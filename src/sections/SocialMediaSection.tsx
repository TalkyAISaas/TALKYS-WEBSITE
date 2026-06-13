import { useEffect, useRef, useState } from 'react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

const SocialMediaSection = () => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [chatStep, setChatStep] = useState(0);

  useEffect(() => {
    let chatTimers: ReturnType<typeof setTimeout>[] = [];

    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const chatObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          chatTimers = [
            setTimeout(() => setChatStep(1), 800),
            setTimeout(() => setChatStep(2), 2000),
            setTimeout(() => setChatStep(3), 3200),
            setTimeout(() => setChatStep(4), 4500),
            setTimeout(() => setChatStep(5), 5800),
          ];
          chatObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => animObserver.observe(el));
    if (sectionRef.current) chatObserver.observe(sectionRef.current);

    return () => {
      animObserver.disconnect();
      chatObserver.disconnect();
      chatTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section ref={sectionRef} id="integrations" className="bg-bg-soft py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{(t('social.eyebrow') as string) || 'INTEGRATIONS'}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('social.titlePrefix') as string}{' '}
            <AccentItalic>{t('social.titleHighlight') as string}</AccentItalic>
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[540px] mx-auto">
            {t('social.subtitle') as string}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 order-2 lg:order-1">
            <div className="bg-white rounded-[22px] border border-black/[0.06] max-w-md mx-auto overflow-hidden shadow-card">
              <div className="bg-background p-3 flex items-center gap-2 border-b border-black/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground">{t('social.phoneFrame') as string}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border-b border-black/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center text-white font-bold">IG</div>
                <div>
                  <p className="font-medium text-foreground text-sm">{t('social.handle') as string}</p>
                  <p className="text-xs text-muted-foreground">{t('social.handleSub') as string}</p>
                </div>
                <div className="ms-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-700">{t('social.activeBadge') as string}</span>
                </div>
              </div>

              <div className="p-4 space-y-3 min-h-[280px]">
                {chatStep >= 1 && (
                  <div className="flex justify-end">
                    <div className="bg-accent/15 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                      <p className="text-sm text-foreground/85">{t('social.messages.customer1') as string}</p>
                    </div>
                  </div>
                )}
                {chatStep >= 2 && (
                  <div className="flex justify-start">
                    <div className="bg-background rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] border border-black/[0.06]">
                      <p className="text-sm text-foreground/75">{t('social.messages.agent1') as string}</p>
                    </div>
                  </div>
                )}
                {chatStep >= 3 && (
                  <div className="flex justify-end">
                    <div className="bg-accent/15 rounded-2xl rounded-tr-sm px-4 py-2">
                      <p className="text-sm text-foreground/85">{t('social.messages.customer2') as string}</p>
                    </div>
                  </div>
                )}
                {chatStep >= 4 && (
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/30">
                    <p className="text-xs text-accent font-medium">{t('social.messages.incomingFrom') as string}</p>
                    <p className="text-xs text-muted-foreground">{t('social.messages.incomingSub') as string}</p>
                  </div>
                )}
                {chatStep >= 5 && (
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                    <p className="text-xs text-green-700">{t('social.messages.confirmed') as string}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h3 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 font-heading font-bold text-2xl text-foreground mb-3">
              {t('social.integrationsHeader') as string}
            </h3>
            <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 text-muted-foreground mb-8">
              {t('social.integrationsSubtitle') as string}
            </p>

            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Salesforce', logo: 'SF' }, { name: 'WhatsApp', logo: 'WA' },
                { name: 'Instagram', logo: 'IG' }, { name: 'Omega POS', logo: 'OM' },
                { name: 'Squirrel', logo: 'SQ' }, { name: 'Messenger', logo: 'MS' },
                { name: 'Zoho CRM', logo: 'ZH' }, { name: 'Shopify', logo: 'SH' },
              ].map((item) => (
                <div key={item.name} className="bg-white border border-black/[0.06] rounded-[18px] p-4 text-center shadow-card hover:-translate-y-0.5 hover:border-accent/30 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-background border border-black/[0.06] flex items-center justify-center mb-2">
                    <span className="font-heading font-bold text-foreground/60 text-xs">{item.logo}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                </div>
              ))}
            </div>

            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 mt-6 p-4 rounded-xl bg-white border border-black/[0.06] shadow-card">
              <p className="text-muted-foreground text-sm">
                {t('social.openApiBefore') as string}{' '}
                <span className="text-accent font-semibold">{t('social.openApiHighlight') as string}</span>{' '}
                {t('social.openApiAfter') as string}{' '}
                <button
                  onClick={() => document.querySelector('#get-started')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-accent hover:text-foreground transition-colors underline underline-offset-2"
                >
                  {t('social.talkToUs') as string}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
