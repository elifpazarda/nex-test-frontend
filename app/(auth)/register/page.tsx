'use client';

import Link from 'next/link';
import { useRegister } from './_hooks/use-register';

export default function RegisterPage() {
  const { form, onSubmit, isLoading, error } = useRegister();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      {/* Top right link */}
      <div className="flex justify-end text-[13px] text-[#5c5a52]">
        Zaten hesabin var mi?
        <Link
          href="/login"
          className="ml-1.5 font-medium text-[#1a5a40] no-underline hover:text-[#154832]"
        >
          Giris yap
        </Link>
      </div>

      {/* Form centered */}
      <div className="mx-auto my-auto w-full max-w-[380px]">
        <h1
          className="font-heading text-[38px] font-medium leading-[1.05]"
          style={{ letterSpacing: '-0.025em' }}
        >
          Hesap <em className="font-medium italic text-[#1a5a40]">olustur.</em>
        </h1>
        <p className="mb-8 mt-0 text-[14.5px] text-[#5c5a52]">
          AI destekli test senaryolari uretmeye hemen basla.
        </p>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            {error && (
              <div className="rounded-[10px] bg-[#f7e5e2] px-3.5 py-3 text-[13px] text-[#9b2a2a]">
                {error}
              </div>
            )}

            {/* Name field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-[13px] font-medium text-[#5c5a52]">
                Isim
              </label>
              <div className="flex items-center rounded-[10px] border border-[#d6d3cb] bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-[120ms] focus-within:border-[#1f6f4e] focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]">
                <input
                  id="name"
                  type="text"
                  placeholder="Adiniz Soyadiniz"
                  autoFocus
                  className="h-[42px] w-full flex-1 rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <div className="text-[12px] text-[#9b2a2a]">{errors.name.message}</div>
              )}
            </div>

            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-[#5c5a52]">
                E-posta
              </label>
              <div className="flex items-center rounded-[10px] border border-[#d6d3cb] bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-[120ms] focus-within:border-[#1f6f4e] focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]">
                <input
                  id="email"
                  type="email"
                  placeholder="sen@sirket.com"
                  className="h-[42px] w-full flex-1 rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <div className="text-[12px] text-[#9b2a2a]">{errors.email.message}</div>
              )}
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[13px] font-medium text-[#5c5a52]">
                Sifre
              </label>
              <div className="flex items-center rounded-[10px] border border-[#d6d3cb] bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-[120ms] focus-within:border-[#1f6f4e] focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-[42px] w-full flex-1 rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <div className="text-[12px] text-[#9b2a2a]">{errors.password.message}</div>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-[13px] font-medium text-[#5c5a52]">
                Sifre Tekrari
              </label>
              <div className="flex items-center rounded-[10px] border border-[#d6d3cb] bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-[120ms] focus-within:border-[#1f6f4e] focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]">
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-[42px] w-full flex-1 rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <div className="text-[12px] text-[#9b2a2a]">{errors.confirmPassword.message}</div>
              )}
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-[22px]">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#1f6f4e] px-5 text-[16px] font-semibold tracking-[0.01em] text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] transition-[background,transform] duration-[120ms] hover:bg-[#1a5a40] active:translate-y-[0.5px] active:bg-[#154832] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isLoading ? 'Kayit olunuyor...' : 'Hesap olustur'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-7 text-[11.5px] leading-relaxed text-[#a8a595]">
          Kayit olarak{' '}
          <span className="cursor-pointer text-[#5c5a52] underline">Hizmet Sartlari</span> ve{' '}
          <span className="cursor-pointer text-[#5c5a52] underline">Gizlilik Politikasi</span>
          &apos;ni kabul etmis olursun.
        </p>
      </div>
    </>
  );
}
