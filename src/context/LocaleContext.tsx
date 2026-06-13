import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  DIRECTION,
  type Direction,
  type Locale,
  LOCALES,
} from '@/i18n/types';
import { EN_TRANSLATIONS } from '@/i18n/translations/en';
import { AR_TRANSLATIONS } from '@/i18n/translations/ar';
import { translate } from '@/i18n/translate';
import { detectLocaleFromGeo } from '@/i18n/geo';

const DICTS = { en: EN_TRANSLATIONS, ar: AR_TRANSLATIONS } as const;
const STORAGE_KEY = 'locale';

function readStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return LOCALES.includes(saved as Locale) ? (saved as Locale) : null;
}

interface LocaleContextValue {
  locale: Locale;
  dir: Direction;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  t: <T = string>(key: string) => T;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale() ?? 'en');
  const userPickedRef = useRef<boolean>(readStoredLocale() !== null);

  // Apply <html lang> and <html dir> on every change.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = DIRECTION[locale];
  }, [locale]);

  // First-visit geo detection only when the user hasn't picked.
  useEffect(() => {
    if (userPickedRef.current) return;
    let cancelled = false;
    detectLocaleFromGeo({ navigatorLanguage: navigator.language })
      .then((detected) => {
        if (!cancelled && !userPickedRef.current) setLocaleState(detected);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback((l: Locale) => {
    userPickedRef.current = true;
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore quota/private-mode failures
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  }, [locale, setLocale]);

  const t = useCallback(
    <T = string,>(key: string): T => translate(DICTS[locale], key) as T,
    [locale],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dir: DIRECTION[locale], setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}

export function useT() {
  return useLocale().t;
}
