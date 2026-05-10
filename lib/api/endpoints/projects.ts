import { apiClient } from '../client';
import type { ApiResponse, PaginatedData } from '@/types/api';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '@/types/project';

export const projectsApi = {
  list: (page = 1, limit = 20) =>
    apiClient.get<ApiResponse<PaginatedData<Project>>>('/projects', {
      params: { page, limit },
    }),

  getById: (id: string) => apiClient.get<ApiResponse<Project>>(`/projects/${id}`),

  create: (data: CreateProjectRequest) => apiClient.post<ApiResponse<Project>>('/projects', data),

  update: (id: string, data: UpdateProjectRequest) =>
    apiClient.patch<ApiResponse<Project>>(`/projects/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<{ message: string }>>(`/projects/${id}`),
};
