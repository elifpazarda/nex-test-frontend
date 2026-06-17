'use client';

import Link from 'next/link';
import { useRegister } from './_hooks/use-register';

export default function RegisterPage() {
  const { form, onSubmit, isLoading } = useRegister();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      {/* Form centered */}
      <div className="mx-auto my-auto w-full max-w-[380px]">
        <h1
          className="font-heading text-[38px] font-medium leading-[1.05]"
          style={{ letterSpacing: '-0.025em' }}
        >
          Hesap <em className="font-medium italic text-accent-foreground">oluştur.</em>
        </h1>
        <p className="mb-8 mt-0 text-[14.5px] text-[var(--palette-neutral-600)]">
          AI destekli test senaryoları üretmeye hemen başla.
        </p>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            {/* Name field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-[13px] font-medium text-[var(--palette-neutral-600)]"
              >
                İsim
              </label>
              <div
                className={`flex items-center rounded-[10px] border bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-[120ms] ${errors.name ? 'border-[var(--palette-danger-500)] shadow-[0_0_0_4px_rgba(192,57,43,0.1)]' : 'border-[var(--palette-neutral-300)] focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]'}`}
              >
                <input
                  id="name"
                  type="text"
                  placeholder="Adınız Soyadınız"
                  autoFocus
                  className="h-[42px] w-full flex-1 rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-foreground outline-none placeholder:text-[var(--palette-neutral-400)]"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <div className="text-[12px] text-[var(--palette-danger-600)]">
                  {errors.name.message}
                </div>
              )}
            </div>

            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[13px] font-medium text-[var(--palette-neutral-600)]"
              >
                E-posta
              </label>
              <div
                className={`flex items-center rounded-[10px] border bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-[120ms] ${errors.email ? 'border-[var(--palette-danger-500)] shadow-[0_0_0_4px_rgba(192,57,43,0.1)]' : 'border-[var(--palette-neutral-300)] focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]'}`}
              >
                <input
                  id="email"
                  type="email"
                  placeholder="sen@sirket.com"
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
              <div
                className={`flex items-center rounded-[10px] border bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-[120ms] ${errors.password ? 'border-[var(--palette-danger-500)] shadow-[0_0_0_4px_rgba(192,57,43,0.1)]' : 'border-[var(--palette-neutral-300)] focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]'}`}
              >
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

            {/* Confirm Password field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-[13px] font-medium text-[var(--palette-neutral-600)]"
              >
                Şifre Tekrarı
              </label>
              <div
                className={`flex items-center rounded-[10px] border bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-[120ms] ${errors.confirmPassword ? 'border-[var(--palette-danger-500)] shadow-[0_0_0_4px_rgba(192,57,43,0.1)]' : 'border-[var(--palette-neutral-300)] focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]'}`}
              >
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-[42px] w-full flex-1 rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-foreground outline-none placeholder:text-[var(--palette-neutral-400)]"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <div className="text-[12px] text-[var(--palette-danger-600)]">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-[22px]">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-[16px] font-semibold tracking-[0.01em] text-background shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] transition-[background,transform] duration-[120ms] hover:bg-[var(--palette-brand-700)] active:translate-y-[0.5px] active:bg-[var(--palette-brand-800)] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isLoading ? 'Kayıt olunuyor...' : 'Hesap oluştur'}
            </button>
          </div>
        </form>

        {/* Login link */}
        <p className="mt-5 text-center text-[13px] text-[var(--palette-neutral-600)]">
          Zaten hesabın var mı?{' '}
          <Link
            href="/login"
            className="font-medium text-accent-foreground no-underline hover:text-[var(--palette-brand-800)]"
          >
            Giriş yap
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-5 text-[11.5px] leading-relaxed text-[var(--palette-neutral-400)]">
          Kayıt olarak{' '}
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
