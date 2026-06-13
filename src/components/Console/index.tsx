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
    <div
      className="
        w-full max-w-[720px] mx-auto
        rounded-2xl border border-foreground/10
        bg-background/80 backdrop-blur-xl
        shadow-[0_20px_60px_-15px_rgba(15,76,92,0.25)]
        overflow-hidden
      "
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-foreground/10 bg-foreground/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
          </div>
          <span className="ms-2 text-xs font-medium text-foreground/60">
            {t('console.label') as string}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-foreground/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
          </span>
          <span>{t('console.live') as string}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <ConsoleTabs active={activeId} onChange={setActiveId} />
        <ActiveCall key={active.id} industry={active} />
        <MetricStrip {...active.metrics} />
      </div>
    </div>
  );
}
