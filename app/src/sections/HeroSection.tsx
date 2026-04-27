import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Clock, Globe, Phone, Zap, Play } from 'lucide-react';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [countersVisible, setCountersVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            setCountersVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Clock, value: '24/7', label: 'Always On' },
    { icon: Globe, value: 'AR + EN', label: 'Bilingual' },
    { icon: Phone, value: '< 3s', label: 'Response Time' },
    { icon: Zap, value: '100%', label: 'Call Coverage' },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-background overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-[0.07] dark:opacity-[0.12]"
          poster="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80"
        >
          <source src="https://cdn.coverr.co/videos/coverr-a-man-talking-on-the-phone-in-an-office-5374/1080p.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 futuristic-grid opacity-20 dark:opacity-20" />
        <div className="gradient-orb w-[500px] h-[500px] -top-20 -right-20 bg-[#0F4C5C]/10 dark:bg-[#0F4C5C]/10" style={{ animationDelay: '0s' }} />
        <div className="gradient-orb w-[400px] h-[400px] -bottom-20 -left-20 bg-[#E07A5F]/5 dark:bg-[#E07A5F]/8" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="w-full px-6 lg:px-16 py-32 lg:py-40">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F4C5C]/10 border border-[#0F4C5C]/20 text-[#0F4C5C] dark:text-[#1A8FA8] text-sm font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07A5F] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E07A5F]" />
                </span>
                Now Live in Lebanon
              </span>
            </div>

            <h1 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 mt-8 font-heading font-bold text-5xl sm:text-6xl lg:text-[5.5rem] text-foreground leading-[1.05]">
              Meet Talkys.
            </h1>

            <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 mt-7 text-lg lg:text-xl text-foreground/55 leading-relaxed max-w-2xl mx-auto">
              Talkys gives you a team of AI voice agents that take orders, answer calls,
              handle deliveries, and manage customer conversations — 24/7, in Arabic and English.
            </p>

            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 mt-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => document.querySelector('#get-started')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8] text-white hover:shadow-[0_0_30px_rgba(15,76,92,0.4)] transition-all duration-300 rounded-full px-8 py-4 text-base font-medium flex items-center gap-2 group"
              >
                Book a Free Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
              <button
                onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-foreground/[0.05] text-foreground border border-foreground/[0.1] hover:bg-foreground/[0.08] transition-all duration-300 rounded-full px-8 py-4 text-base font-medium flex items-center gap-2 group"
              >
                <Play className="w-4 h-4 text-[#1A8FA8] group-hover:scale-110 transition-transform" />
                See How It Works
              </button>
            </div>

            {/* Waveform */}
            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-[350ms] mt-12 flex items-center justify-center gap-1">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.08}s`, height: `${8 + Math.sin(i * 0.8) * 12}px` }} />
              ))}
            </div>

            {/* Stats Bar */}
            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-[400ms] mt-10 lg:mt-14">
              <div className="inline-flex flex-wrap justify-center gap-6 lg:gap-10 p-6 lg:px-12 lg:py-7 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06] backdrop-blur-md">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-11 h-11 rounded-xl bg-[#0F4C5C]/10 flex items-center justify-center group-hover:bg-[#0F4C5C]/20 transition-colors duration-300">
                      <stat.icon className="w-5 h-5 text-[#1A8FA8]" />
                    </div>
                    <div className="text-left">
                      <p className={`font-heading font-bold text-2xl text-foreground ${countersVisible ? 'counter-animate' : 'opacity-0'}`} style={{ animationDelay: `${index * 150}ms` }}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-foreground/40">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
