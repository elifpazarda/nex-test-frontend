/** GET /api/jira/auth-url → data field */
export interface JiraAuthUrl {
  authUrl: string;
}

/** GET /api/jira/connection → data field (tokens are never returned) */
export interface JiraConnection {
  siteUrl: string;
  siteName: string;
  connectedAt: string;
  updatedAt: string;
}
