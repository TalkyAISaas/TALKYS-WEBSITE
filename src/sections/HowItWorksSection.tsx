import { useEffect, useRef, useState } from 'react';
import { Phone, MessageCircle, ShoppingCart, Send, BarChart3 } from 'lucide-react';
import { useT } from '@/context/LocaleContext';

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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
        if (entries[0].isIntersecting) { setIsVisible(true); visObserver.disconnect(); }
      },
      { threshold: 0.2 }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => animObserver.observe(el));
    if (sectionRef.current) visObserver.observe(sectionRef.current);
    return () => { animObserver.disconnect(); visObserver.disconnect(); };
  }, []);

  // Auto-advance steps only when section is visible
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const t = useT();
  const stepsCopy = t<{ title: string; description: string; detail: string }[]>('howItWorks.steps');
  const integrationsCopy = t<string[]>('howItWorks.integrations');

  const steps = [
    { icon: Phone,         number: '01', image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=600&q=80', ...stepsCopy[0] },
    { icon: MessageCircle, number: '02', image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=600&q=80', ...stepsCopy[1] },
    { icon: ShoppingCart,  number: '03', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80', ...stepsCopy[2] },
    { icon: Send,          number: '04', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=600&q=80', ...stepsCopy[3] },
    { icon: BarChart3,     number: '05', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', ...stepsCopy[4] },
  ];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-24 lg:py-32"
    >
      <div className="absolute top-0 left-0 right-0 section-divider" />

      {/* Background orb */}
      <div className="gradient-orb w-[400px] h-[400px] top-1/3 -left-40 bg-[#1A8FA8]/5" />

      <div className="w-full px-6 lg:px-16">
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
              {t('howItWorks.titlePrefix') as string} <span className="text-[#1A8FA8]">{t('howItWorks.titleHighlight') as string}</span>
            </h2>
            <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 mt-5 text-lg text-foreground/50">
              {t('howItWorks.subtitle') as string}
            </p>
          </div>

          {/* Interactive steps layout */}
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200">
            <div className="grid lg:grid-cols-[350px_1fr] gap-8">
              {/* Step selector - left panel */}
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-500 group ${
                      activeStep === index
                        ? 'card-dark border-[#0F4C5C]/30 bg-[#0F4C5C]/10'
                        : 'hover:bg-foreground/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                        activeStep === index
                          ? 'bg-gradient-to-br from-[#0F4C5C] to-[#1A8FA8] shadow-[0_0_20px_rgba(15,76,92,0.3)]'
                          : 'bg-foreground/[0.04]'
                      }`}>
                        <span className={`font-heading font-bold text-sm ${activeStep === index ? 'text-white' : 'text-foreground/40'}`}>
                          {step.number}
                        </span>
                      </div>
                      <div>
                        <h3 className={`font-heading font-semibold transition-colors duration-300 ${
                          activeStep === index ? 'text-foreground' : 'text-foreground/50'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                          activeStep === index ? 'text-[#1A8FA8]' : 'text-foreground/25'
                        }`}>
                          {step.detail}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {activeStep === index && (
                      <div className="mt-3 ml-16 h-0.5 bg-foreground/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8] rounded-full animate-[shimmer_4s_linear_infinite]" style={{ width: '100%' }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Step detail - right panel with image */}
              <div className="card-gradient-border overflow-hidden">
                <div className="relative h-full min-h-[400px]">
                  {/* Image */}
                  <img
                    key={activeStep}
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#1A8FA8] flex items-center justify-center">
                        {(() => {
                          const Icon = steps[activeStep].icon;
                          return <Icon className="w-5 h-5 text-white" />;
                        })()}
                      </div>
                      <span className="text-[#1A8FA8] font-heading font-bold text-sm">{t('howItWorks.stepLabel') as string} {steps[activeStep].number}</span>
                    </div>
                    <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
                      {steps[activeStep].title}
                    </h3>
                    <p className="text-foreground/60 leading-relaxed max-w-md">
                      {steps[activeStep].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* POS Integration Badges */}
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-500 mt-12 flex flex-wrap justify-center gap-3">
            {integrationsCopy.map((integration, index) => (
              <div
                key={index}
                className="px-5 py-2.5 rounded-full bg-foreground/[0.03] border border-foreground/[0.06] text-foreground/50 text-sm font-medium hover:bg-foreground/[0.06] hover:text-foreground/70 transition-all duration-300 cursor-default"
              >
                {integration}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
