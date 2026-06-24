"use client";

import { SUPPORTED_CURRENCIES } from "@/lib/market/currency";
import { useCurrency } from "./currency-provider";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  return (
    <label className="inline-flex items-center">
      <span className="sr-only">Display currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        aria-label="Display currency"
        className="h-9 rounded-lg border border-whisky-200 bg-white px-2 text-sm text-charcoal hover:border-whisky-400 focus:border-whisky-500 focus:outline-none"
      >
        {SUPPORTED_CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
    </label>
  );
}
