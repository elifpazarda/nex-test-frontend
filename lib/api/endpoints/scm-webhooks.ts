import { apiClient } from '../client';
import type { ApiResponse, PaginatedData } from '@/types/api';
import type {
  ScmConnection,
  ScmConnectionCreated,
  CreateScmConnectionRequest,
  UpdateScmConnectionRequest,
  ScmWebhookEvent,
  ScmWebhookEventListParams,
} from '@/types/scm-webhook';

export const scmWebhooksApi = {
  /** Kullanicinin SCM webhook baglantilari (secret haric) */
  list: () => apiClient.get<ApiResponse<ScmConnection[]>>('/v1/scm-webhooks'),

  /** Yeni baglanti olustur — yanitta secret + webhookUrl bir kez doner */
  create: (data: CreateScmConnectionRequest) =>
    apiClient.post<ApiResponse<ScmConnectionCreated>>('/v1/scm-webhooks', data),

  /** Ayarlari guncelle (label/active/autoGenerate/targetGroupId) */
  update: (id: string, data: UpdateScmConnectionRequest) =>
    apiClient.patch<ApiResponse<ScmConnection>>(`/v1/scm-webhooks/${id}`, data),

  /** Secret'i yenile — yeni secret bir kez doner */
  rotateSecret: (id: string) =>
    apiClient.post<ApiResponse<ScmConnectionCreated>>(
      `/v1/scm-webhooks/${id}/rotate-secret`,
    ),

  /** Baglantiyi sil */
  remove: (id: string) =>
    apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/v1/scm-webhooks/${id}`),

  /** Baglantinin webhook event gecmisi (paginated) */
  listEvents: (id: string, params: ScmWebhookEventListParams = {}) =>
    apiClient.get<ApiResponse<PaginatedData<ScmWebhookEvent>>>(
      `/v1/scm-webhooks/${id}/events`,
      { params: { page: 1, limit: 20, ...params } },
    ),
};
