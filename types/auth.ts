export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** POST /api/auth/login → data field */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

/** POST /api/auth/register → data field (no tokens returned) */
export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
