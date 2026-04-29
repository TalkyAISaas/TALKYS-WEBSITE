import { useEffect, useRef, useState } from 'react';
import { Instagram, MessageCircle, Phone, ShoppingCart, Send, Check, Smartphone } from 'lucide-react';

const SocialMediaSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [chatStep, setChatStep] = useState(0);

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

  // Animate chat messages appearing
  useEffect(() => {
    const timers = [
      setTimeout(() => setChatStep(1), 800),
      setTimeout(() => setChatStep(2), 2000),
      setTimeout(() => setChatStep(3), 3200),
      setTimeout(() => setChatStep(4), 4500),
      setTimeout(() => setChatStep(5), 5800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const integrations = [
    { name: 'Salesforce', logo: 'SF' },
    { name: 'WhatsApp', logo: 'WA' },
    { name: 'Instagram', logo: 'IG' },
    { name: 'Omega POS', logo: 'OM' },
    { name: 'Squirrel', logo: 'SQ' },
    { name: 'Messenger', logo: 'MS' },
    { name: 'Zoho CRM', logo: 'ZH' },
    { name: 'Shopify', logo: 'SH' },
  ];

  return (
    <section
      ref={sectionRef}
      id="integrations"
      className="relative py-24 lg:py-32 bg-background"
    >
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="gradient-orb w-[500px] h-[500px] bottom-0 right-0 bg-[#E07A5F]/5" />

      <div className="w-full px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
              Turn Social Media Messages Into{' '}
              <span className="text-[#E07A5F]">Confirmed Orders</span>
            </h2>
            <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 mt-5 text-lg text-foreground/50">
              Talkys connects to every platform your customers use and converts conversations into revenue.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Animated chat preview */}
            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 order-2 lg:order-1">
              <div className="card-gradient-border p-0 max-w-md mx-auto overflow-hidden">
                {/* Phone frame */}
                <div className="bg-background rounded-t-2xl p-3 flex items-center gap-2 border-b border-foreground/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-foreground/30">Instagram DM</span>
                  </div>
                </div>

                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-foreground/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">@YourRestaurant</p>
                    <p className="text-xs text-foreground/40">Instagram Business</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-400/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400">Active</span>
                  </div>
                </div>

                {/* Animated Chat Messages */}
                <div className="p-4 space-y-3 min-h-[280px]">
                  {chatStep >= 1 && (
                    <div className="flex justify-end" style={{ animation: 'slideInFromRight 0.4s ease-out' }}>
                      <div className="bg-[#0F4C5C]/20 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                        <p className="text-sm text-foreground/80">
                          Baddo order 1 shawarma w 2 fries please, Hamra area
                        </p>
                      </div>
                    </div>
                  )}
                  {chatStep >= 2 && (
                    <div className="flex justify-start" style={{ animation: 'slideInFromLeft 0.4s ease-out' }}>
                      <div className="bg-foreground/[0.04] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] border border-foreground/[0.06]">
                        <p className="text-sm text-foreground/70">
                          Ahlan! Receiving your order now. Talkys will call you in a few seconds to confirm your address.
                        </p>
                      </div>
                    </div>
                  )}
                  {chatStep >= 3 && (
                    <div className="flex justify-end" style={{ animation: 'slideInFromRight 0.4s ease-out' }}>
                      <div className="bg-[#0F4C5C]/20 rounded-2xl rounded-tr-sm px-4 py-2">
                        <p className="text-sm text-foreground/80">Ok thanks!</p>
                      </div>
                    </div>
                  )}
                  {chatStep >= 4 && (
                    <div style={{ animation: 'scaleIn 0.4s ease-out' }}>
                      <div className="p-3 rounded-xl bg-[#E07A5F]/10 border border-[#E07A5F]/20">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Phone className="w-4 h-4 text-[#E07A5F]" />
                            {/* Ripple rings */}
                            <div className="ripple-ring w-8 h-8 -top-2 -left-2" />
                            <div className="ripple-ring w-8 h-8 -top-2 -left-2" style={{ animationDelay: '0.5s' }} />
                          </div>
                          <div>
                            <p className="text-xs text-[#E07A5F] font-medium">Incoming call from +961 XX XXX XXX</p>
                            <p className="text-xs text-foreground/40">Talkys — Order Confirmation</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {chatStep >= 5 && (
                    <div style={{ animation: 'scaleIn 0.4s ease-out' }}>
                      <div className="p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5" />
                          <p className="text-xs text-emerald-300">
                            Order confirmed! 1 Shawarma + 2 Fries — Delivery to Hamra in 35 min.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Integrations grid */}
            <div className="order-1 lg:order-2">
              <h3 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 font-heading font-semibold text-2xl text-foreground mb-3">
                Connects to Your Entire Stack
              </h3>
              <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 text-foreground/50 mb-8">
                Talkys integrates with the tools you already use. POS systems, CRMs, messaging platforms — everything syncs automatically.
              </p>

              {/* Integration cards */}
              <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {integrations.map((item, index) => (
                  <div
                    key={index}
                    className="card-dark p-4 text-center group hover:border-[#0F4C5C]/30"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-foreground/[0.04] flex items-center justify-center mb-2 group-hover:bg-[#0F4C5C]/15 transition-all duration-300">
                      <span className="font-heading font-bold text-foreground/40 group-hover:text-[#1A8FA8] transition-colors duration-300">
                        {item.logo}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/40 group-hover:text-foreground/60 transition-colors">{item.name}</p>
                  </div>
                ))}
              </div>

              {/* Open API note */}
              <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 mt-6 p-4 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06]">
                <p className="text-foreground/50 text-sm">
                  Don't see your stack? Talkys <span className="text-[#1A8FA8]">open API</span> connects to any platform.{' '}
                  <button
                    onClick={() => document.querySelector('#get-started')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-[#1A8FA8] hover:text-foreground transition-colors underline underline-offset-2"
                  >
                    Talk to us
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
