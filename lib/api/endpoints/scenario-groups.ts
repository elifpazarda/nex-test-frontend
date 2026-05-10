import { apiClient } from '../client';
import type { ApiResponse, PaginatedData } from '@/types/api';
import type {
  ScenarioGroup,
  CreateScenarioGroupRequest,
  UpdateScenarioGroupRequest,
} from '@/types/scenario-group';

export const scenarioGroupsApi = {
  listByProject: (projectId: string, page = 1, limit = 20) =>
    apiClient.get<ApiResponse<PaginatedData<ScenarioGroup>>>(
      `/scenario-groups/project/${projectId}`,
      { params: { page, limit } },
    ),

  getById: (id: string) => apiClient.get<ApiResponse<ScenarioGroup>>(`/scenario-groups/${id}`),

  create: (data: CreateScenarioGroupRequest) =>
    apiClient.post<ApiResponse<ScenarioGroup>>('/scenario-groups', data),

  update: (id: string, data: UpdateScenarioGroupRequest) =>
    apiClient.patch<ApiResponse<ScenarioGroup>>(`/scenario-groups/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<{ message: string }>>(`/scenario-groups/${id}`),
};
