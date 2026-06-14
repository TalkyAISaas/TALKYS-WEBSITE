import { useEffect, useRef, useState } from 'react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

type Moment = { time: string; text: string; outcome: string };
type Industry = { key: string; label: string; emoji?: string; moments: Moment[] };

const DEFAULT_KEY = 'dealership';

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();

  const industriesCopy = t<Industry[]>('features.industries');
  const industries: Industry[] = Array.isArray(industriesCopy) ? industriesCopy : [];

  const yourIndustryLabel = (t('features.yourIndustry') as string) || 'Your industry';
  const yourIndustryAria = (t('features.yourIndustryAria') as string) || 'Book a demo';

  const initialKey = industries.some((i) => i.key === DEFAULT_KEY)
    ? DEFAULT_KEY
    : industries[0]?.key ?? DEFAULT_KEY;
  const [activeKey, setActiveKey] = useState<string>(initialKey);

  const active =
    industries.find((i) => i.key === activeKey) ?? industries[0] ?? null;

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

  const scrollToDemo = () => {
    document.querySelector('#get-started')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} id="features" className="py-24 lg:py-28">
      <div className="max-w-[920px] mx-auto px-6">
        <div className="text-center mb-10">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{(t('features.eyebrow') as string) || 'A DAY WITH TALKYS'}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('features.titlePrefix') as string}{' '}
            <AccentItalic>{t('features.titleHighlight') as string}</AccentItalic>
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[520px] mx-auto">
            {t('features.subtitle') as string}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={(t('features.eyebrow') as string) || 'Industries'}
          className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 flex flex-wrap justify-center gap-2 mb-10"
        >
          {industries.map((industry) => {
            const isActive = industry.key === activeKey;
            return (
              <button
                key={industry.key}
                role="tab"
                aria-selected={isActive}
                aria-controls="day-timeline-panel"
                onClick={() => setActiveKey(industry.key)}
                className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-accent to-accent-soft text-white border border-transparent shadow-[0_6px_14px_-4px_rgba(229,119,86,0.45)]'
                    : 'bg-white text-muted-foreground border border-black/10 hover:border-black/20'
                }`}
              >
                {industry.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={scrollToDemo}
            aria-label={yourIndustryAria}
            className="text-xs font-semibold italic px-4 py-2 rounded-full border border-dashed border-teal/40 text-teal hover:border-teal/70 hover:bg-teal/5 transition-all"
          >
            + {yourIndustryLabel}
          </button>
        </div>

        <div
          id="day-timeline-panel"
          role="tabpanel"
          aria-labelledby={active?.key ?? ''}
          className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 max-w-[560px] mx-auto"
        >
          {active && (
            <ol key={active.key} className="relative ps-8 list-none">
              <span
                aria-hidden
                className="absolute inset-y-1 start-[9px] w-[2px] rounded-full bg-gradient-to-b from-accent to-teal"
              />
              {active.moments.map((moment, idx) => (
                <li key={`${active.key}-${idx}`} className="relative py-2.5 ps-0">
                  <span
                    aria-hidden
                    className="absolute top-3.5 -start-[30px] w-4 h-4 rounded-full bg-white border-[3px] border-accent shadow-[0_0_0_4px_rgba(229,119,86,0.12)]"
                  />
                  <div className="text-[11px] font-bold tracking-[0.08em] text-accent uppercase">
                    {moment.time}
                  </div>
                  <p className="mt-1 text-sm text-foreground leading-[1.5]">
                    {moment.text}{' '}
                    <span className="font-bold text-teal">{moment.outcome}</span>
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
