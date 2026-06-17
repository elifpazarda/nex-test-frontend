'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/endpoints/auth';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import type { ApiErrorResponse } from '@/types/api';

export function useRegister() {
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    onSuccess: () => {
      toast.success('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
      router.push('/login');
    },
    onError: (error: Error) => {
      let message = 'Kayıt yapılamadı. Lütfen tekrar deneyin.';
      if (error instanceof AxiosError && error.response?.data) {
        const body = error.response.data as ApiErrorResponse;
        const msg = body.error?.message;
        message = Array.isArray(msg) ? msg.join(', ') : msg || message;
      }
      toast.error('Kayıt başarısız', { description: message, duration: 4000 });
    },
  });

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
  };
}
