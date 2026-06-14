import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

interface FaqItem {
  q: string;
  a: string;
}

const FaqSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

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

  const itemsCopy = t<FaqItem[]>('faq.items');
  const items = Array.isArray(itemsCopy) ? itemsCopy : [];

  return (
    <section ref={sectionRef} id="faq" className="py-24 lg:py-28">
      <div className="max-w-[820px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{t('faq.eyebrow') as string}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('faq.titlePrefix') as string}{' '}
            <AccentItalic>{t('faq.titleHighlight') as string}</AccentItalic>
          </h2>
        </div>

        <ul className="space-y-3">
          {items.map((it, i) => {
            const isOpen = openIdx === i;
            return (
              <li
                key={i}
                className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 bg-white border border-black/[0.06] rounded-[18px] shadow-card overflow-hidden"
                style={{ transitionDelay: `${(i + 1) * 60}ms` }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 lg:p-6 text-start hover:bg-bg-soft transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-[17px] lg:text-[18px] text-foreground tracking-[-0.01em]">
                    {it.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2.5}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 lg:px-6 pb-5 lg:pb-6 text-[15px] leading-[1.6] text-muted-foreground">
                      {it.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default FaqSection;
