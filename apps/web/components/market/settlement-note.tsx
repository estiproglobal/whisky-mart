"use client";

import { useCurrency } from "./currency-provider";

/**
 * Shown only when the display currency differs from the settlement currency
 * (GBP). Real multi-currency settlement is recorded in DEFERRED.md.
 */
export function SettlementNote({ className }: { className?: string }) {
  const { currency } = useCurrency();
  if (currency === "GBP") return null;
  return (
    <p className={className}>
      Prices shown in {currency} are indicative; your payment is processed in GBP.
    </p>
  );
}
