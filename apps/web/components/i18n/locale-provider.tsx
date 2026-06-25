"use client";

import * as React from "react";
import { DEFAULT_LOCALE, htmlLangFor, isSupportedLocale, translate, type Locale } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  t: (key: string, fallback?: string) => string;
  setLocale: (code: Locale) => void;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

/**
 * Holds the UI language. Server + first client render use English (so pages stay
 * statically generated and SEO is English-canonical); the saved preference is
 * read from a cookie after mount and applied client-side — no hydration
 * mismatch. Full locale-routed URLs + hreflang are a production follow-up
 * (see DEFERRED.md).
 */
export function LocaleProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = React.useState<Locale>(initialLocale);

  React.useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)wm_locale=([^;]+)/);
    const saved = match?.[1];
    if (isSupportedLocale(saved)) setLocaleState(saved);
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = htmlLangFor(locale);
  }, [locale]);

  const setLocale = React.useCallback((code: Locale) => {
    setLocaleState(code);
    try {
      document.cookie = `wm_locale=${code}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* ignore */
    }
  }, []);

  const t = React.useCallback(
    (key: string, fallback?: string) => translate(locale, key, fallback),
    [locale],
  );

  const value = React.useMemo(() => ({ locale, t, setLocale }), [locale, t, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useT(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) throw new Error("useT must be used within a LocaleProvider");
  return ctx;
}
