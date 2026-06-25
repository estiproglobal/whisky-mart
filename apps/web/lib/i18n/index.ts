import { MESSAGES, SUPPORTED_LOCALES, type Locale } from "./messages";

export const DEFAULT_LOCALE: Locale = "en";

export function isSupportedLocale(code: string | undefined | null): code is Locale {
  return !!code && SUPPORTED_LOCALES.some((l) => l.code === code);
}

export function htmlLangFor(locale: Locale): string {
  return SUPPORTED_LOCALES.find((l) => l.code === locale)?.htmlLang ?? "en-GB";
}

/** Translate a key for a locale, falling back to English then the key itself. */
export function translate(locale: Locale, key: string, fallback?: string): string {
  return MESSAGES[locale]?.[key] ?? MESSAGES[DEFAULT_LOCALE][key] ?? fallback ?? key;
}

export { MESSAGES, SUPPORTED_LOCALES };
export type { Locale, LocaleMeta } from "./messages";
