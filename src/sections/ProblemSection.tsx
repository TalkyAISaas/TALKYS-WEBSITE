import { useEffect, useRef, useState } from 'react';
import { useT, useLocale } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

const AnimatedCounter = ({ end, suffix = '', visible, locale }: { end: number; suffix?: string; visible: boolean; locale: 'en' | 'ar' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const duration = 2000;
    const startTime = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, end]);
  return <span>{count.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}{suffix}</span>;
};

const ProblemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('animate-visible'); setIsVisible(true); }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const t = useT();
  const { locale } = useLocale();

  interface ProblemCopy {
    title: string;
    description: string;
    statLabel: string;
  }
  const problemCopy = t<ProblemCopy[]>('problem.items');

  const problems = [
    { stat: { value: 62,   suffix: '%' } },
    { stat: { value: 3,    suffix: 'x' } },
    { stat: { value: 23,   suffix: '%' } },
    { stat: { value: 1500, suffix: '$' } },
  ].map((p, i) => ({ ...p, ...problemCopy[i] }));

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{(t('problem.eyebrow') as string) || 'THE PROBLEM'}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('problem.titlePrefix') as string}{' '}
            <AccentItalic>{t('problem.titleHighlight') as string}</AccentItalic>{' '}
            {t('problem.titleSuffix') as string}
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[540px] mx-auto">
            {t('problem.subtitle') as string}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700"
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="bg-white border border-black/[0.06] rounded-[22px] p-10 px-7 shadow-card text-center hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 h-full">
                <div className="text-[60px] font-bold tracking-[-0.04em] leading-none text-accent italic mb-3.5 font-heading">
                  <AnimatedCounter end={problem.stat.value} suffix={problem.stat.suffix} visible={isVisible} locale={locale} />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2 tracking-[-0.015em]">{problem.title}</h4>
                <p className="text-muted-foreground text-sm leading-[1.5]">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
