'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/endpoints/auth';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/use-auth';
import type { ApiErrorResponse } from '@/types/api';

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens } = useAuth();

  const callbackUrl = searchParams.get('callbackUrl') ?? '/projects';

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data.data;
      setTokens(accessToken, refreshToken);
      router.push(callbackUrl);
    },
    onError: (error: Error) => {
      let message = 'Giriş yapılamadı. Lütfen tekrar deneyin.';
      if (error instanceof AxiosError && error.response?.data) {
        const body = error.response.data as ApiErrorResponse;
        const msg = body.error?.message;
        message = Array.isArray(msg) ? msg.join(', ') : msg || message;
      }
      toast.error('Giriş başarısız', { description: message, duration: 4000 });
    },
  });

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
  };
}
