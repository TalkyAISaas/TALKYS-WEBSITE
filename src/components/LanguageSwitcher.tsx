import { useLocale, useT } from '@/context/LocaleContext';

export function LanguageSwitcher() {
  const { locale, toggleLocale } = useLocale();
  const t = useT();
  const isAr = locale === 'ar';

  return (
    <button
      onClick={toggleLocale}
      aria-label={t('nav.languageSwitch')}
      className="
        w-10 h-10 rounded-full
        bg-black/[0.05] dark:bg-white/[0.06]
        border border-black/[0.06] dark:border-white/[0.06]
        flex items-center justify-center
        hover:bg-black/[0.08] dark:hover:bg-white/[0.1]
        transition-colors
        text-xs font-semibold text-foreground/70
      "
    >
      <span aria-hidden="true">{isAr ? 'EN' : 'AR'}</span>
    </button>
  );
}
