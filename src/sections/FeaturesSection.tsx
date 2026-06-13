import { useEffect, useRef } from 'react';
import {
  Mic,
  BookOpen,
  Phone,
  ArrowRightLeft,
  BarChart3,
  MessageSquare,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { useT } from '@/context/LocaleContext';

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
  const itemsCopy = t<{ title: string; desc: string }[]>('features.items');
  const dashboardStats = t<{ value: string; label: string }[]>('features.dashboard.stats');

  const features = [
    { icon: Mic,            highlight: true,  ...itemsCopy[0] },
    { icon: BookOpen,       highlight: false, ...itemsCopy[1] },
    { icon: Phone,          highlight: false, ...itemsCopy[2] },
    { icon: ArrowRightLeft, highlight: false, ...itemsCopy[3] },
    { icon: BarChart3,      highlight: true,  ...itemsCopy[4] },
    { icon: MessageSquare,  highlight: false, ...itemsCopy[5] },
    { icon: Users,          highlight: false, ...itemsCopy[6] },
    { icon: Shield,         highlight: false, ...itemsCopy[7] },
    { icon: Zap,            highlight: true,  ...itemsCopy[8] },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 lg:py-32"
    >
      <div className="absolute top-0 left-0 right-0 section-divider" />

      {/* Subtle glow */}
      <div className="gradient-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F4C5C]/4" />

      <div className="w-full px-6 lg:px-16">
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
              {t('features.titlePrefix') as string} <span className="text-[#1A8FA8]">{t('features.titleHighlight') as string}</span>
            </h2>
            <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 mt-5 text-lg text-foreground/50">
              {t('features.subtitle') as string}
            </p>
          </div>

          {/* Features Grid with mixed card sizes */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700"
                style={{ transitionDelay: `${(index + 1) * 60}ms` }}
              >
                <div className={`${feature.highlight ? 'card-gradient-border' : 'card-dark'} p-6 h-full group relative overflow-hidden`}>
                  {/* Hover glow */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-[#0F4C5C]/10 blur-3xl" />
                  </div>

                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl ${feature.highlight ? 'bg-[#0F4C5C]/20' : 'bg-foreground/[0.04]'} flex items-center justify-center mb-4 group-hover:bg-[#0F4C5C]/20 group-hover:shadow-[0_0_20px_rgba(15,76,92,0.15)] transition-all duration-500`}>
                      <feature.icon className={`w-6 h-6 ${feature.highlight ? 'text-[#1A8FA8]' : 'text-foreground/50'} group-hover:text-[#1A8FA8] group-hover:scale-110 transition-all duration-500`} />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-foreground/40 leading-relaxed group-hover:text-foreground/55 transition-colors duration-300">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom visual - Dashboard preview */}
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-500 mt-16">
            <div className="card-gradient-border overflow-hidden">
              <div className="relative h-64 lg:h-80">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                  alt="Analytics Dashboard"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="text-[#1A8FA8] text-sm font-medium">{t('features.dashboard.eyebrow') as string}</p>
                    <p className="text-foreground font-heading font-bold text-2xl mt-1">{t('features.dashboard.title') as string}</p>
                    <p className="text-foreground/40 text-sm mt-1">{t('features.dashboard.subtitle') as string}</p>
                  </div>
                  <div className="hidden lg:flex items-center gap-6">
                    {dashboardStats.map((s, i) => (
                      <div key={i} className="text-center">
                        <p className="text-foreground font-heading font-bold text-2xl">{s.value}</p>
                        <p className="text-foreground/30 text-xs">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
