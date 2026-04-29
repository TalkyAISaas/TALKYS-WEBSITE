import { useEffect, useRef, useState } from 'react';
import { PhoneOff, Users, RefreshCw, TrendingUp } from 'lucide-react';

const AnimatedCounter = ({ end, suffix = '', visible }: { end: number; suffix?: string; visible: boolean }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (2000 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end]);
  return <span>{count.toLocaleString()}{suffix}</span>;
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

  const problems = [
    { icon: PhoneOff, title: 'Missed Calls = Missed Revenue', description: 'Your delivery line rings during peak hours. Staff are busy. Customers hang up and call someone else.', image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=600&q=80', stat: { value: 62, suffix: '%', label: 'of calls missed during peak hours' } },
    { icon: Users, title: 'Staff Overwhelmed', description: 'Friday night, 8pm — three calls at once, WhatsApp orders, social media DMs stacking up.', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80', stat: { value: 3, suffix: 'x', label: 'more orders than staff can handle' } },
    { icon: RefreshCw, title: 'Orders Lost in Translation', description: 'Order taken by phone, written on paper, manually entered into POS. Errors happen.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80', stat: { value: 23, suffix: '%', label: 'average order error rate' } },
    { icon: TrendingUp, title: 'Hiring Costs Rising', description: 'A receptionist costs $800-1,500/month. They get sick, they leave, they make mistakes.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80', stat: { value: 1500, suffix: '$', label: '/month per receptionist' } },
  ];

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-background">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="w-full px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
              Lebanon's Businesses Are Losing{' '}
              <span className="text-[#E07A5F]">Revenue</span> to Missed Calls
            </h2>
            <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 mt-5 text-lg text-foreground/50 leading-relaxed">
              Every unanswered call is a lost order. Every busy line is a customer calling your competitor.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {problems.map((problem, index) => (
              <div key={index} className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700" style={{ transitionDelay: `${(index + 2) * 100}ms` }}>
                <div className="card-gradient-border p-0 h-full group">
                  <div className="relative h-44 overflow-hidden rounded-t-2xl">
                    <img src={problem.image} alt={problem.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#E07A5F]/20 backdrop-blur-sm border border-[#E07A5F]/30">
                      <p className="text-[#E07A5F] font-heading font-bold text-lg">
                        <AnimatedCounter end={problem.stat.value} suffix={problem.stat.suffix} visible={isVisible} />
                      </p>
                      <p className="text-foreground/40 text-[10px]">{problem.stat.label}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E07A5F]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E07A5F]/20 transition-colors duration-300">
                        <problem.icon className="w-6 h-6 text-[#E07A5F] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{problem.title}</h3>
                        <p className="text-foreground/50 leading-relaxed text-sm">{problem.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
