import Link from 'next/link';

export function LandingCTA() {
  return (
    <section
      className="mx-8 mb-14 rounded-[24px] bg-[var(--palette-neutral-950)] px-8 py-24 text-center"
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
          className="mt-8 inline-flex h-14 items-center gap-2 rounded-[10px] bg-primary px-6 text-[18px] font-semibold text-background no-underline shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[var(--palette-brand-700)]"
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
  );
}
