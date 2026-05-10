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
} from '@/types/scenario';

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
    apiClient.post<ApiResponse<GenerateResponse>>('/scenarios/generate/text', data),

  generateFromJira: (data: GenerateJiraRequest) =>
    apiClient.post<ApiResponse<GenerateResponse>>('/scenarios/generate/jira', data),

  generateFromExcel: (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('file', file);
    return apiClient.post<ApiResponse<GenerateResponse>>('/scenarios/generate/excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  generateFromPdf: (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('file', file);
    return apiClient.post<ApiResponse<GenerateResponse>>('/scenarios/generate/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // --- BDD Conversion ---
  convertToBdd: (data: ConvertBddRequest) =>
    apiClient.post<ApiResponse<ConvertBddResponse>>('/scenarios/convert-bdd', data),

  // --- Save ---
  save: (data: SaveScenariosRequest) =>
    apiClient.post<ApiResponse<TestScenario[]>>('/scenarios', data),

  // --- Import ---
  importExcel: (groupId: string, file: File, saveResults: boolean) => {
    const formData = new FormData();
    formData.append('groupId', groupId);
    formData.append('file', file);
    formData.append('saveResults', String(saveResults));
    return apiClient.post<ApiResponse<unknown>>('/scenarios/import-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // --- Export (returns file download) ---
  exportByProject: (
    projectId: string,
    format: ExportFormat,
    options?: { startDate?: string; endDate?: string; xrayFormat?: boolean },
  ) =>
    apiClient.get(`/scenarios/export/all/${projectId}`, {
      params: { format, ...options },
      responseType: 'blob',
    }),

  exportByGroup: (groupId: string, format: ExportFormat) =>
    apiClient.get(`/scenarios/export/group/${groupId}`, {
      params: { format },
      responseType: 'blob',
    }),

  exportSingle: (id: string, format: ExportFormat) =>
    apiClient.get(`/scenarios/export/${id}`, {
      params: { format },
      responseType: 'blob',
    }),
};
