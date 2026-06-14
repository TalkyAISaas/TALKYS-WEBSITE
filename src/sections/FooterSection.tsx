import { useEffect, useRef } from 'react';
import { Twitter, Linkedin, Youtube, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useT } from '@/context/LocaleContext';

const LEGAL_HREFS = ['/privacy', '/terms', '/cookies'] as const;

const FooterSection = () => {
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

  const categoriesCopy = t<{ Product: string; Company: string; Legal: string }>('footer.categories');
  const linksCopy = t<{ Product: string[]; Company: string[]; Legal: string[] }>('footer.links');

  const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
  const categories = isObj(categoriesCopy) ? categoriesCopy : { Product: 'Product', Company: 'Company', Legal: 'Legal' };
  const links = isObj(linksCopy) ? linksCopy : { Product: [], Company: [], Legal: [] };

  const footerEntries: [keyof typeof categories, string[]][] = [
    ['Product', Array.isArray(links.Product) ? links.Product : []],
    ['Company', Array.isArray(links.Company) ? links.Company : []],
    ['Legal',   Array.isArray(links.Legal)   ? links.Legal   : []],
  ];

  return (
    <footer ref={sectionRef} className="bg-navy text-white/70 pt-20 pb-9 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-white/[0.08]">
          <div>
            <div className="text-[26px] font-extrabold text-white tracking-[-0.04em] mb-3.5">
              Talkys<span className="text-accent">.</span>
            </div>
            <p className="text-white/55 text-sm leading-[1.55] max-w-[320px]">
              {t('footer.description') as string}
            </p>
          </div>

          {footerEntries.map(([key, items]) => (
            <div key={key}>
              <h5 className="text-white text-xs font-bold tracking-[0.16em] uppercase mb-4">{categories[key]}</h5>
              <ul className="list-none space-y-2.5">
                {items.map((label, i) => (
                  <li key={label}>
                    {key === 'Legal' ? (
                      <Link
                        to={LEGAL_HREFS[i] ?? '#'}
                        className="text-white/55 text-sm hover:text-accent transition-colors"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a href="#" className="text-white/55 text-sm hover:text-accent transition-colors">{label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-[13px]">{t('footer.copyright') as string}</p>
          <div className="flex gap-2">
            {[Twitter, Linkedin, Youtube, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 bg-white/[0.04] border border-white/[0.1] rounded-[10px] flex items-center justify-center text-white/65 hover:bg-accent hover:text-white hover:border-accent transition-all"
                aria-label="Social"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
