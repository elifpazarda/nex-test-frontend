'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/api/endpoints/auth';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/use-auth';

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
  });

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
