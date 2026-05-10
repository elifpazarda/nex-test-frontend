'use client';

import { useAuth } from '@/hooks/use-auth';

export function useProjects() {
  const { user } = useAuth();

  return {
    user,
  };
}
