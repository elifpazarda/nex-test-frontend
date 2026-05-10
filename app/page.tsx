import { LandingNav } from '@/components/landing/landing-nav';
import { LandingHero } from '@/components/landing/landing-hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Features } from '@/components/landing/features';
import { LandingCTA } from '@/components/landing/landing-cta';
import { LandingFooter } from '@/components/landing/landing-footer';

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-background">
      <LandingNav />
      <LandingHero />
      <HowItWorks />
      <Features />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
