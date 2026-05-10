import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Gecerli bir e-posta adresi girin'),
  password: z.string().min(8, 'Sifre en az 8 karakter olmali'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Isim en az 2 karakter olmali'),
    email: z.string().email('Gecerli bir e-posta adresi girin'),
    password: z.string().min(8, 'Sifre en az 8 karakter olmali'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Sifreler eslesmiyor',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
