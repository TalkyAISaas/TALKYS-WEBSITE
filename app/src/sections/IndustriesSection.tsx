import { useEffect, useRef, useState } from 'react';
import { Utensils, Stethoscope, ShoppingBag, Home, Scissors, Truck, Package, Ship } from 'lucide-react';

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

  const industries = [
    {
      icon: Utensils,
      title: 'Restaurants & Food Delivery',
      shortTitle: 'Food',
      description: 'Take orders in Arabic and English, sync to POS, confirm via WhatsApp.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      role: 'Ordering + Receptionist',
      flow: ['Customer calls or DMs', 'Talkys takes order and address', 'POS sync + ETA confirmation'],
      quote: '"Ahlan! I see you usually order 2 shawarmas. Same address in Hamra?"',
      capabilities: ['Menu knowledge', 'POS integration', 'Delivery tracking', 'Upselling'],
    },
    {
      icon: Stethoscope,
      title: 'Clinics & Healthcare',
      shortTitle: 'Healthcare',
      description: 'Book appointments, handle inquiries, send reminders 24/7.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      role: 'Secretary + Appointment Agent',
      flow: ['Patient calls', 'Talkys books appointment slot', 'Reminder sent with clinic details'],
      quote: '"Dr. Hanna has availability Thursday at 3pm. Shall I book that for you?"',
      capabilities: ['Scheduling', 'Patient records', 'Reminders', 'Insurance queries'],
    },
    {
      icon: ShoppingBag,
      title: 'Retail & E-commerce',
      shortTitle: 'Retail',
      description: 'Handle order inquiries, process returns, answer product questions.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      role: 'Customer Service + Lead Agent',
      flow: ['Client asks about product', 'Talkys qualifies intent and details', 'Lead/opportunity pushed to CRM'],
      quote: '"The leather bag you liked is back in stock. Want me to reserve one?"',
      capabilities: ['Product catalog', 'CRM sync', 'Returns handling', 'Recommendations'],
    },
    {
      icon: Home,
      title: 'Real Estate',
      shortTitle: 'Real Estate',
      description: 'Qualify leads, schedule viewings, answer property questions.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      role: 'Lead Management',
      flow: ['Inbound inquiry received', 'Talkys qualifies budget and area', 'Viewing booked with agent'],
      quote: '"Welcome back, Ahmad. You were looking at 3-bedroom villas in Beit Mery..."',
      capabilities: ['Lead scoring', 'Property matching', 'Viewing scheduler', 'Follow-ups'],
    },
    {
      icon: Scissors,
      title: 'Salons & Beauty',
      shortTitle: 'Salons',
      description: 'Book appointments, send reminders, handle cancellations.',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      role: 'Receptionist',
      flow: ['Customer requests service', 'Talkys finds open slot', 'Booking confirmation + reminders'],
      quote: '"We have an opening with Sarah at 2pm for a blowout. Should I confirm?"',
      capabilities: ['Booking system', 'Staff schedules', 'Cancellations', 'Product upsells'],
    },
    {
      icon: Truck,
      title: 'Transportation',
      shortTitle: 'Transport',
      description: 'Handle booking inquiries, track shipments, manage fleet communications.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      role: 'Call Answering + Dispatch',
      flow: ['Client calls for shipment status', 'Talkys fetches live update', 'Status and ETA shared instantly'],
      quote: '"Your shipment #4821 is currently in customs. Expected release: tomorrow 10am."',
      capabilities: ['Fleet tracking', 'ETA updates', 'Dispatch coordination', 'Status queries'],
    },
    {
      icon: Package,
      title: 'Logistics & Warehousing',
      shortTitle: 'Logistics',
      description: 'Manage delivery schedules, coordinate pickups, update customers.',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
      role: 'Operations Assistant',
      flow: ['Pickup request received', 'Talkys confirms window and details', 'Task pushed to operations queue'],
      quote: '"Your pickup is scheduled for tomorrow between 9-11am. Driver Ahmad will call before arriving."',
      capabilities: ['Pickup scheduling', 'Inventory queries', 'Route optimization', 'Customer updates'],
    },
    {
      icon: Ship,
      title: 'Import & Export',
      shortTitle: 'Import/Export',
      description: 'Handle customs inquiries, track shipments, coordinate with partners.',
      image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?auto=format&fit=crop&w=800&q=80',
      role: 'Client Calls + Service Desk',
      flow: ['Partner calls for customs status', 'Talkys answers from knowledge base', 'Case logged for follow-up'],
      quote: '"Container MSKU-7291 cleared customs yesterday. Delivery to warehouse is scheduled Friday."',
      capabilities: ['Customs tracking', 'Document status', 'Partner coordination', 'Case management'],
    },
  ];

  const active = industries[activeTab];

  return (
    <section
      ref={sectionRef}
      id="industries"
      className="relative py-24 lg:py-32 bg-background"
    >
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="gradient-orb w-[400px] h-[400px] top-1/4 right-0 bg-[#0F4C5C]/5" />

      <div className="w-full px-6 lg:px-16">
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
              Built for Every <span className="text-[#1A8FA8]">Lebanese Business</span>
            </h2>
            <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 mt-5 text-lg text-foreground/50">
              Whether you run a restaurant, clinic, logistics company, or retail store — Talkys adapts to your industry.
            </p>
          </div>

          {/* Industry Tabs */}
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200">
            <div className="mb-10 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max min-w-full justify-start lg:justify-center gap-2 px-1">
              {industries.map((industry, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-400 ${
                    activeTab === index
                      ? 'bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8] text-white shadow-[0_0_20px_rgba(15,76,92,0.3)]'
                      : 'bg-foreground/[0.03] text-foreground/50 hover:text-foreground/80 hover:bg-foreground/[0.06] border border-foreground/[0.06]'
                  }`}
                >
                  {industry.shortTitle}
                </button>
              ))}
              </div>
            </div>
          </div>

          {/* Active Industry Display */}
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300">
            <div className="card-gradient-border overflow-hidden">
              <div className="grid lg:grid-cols-2">
                {/* Left - Image with overlay */}
                <div className="relative h-64 lg:h-auto lg:min-h-[450px] overflow-hidden">
                  <img
                    key={activeTab}
                    src={active.image}
                    alt={active.title}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-background/25 to-transparent lg:hidden" />

                  {/* Floating role badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-background/60 backdrop-blur-sm border border-foreground/10">
                    <p className="text-[#E07A5F] text-xs font-medium">{active.role}</p>
                  </div>

                  {/* Capabilities pills */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    {active.capabilities.map((cap) => (
                      <span key={cap} className="px-2 py-1 rounded-full bg-background/60 backdrop-blur-sm border border-foreground/10 text-foreground/60 text-[10px]">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right - Content */}
                <div className="p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0F4C5C]/15 flex items-center justify-center">
                      <active.icon className="w-6 h-6 text-[#1A8FA8]" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-foreground">
                      {active.title}
                    </h3>
                  </div>

                  <p className="text-foreground/50 leading-relaxed mb-6">
                    {active.description}
                  </p>

                  {/* Flow Steps */}
                  <div className="space-y-3 mb-8">
                    {active.flow.map((step, idx) => (
                      <div key={step} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0F4C5C] to-[#1A8FA8] flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">{idx + 1}</span>
                        </div>
                        <span className="text-sm text-foreground/60">{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* AI Quote */}
                  <div className="rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F4C5C] to-[#1A8FA8] flex items-center justify-center">
                          <span className="text-white font-bold text-xs">T</span>
                        </div>
                        {/* Waveform dots */}
                        <div className="absolute -right-1 -bottom-1 flex gap-0.5">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="waveform-bar" style={{ width: '2px', animationDelay: `${i * 0.2}s` }} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#1A8FA8] font-medium">Talkys speaking to customer</p>
                    </div>
                    <p className="text-foreground/60 leading-relaxed italic">
                      {active.quote}
                    </p>
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

export default IndustriesSection;
