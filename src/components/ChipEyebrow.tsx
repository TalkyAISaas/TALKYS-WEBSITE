import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function ChipEyebrow({ children, className = '' }: Props) {
  return (
    <div className={`chip-eyebrow ${className}`}>
      <span className="bracket" aria-hidden="true">‹</span>
      <span>{children}</span>
      <span className="bracket" aria-hidden="true">›</span>
    </div>
  );
}
