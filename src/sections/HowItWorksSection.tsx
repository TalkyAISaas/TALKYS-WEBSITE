import { useEffect, useRef, useState } from 'react';
import { Phone, MessageCircle, ShoppingCart, Send, BarChart3 } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

const ICONS = [Phone, MessageCircle, ShoppingCart, Send, BarChart3];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const t = useT();
  const stepsCopy = t<{ title: string; description: string; detail: string }[]>('howItWorks.steps');
  const integrationsCopy = t<string[]>('howItWorks.integrations');
  const stepsArray = Array.isArray(stepsCopy) ? stepsCopy : [];
  const integrationsArray = Array.isArray(integrationsCopy) ? integrationsCopy : [];

  useEffect(() => {
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const visObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          visObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => animObserver.observe(el));
    if (sectionRef.current) visObserver.observe(sectionRef.current);
    return () => {
      animObserver.disconnect();
      visObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible || stepsArray.length === 0) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stepsArray.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible, stepsArray.length]);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{(t('howItWorks.eyebrow') as string) || 'HOW IT WORKS'}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('howItWorks.titlePrefix') as string}{' '}
            <AccentItalic>{t('howItWorks.titleHighlight') as string}</AccentItalic>
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[540px] mx-auto">
            {t('howItWorks.subtitle') as string}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200">
          {stepsArray.map((step, i) => {
            const Icon = ICONS[i];
            const isActive = activeStep === i;
            return (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`text-left rounded-[22px] p-7 border transition-all duration-500 ${
                  isActive
                    ? 'bg-[#fef4ed] border-accent/45 shadow-coral -translate-y-2'
                    : 'bg-white border-black/[0.06] shadow-card hover:-translate-y-0.5'
                }`}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10.5px] font-bold tracking-[0.22em] mb-5 border transition-colors ${
                  isActive
                    ? 'bg-accent/15 border-accent/40 text-foreground'
                    : 'bg-background border-black/[0.06] text-foreground'
                }`}>
                  <span className="text-accent text-[12px]">‹</span>
                  {t('howItWorks.stepLabel') as string} {String(i + 1).padStart(2, '0')}
                  <span className="text-accent text-[12px]">›</span>
                </div>

                <div className={`w-14 h-14 rounded-[14px] flex items-center justify-center text-white mb-5 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-accent to-accent-soft shadow-[0_10px_24px_-10px_rgba(229,119,86,0.5)]'
                    : 'bg-gradient-to-br from-teal to-teal-light shadow-[0_10px_24px_-10px_rgba(14,79,92,0.5)]'
                }`}>
                  {Icon && <Icon className="w-5 h-5" strokeWidth={2} />}
                </div>

                <h4 className="text-[20px] font-bold text-foreground mb-2 tracking-[-0.015em] font-heading">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-[1.5]">
                  {step.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {integrationsArray.map((integration) => (
            <div
              key={integration}
              className="px-5 py-2.5 rounded-full bg-white border border-black/[0.06] text-foreground/60 text-sm font-medium shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:text-foreground hover:border-accent/30 transition-all"
            >
              {integration}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
