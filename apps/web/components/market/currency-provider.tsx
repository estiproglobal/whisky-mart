"use client";

import * as React from "react";
import { DEFAULT_CURRENCY, staticRates } from "@/lib/market/currency";

interface CurrencyContextValue {
  currency: string;
  rates: Record<string, number>;
  setCurrency: (code: string) => void;
}

const CurrencyContext = React.createContext<CurrencyContextValue | null>(null);

/**
 * Holds the shopper's display currency. `initialCurrency` comes from a cookie
 * read on the server (see root layout), so the server and first client render
 * agree — no hydration flash. Changing currency updates all prices live and
 * persists the choice in a cookie for subsequent SSR.
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
