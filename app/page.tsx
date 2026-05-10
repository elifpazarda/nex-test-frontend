import { LandingNav } from './_components/landing-nav';
import { LandingHero } from './_components/landing-hero';
import { HowItWorks } from './_components/how-it-works';
import { Features } from './_components/features';
import { LandingFooter } from './_components/landing-footer';

export default function LandingPage() {
  return (
    <div className="h-screen overflow-x-hidden overflow-y-auto bg-background snap-y snap-proximity">
      <div className="relative flex min-h-screen flex-col snap-start">
        <LandingNav />
        <LandingHero />

        {/* Scroll indicator — overlay, pinned to bottom (ZStack .bottom) */}
        <a
          href="#how"
          className="group absolute inset-x-0 bottom-6 z-10 hidden flex-col items-center gap-2 no-underline md:flex"
        >
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--palette-neutral-400)] transition-colors group-hover:text-accent-foreground">
            Kesfet
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-sm transition-all group-hover:border-primary group-hover:shadow-[0_0_16px_rgba(31,111,78,0.2)]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="animate-bounce text-[var(--palette-neutral-400)] transition-colors group-hover:text-primary"
            >
              <path
                d="M10 4v12m0 0l-4.5-4.5m4.5 4.5l4.5-4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </a>
      </div>
      <div className="snap-start">
        <HowItWorks />
      </div>
      <div className="snap-start">
        <Features />
      </div>
      <div className="snap-start">
        <LandingFooter />
      </div>
    </div>
  );
}
