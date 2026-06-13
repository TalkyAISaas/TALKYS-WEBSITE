import { useEffect, useRef } from 'react';
import { useT } from '@/context/LocaleContext';

const FooterSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const t = useT();
  const categories = t<{ Product: string; Company: string; Legal: string }>('footer.categories');
  const links = t<{ Product: string[]; Company: string[]; Legal: string[] }>('footer.links');

  const footerEntries: [keyof typeof categories, string[]][] = [
    ['Product', links.Product],
    ['Company', links.Company],
    ['Legal', links.Legal],
  ];

  return (
    <footer
      ref={sectionRef}
      className="relative bg-[#F5F0EB] dark:bg-[#060a12] border-t border-[#E8E0D8] dark:border-white/[0.06]"
    >
      {/* Footer Links */}
      <div className="py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Logo & Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal to-teal-light flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-lg">T</span>
                </div>
                <span className="font-heading font-semibold text-xl text-foreground">
                  Talkys
                </span>
              </div>
              <p className="text-sm text-foreground/40 leading-relaxed max-w-xs">
                {t('footer.description') as string}
              </p>
              <p className="mt-2 text-xs text-foreground/20">
                {t('footer.regions') as string}
              </p>
            </div>

            {/* Links */}
            {footerEntries.map(([key, items]) => (
              <div key={key}>
                <h4 className="font-heading font-semibold text-foreground text-sm mb-4">{categories[key]}</h4>
                <ul className="space-y-2.5">
                  {items.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-foreground/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-foreground/30">
              {t('footer.copyright') as string}
            </p>
            <div className="flex items-center gap-4">
              {/* Social Icons */}
              {['LinkedIn', 'Instagram', 'X'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-full bg-foreground/[0.04] border border-foreground/[0.06] flex items-center justify-center hover:bg-foreground/[0.08] transition-colors"
                >
                  <span className="text-xs text-foreground/40">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
