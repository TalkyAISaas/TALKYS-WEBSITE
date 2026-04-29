import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Industries', href: '#industries' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Get Started', href: '#get-started' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 dark:bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06] shadow-sm dark:shadow-none'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <a
              href="#"
              className="flex items-center gap-2.5"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#1A8FA8] flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">T</span>
              </div>
              <span className="font-heading font-semibold text-xl text-foreground">Talkys</span>
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-300"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full bg-black/[0.05] dark:bg-white/[0.06] flex items-center justify-center hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition-colors border border-black/[0.06] dark:border-white/[0.06]"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-foreground/70" />
                ) : (
                  <Sun className="w-4 h-4 text-[#E07A5F]" />
                )}
              </button>
              <button
                onClick={() => scrollToSection('#get-started')}
                className="bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8] text-white hover:opacity-90 transition-all rounded-full px-6 py-2.5 text-sm font-medium"
              >
                Book a Demo
              </button>
            </div>

            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full bg-black/[0.05] dark:bg-white/[0.06] flex items-center justify-center border border-black/[0.06] dark:border-white/[0.06]"
              >
                {theme === 'light' ? <Moon className="w-4 h-4 text-foreground/70" /> : <Sun className="w-4 h-4 text-[#E07A5F]" />}
              </button>
              <button className="p-2 text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-white/95 dark:bg-[#0a0f1a]/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="relative flex flex-col items-center justify-center h-full gap-6">
          {navLinks.map((link) => (
            <button key={link.label} onClick={() => scrollToSection(link.href)} className="text-2xl font-heading font-medium text-foreground/80 hover:text-foreground transition-colors">
              {link.label}
            </button>
          ))}
          <button onClick={() => scrollToSection('#get-started')} className="mt-4 bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8] text-white hover:opacity-90 transition-all rounded-full px-8 py-3 text-lg font-medium">
            Book a Demo
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
