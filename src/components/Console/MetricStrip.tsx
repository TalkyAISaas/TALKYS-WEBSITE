import { Star } from 'lucide-react';
import { useT, useLocale } from '@/context/LocaleContext';

interface MetricStripProps {
  handled: number;
  missed: number;
  rating: number;
}

export function MetricStrip({ handled, missed, rating }: MetricStripProps) {
  const t = useT();
  const { locale } = useLocale();
  const fmt = (n: number) => n.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US');

  return (
    <div className="rounded-lg border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-foreground/50 mb-2">
        {t('console.metrics.todaysCalls') as string}
      </p>
      <div className="flex items-center gap-5 text-sm">
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading font-bold text-foreground">{fmt(handled)}</span>
          <span className="text-foreground/60 text-xs">{t('console.metrics.handled') as string}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading font-bold text-foreground">{fmt(missed)}</span>
          <span className="text-foreground/60 text-xs">{t('console.metrics.missed') as string}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-[#E07A5F] fill-[#E07A5F]" />
          <span className="font-heading font-bold text-foreground">{rating.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
        </div>
      </div>
    </div>
  );
}
