"use client";

import * as React from "react";
import { DEFAULT_CURRENCY, isSupportedCurrency, staticRates } from "@/lib/market/currency";

interface CurrencyContextValue {
  currency: string;
  rates: Record<string, number>;
  setCurrency: (code: string) => void;
}

const CurrencyContext = React.createContext<CurrencyContextValue | null>(null);

/**
 * Holds the shopper's display currency. Server + first client render use GBP
 * (so all pages stay statically generated and SEO is GBP-canonical); the saved
 * preference is read from a cookie *after* mount and applied client-side, so
 * there's no hydration mismatch. Changing currency updates all prices live and
 * persists the choice in a cookie.
 */
export function CurrencyProvider({
  initialCurrency = DEFAULT_CURRENCY,
  children,
}: {
  initialCurrency?: string;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = React.useState(initialCurrency);
  const rates = React.useMemo(() => staticRates.getRates(), []);

  // Apply the saved preference after hydration (avoids forcing dynamic render).
  React.useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)wm_currency=([^;]+)/);
    const saved = match?.[1];
    if (saved && isSupportedCurrency(saved)) setCurrencyState(saved);
  }, []);

  const setCurrency = React.useCallback((code: string) => {
    setCurrencyState(code);
    try {
      document.cookie = `wm_currency=${code}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* ignore */
    }
  }, []);

  const value = React.useMemo(
    () => ({ currency, rates, setCurrency }),
    [currency, rates, setCurrency],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = React.useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
