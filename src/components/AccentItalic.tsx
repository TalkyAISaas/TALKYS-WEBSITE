import type { ReactNode } from 'react';

export function AccentItalic({ children }: { children: ReactNode }) {
  return <span className="accent-italic">{children}</span>;
}
