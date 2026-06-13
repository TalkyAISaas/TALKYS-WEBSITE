import { Headphones } from 'lucide-react';
import { useT } from '@/context/LocaleContext';

export function AriaOrb() {
  const t = useT();
  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      {/* Three expanding rings */}
      <span
        className="absolute top-1/2 left-1/2 border-[1.5px] border-accent/50 rounded-full -translate-x-1/2 -translate-y-1/2 animate-orb-ripple"
        style={{ width: 120, height: 120, animationDelay: '0s' }}
        aria-hidden="true"
      />
      <span
        className="absolute top-1/2 left-1/2 border-[1.5px] border-accent/50 rounded-full -translate-x-1/2 -translate-y-1/2 animate-orb-ripple"
        style={{ width: 120, height: 120, animationDelay: '1.3s' }}
        aria-hidden="true"
      />
      <span
        className="absolute top-1/2 left-1/2 border-[1.5px] border-accent/50 rounded-full -translate-x-1/2 -translate-y-1/2 animate-orb-ripple"
        style={{ width: 120, height: 120, animationDelay: '2.6s' }}
        aria-hidden="true"
      />

      {/* Breathing core */}
      <div
        className="absolute top-1/2 left-1/2 w-[110px] h-[110px] rounded-full flex items-center justify-center text-white animate-orb-breathe z-[3]"
        style={{
          background: 'linear-gradient(135deg, #0e4f5c 0%, #e57756 100%)',
          boxShadow: '0 20px 50px -10px rgba(229,119,86,0.5)',
        }}
      >
        <Headphones className="w-9 h-9" strokeWidth={2} />
      </div>

      {/* Label */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-[13px] text-muted-foreground tracking-[0.04em] whitespace-nowrap">
        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 align-middle animate-live-blink shadow-[0_0_6px_#16a34a]" />
        <strong className="text-foreground font-bold">{t('solution.ariaName') as string}</strong>
        <span> · {t('solution.ariaTagline') as string}</span>
      </div>
    </div>
  );
}
