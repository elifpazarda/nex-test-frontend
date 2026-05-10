import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ═══ Left: Brand Panel ═══ */}
      <aside className="relative hidden overflow-hidden border-r border-[#f4efe3] bg-[#fbf8f1] px-14 py-10 lg:flex lg:flex-col">
        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(31,111,78,0.07),transparent_45%),radial-gradient(circle_at_95%_88%,rgba(198,138,18,0.07),transparent_50%)]" />

        {/* Nav */}
        <div className="relative flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 text-inherit no-underline">
            {/* NxMark SVG */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="15" stroke="#1F6F4E" strokeWidth="1.6" />
              <path
                d="M10 21V11l12 10V11"
                stroke="#1F6F4E"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-heading text-[22px] font-medium tracking-tight text-[#1a1a18]">
              NexTest
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#5c5a52] no-underline hover:text-[#1a1a18]"
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
        <div className="relative my-auto max-w-[460px]">
          <div className="font-heading text-[120px] italic leading-[0.6] text-[#a9d2bb]">
            &ldquo;
          </div>
          <p className="font-heading text-[32px] font-medium leading-[1.18] tracking-tight text-[#1a1a18]">
            Bir sprint&apos;te <em className="font-medium italic text-[#1a5a40]">uc gun</em>{' '}
            harcadigimiz test senaryosu yazimi, artik{' '}
            <em className="font-medium italic text-[#1a5a40]">kahve molasi</em> kadar suruyor.
          </p>
          <div className="mt-[22px] flex items-center gap-3">
            <span
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold tracking-wide"
              style={{ background: '#FED9B7', color: '#7A3E12' }}
            >
              AC
            </span>
            <div>
              <div className="text-[13px] font-medium text-[#1a1a18]">Asli Cetin</div>
              <div className="text-[13px] text-[#5c5a52]">QA Lead, Trendyol</div>
            </div>
          </div>
        </div>

        {/* Peek card */}
        <div className="relative mt-12 max-w-[460px] rounded-[14px] border border-[#e8e1cf] bg-white p-[14px_16px] shadow-[0_18px_40px_-20px_rgba(31,41,38,0.15)]">
          <div className="flex items-center justify-between border-b border-dashed border-[#e8e1cf] pb-2.5 text-[11px] uppercase tracking-[0.06em] text-[#a8a595]">
            <span>NexTest · Odeme akisi</span>
            <span className="font-mono normal-case tracking-normal text-[#157449]">1.8 sn</span>
          </div>
          {/* Row 1 */}
          <div className="grid grid-cols-[100px_1fr_auto] items-center gap-2.5 py-2 text-[13px]">
            <span className="inline-flex items-center rounded-[4px] bg-[#e8f3ee] px-2 py-0.5 text-[11px] font-medium text-[#157449]">
              Happy
            </span>
            <span className="text-[#1a1a18]">Gecerli kart ile odeme tamamlanir</span>
            <span className="inline-flex items-center rounded-[4px] bg-[#9b2a2a] px-2 py-0.5 text-[11px] font-medium text-white">
              Kritik
            </span>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-[100px_1fr_auto] items-center gap-2.5 border-t border-[#f4efe3] py-2 text-[13px]">
            <span className="inline-flex items-center rounded-[4px] bg-[#f7e5e2] px-2 py-0.5 text-[11px] font-medium text-[#9b2a2a]">
              Negative
            </span>
            <span className="text-[#1a1a18]">Yetersiz bakiye uyarisi gosterilir</span>
            <span className="inline-flex items-center rounded-[4px] bg-[#fbe5df] px-2 py-0.5 text-[11px] font-medium text-[#c0392b]">
              Yuksek
            </span>
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-[100px_1fr_auto] items-center gap-2.5 border-t border-[#f4efe3] py-2 text-[13px]">
            <span className="inline-flex items-center rounded-[4px] bg-[#f5eddb] px-2 py-0.5 text-[11px] font-medium text-[#8a6b16]">
              Edge
            </span>
            <span className="text-[#1a1a18]">3D Secure zaman asiminda geri al</span>
            <span className="inline-flex items-center rounded-[4px] bg-[#f5eddb] px-2 py-0.5 text-[11px] font-medium text-[#8a6b16]">
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
