export const SUPPORTED_LOCALES = ["en", "de", "it", "es", "fr"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(locale: string): locale is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

export function localeToHtmlLang(locale: Locale): string {
  // Keep it simple: use the 2-letter language code as <html lang="..."> value.
  return locale;
}

