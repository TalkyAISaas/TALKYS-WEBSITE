import { Star } from 'lucide-react';

interface MetricStripProps {
  handled: number;
  missed: number;
  rating: number;
}

export function MetricStrip({ handled, missed, rating }: MetricStripProps) {
  return (
    <div className="rounded-lg border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-foreground/50 mb-2">
        Today's calls
      </p>
      <div className="flex items-center gap-5 text-sm">
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading font-bold text-foreground">{handled}</span>
          <span className="text-foreground/60 text-xs">handled</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading font-bold text-foreground">{missed}</span>
          <span className="text-foreground/60 text-xs">missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-[#E07A5F] fill-[#E07A5F]" />
          <span className="font-heading font-bold text-foreground">{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
