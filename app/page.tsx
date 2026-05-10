import Link from 'next/link';

const CAT_STYLE: Record<string, { fg: string; bg: string }> = {
  happy_path: { fg: '#157449', bg: '#e8f3ee' },
  edge_case: { fg: '#8a6b16', bg: '#f5eddb' },
  negative: { fg: '#9b2a2a', bg: '#f7e5e2' },
};
const PRI_STYLE: Record<string, { fg: string; bg: string }> = {
  critical: { fg: '#fff', bg: '#9b2a2a' },
  high: { fg: '#c0392b', bg: '#fbe5df' },
  medium: { fg: '#8a6b16', bg: '#f5eddb' },
};

function ScenarioRow({
  cat,
  pri,
  title,
  muted,
}: {
  cat: string;
  pri: string;
  title: string;
  muted?: boolean;
}) {
  return (
    <div
      className="grid grid-cols-[100px_1fr_auto] items-center gap-3 border-b border-[#f4efe3] px-1 py-[11px] text-[13.5px] last:border-0"
      style={{ opacity: muted ? 0.45 : 1 }}
    >
      <span
        className="inline-flex w-fit items-center rounded-[4px] px-2 py-0.5 text-[11px] font-medium"
        style={{ background: CAT_STYLE[cat]?.bg, color: CAT_STYLE[cat]?.fg }}
      >
        {cat.replace('_', ' ')}
      </span>
      <span className="text-[#1a1a18]">{title}</span>
      <span
        className="inline-flex items-center rounded-[4px] px-2 py-0.5 text-[11px] font-medium"
        style={{ background: PRI_STYLE[pri]?.bg, color: PRI_STYLE[pri]?.fg }}
      >
        {pri}
      </span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-[#fffdf8]">
      {/* ═══ Nav ═══ */}
      <header className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="#1F6F4E" strokeWidth="1.6" />
            <path
              d="M10 21V11l12 10V11"
              stroke="#1F6F4E"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-heading text-[18px] font-medium tracking-tight text-[#1a1a18]">
            NexTest
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#how"
            className="text-[14px] font-medium text-[#5c5a52] no-underline hover:text-[#1a1a18]"
          >
            Nasil calisir
          </a>
          <a
            href="#features"
            className="text-[14px] font-medium text-[#5c5a52] no-underline hover:text-[#1a1a18]"
          >
            Ozellikler
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-[8px] px-3 py-2 text-[13px] font-medium text-[#5c5a52] no-underline hover:bg-[#f4efe3]"
          >
            Giris yap
          </Link>
          <Link
            href="/register"
            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-[#1f6f4e] px-3.5 text-[13px] font-semibold text-white no-underline shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4)] hover:bg-[#1a5a40]"
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

      {/* ═══ Hero ═══ */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-16 px-8 py-16 pb-24 md:grid-cols-2">
        <div>
          <span className="mb-[18px] inline-flex items-center rounded-[4px] bg-[#ecf5f0] px-2 py-0.5 text-[11px] font-medium text-[#1a5a40]">
            Beta · QA ekipleri icin
          </span>
          <h1 className="font-heading text-[clamp(40px,5.4vw,72px)] font-medium leading-[1.02] tracking-[-0.03em] text-[#1a1a18]">
            Test senaryolarini <em className="italic text-[#1a5a40]">elle</em> yazma.
            <br />
            <em className="italic text-[#1a5a40]">NexTest</em> uretsin.
          </h1>
          <p className="mt-6 max-w-[520px] text-[18px] leading-relaxed text-[#5c5a52]">
            Metin, Jira ticket&apos;i, Excel veya PDF gereksinim dokumani ver — happy path, edge
            case ve negatif senaryolari oncelik etiketleriyle saniyeler icinde al. Cucumber veya
            Playwright koduna tek tikla donustur.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/register"
              className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-[#1f6f4e] px-5 text-[16px] font-semibold text-[#fffdf8] no-underline shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#1a5a40]"
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
            <button className="inline-flex h-12 items-center gap-2 rounded-[10px] px-5 text-[16px] font-semibold text-[#1a1a18] hover:bg-[#f4efe3]">
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
          <div className="mt-8 flex items-center gap-3 text-[13px] text-[#5c5a52]">
            <div className="flex -space-x-1.5">
              {[
                { bg: '#FED9B7', fg: '#7A3E12', t: 'AK' },
                { bg: '#C7E9D6', fg: '#1F6F4E', t: 'MO' },
                { bg: '#D9DCFF', fg: '#3F3DB5', t: 'SD' },
                { bg: '#F8D4D4', fg: '#9B2A2A', t: '+' },
              ].map((a) => (
                <span
                  key={a.t}
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#fffdf8] text-[10px] font-semibold"
                  style={{ background: a.bg, color: a.fg }}
                >
                  {a.t}
                </span>
              ))}
            </div>
            <span>120+ QA ekibi NexTest&apos;i kullaniyor</span>
          </div>
        </div>

        {/* Hero visual: product preview */}
        <div className="relative">
          <div
            className="relative z-[2] overflow-hidden rounded-[18px] border border-[#e8e1cf] bg-white shadow-[0_30px_60px_-25px_rgba(31,41,38,0.25),0_12px_28px_-10px_rgba(31,41,38,0.12)]"
            style={{ transform: 'rotate(-0.6deg)' }}
          >
            {/* Browser bar */}
            <div className="flex items-center gap-2 border-b border-[#f4efe3] bg-[#fbf8f1] px-4 py-3">
              <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#FF6058' }} />
              <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#FFBC2E' }} />
              <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#27CA40' }} />
              <span className="ml-3 font-mono text-[12px] text-[#5c5a52]">
                app.nextest.io / generate
              </span>
            </div>
            {/* Body */}
            <div className="px-6 py-[22px]">
              {/* Input area */}
              <div className="mb-[18px] rounded-[10px] border border-[#f4efe3] bg-[#fbf8f1] p-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a8a595]">
                  Gereksinim
                </span>
                <p className="mt-2 text-[14px] leading-[1.55] text-[#1a1a18]">
                  Kullanici gecerli e-posta ve sifre ile giris yapabilmeli. Yanlis girislerde uyari
                  gosterilmeli, 5 basarisiz denemeden sonra hesap 15 dakika kilitlenmeli.
                </p>
              </div>
              {/* Divider */}
              <div className="mb-1.5 flex items-center justify-between border-b border-dashed border-[#e8e1cf] pb-2.5 text-[12px] text-[#5c5a52]">
                <span>NexTest 12 senaryo uretti</span>
                <span className="font-mono text-[11px] text-[#157449]">2.4 sn</span>
              </div>
              {/* Scenario rows */}
              <ScenarioRow
                cat="happy_path"
                pri="critical"
                title="Gecerli kimlik bilgileri ile giris basarili"
              />
              <ScenarioRow cat="negative" pri="high" title="Hatali sifrede uyari goruntulenir" />
              <ScenarioRow
                cat="edge_case"
                pri="medium"
                title="E-posta buyuk/kucuk harf duyarsiz kabul edilir"
              />
              <ScenarioRow
                cat="negative"
                pri="high"
                title="5 basarisiz denemeden sonra hesap kilitlenir"
              />
              <ScenarioRow
                cat="happy_path"
                pri="medium"
                title="Beni hatirla tercihi 30 gun saklanir"
                muted
              />
              {/* Footer badges */}
              <div className="mt-3.5 flex gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#e8f3ee] px-2 py-0.5 text-[11px] font-medium text-[#157449]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#157449]" />8 happy
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#f5eddb] px-2 py-0.5 text-[11px] font-medium text-[#8a6b16]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8a6b16]" />2 edge
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#f7e5e2] px-2 py-0.5 text-[11px] font-medium text-[#9b2a2a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9b2a2a]" />2 negative
                </span>
              </div>
            </div>
          </div>
          {/* Shadow behind */}
          <div
            className="absolute inset-[8px_-12px_-12px_12px] z-[1] rounded-[18px] bg-[#1f6f4e] opacity-[0.08]"
            style={{ transform: 'rotate(1.6deg)' }}
          />
        </div>
      </section>

      {/* ═══ How it works ═══ */}
      <section className="mx-auto max-w-[1200px] px-8 py-[88px]" id="how">
        <div className="mb-14 text-center">
          <span className="mb-3.5 inline-block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#1a5a40]">
            Nasil calisir
          </span>
          <h2 className="mx-auto max-w-[720px] font-heading text-[clamp(28px,3.5vw,44px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#1a1a18]">
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
              className="relative rounded-[14px] border border-[#e8e1cf] bg-white px-7 py-8"
            >
              <div className="font-heading text-[56px] font-normal italic leading-none text-[#a9d2bb]">
                {step.n}
              </div>
              <div className="absolute right-7 top-8 flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#ecf5f0] text-[#1a5a40]">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2l1.5 3.5L13 7l-3 2.5.5 4L8 11.5 5.5 13.5l.5-4L3 7l3.5-1.5L8 2z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-[#1a1a18]">
                {step.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-[1.55] text-[#5c5a52]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Features ═══ */}
      <section className="mx-auto max-w-[1200px] px-8 pb-[88px]" id="features">
        <div className="mb-14 text-center">
          <span className="mb-3.5 inline-block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#1a5a40]">
            Ozellikler
          </span>
          <h2 className="font-heading text-[clamp(28px,3.5vw,44px)] font-medium leading-[1.15] tracking-[-0.02em] text-[#1a1a18]">
            QA ekipleri icin tasarlandi.
          </h2>
        </div>
        <div
          className="grid overflow-hidden rounded-[14px] border border-[#e8e1cf] bg-[#e8e1cf] md:grid-cols-3"
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
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#ecf5f0] text-[#1a5a40]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2l1.5 3.5L13 7l-3 2.5.5 4L8 11.5 5.5 13.5l.5-4L3 7l3.5-1.5L8 2z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold tracking-[-0.005em] text-[#1a1a18]">
                {feat.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-[1.55] text-[#5c5a52]">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section
        className="mx-8 mb-14 rounded-[24px] bg-[#0f0f0e] px-8 py-24 text-center"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(122,191,158,0.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(217,202,168,0.12), transparent 50%)',
        }}
      >
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-heading text-[clamp(36px,4.5vw,56px)] font-medium leading-[1.1] tracking-[-0.02em] text-[#f4edd9]">
            Bugun ilk senaryonu uret.
          </h2>
          <p className="mt-[18px] text-[17px] text-[#f4edd9]/65">
            Kart bilgisi yok. Ilk 100 senaryo bedava.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-14 items-center gap-2 rounded-[10px] bg-[#1f6f4e] px-6 text-[18px] font-semibold text-[#fffdf8] no-underline shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#1a5a40]"
          >
            Ucretsiz hesap olustur
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
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-[#e8e1cf] px-8 py-7">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6">
          <Link href="/" className="inline-flex items-center gap-2 no-underline">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="#1F6F4E" strokeWidth="1.6" />
              <path
                d="M10 21V11l12 10V11"
                stroke="#1F6F4E"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-heading text-[14px] font-medium text-[#1a1a18]">NexTest</span>
          </Link>
          <span className="text-[13px] text-[#5c5a52]">
            © 2026 NexTest — Test senaryosu uretim platformu
          </span>
          <div className="flex gap-5">
            <span className="text-[13px] text-[#5c5a52] hover:text-[#1a1a18]">Gizlilik</span>
            <span className="text-[13px] text-[#5c5a52] hover:text-[#1a1a18]">Sartlar</span>
            <span className="text-[13px] text-[#5c5a52] hover:text-[#1a1a18]">Iletisim</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
