"use client";

import { displayMoney } from "@/lib/market/currency";
import { useCurrency } from "./currency-provider";

/**
 * Displays a base-GBP Money in the shopper's chosen currency. Conversion is
 * client-side and reactive (changing currency updates every price live);
 * the initial value matches the server (cookie-seeded provider) so there's no
 * hydration flash.
 */
export function Price({
  money,
  className,
}: {
  money: { amount: number; currency: string };
  className?: string;
}) {
  const { currency, rates } = useCurrency();
  return <span className={className}>{displayMoney(money, currency, rates)}</span>;
}
