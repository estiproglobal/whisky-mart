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
        className="h-7 rounded-md border border-transparent bg-transparent px-1.5 text-xs text-charcoal/70 hover:text-charcoal focus:border-gold/40 focus:outline-none"
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
