import Link from 'next/link';
import { ProductPreview } from './product-preview';

export function LandingHero() {
  return (
    <section className="mx-auto grid max-w-[1200px] items-center gap-16 px-8 py-16 pb-24 md:grid-cols-2">
      <div>
        <span className="mb-[18px] inline-flex items-center rounded-[4px] bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
          Beta · QA ekipleri icin
        </span>
        <h1 className="font-heading text-[clamp(40px,5.4vw,72px)] font-medium leading-[1.02] tracking-[-0.03em] text-foreground">
          Test senaryolarini <em className="italic text-accent-foreground">elle</em> yazma.
          <br />
          <em className="italic text-accent-foreground">NexTest</em> uretsin.
        </h1>
        <p className="mt-6 max-w-[520px] text-[18px] leading-relaxed text-[var(--palette-neutral-600)]">
          Metin, Jira ticket&apos;i, Excel veya PDF gereksinim dokumani ver — happy path, edge case
          ve negatif senaryolari oncelik etiketleriyle saniyeler icinde al. Cucumber veya Playwright
          koduna tek tikla donustur.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/register"
            className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-primary px-5 text-[16px] font-semibold text-background no-underline shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[var(--palette-brand-700)]"
          >
            Ucretsiz basla
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path
                d="M4.5 2.5L8 6l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <button className="inline-flex h-12 items-center gap-2 rounded-[10px] px-5 text-[16px] font-semibold text-foreground hover:bg-secondary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2l1.5 3.5L13 7l-3 2.5.5 4L8 11.5 5.5 13.5l.5-4L3 7l3.5-1.5L8 2z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            Canli demoyu izle
          </button>
        </div>
        <div className="mt-8 flex items-center gap-3 text-[13px] text-[var(--palette-neutral-600)]">
          <div className="flex -space-x-1.5">
            {[
              { bg: '#FED9B7', fg: '#7A3E12', t: 'AK' },
              { bg: '#C7E9D6', fg: '#1F6F4E', t: 'MO' },
              { bg: '#D9DCFF', fg: '#3F3DB5', t: 'SD' },
              { bg: '#F8D4D4', fg: '#9B2A2A', t: '+' },
            ].map((a) => (
              <span
                key={a.t}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background text-[10px] font-semibold"
                style={{ background: a.bg, color: a.fg }}
              >
                {a.t}
              </span>
            ))}
          </div>
          <span>120+ QA ekibi NexTest&apos;i kullaniyor</span>
        </div>
      </div>

      <ProductPreview />
    </section>
  );
}
