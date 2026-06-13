import { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const TestimonialsSection = () => {
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

  const itemsCopy = t<TestimonialItem[]>('testimonials.items');
  const items = Array.isArray(itemsCopy) ? itemsCopy : [];

  return (
    <section ref={sectionRef} id="testimonials" className="bg-bg-soft py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{(t('testimonials.eyebrow') as string) || 'CUSTOMERS'}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {(t('testimonials.titlePrefix') as string) || '1,200+ businesses pick Talkys'}{' '}
            <AccentItalic>{(t('testimonials.titleHighlight') as string) || 'every day'}</AccentItalic>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-[18px]">
          {items.map((item, i) => (
            <div
              key={i}
              className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 bg-white border border-black/[0.06] rounded-[22px] p-8 shadow-card flex flex-col"
              style={{ transitionDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="flex gap-1 text-accent mb-4">
                {Array.from({ length: 5 }, (_, k) => (
                  <Star key={k} className="w-4 h-4 fill-accent" />
                ))}
              </div>
              <blockquote className="text-[15.5px] text-foreground leading-[1.55] mb-6 tracking-[-0.005em] flex-1">
                "{item.quote}"
              </blockquote>
              <div className="flex items-center gap-3 pt-5 border-t border-black/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-accent flex items-center justify-center text-white font-bold text-sm">
                  {item.initials}
                </div>
                <div>
                  <strong className="block text-sm font-bold text-foreground">{item.name}</strong>
                  <small className="block text-muted-foreground text-[12.5px] mt-0.5">{item.role}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
