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
        className="h-7 rounded-md border border-transparent bg-transparent px-1.5 text-xs text-charcoal/70 hover:text-charcoal focus:border-gold/40 focus:outline-none"
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
