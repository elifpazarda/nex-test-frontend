export const SCM_EVENT_STATUSES = [
  'RECEIVED',
  'PROCESSED',
  'SKIPPED',
  'FAILED',
] as const;

export type ScmEventStatus = (typeof SCM_EVENT_STATUSES)[number];

/** GET /v1/scm-webhooks (liste) ve PATCH sonucu — secret icermez */
export interface ScmConnection {
  id: string;
  provider: string;
  label: string | null;
  active: boolean;
  autoGenerate: boolean;
  targetGroupId: string | null;
  projectId: string | null;
  webhookUrl: string;
  createdAt: string;
}

/** POST /v1/scm-webhooks ve rotate-secret sonucu — secret yalnizca burada doner */
export interface ScmConnectionCreated extends ScmConnection {
  secret: string;
}

export interface CreateScmConnectionRequest {
  provider: 'github';
  label?: string;
  projectId?: string;
  autoGenerate?: boolean;
  targetGroupId?: string;
}

export interface UpdateScmConnectionRequest {
  label?: string;
  active?: boolean;
  autoGenerate?: boolean;
  targetGroupId?: string;
}

/** GET /v1/scm-webhooks/:id/events (paginated) */
export interface ScmWebhookEvent {
  id: string;
  provider: string;
  eventType: string;
  action: string | null;
  deliveryId: string | null;
  sourceRef: string | null;
  status: ScmEventStatus;
  error: string | null;
  createdAt: string;
}

export interface ScmWebhookEventListParams {
  page?: number;
  limit?: number;
  status?: ScmEventStatus;
  eventType?: string;
}
