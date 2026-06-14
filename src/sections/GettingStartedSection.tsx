import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const CC_RECIPIENTS = 'ali.fakih@rentallsoftware.com, ali.alfakih@ssupworld.com';

const GettingStartedSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    industry: '',
    phone: '',
    useCase: '',
    consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

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
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus('error');
      setErrorMsg('Form is not configured. Set VITE_WEB3FORMS_KEY in .env.local.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const payload = {
        access_key: accessKey,
        subject: `New Talkys demo request — ${formData.fullName || formData.company || formData.email}`,
        from_name: formData.fullName || 'Talkys website',
        replyto: formData.email,
        cc: CC_RECIPIENTS,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        industry: formData.industry,
        use_case: formData.useCase,
        consent: formData.consent ? 'Yes' : 'No',
      };

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Submission failed');
      }

      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        company: '',
        industry: '',
        phone: '',
        useCase: '',
        consent: false,
      });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    }
  };

  const industryOptionsCopy = t<Record<string, string>>('getStarted.form.industryOptions');
  const industryOptions =
    industryOptionsCopy && typeof industryOptionsCopy === 'object' && !Array.isArray(industryOptionsCopy)
      ? industryOptionsCopy
      : {};

  return (
    <section ref={sectionRef} id="get-started" className="py-24 lg:py-28">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="text-center mb-6">
          <ChipEyebrow>{(t('getStarted.eyebrow') as string) || 'GET STARTED'}</ChipEyebrow>
        </div>

        <div className="relative bg-white border border-black/[0.06] rounded-[28px] p-12 lg:p-16 overflow-hidden shadow-card">
          <div
            className="absolute -top-[30%] -right-[10%] w-[55%] h-[130%] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(229,119,86,0.10) 0%, transparent 60%)' }}
          />
          <div
            className="absolute -bottom-[40%] -left-[10%] w-[55%] h-[130%] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(14,79,92,0.07) 0%, transparent 60%)' }}
          />

          <div className="relative z-[1]">
            <h2
              className="text-center font-heading font-bold text-foreground tracking-[-0.025em] leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(32px, 4.5vw, 48px)' }}
            >
              {t('getStarted.titlePrefix') as string}{' '}
              <AccentItalic>{t('getStarted.titleHighlight') as string}</AccentItalic>
            </h2>
            <p className="text-center text-muted-foreground text-[17px] mb-9 max-w-[520px] mx-auto">
              {t('getStarted.paragraph') as string}
            </p>

            <form onSubmit={handleSubmit} className="max-w-[520px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.fullName') as string}</label>
                  <input
                    type="text" required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t('getStarted.form.fullNamePlaceholder') as string}
                    className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.email') as string}</label>
                  <input
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('getStarted.form.emailPlaceholder') as string}
                    className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.phone') as string}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('getStarted.form.phonePlaceholder') as string}
                    className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.company') as string}</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t('getStarted.form.companyPlaceholder') as string}
                    className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.industry') as string}</label>
                  <select
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none appearance-none cursor-pointer focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all"
                  >
                    <option value="">{t('getStarted.form.industrySelect') as string}</option>
                    {Object.entries(industryOptions).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.useCase') as string}</label>
                  <textarea
                    rows={3}
                    value={formData.useCase}
                    onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                    placeholder={t('getStarted.form.useCasePlaceholder') as string}
                    className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 mb-5">
                <input
                  type="checkbox" id="consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-black/20 text-accent focus:ring-accent/40"
                />
                <label htmlFor="consent" className="text-xs text-muted-foreground">{t('getStarted.form.consent') as string}</label>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full btn-coral inline-flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Sending…' : (t('getStarted.form.submit') as string)}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              {status === 'success' && (
                <p className="text-center text-emerald-600 text-sm mt-4">
                  {t('getStarted.form.successMessage') as string}
                </p>
              )}
              {status === 'error' && (
                <p className="text-center text-red-600 text-sm mt-4">{errorMsg}</p>
              )}

              <p className="text-center text-muted-foreground text-[13px] mt-5">
                {(t('getStarted.formMeta') as string) || 'No credit card · 14-day trial · Reply within 24h'}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStartedSection;
