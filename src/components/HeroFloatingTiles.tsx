import { Phone, Headphones, Calendar, Sparkles } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface TileProps {
  position: 'tl' | 'tr' | 'bl' | 'br';
  rotation: number;
  delay: number;
  Icon: IconComponent;
}

const POSITION_CLASS: Record<TileProps['position'], string> = {
  tl: 'top-[14%] left-[8%]',
  tr: 'top-[14%] right-[8%]',
  bl: 'bottom-[22%] left-[9%]',
  br: 'bottom-[22%] right-[9%]',
};

function FloatingTile({ position, rotation, delay, Icon }: TileProps) {
  return (
    <div className={`absolute z-[1] ${POSITION_CLASS[position]}`}>
      <div
        className="w-[88px] h-[88px] bg-white rounded-[22px] flex items-center justify-center shadow-tile text-primary animate-bob-tile"
        style={{ ['--rot' as string]: `${rotation}deg`, animationDelay: `${delay}s` }}
      >
        <Icon className="w-8 h-8" strokeWidth={2} />
      </div>
    </div>
  );
}

export function HeroFloatingTiles() {
  return (
    <>
      <FloatingTile position="tl" rotation={-12} delay={0}   Icon={Phone} />
      <FloatingTile position="tr" rotation={10}  delay={1}   Icon={Headphones} />
      <FloatingTile position="bl" rotation={-8}  delay={2}   Icon={Calendar} />
      <FloatingTile position="br" rotation={14}  delay={0.5} Icon={Sparkles} />
    </>
  );
}
