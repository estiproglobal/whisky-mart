/**
 * Multi-currency display layer (Phase 2). Catalogue money is stored in GBP
 * minor units; this converts it for *display* in the shopper's chosen currency.
 *
 * Interface-first: `RatesProvider` returns static rates today and swaps for a
 * live FX feed later. Payment settlement remains GBP for now — multi-currency
 * settlement (Stripe presentment) is recorded in DEFERRED.md.
 */

export interface CurrencyMeta {
  code: string;
  symbol: string;
  locale: string;
  label: string;
}

/** Two-decimal currencies only (keeps the `minor = amount/100` model simple). */
export const SUPPORTED_CURRENCIES: CurrencyMeta[] = [
  { code: "GBP", symbol: "£", locale: "en-GB", label: "British Pound" },
  { code: "EUR", symbol: "€", locale: "en-IE", label: "Euro" },
  { code: "USD", symbol: "$", locale: "en-US", label: "US Dollar" },
  { code: "AUD", symbol: "A$", locale: "en-AU", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", locale: "en-CA", label: "Canadian Dollar" },
];

export const DEFAULT_CURRENCY = "GBP";

export function isSupportedCurrency(code: string | undefined | null): boolean {
  return !!code && SUPPORTED_CURRENCIES.some((c) => c.code === code);
}

export interface RatesProvider {
  getRates(): Record<string, number>;
}

// Illustrative static FX, base = GBP. Replaced by a live provider later.
const STATIC_RATES: Record<string, number> = { GBP: 1, EUR: 1.18, USD: 1.27, AUD: 1.93, CAD: 1.74 };

export const staticRates: RatesProvider = {
  getRates: () => STATIC_RATES,
};

/** Convert a GBP minor-unit amount into another currency's minor units. */
export function convertFromGbp(amountMinorGbp: number, toCurrency: string, rates = STATIC_RATES): number {
  const rate = rates[toCurrency] ?? 1;
  return Math.round(amountMinorGbp * rate);
}

export function formatMoneyIn(amountMinor: number, currency: string, locale?: string): string {
  const meta = SUPPORTED_CURRENCIES.find((c) => c.code === currency);
  return new Intl.NumberFormat(locale ?? meta?.locale ?? "en-GB", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

/** Convert a base-GBP Money for display in the target currency, formatted. */
export function displayMoney(
  money: { amount: number; currency: string },
  toCurrency: string,
  rates = STATIC_RATES,
): string {
  const minor = toCurrency === "GBP" ? money.amount : convertFromGbp(money.amount, toCurrency, rates);
  return formatMoneyIn(minor, toCurrency);
}
