export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export const LOCALES: Locale[] = ['en', 'ar'];

export const DIRECTION: Record<Locale, Direction> = {
  en: 'ltr',
  ar: 'rtl',
};

