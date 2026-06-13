import { useEffect, useRef, useState } from 'react';
import { Utensils, Stethoscope, ShoppingBag, Home, Scissors, Truck, Package, Ship } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

const IndustriesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const t = useT();
  interface IndustryCopy {
    shortTitle: string;
    title: string;
    description: string;
    role: string;
    flow: string[];
    quote: string;
    capabilities: string[];
  }
  const industryCopy = t<IndustryCopy[]>('industries.items');
  const industryCopyArray = Array.isArray(industryCopy) ? industryCopy : [];

  const industries = [
    { icon: Utensils,    ...industryCopyArray[0] },
    { icon: Stethoscope, ...industryCopyArray[1] },
    { icon: ShoppingBag, ...industryCopyArray[2] },
    { icon: Home,        ...industryCopyArray[3] },
    { icon: Scissors,    ...industryCopyArray[4] },
    { icon: Truck,       ...industryCopyArray[5] },
    { icon: Package,     ...industryCopyArray[6] },
    { icon: Ship,        ...industryCopyArray[7] },
  ];

  const active = industries[activeTab] ?? null;
  if (!active) return null;

  return (
    <section ref={sectionRef} id="industries" className="py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{(t('industries.eyebrow') as string) || 'INDUSTRIES'}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('industries.titlePrefix') as string}{' '}
            <AccentItalic>{t('industries.titleHighlight') as string}</AccentItalic>
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[540px] mx-auto">
            {t('industries.subtitle') as string}
          </p>
        </div>

        {/* Tab pills */}
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 mb-10 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full justify-start lg:justify-center gap-2 px-1">
            {industries.map((industry, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border ${
                  activeTab === index
                    ? 'bg-accent text-white border-accent shadow-coral'
                    : 'bg-white text-foreground/60 border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:text-foreground hover:border-accent/30'
                }`}
              >
                {industry.shortTitle}
              </button>
            ))}
          </div>
        </div>

        {/* Active industry card */}
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 bg-white border border-black/[0.06] rounded-[22px] overflow-hidden shadow-card">
          <div className="grid lg:grid-cols-[1fr_1.2fr]">
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-teal to-teal-light flex items-center justify-center text-white shadow-[0_10px_24px_-10px_rgba(14,79,92,0.4)]">
                  <active.icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-accent text-xs font-bold tracking-[0.15em] uppercase">{active.role}</span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-3 tracking-[-0.015em]">
                {active.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{active.description}</p>

              <ul className="space-y-3 mb-6">
                {active.flow.map((step, idx) => (
                  <li key={step} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{idx + 1}</span>
                    </div>
                    <span className="text-sm text-foreground/70">{step}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {active.capabilities.map((cap) => (
                  <span key={cap} className="px-3 py-1 rounded-full bg-background border border-black/[0.06] text-foreground/60 text-[11px] font-medium">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-background border-t lg:border-t-0 lg:border-s border-black/[0.06] p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <p className="text-xs text-accent font-medium">{t('industries.speakingLabel') as string}</p>
              </div>
              <p className="text-foreground/70 text-base leading-relaxed italic">
                {active.quote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
