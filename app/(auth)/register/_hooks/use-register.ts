'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/endpoints/auth';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';

export function useRegister() {
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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
      toast.success('Kayit basarili! Simdi giris yapabilirsiniz.');
      router.push('/login');
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
