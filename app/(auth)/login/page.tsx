'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLogin } from './_hooks/use-login';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { form, onSubmit, isLoading, error } = useLogin();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Giris Yap</CardTitle>
        <CardDescription>Hesabiniza giris yapin</CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-posta
            </label>
            <Input id="email" type="email" placeholder="ornek@email.com" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Sifre
            </label>
            <Input id="password" type="password" placeholder="******" {...register('password')} />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Giris yapiliyor...' : 'Giris Yap'}
          </Button>
          <p className="text-sm text-muted-foreground">
            Hesabiniz yok mu?{' '}
            <Link href="/register" className="text-primary underline">
              Kayit olun
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
