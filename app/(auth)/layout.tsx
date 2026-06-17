import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ═══ Left: Brand Panel ═══ */}
      <aside className="relative hidden overflow-hidden border-r border-secondary bg-muted px-14 py-10 lg:flex lg:flex-col lg:justify-between">
        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(31,111,78,0.07),transparent_45%),radial-gradient(circle_at_95%_88%,rgba(198,138,18,0.07),transparent_50%)]" />

        {/* Nav */}
        <div className="relative flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 text-inherit no-underline">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="15" className="stroke-primary" strokeWidth="1.6" />
              <path
                d="M10 21V11l12 10V11"
                className="stroke-primary"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-heading text-[22px] font-medium tracking-tight text-foreground">
              NexTest
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-[var(--palette-neutral-600)] no-underline hover:text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M9 3L5 7l4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Anasayfa
          </Link>
        </div>

        {/* Quote */}
        <div className="relative max-w-[460px]">
          <div className="font-heading text-[80px] italic leading-[0.6] text-[var(--palette-brand-200)]">
            &ldquo;
          </div>
          <p className="mt-2 font-heading text-[28px] font-medium leading-[1.25] tracking-tight text-foreground">
            Bir sprint&apos;te <em className="font-medium italic text-accent-foreground">üç gün</em>{' '}
            harcadığımız test senaryosu yazımı, artık{' '}
            <em className="font-medium italic text-accent-foreground">kahve molası</em> kadar
            sürüyor.
          </p>
          <div className="mt-[22px] flex items-center gap-3">
            <span
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold tracking-wide"
              style={{ background: '#FED9B7', color: '#7A3E12' }}
            >
              AC
            </span>
            <div>
              <div className="text-[13px] font-medium text-foreground">Aslı Çetin</div>
              <div className="text-[13px] text-[var(--palette-neutral-600)]">QA Lead, Trendyol</div>
            </div>
          </div>
        </div>

        {/* Peek card */}
        <div className="relative max-w-[500px] rounded-[16px] border border-border bg-white p-[18px_20px] shadow-[0_18px_40px_-20px_rgba(31,41,38,0.15)]">
          <div className="flex items-center justify-between border-b border-dashed border-border pb-3 text-[12px] uppercase tracking-[0.06em] text-[var(--palette-neutral-400)]">
            <span>NexTest · Ödeme akışı</span>
            <span className="font-mono normal-case tracking-normal text-[var(--palette-success-600)]">
              1.8 sn
            </span>
          </div>
          {/* Row 1 */}
          <div className="grid grid-cols-[110px_1fr_auto] items-center gap-3 py-2.5 text-[14px]">
            <span className="inline-flex items-center rounded-[4px] bg-[var(--palette-success-50)] px-2.5 py-1 text-[12px] font-medium text-[var(--palette-success-600)]">
              Happy
            </span>
            <span className="text-foreground">Geçerli kart ile ödeme tamamlanır</span>
            <span className="inline-flex items-center rounded-[4px] bg-[var(--palette-danger-600)] px-2.5 py-1 text-[12px] font-medium text-white">
              Kritik
            </span>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-[110px_1fr_auto] items-center gap-3 border-t border-secondary py-2.5 text-[14px]">
            <span className="inline-flex items-center rounded-[4px] bg-[var(--palette-danger-50)] px-2.5 py-1 text-[12px] font-medium text-[var(--palette-danger-600)]">
              Negative
            </span>
            <span className="text-foreground">Yetersiz bakiye uyarısı gösterilir</span>
            <span className="inline-flex items-center rounded-[4px] bg-[var(--palette-danger-100)] px-2.5 py-1 text-[12px] font-medium text-destructive">
              Yüksek
            </span>
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-[110px_1fr_auto] items-center gap-3 border-t border-secondary py-2.5 text-[14px]">
            <span className="inline-flex items-center rounded-[4px] bg-[var(--palette-warning-100)] px-2.5 py-1 text-[12px] font-medium text-[var(--palette-warning-muted)]">
              Edge
            </span>
            <span className="text-foreground">3D Secure zaman aşımında geri al</span>
            <span className="inline-flex items-center rounded-[4px] bg-[var(--palette-warning-100)] px-2.5 py-1 text-[12px] font-medium text-[var(--palette-warning-muted)]">
              Orta
            </span>
          </div>
        </div>
      </aside>

      {/* ═══ Right: Form Panel ═══ */}
      <section className="flex flex-col px-5 py-10 lg:px-14 lg:py-10">{children}</section>
    </div>
  );
}
