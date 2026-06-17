export function Features() {
  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-[88px]" id="features">
      <div className="mb-14 text-center">
        <span className="mb-3.5 inline-block text-[12px] font-semibold uppercase tracking-[0.12em] text-accent-foreground">
          Özellikler
        </span>
        <h2 className="font-heading text-[clamp(28px,3.5vw,44px)] font-medium leading-[1.15] tracking-[-0.02em] text-foreground">
          QA ekipleri için tasarlandı.
        </h2>
      </div>
      <div
        className="grid overflow-hidden rounded-[14px] border border-border bg-border md:grid-cols-3"
        style={{ gap: '1px' }}
      >
        {[
          {
            title: '4 farklı kaynak',
            desc: 'Metin, Jira, Excel, PDF. Her biri için optimize edilmiş özel prompt mühendisliği.',
          },
          {
            title: 'Otomatik etiketleme',
            desc: 'Senaryo kategorisi (happy/edge/negative) ve önceliği AI tarafından çıkarılır.',
          },
          {
            title: 'Jira entegrasyonu',
            desc: "Ticket'i linkle çek, üretilen senaryoları Xray test case formatında geri yorum bırak.",
          },
          {
            title: 'Cucumber + Playwright',
            desc: 'Gherkin feature dosyaları ya da Playwright TypeScript test fonksiyonları.',
          },
          {
            title: 'Proje organizasyonu',
            desc: 'Proje → Senaryo Grubu → Senaryo. Versiyonlama ve geçmiş kaydı dahil.',
          },
          {
            title: 'Tek e-posta + şifre',
            desc: 'Sosyal login yok, takım hesabı paylaşımı yok. Yalın, hızlı, tahmin edilebilir.',
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
