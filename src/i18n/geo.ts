import type { Locale } from './types';

export const ARABIC_COUNTRIES = new Set<string>([
  'LB', 'SA', 'AE', 'EG', 'JO', 'KW', 'QA', 'BH', 'OM',
  'IQ', 'SY', 'YE', 'PS', 'MA', 'DZ', 'TN', 'LY', 'SD',
  'MR', 'DJ', 'SO', 'KM',
]);

const GEO_ENDPOINT = 'https://api.country.is';
const TIMEOUT_MS = 2000;

interface DetectOptions {
  navigatorLanguage?: string;
  signal?: AbortSignal;
}

function localeFromNavigator(lang: string | undefined): Locale {
  if (lang && lang.toLowerCase().startsWith('ar')) return 'ar';
  return 'en';
}

export async function detectLocaleFromGeo(opts: DetectOptions = {}): Promise<Locale> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(GEO_ENDPOINT, { signal: controller.signal });
    if (!res.ok) throw new Error(`geo ${res.status}`);
    const data = (await res.json()) as { country?: string };
    const country = (data.country ?? '').toUpperCase();
    if (ARABIC_COUNTRIES.has(country)) return 'ar';
    return 'en';
  } catch {
    return localeFromNavigator(opts.navigatorLanguage);
  } finally {
    clearTimeout(timer);
  }
}
