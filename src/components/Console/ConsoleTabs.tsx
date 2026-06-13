import * as Tabs from '@radix-ui/react-tabs';
import { INDUSTRIES, type IndustryId } from '@/data/industries';
import { useLocale } from '@/context/LocaleContext';

interface ConsoleTabsProps {
  active: IndustryId;
  onChange: (id: IndustryId) => void;
}

export function ConsoleTabs({ active, onChange }: ConsoleTabsProps) {
  const { locale } = useLocale();
  return (
    <Tabs.Root value={active} onValueChange={(v) => onChange(v as IndustryId)}>
      <Tabs.List
        aria-label="Industry"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2"
      >
        {INDUSTRIES.map((ind) => (
          <Tabs.Trigger
            key={ind.id}
            value={ind.id}
            className={`
              flex items-center justify-center gap-2 px-3 py-2 rounded-lg
              border border-foreground/10 bg-foreground/[0.03]
              text-sm font-medium text-foreground/70
              hover:bg-foreground/[0.06] hover:text-foreground
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A8FA8]
              transition-colors duration-200
              data-[state=active]:bg-[#0F4C5C] data-[state=active]:text-white
              data-[state=active]:border-[#0F4C5C]
            `}
          >
            <span className="text-base" aria-hidden="true">{ind.icon}</span>
            <span>{ind.label[locale]}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
