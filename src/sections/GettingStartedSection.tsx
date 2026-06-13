import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Headphones, Monitor, Settings, Sparkles } from 'lucide-react';
import { useT } from '@/context/LocaleContext';

const GettingStartedSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    industry: '',
    phone: '',
    useCase: '',
    consent: false,
  });

  const t = useT();
  const expectations = t<string[]>('getStarted.expectations');
  const expectationIcons = [Headphones, Settings, Monitor, Sparkles];
  const trustStats = t<{ value: string; label: string }[]>('getStarted.stats');
  const industryOptions = t<Record<string, string>>('getStarted.form.industryOptions');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('getStarted.form.successMessage') as string);
  };

  return (
    <section
      ref={sectionRef}
      id="get-started"
      className="relative py-24 lg:py-32"
    >
      <div className="absolute top-0 left-0 right-0 section-divider" />

      {/* Background effects */}
      <div className="gradient-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F4C5C]/5" />
      <div className="gradient-orb w-[300px] h-[300px] top-0 right-0 bg-[#E07A5F]/4" style={{ animationDelay: '1.5s' }} />

      <div className="w-full px-6 lg:px-16">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left - Info */}
            <div>
              <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
                {t('getStarted.titlePrefix') as string}{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8]">
                  {t('getStarted.titleHighlight') as string}
                </span>
              </h2>
              <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 mt-6 text-lg text-foreground/50 leading-relaxed">
                {t('getStarted.paragraph') as string}
              </p>

              {/* What to Expect - animated cards */}
              <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 mt-10">
                <h3 className="text-sm text-foreground/30 uppercase tracking-wider mb-5">{t('getStarted.whatToExpect') as string}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {expectations.map((text, index) => {
                    const Icon = expectationIcons[index];
                    return (
                      <div key={index} className="card-dark p-4 group" style={{ animationDelay: `${index * 100}ms` }}>
                        <Icon className="w-5 h-5 text-[#1A8FA8] mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <p className="text-foreground/60 text-sm">{text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trust image */}
              <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 mt-8">
                <div className="relative rounded-2xl overflow-hidden h-40">
                  <img
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80"
                    alt="Business meeting"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-6">
                    {trustStats.map((stat, i) => (
                      <div key={i}>
                        <p className="font-heading font-bold text-xl text-foreground">{stat.value}</p>
                        <p className="text-foreground/30 text-xs">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200">
              <form onSubmit={handleSubmit} className="card-gradient-border p-8">
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground/50 mb-1.5">{t('getStarted.form.fullName') as string}</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-foreground placeholder-foreground/25 focus:border-[#0F4C5C]/50 focus:shadow-[0_0_15px_rgba(15,76,92,0.15)] focus:outline-none transition-all duration-300"
                        placeholder={t('getStarted.form.fullNamePlaceholder') as string}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground/50 mb-1.5">{t('getStarted.form.email') as string}</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-foreground placeholder-foreground/25 focus:border-[#0F4C5C]/50 focus:shadow-[0_0_15px_rgba(15,76,92,0.15)] focus:outline-none transition-all duration-300"
                        placeholder={t('getStarted.form.emailPlaceholder') as string}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground/50 mb-1.5">{t('getStarted.form.company') as string}</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-foreground placeholder-foreground/25 focus:border-[#0F4C5C]/50 focus:shadow-[0_0_15px_rgba(15,76,92,0.15)] focus:outline-none transition-all duration-300"
                        placeholder={t('getStarted.form.companyPlaceholder') as string}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground/50 mb-1.5">{t('getStarted.form.industry') as string}</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-foreground/70 focus:border-[#0F4C5C]/50 focus:shadow-[0_0_15px_rgba(15,76,92,0.15)] focus:outline-none transition-all duration-300 appearance-none"
                      >
                        <option value="" className="bg-background">{t('getStarted.form.industrySelect') as string}</option>
                        {Object.entries(industryOptions).map(([value, label]) => (
                          <option key={value} value={value} className="bg-background">{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground/50 mb-1.5">{t('getStarted.form.phone') as string}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-foreground placeholder-foreground/25 focus:border-[#0F4C5C]/50 focus:shadow-[0_0_15px_rgba(15,76,92,0.15)] focus:outline-none transition-all duration-300"
                      placeholder={t('getStarted.form.phonePlaceholder') as string}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-foreground/50 mb-1.5">{t('getStarted.form.useCase') as string}</label>
                    <textarea
                      value={formData.useCase}
                      onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-foreground placeholder-foreground/25 focus:border-[#0F4C5C]/50 focus:shadow-[0_0_15px_rgba(15,76,92,0.15)] focus:outline-none transition-all duration-300 resize-none"
                      placeholder={t('getStarted.form.useCasePlaceholder') as string}
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-foreground/20 bg-foreground/[0.04] text-[#0F4C5C] focus:ring-[#0F4C5C]/40"
                    />
                    <label htmlFor="consent" className="text-xs text-foreground/40">
                      {t('getStarted.form.consent') as string}
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8] text-white hover:shadow-[0_0_30px_rgba(15,76,92,0.4)] transition-all duration-300 rounded-xl px-8 py-4 text-base font-medium flex items-center justify-center gap-2 group mt-2"
                  >
                    {t('getStarted.form.submit') as string}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 rtl:rotate-180" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStartedSection;
