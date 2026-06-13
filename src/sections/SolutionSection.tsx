import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';
import { AriaOrb } from '@/components/AriaOrb';

const SolutionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();

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

  const featuresCopy = t<string[]>('solution.features');
  const featuresArray = Array.isArray(featuresCopy) ? featuresCopy : [];

  return (
    <section ref={sectionRef} id="solution" className="bg-bg-soft py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{(t('solution.eyebrow') as string) || 'THE SOLUTION'}</ChipEyebrow>
          </div>

          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline mb-5">
            {t('solution.titleLine1') as string}{' '}
            <AccentItalic>{t('solution.titleLine2') as string}</AccentItalic>
          </h2>

          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 text-[17px] text-muted-foreground mb-7 leading-[1.55]">
            {t('solution.paragraph') as string}
          </p>

          <ul className="list-none space-y-5">
            {featuresArray.map((text, i) => (
              <li
                key={i}
                className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 flex items-start gap-3.5"
                style={{ transitionDelay: `${200 + i * 80}ms` }}
              >
                <div className="w-7 h-7 bg-accent rounded-[9px] flex items-center justify-center text-white flex-shrink-0 shadow-[0_6px_16px_-6px_rgba(229,119,86,0.55)]">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <div>
                  <strong className="block text-[15.5px] text-foreground font-bold mb-0.5">{text}</strong>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative h-[440px] flex items-center justify-center">
          <AriaOrb />
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
