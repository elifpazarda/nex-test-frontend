export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1200px] px-8 py-[88px]" id="how">
      <div className="mb-14 text-center">
        <span className="mb-3.5 inline-block text-[12px] font-semibold uppercase tracking-[0.12em] text-accent-foreground">
          Nasil calisir
        </span>
        <h2 className="mx-auto max-w-[720px] font-heading text-[clamp(28px,3.5vw,44px)] font-medium leading-[1.15] tracking-[-0.02em] text-foreground">
          Uc adimda senaryo, kod, Jira&apos;ya export.
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            n: '01',
            title: 'Gereksinim ver',
            desc: 'Duz metin, Jira ticket linki, Excel ya da PDF — fark etmez. NexTest hepsini okur.',
          },
          {
            n: '02',
            title: 'AI senaryolastirsin',
            desc: 'Happy path, edge case ve negatif senaryolar; kritik / yuksek / orta / dusuk oncelikle etiketlenir.',
          },
          {
            n: '03',
            title: 'Koda dok, paylas',
            desc: "Tek tikla Cucumber feature ya da Playwright TypeScript. Jira'ya yorum, PDF rapor.",
          },
        ].map((step) => (
          <div
            key={step.n}
            className="relative rounded-[14px] border border-border bg-white px-7 py-8"
          >
            <div className="font-heading text-[56px] font-normal italic leading-none text-[var(--palette-brand-200)]">
              {step.n}
            </div>
            <div className="absolute right-7 top-8 flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent text-accent-foreground">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2l1.5 3.5L13 7l-3 2.5.5 4L8 11.5 5.5 13.5l.5-4L3 7l3.5-1.5L8 2z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-[14.5px] leading-[1.55] text-[var(--palette-neutral-600)]">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
