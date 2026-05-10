import { apiClient } from '../client';
import type { ApiResponse } from '@/types/api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '@/types/auth';

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh', {
      refreshToken,
    }),

  me: () => apiClient.get<ApiResponse<User>>('/auth/me'),

  logout: () => apiClient.post('/auth/logout'),
};
