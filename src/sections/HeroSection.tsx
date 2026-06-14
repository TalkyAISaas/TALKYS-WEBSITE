import { useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';
import { HeroArcs } from '@/components/HeroArcs';
import { HeroFloatingTiles } from '@/components/HeroFloatingTiles';
import { useT } from '@/context/LocaleContext';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative overflow-hidden min-h-[90vh] flex items-center justify-center bg-background px-6 pt-20 pb-32">
      <HeroArcs />
      <HeroFloatingTiles />

      <div className="relative z-[2] max-w-[900px] mx-auto text-center">
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-8">
          <ChipEyebrow>{t('hero.badge') as string}</ChipEyebrow>
        </div>

        <h1 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 giant-headline mb-7">
          {t('hero.title') as string}{' '}
          <AccentItalic>Talkys</AccentItalic>.
        </h1>

        <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 text-[17px] text-muted-foreground max-w-[560px] mx-auto mb-9 leading-[1.5]">
          {t('hero.subtitle') as string}
        </p>

        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 inline-flex gap-3 flex-wrap justify-center relative">
          <button
            onClick={() => document.querySelector('#get-started')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-coral inline-flex items-center gap-2"
          >
            {t('hero.ctaPrimary') as string}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
          <button
            onClick={() => document.querySelector('#demo')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-dark inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {t('hero.ctaSecondary') as string}
          </button>

          <div className="scribble">
            <svg viewBox="0 0 60 38" fill="none" aria-hidden="true">
              <path d="M 4 32 C 18 32, 35 22, 50 6" stroke="#e57756" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 44 6 L 52 4 L 52 13" stroke="#e57756" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="script">{t('hero.scribble') as string}</span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
