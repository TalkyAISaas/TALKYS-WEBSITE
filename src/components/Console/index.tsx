import { useState } from 'react';
import { INDUSTRIES, type IndustryId } from '@/data/industries';
import { useT } from '@/context/LocaleContext';
import { ConsoleTabs } from './ConsoleTabs';
import { ActiveCall } from './ActiveCall';
import { MetricStrip } from './MetricStrip';

export function Console() {
  const t = useT();
  const [activeId, setActiveId] = useState<IndustryId>('restaurant');
  const active = INDUSTRIES.find((i) => i.id === activeId)!;

  return (
    <div className="w-full max-w-[720px] mx-auto rounded-3xl border border-black/[0.06] bg-white shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06] bg-background">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
          </div>
          <span className="ms-2 text-xs font-medium text-muted-foreground">
            {t('console.label') as string}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span>{t('console.live') as string}</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <ConsoleTabs active={activeId} onChange={setActiveId} />
        <ActiveCall key={active.id} industry={active} />
        <MetricStrip {...active.metrics} />
      </div>
    </div>
  );
}
