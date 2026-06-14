import { useEffect, useRef } from 'react';
import { Check, X, Languages, BadgeCheck, MapPin, LayoutPanelTop, LayoutGrid } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

type CriterionKey = 'arabic' | 'doneForYou' | 'beirutTeam' | 'builtForYou' | 'multiChannel';

interface Criterion {
  key: CriterionKey;
  label: string;
}

const CRITERION_ICON: Record<CriterionKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  arabic: Languages,
  doneForYou: BadgeCheck,
  beirutTeam: MapPin,
  builtForYou: LayoutPanelTop,
  multiChannel: LayoutGrid,
};

const scrollToDemo = () => {
  const target = document.querySelector('#demo') ?? document.querySelector('#get-started');
  target?.scrollIntoView({ behavior: 'smooth' });
};

const WhyTalkysSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();

  const criteria = t<Criterion[]>('whyTalkys.criteria');
  const criteriaArray: Criterion[] = Array.isArray(criteria) ? criteria : [];

  const talkysName = t('whyTalkys.talkys.name') as string;
  const talkysSubtitle = t('whyTalkys.talkys.subtitle') as string;
  const otherName = t('whyTalkys.other.name') as string;
  const otherSubtitle = t('whyTalkys.other.subtitle') as string;

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

  const gridTemplate = 'minmax(180px, 220px) repeat(5, minmax(0, 1fr))';

  return (
    <section ref={sectionRef} id="why-talkys" className="py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{t('whyTalkys.eyebrow') as string}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('whyTalkys.titlePrefix') as string}{' '}
            <AccentItalic>{t('whyTalkys.titleHighlight') as string}</AccentItalic>.
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[640px] mx-auto leading-relaxed">
            {t('whyTalkys.subtitle') as string}
          </p>
        </div>

        {/* Comparison card */}
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 bg-white border border-black/[0.06] rounded-[24px] shadow-card overflow-hidden">
          {/* Desktop: criterion column header */}
          <div
            className="hidden md:grid bg-[hsl(30,50%,95%)] border-b border-black/[0.06]"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div className="px-7 py-6 flex items-center text-[12px] font-medium tracking-[0.15em] uppercase text-muted-foreground font-heading">
              {t('whyTalkys.columnsTitle') as string}
            </div>
            {criteriaArray.map((c) => {
              const Icon = CRITERION_ICON[c.key];
              return (
                <div key={c.key} className="px-3 py-6 text-center border-s border-black/[0.06]">
                  <div className="w-8 h-8 mx-auto mb-2.5 inline-flex items-center justify-center bg-white rounded-[10px] shadow-[0_4px_12px_-4px_rgba(14,79,92,0.10)] text-primary">
                    <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                  </div>
                  <div className="font-heading text-[13.5px] font-semibold tracking-[-0.01em] text-foreground leading-[1.25] whitespace-pre-line">
                    {c.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Talkys row */}
          <div
            className="md:grid relative bg-gradient-to-r from-accent/[0.07] to-accent/[0.03]"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {/* Coral accent bar on the start edge (desktop) */}
            <div className="hidden md:block absolute start-0 top-6 bottom-6 w-1 bg-accent rounded-e-md" aria-hidden="true" />

            {/* Vendor name cell */}
            <div className="px-7 py-7 md:py-8 flex flex-col justify-center md:border-b-0 border-b border-black/[0.06]">
              <div className="font-heading font-bold text-[22px] tracking-[-0.02em] text-foreground leading-[1.1]">
                {talkysName}<span className="text-accent">.</span>
              </div>
              <div className="text-muted-foreground text-[13px] mt-1 leading-snug">{talkysSubtitle}</div>
            </div>

            {/* Cells */}
            {criteriaArray.map((c) => (
              <ComparisonCell
                key={c.key}
                kind="positive"
                criterionLabel={c.label}
                note={t(`whyTalkys.talkys.notes.${c.key}`) as string}
              />
            ))}
          </div>

          {/* Other voice AI row */}
          <div
            className="md:grid border-t border-black/[0.06]"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div className="px-7 py-7 md:py-8 flex flex-col justify-center md:border-b-0 border-b border-black/[0.06]">
              <div className="font-heading font-semibold text-[19px] tracking-[-0.02em] text-muted-foreground leading-[1.1]">
                {otherName}
              </div>
              <div className="text-muted-foreground/80 text-[13px] mt-1 leading-snug">{otherSubtitle}</div>
            </div>

            {criteriaArray.map((c) => (
              <ComparisonCell
                key={c.key}
                kind="negative"
                criterionLabel={c.label}
                note={t(`whyTalkys.other.notes.${c.key}`) as string}
              />
            ))}
          </div>

          {/* Footer CTA strip */}
          <div className="bg-[hsl(30,50%,96%)] border-t border-black/[0.06] px-7 py-7 flex flex-wrap items-center justify-between gap-5">
            <p className="text-[14.5px] text-muted-foreground leading-relaxed max-w-[640px]">
              <strong className="text-foreground font-semibold">{t('whyTalkys.footerLine') as string}</strong>{' '}
              {t('whyTalkys.footerSubline') as string}
            </p>
            <button onClick={scrollToDemo} className="btn-coral inline-flex items-center gap-2">
              {t('whyTalkys.cta') as string}
              <svg viewBox="0 0 24 24" className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ComparisonCellProps {
  kind: 'positive' | 'negative';
  criterionLabel: string;
  note: string;
}

function ComparisonCell({ kind, criterionLabel, note }: ComparisonCellProps) {
  const isPositive = kind === 'positive';
  const cleanLabel = criterionLabel.replace(/\n/g, ' ');

  return (
    <div className="px-4 py-6 md:py-7 md:border-s border-black/[0.06] flex md:flex-col items-center md:justify-center gap-3 md:gap-2 md:text-center [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-b-0">
      {/* Mobile-only criterion label */}
      <span className="md:hidden flex-1 text-[12px] font-semibold tracking-[0.08em] uppercase text-muted-foreground leading-snug">
        {cleanLabel}
      </span>

      {/* Indicator */}
      {isPositive ? (
        <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-accent text-white shadow-[0_6px_14px_-4px_rgba(229,119,86,0.55)] shrink-0">
          <Check className="w-4 h-4" strokeWidth={3} />
        </span>
      ) : (
        <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-black/[0.07] text-foreground/55 shrink-0">
          <X className="w-4 h-4" strokeWidth={3} />
        </span>
      )}

      {/* Note */}
      <span
        className={
          isPositive
            ? 'text-[12.5px] font-medium text-foreground leading-snug md:max-w-[140px]'
            : 'text-[12.5px] italic text-muted-foreground leading-snug md:max-w-[140px]'
        }
      >
        {note}
      </span>
    </div>
  );
}

export default WhyTalkysSection;
