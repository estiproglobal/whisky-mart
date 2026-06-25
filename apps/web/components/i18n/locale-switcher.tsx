"use client";

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";
import { useT } from "./locale-provider";

export function LocaleSwitcher() {
  const { locale, setLocale } = useT();
  return (
    <label className="inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label="Language"
        className="h-9 rounded-lg border border-whisky-200 bg-white px-2 text-sm text-charcoal hover:border-whisky-400 focus:border-whisky-500 focus:outline-none"
      >
        {SUPPORTED_LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
