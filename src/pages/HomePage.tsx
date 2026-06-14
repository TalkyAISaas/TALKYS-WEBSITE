import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Navigation from '@/sections/Navigation';
import HeroSection from '@/sections/HeroSection';
import ProblemSection from '@/sections/ProblemSection';
import SolutionSection from '@/sections/SolutionSection';
import DemoSection from '@/sections/DemoSection';
import HowItWorksSection from '@/sections/HowItWorksSection';
import FeaturesSection from '@/sections/FeaturesSection';
import WhyTalkysSection from '@/sections/WhyTalkysSection';
import FounderNoteSection from '@/sections/FounderNoteSection';
import FaqSection from '@/sections/FaqSection';
import GettingStartedSection from '@/sections/GettingStartedSection';
import FooterSection from '@/sections/FooterSection';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

type BridgeCopy = { eyebrow: string; linePrefix: string; lineAccent: string };

const SectionBridge = ({ copy }: { copy: BridgeCopy }) => (
  <div className="flex flex-col items-center gap-4 py-10 -mt-4 -mb-4 relative z-10 px-6 text-center">
    <ChipEyebrow>{copy.eyebrow}</ChipEyebrow>
    <p className="font-heading text-[22px] sm:text-[26px] text-foreground leading-[1.2] tracking-[-0.01em] max-w-[520px]">
      {copy.linePrefix}{' '}
      <AccentItalic>{copy.lineAccent}</AccentItalic>
    </p>
    <svg
      aria-hidden
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#e57756"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-bounce-soft"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="6 13 12 19 18 13" />
    </svg>
  </div>
);

const HomePage = () => {
  const location = useLocation();
  const t = useT();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash;
    const tryScroll = () => {
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    const timer = window.setTimeout(tryScroll, 50);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <DemoSection />
        <SectionBridge copy={t<BridgeCopy>('bridge.demoToHow')} />
        <HowItWorksSection />
        <FeaturesSection />
        <WhyTalkysSection />
        <FounderNoteSection />
        <FaqSection />
        <GettingStartedSection />
      </main>
      <FooterSection />
    </>
  );
};

export default HomePage;
