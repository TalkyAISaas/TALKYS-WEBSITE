import { useEffect, useRef } from 'react';
import {
  Mic, BookOpen, Phone, ArrowRightLeft, BarChart3, MessageSquare, Users, Shield, Zap,
} from 'lucide-react';
import VanillaTilt from 'vanilla-tilt';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

const ICONS = [Mic, BookOpen, Phone, ArrowRightLeft, BarChart3, MessageSquare, Users, Shield, Zap];
const HIGHLIGHT_INDEXES = new Set([0, 4, 8]);

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const itemsCopy = t<{ title: string; desc: string }[]>('features.items');
  const dashboardStatsCopy = t<{ value: string; label: string }[]>('features.dashboard.stats');
  const items = Array.isArray(itemsCopy) ? itemsCopy : [];
  const dashboardStats = Array.isArray(dashboardStatsCopy) ? dashboardStatsCopy : [];

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

    const tiltTargets = sectionRef.current?.querySelectorAll<HTMLElement>('[data-tilt]');
    if (tiltTargets) {
      VanillaTilt.init(Array.from(tiltTargets), {
        max: 4,
        speed: 500,
        perspective: 1500,
        easing: 'cubic-bezier(.03,.98,.52,.99)',
      });
    }

    return () => {
      observer.disconnect();
      tiltTargets?.forEach((el) => {
        const tilt = (el as HTMLElement & { vanillaTilt?: { destroy: () => void } }).vanillaTilt;
        if (tilt) tilt.destroy();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{(t('features.eyebrow') as string) || 'FEATURES'}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('features.titlePrefix') as string}{' '}
            <AccentItalic>{t('features.titleHighlight') as string}</AccentItalic>
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[520px] mx-auto">
            {t('features.subtitle') as string}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            const isHighlight = HIGHLIGHT_INDEXES.has(i);
            const isWaveform = i === 4;
            return (
              <div
                key={i}
                data-tilt
                data-tilt-max={isHighlight ? 3 : 4}
                className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 relative bg-white border border-black/[0.06] rounded-[22px] p-7 shadow-card hover:shadow-card-hover overflow-hidden"
                style={{ transitionDelay: `${(i + 1) * 60}ms`, transformStyle: 'preserve-3d' }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all ${
                  isHighlight
                    ? 'bg-gradient-to-br from-accent to-accent-soft text-white shadow-[0_10px_24px_-10px_rgba(229,119,86,0.5)]'
                    : 'bg-gradient-to-br from-teal to-teal-light text-white shadow-[0_10px_24px_-10px_rgba(14,79,92,0.5)]'
                }`}>
                  {Icon && <Icon className="w-5 h-5" strokeWidth={2} />}
                </div>
                <h3 className="font-heading font-bold text-[20px] text-foreground mb-1.5 tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-[1.5]">
                  {item.desc}
                </p>

                {isWaveform && (
                  <div className="mt-4 h-16 flex items-end gap-1 justify-between">
                    {Array.from({ length: 18 }, (_, k) => (
                      <div
                        key={k}
                        className="flex-1 rounded-[3px] animate-wave-pulse"
                        style={{
                          background: 'linear-gradient(180deg, #e57756 0%, #f5a585 100%)',
                          animationDelay: `${(k < 9 ? k : 17 - k) * 0.08}s`,
                          boxShadow: '0 0 12px rgba(229,119,86,0.3)',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-500 mt-12">
          <div className="bg-white border border-black/[0.06] rounded-[22px] p-8 shadow-card relative overflow-hidden">
            <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
              <div>
                <p className="text-accent text-sm font-medium uppercase tracking-[0.16em]">{t('features.dashboard.eyebrow') as string}</p>
                <p className="text-foreground font-heading font-bold text-2xl mt-2">{t('features.dashboard.title') as string}</p>
                <p className="text-muted-foreground text-sm mt-1">{t('features.dashboard.subtitle') as string}</p>
              </div>
              <div className="flex items-center gap-6">
                {dashboardStats.map((s, k) => (
                  <div key={k} className="text-center">
                    <p className="text-foreground font-heading font-bold text-2xl">{s.value}</p>
                    <p className="text-muted-foreground text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
