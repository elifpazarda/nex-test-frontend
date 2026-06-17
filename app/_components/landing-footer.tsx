import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-8 py-7">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6">
        <Link href="/" className="inline-flex items-center gap-2 no-underline">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" className="stroke-primary" strokeWidth="1.6" />
            <path
              d="M10 21V11l12 10V11"
              className="stroke-primary"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-heading text-[14px] font-medium text-foreground">NexTest</span>
        </Link>
        <span className="text-[13px] text-[var(--palette-neutral-600)]">
          © 2026 NexTest — Test senaryosu üretim platformu
        </span>
        <div className="flex gap-5">
          <span className="text-[13px] text-[var(--palette-neutral-600)] hover:text-foreground">
            Gizlilik
          </span>
          <span className="text-[13px] text-[var(--palette-neutral-600)] hover:text-foreground">
            Şartlar
          </span>
          <span className="text-[13px] text-[var(--palette-neutral-600)] hover:text-foreground">
            İletişim
          </span>
        </div>
      </div>
    </footer>
  );
}
