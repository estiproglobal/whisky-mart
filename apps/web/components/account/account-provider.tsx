"use client";

import * as React from "react";

export interface Customer {
  email: string;
  name: string;
}

interface AccountContextValue {
  customer: Customer | null;
  ready: boolean; // hydrated from storage
  signIn: (customer: Customer) => void;
  signOut: () => void;
}

const AccountContext = React.createContext<AccountContextValue | null>(null);
const STORAGE_KEY = "wm_account";

/**
 * Mock client-side account (dev only). Real auth (Clerk/Auth0) + server
 * sessions land with the auth swap — see DEFERRED.md.
 */
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCustomer(JSON.parse(raw) as Customer);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const signIn = React.useCallback((c: Customer) => {
    setCustomer(c);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    } catch {
      /* ignore */
    }
  }, []);

  const signOut = React.useCallback(() => {
    setCustomer(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = React.useMemo(
    () => ({ customer, ready, signIn, signOut }),
    [customer, ready, signIn, signOut],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const ctx = React.useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within an AccountProvider");
  return ctx;
}
