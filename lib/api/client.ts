import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// ---------------------------------------------------------------------------
// Request interceptor: attach JWT Bearer token
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window === 'undefined') return config;

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor: handle 401 with token refresh + retry queue
// ---------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue: {
  resolve: (value: AxiosResponse) => void;
  reject: (reason: unknown) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

function processQueue(error: unknown) {
  if (error) {
    failedQueue.forEach(({ reject }) => reject(error));
  }
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop on refresh endpoint itself
    if (originalRequest.url?.includes('/auth/refresh')) {
      clearTokens();
      redirectToLogin();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue requests while a refresh is in progress
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const newAccessToken: string = data.data.accessToken;
      const newRefreshToken: string = data.data.refreshToken;

      setTokens(newAccessToken, newRefreshToken);

      // Retry the original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      const response = await apiClient(originalRequest);

      // Retry all queued requests
      for (const { resolve, config } of failedQueue) {
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        resolve(await apiClient(config));
      }
      failedQueue = [];

      return response;
    } catch (refreshError) {
      processQueue(refreshError);
      clearTokens();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ---------------------------------------------------------------------------
// Token helpers (used by auth-provider too)
// ---------------------------------------------------------------------------
export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  // Also set cookie so proxy.ts can read it on the server
  document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  document.cookie = 'access_token=; path=/; max-age=0';
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function redirectToLogin() {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
