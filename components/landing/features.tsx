export function Features() {
  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-[88px]" id="features">
      <div className="mb-14 text-center">
        <span className="mb-3.5 inline-block text-[12px] font-semibold uppercase tracking-[0.12em] text-accent-foreground">
          Ozellikler
        </span>
        <h2 className="font-heading text-[clamp(28px,3.5vw,44px)] font-medium leading-[1.15] tracking-[-0.02em] text-foreground">
          QA ekipleri icin tasarlandi.
        </h2>
      </div>
      <div
        className="grid overflow-hidden rounded-[14px] border border-border bg-border md:grid-cols-3"
        style={{ gap: '1px' }}
      >
        {[
          {
            title: '4 farkli kaynak',
            desc: 'Metin, Jira, Excel, PDF. Her biri icin optimize edilmis ozel prompt muhendisligi.',
          },
          {
            title: 'Otomatik etiketleme',
            desc: 'Senaryo kategorisi (happy/edge/negative) ve onceligi AI tarafindan cikarilir.',
          },
          {
            title: 'Jira entegrasyonu',
            desc: "Ticket'i linkle cek, uretilen senaryolari Xray test case formatinda geri yorum birak.",
          },
          {
            title: 'Cucumber + Playwright',
            desc: 'Gherkin feature dosyalari ya da Playwright TypeScript test fonksiyonlari.',
          },
          {
            title: 'Proje organizasyonu',
            desc: 'Proje → Senaryo Grubu → Senaryo. Versiyonlama ve gecmis kaydi dahil.',
          },
          {
            title: 'Tek e-posta + sifre',
            desc: 'Sosyal login yok, takim hesabi paylasimi yok. Yalin, hizli, tahmin edilebilir.',
          },
        ].map((feat) => (
          <div key={feat.title} className="bg-white px-7 py-8">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-accent-foreground">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2l1.5 3.5L13 7l-3 2.5.5 4L8 11.5 5.5 13.5l.5-4L3 7l3.5-1.5L8 2z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-[17px] font-semibold tracking-[-0.005em] text-foreground">
              {feat.title}
            </h3>
            <p className="mt-1.5 text-[14px] leading-[1.55] text-[var(--palette-neutral-600)]">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
