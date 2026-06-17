'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useLogin } from './_hooks/use-login';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { form, onSubmit, isLoading } = useLogin();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      {/* Top right link */}
      <div className="flex justify-end text-[13px] text-[var(--palette-neutral-600)]">
        Hesabın yok mu?
        <Link
          href="/register"
          className="ml-1.5 font-medium text-accent-foreground no-underline hover:text-[var(--palette-brand-800)]"
        >
          Hesap oluştur
        </Link>
      </div>

      {/* Form centered */}
      <div className="mx-auto my-auto w-full max-w-[380px]">
        <h1
          className="font-heading text-[38px] font-medium leading-[1.05]"
          style={{ letterSpacing: '-0.025em' }}
        >
          Tekrar <em className="font-medium italic text-accent-foreground">hoş geldin.</em>
        </h1>
        <p className="mb-8 mt-0 text-[14.5px] text-[var(--palette-neutral-600)]">
          Hesabına giriş yaparak senaryolarına devam et.
        </p>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[13px] font-medium text-[var(--palette-neutral-600)]"
              >
                E-posta
              </label>
              <div className="flex items-center rounded-[10px] border border-[var(--palette-neutral-300)] bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-[120ms] focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]">
                <input
                  id="email"
                  type="email"
                  placeholder="sen@sirket.com"
                  autoFocus
                  className="h-[42px] w-full flex-1 rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-foreground outline-none placeholder:text-[var(--palette-neutral-400)]"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <div className="text-[12px] text-[var(--palette-danger-600)]">
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[13px] font-medium text-[var(--palette-neutral-600)]"
              >
                Şifre
              </label>
              <div className="flex items-center rounded-[10px] border border-[var(--palette-neutral-300)] bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-[120ms] focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-[42px] w-full flex-1 rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-foreground outline-none placeholder:text-[var(--palette-neutral-400)]"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <div className="text-[12px] text-[var(--palette-danger-600)]">
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Remember me row */}
            <div className="flex items-center justify-between text-[13px]">
              <label className="inline-flex cursor-pointer items-center gap-2.5 select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-[18px] w-[18px] rounded-[5px] border-[1.5px] border-[var(--palette-neutral-300)] bg-white accent-primary"
                />
                <span className="text-foreground">Beni hatırla</span>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-[22px]">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-[16px] font-semibold tracking-[0.01em] text-background shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] transition-[background,transform] duration-[120ms] hover:bg-[var(--palette-brand-700)] active:translate-y-[0.5px] active:bg-[var(--palette-brand-800)] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş yap'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-7 text-[11.5px] leading-relaxed text-[var(--palette-neutral-400)]">
          Devam ederek{' '}
          <span className="cursor-pointer text-[var(--palette-neutral-600)] underline">
            Hizmet Şartları
          </span>{' '}
          ve{' '}
          <span className="cursor-pointer text-[var(--palette-neutral-600)] underline">
            Gizlilik Politikası
          </span>
          &apos;nı kabul etmiş olursun.
        </p>
      </div>
    </>
  );
}
