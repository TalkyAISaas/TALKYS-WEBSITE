import { useEffect, useRef, useState } from 'react';
import { Check, PhoneCall, ShoppingCart, MessageSquare, Database } from 'lucide-react';

const SolutionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeAgent, setActiveAgent] = useState(0);
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

  // Auto-cycle agents only when section is visible
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const features = [
    { icon: PhoneCall, text: 'Unlimited parallel calls — no busy signal, ever' },
    { icon: ShoppingCart, text: 'Orders sync directly to Omega & Squirrel POS' },
    { icon: MessageSquare, text: 'Speaks natural Lebanese Arabic + English' },
    { icon: Database, text: 'Every call logged, transcribed, and searchable' },
  ];

  const agents = [
    {
      name: 'Layla',
      role: 'Receptionist',
      color: 'from-purple-500 to-purple-600',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      message: '"Ahlan! Welcome to your restaurant. How can I help you today?"',
    },
    {
      name: 'Karim',
      role: 'Delivery',
      color: 'from-[#0F4C5C] to-[#1A8FA8]',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      message: '"Your order is confirmed! Delivery to Hamra in 35 minutes."',
    },
    {
      name: 'Sara',
      role: 'Support',
      color: 'from-blue-500 to-blue-600',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
      message: '"I\'ve checked your account — your last order is out for delivery."',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="solution"
      className="relative py-24 lg:py-32"
    >
      <div className="absolute top-0 left-0 right-0 section-divider" />

      {/* Background orb */}
      <div className="gradient-orb w-[500px] h-[500px] top-1/4 -right-40 bg-[#0F4C5C]/6" />

      <div className="w-full px-6 lg:px-16">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div>
              <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
                One Platform.
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8]">A Full Voice Team.</span>
              </h2>

              <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 mt-6 text-lg text-foreground/50 leading-relaxed">
                Talkys lets you build a team of AI voice agents that each have their own name,
                personality, knowledge base, and role. They answer calls, take orders, book tables,
                send confirmations, and sync everything to your existing systems — automatically.
              </p>

              {/* Features List with slide-in */}
              <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 mt-8 space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-7 h-7 rounded-full bg-[#0F4C5C]/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F4C5C]/30 transition-all duration-300">
                      <Check className="w-4 h-4 text-[#1A8FA8]" />
                    </div>
                    <span className="text-foreground/70 group-hover:text-foreground/90 transition-colors duration-300">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Team image */}
              <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 mt-8">
                <div className="relative rounded-2xl overflow-hidden h-48">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-foreground/80 text-sm font-medium">Powering businesses across Lebanon</p>
                    <p className="text-foreground/40 text-xs mt-1">From Beirut to Tripoli</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Animated Agent Cards */}
            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300">
              <div className="card-gradient-border p-8">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
                  Meet Your AI Team
                </h3>
                <div className="space-y-4">
                  {agents.map((agent, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveAgent(index)}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-500 ${
                        activeAgent === index
                          ? 'bg-[#0F4C5C]/15 border border-[#0F4C5C]/30 shadow-[0_0_20px_rgba(15,76,92,0.1)]'
                          : 'bg-foreground/[0.02] border border-transparent hover:bg-foreground/[0.05]'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-foreground/10"
                        />
                        {activeAgent === index && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{agent.name}</p>
                        <p className="text-sm text-foreground/40">{agent.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeAgent === index ? (
                          <>
                            {/* Live waveform */}
                            <div className="flex items-end gap-0.5 h-6 overflow-hidden">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className="waveform-bar"
                                  style={{ animationDelay: `${i * 0.15}s`, width: '2px' }}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-emerald-400">Speaking</span>
                          </>
                        ) : (
                          <span className="text-xs text-foreground/30">Standby</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active agent message bubble */}
                <div className="mt-6 p-4 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] transition-all duration-500">
                  <div className="flex items-start gap-3">
                    <img
                      src={agents[activeAgent].avatar}
                      alt={agents[activeAgent].name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs text-[#1A8FA8] font-medium">{agents[activeAgent].name} is saying:</p>
                      <p className="text-foreground/60 text-sm mt-1 italic">{agents[activeAgent].message}</p>
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

export default SolutionSection;
