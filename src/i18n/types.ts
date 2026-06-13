export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export const LOCALES: Locale[] = ['en', 'ar'];

export const DIRECTION: Record<Locale, Direction> = {
  en: 'ltr',
  ar: 'rtl',
};

// The shape that both en.ts and ar.ts must satisfy.
// Use `typeof EN_TRANSLATIONS` from en.ts as the canonical shape — ar.ts
// imports the type and is required to match.
