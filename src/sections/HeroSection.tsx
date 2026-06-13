import { useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Console } from '@/components/Console';
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

  const trustLogos = t<string[]>('hero.trustLogos');
  const trustLogosArray = Array.isArray(trustLogos) ? trustLogos : [];

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
          <AccentItalic>Talkys</AccentItalic>
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
            onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
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

        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-[400ms] mt-14">
          <Console />
        </div>
      </div>

      <div className="absolute bottom-9 left-0 right-0 text-center z-[2]">
        <div className="text-[11.5px] tracking-[0.18em] text-muted-foreground inline-flex items-center gap-3.5 before:content-[''] before:w-[60px] before:h-px before:bg-black/10 after:content-[''] after:w-[60px] after:h-px after:bg-black/10">
          {t('hero.trustLabel') as string}{' '}
          <strong className="text-foreground font-bold">{t('hero.trustCount') as string}</strong>{' '}
          {t('hero.trustSuffix') as string}
        </div>
        <div className="mt-4 flex gap-12 justify-center items-center flex-wrap">
          {trustLogosArray.map((logo) => (
            <span key={logo} className="font-bold text-[19px] tracking-[-0.02em] text-foreground/50">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
