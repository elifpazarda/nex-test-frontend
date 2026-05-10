import Link from 'next/link';

export function LandingNav() {
  return (
    <header className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-6">
      <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="15" className="stroke-primary" strokeWidth="1.6" />
          <path
            d="M10 21V11l12 10V11"
            className="stroke-primary"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-heading text-[18px] font-medium tracking-tight text-foreground">
          NexTest
        </span>
      </Link>
      <nav className="hidden items-center gap-7 md:flex">
        <a
          href="#how"
          className="text-[14px] font-medium text-[var(--palette-neutral-600)] no-underline hover:text-foreground"
        >
          Nasil calisir
        </a>
        <a
          href="#features"
          className="text-[14px] font-medium text-[var(--palette-neutral-600)] no-underline hover:text-foreground"
        >
          Ozellikler
        </a>
      </nav>
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-[8px] px-3 py-2 text-[13px] font-medium text-[var(--palette-neutral-600)] no-underline hover:bg-secondary"
        >
          Giris yap
        </Link>
        <Link
          href="/register"
          className="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-primary px-3.5 text-[13px] font-semibold text-white no-underline shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4)] hover:bg-[var(--palette-brand-700)]"
        >
          Hesap olustur
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M4.5 2.5L8 6l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
