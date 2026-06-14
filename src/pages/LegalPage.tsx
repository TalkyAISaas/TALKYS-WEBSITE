import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import Navigation from '@/sections/Navigation';
import FooterSection from '@/sections/FooterSection';

type LegalSlug = 'privacy' | 'terms' | 'cookies';

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalContent {
  title: string;
  intro: string;
  sections: LegalSection[];
}

const LegalPage = ({ slug }: { slug: LegalSlug }) => {
  const t = useT();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  const content = t<LegalContent>(`legal.${slug}`);
  const lastUpdated = t<string>('legal.lastUpdated');
  const backToHome = t<string>('legal.backToHome');

  return (
    <>
      <Navigation />
      <main className="bg-background">
        <article className="max-w-[760px] mx-auto px-6 pt-16 pb-24">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-foreground/60 hover:text-accent text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            {backToHome}
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-foreground mb-3">
            {content.title}
          </h1>
          <p className="text-foreground/50 text-sm mb-10">{lastUpdated}</p>

          <p className="text-foreground/80 text-base leading-[1.7] mb-12">
            {content.intro}
          </p>

          <div className="space-y-10">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold text-foreground mb-3 tracking-[-0.01em]">
                  {section.heading}
                </h2>
                <p className="text-foreground/70 text-[15px] leading-[1.7]">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

        </article>
      </main>
      <FooterSection />
    </>
  );
};

export default LegalPage;
