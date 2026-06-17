import { apiClient } from '../client';
import type { ApiResponse, PaginatedData } from '@/types/api';
import type {
  TestScenario,
  GenerateTextRequest,
  GenerateJiraRequest,
  SaveScenariosRequest,
  ConvertBddRequest,
  GenerateResponse,
  ConvertBddResponse,
  ExportFormat,
  ImportExcelResult,
} from '@/types/scenario';

/** Optional query params shared by all export endpoints */
interface ExportOptions {
  startDate?: string;
  endDate?: string;
  xrayFormat?: boolean;
}

/**
 * AI uretim/donusum istekleri 15sn'lik global timeout'tan cok daha uzun
 * surebilir; bu uclar icin istek bazinda 5 dakikalik timeout kullanilir.
 */
const AI_TIMEOUT = 300_000;

export const scenariosApi = {
  // --- List & Detail ---
  listByGroup: (groupId: string, page = 1, limit = 20) =>
    apiClient.get<ApiResponse<PaginatedData<TestScenario>>>(`/scenarios/group/${groupId}`, {
      params: { page, limit },
    }),

  getById: (id: string) => apiClient.get<ApiResponse<TestScenario>>(`/scenarios/${id}`),

  delete: (id: string) => apiClient.delete<ApiResponse<{ message: string }>>(`/scenarios/${id}`),

  // --- AI Generation (does NOT save) ---
  generateFromText: (data: GenerateTextRequest) =>
    apiClient.post<ApiResponse<GenerateResponse>>('/scenarios/generate/text', data, {
      timeout: AI_TIMEOUT,
    }),

  generateFromJira: (data: GenerateJiraRequest) =>
    apiClient.post<ApiResponse<GenerateResponse>>('/scenarios/generate/jira', data, {
      timeout: AI_TIMEOUT,
    }),

  generateFromExcel: (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('file', file);
    return apiClient.post<ApiResponse<GenerateResponse>>('/scenarios/generate/excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: AI_TIMEOUT,
    });
  },

  generateFromPdf: (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('file', file);
    return apiClient.post<ApiResponse<GenerateResponse>>('/scenarios/generate/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: AI_TIMEOUT,
    });
  },

  // --- BDD Conversion ---
  convertToBdd: (data: ConvertBddRequest) =>
    apiClient.post<ApiResponse<ConvertBddResponse>>('/scenarios/convert-bdd', data, {
      timeout: AI_TIMEOUT,
    }),

  // --- Save ---
  save: (data: SaveScenariosRequest) =>
    apiClient.post<ApiResponse<TestScenario[]>>('/scenarios', data),

  // --- Import ---
  importExcel: (groupId: string, file: File, saveResults: boolean) => {
    const formData = new FormData();
    formData.append('groupId', groupId);
    formData.append('file', file);
    formData.append('saveResults', String(saveResults));
    return apiClient.post<ApiResponse<ImportExcelResult>>('/scenarios/import-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: AI_TIMEOUT,
    });
  },

  // --- Export (returns file download) ---
  exportByProject: (projectId: string, format: ExportFormat, options?: ExportOptions) =>
    apiClient.get<Blob>(`/scenarios/export/all/${projectId}`, {
      params: { format, ...options },
      responseType: 'blob',
    }),

  exportByGroup: (groupId: string, format: ExportFormat, options?: ExportOptions) =>
    apiClient.get<Blob>(`/scenarios/export/group/${groupId}`, {
      params: { format, ...options },
      responseType: 'blob',
    }),

  exportSingle: (id: string, format: ExportFormat, options?: ExportOptions) =>
    apiClient.get<Blob>(`/scenarios/export/${id}`, {
      params: { format, ...options },
      responseType: 'blob',
    }),
};
