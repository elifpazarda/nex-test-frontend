'use client';

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
import { useRegister } from './_hooks/use-register';

export default function RegisterPage() {
  const { form, onSubmit, isLoading, error } = useRegister();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kayit Ol</CardTitle>
        <CardDescription>Yeni bir hesap olusturun</CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Isim
            </label>
            <Input id="name" type="text" placeholder="Adiniz" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

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

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Sifre Tekrari
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="******"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Kayit olunuyor...' : 'Kayit Ol'}
          </Button>
          <p className="text-sm text-muted-foreground">
            Zaten hesabiniz var mi?{' '}
            <Link href="/login" className="text-primary underline">
              Giris yapin
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
