/** Backend wraps every successful response in this shape */
export interface ApiResponse<T> {
  success: true;
  timestamp: string;
  path: string;
  data: T;
}

/** Backend error response shape */
export interface ApiErrorResponse {
  success: false;
  timestamp: string;
  path: string;
  error: {
    statusCode: number;
    message: string | string[];
  };
}

/** Paginated list response (inside data field) */
export interface PaginatedData<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
