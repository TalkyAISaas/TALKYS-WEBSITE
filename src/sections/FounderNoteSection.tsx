import { useEffect, useRef } from 'react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

const FounderNoteSection = () => {
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

  const paragraphs = t<string[]>('founderNote.paragraphs');
  const paras = Array.isArray(paragraphs) ? paragraphs : [];

  return (
    <section ref={sectionRef} id="founders" className="bg-bg-soft py-24 lg:py-28">
      <div className="max-w-[760px] mx-auto px-6 text-center">
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
          <ChipEyebrow>{t('founderNote.eyebrow') as string}</ChipEyebrow>
        </div>
        <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline mb-10">
          {t('founderNote.titlePrefix') as string}{' '}
          <AccentItalic>{t('founderNote.titleHighlight') as string}</AccentItalic>
        </h2>
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 space-y-5 text-[17.5px] leading-[1.7] text-foreground/85">
          {paras.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 mt-8 text-sm text-muted-foreground italic">
          {t('founderNote.signature') as string}
        </p>
      </div>
    </section>
  );
};

export default FounderNoteSection;
