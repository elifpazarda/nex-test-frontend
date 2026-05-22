import { apiClient } from '../client';
import type { ApiResponse } from '@/types/api';
import type { JiraAuthUrl, JiraConnection } from '@/types/jira';

export const jiraApi = {
  /** Atlassian OAuth başlatma URL'sini al */
  getAuthUrl: () => apiClient.get<ApiResponse<JiraAuthUrl>>('/jira/auth-url'),

  /** Mevcut Jira bağlantısını getir (bağlantı yoksa 404) */
  getConnection: () => apiClient.get<ApiResponse<JiraConnection>>('/jira/connection'),

  /** Jira bağlantısını kaldır */
  deleteConnection: () =>
    apiClient.delete<ApiResponse<{ message: string }>>('/jira/connection'),
};
