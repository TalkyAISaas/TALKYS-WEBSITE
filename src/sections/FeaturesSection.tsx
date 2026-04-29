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

  const features = [
    { icon: Mic, title: 'Natural Voice', desc: 'Arabic & English with natural code-switching between dialects', highlight: true },
    { icon: BookOpen, title: 'Custom Knowledge', desc: 'Train each agent on your business — menu, FAQ, policies' },
    { icon: Phone, title: 'Unlimited Calls', desc: 'Handle hundreds of calls simultaneously, zero busy signals' },
    { icon: ArrowRightLeft, title: 'Smart Transfer', desc: 'AI detects when to escalate to a human and transfers seamlessly' },
    { icon: BarChart3, title: 'Live Analytics', desc: 'Real-time dashboard with call metrics, transcripts, and KPIs', highlight: true },
    { icon: MessageSquare, title: 'Omnichannel', desc: 'WhatsApp, Instagram, Messenger, SMS — all in one inbox' },
    { icon: Users, title: 'Multiple Agents', desc: 'Create unique AI personas with different voices and personalities' },
    { icon: Shield, title: 'Secure & Compliant', desc: 'End-to-end encryption with GDPR-ready data handling' },
    { icon: Zap, title: 'No-Code Setup', desc: 'Go live in days, not months. No developer or IT team required', highlight: true },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 lg:py-32 bg-background"
    >
      <div className="absolute top-0 left-0 right-0 section-divider" />

      {/* Subtle glow */}
      <div className="gradient-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F4C5C]/4" />

      <div className="w-full px-6 lg:px-16">
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
              Everything Your Voice Team <span className="text-[#1A8FA8]">Needs</span>
            </h2>
            <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 mt-5 text-lg text-foreground/50">
              Built for Lebanese businesses, Talkys combines enterprise-grade AI with simplicity.
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
                    <p className="text-[#1A8FA8] text-sm font-medium">Real-Time Intelligence Dashboard</p>
                    <p className="text-foreground font-heading font-bold text-2xl mt-1">Monitor Every Conversation</p>
                    <p className="text-foreground/40 text-sm mt-1">Call metrics, transcripts, lead scoring — all in one portal</p>
                  </div>
                  <div className="hidden lg:flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-foreground font-heading font-bold text-2xl">98%</p>
                      <p className="text-foreground/30 text-xs">Accuracy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-heading font-bold text-2xl">2.4s</p>
                      <p className="text-foreground/30 text-xs">Avg Response</p>
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-heading font-bold text-2xl">24/7</p>
                      <p className="text-foreground/30 text-xs">Uptime</p>
                    </div>
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
