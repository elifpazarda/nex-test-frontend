'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/endpoints/auth';
import { setTokens as persistTokens, clearTokens, getAccessToken } from '@/lib/api/client';
import type { User } from '@/types/auth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // On mount, check if we have a token and fetch user info
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .me()
      .then((response) => {
        setUser(response.data.data);
      })
      .catch(() => {
        clearTokens();
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const setTokens = useCallback((accessToken: string, refreshToken: string) => {
    persistTokens(accessToken, refreshToken);
  }, []);

  const logout = useCallback(() => {
    authApi.logout().catch(() => {
      // Ignore logout API errors — we clear locally regardless
    });
    clearTokens();
    setUser(null);
    queryClient.clear();
    window.location.href = '/login';
  }, [queryClient]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      setTokens,
      logout,
    }),
    [user, isLoading, setTokens, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
