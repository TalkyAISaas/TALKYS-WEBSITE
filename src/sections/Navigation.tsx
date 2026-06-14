import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useT } from '@/context/LocaleContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useT();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: t('nav.links.howItWorks') as string, href: '#demo' },
    { label: t('nav.links.features') as string, href: '#features' },
    { label: t('nav.links.getStarted') as string, href: '#get-started' },
  ];

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + href);
      return;
    }
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/82 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="text-[22px] font-extrabold text-foreground tracking-[-0.04em]"
          >
            Talkys<span className="text-accent">.</span>
          </Link>

          <ul className="hidden lg:flex gap-[30px] list-none">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="text-foreground text-[14.5px] font-medium hover:text-accent transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-3.5">
            <LanguageSwitcher />
            <button
              onClick={() => scrollToSection('#get-started')}
              className="bg-foreground text-white border-0 px-[18px] py-2.5 rounded-[9px] text-[14px] font-semibold cursor-pointer hover:-translate-y-0.5 transition-transform inline-flex items-center gap-1.5"
            >
              {t('nav.bookDemo') as string}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="relative flex flex-col items-center justify-center h-full gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="text-2xl font-heading font-medium text-foreground/80 hover:text-accent transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button onClick={() => scrollToSection('#get-started')} className="btn-coral mt-2">
            {t('nav.bookDemo') as string}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
