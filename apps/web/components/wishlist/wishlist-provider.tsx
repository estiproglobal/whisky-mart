"use client";

import * as React from "react";

interface WishlistContextValue {
  ids: string[];
  count: number;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
}

const WishlistContext = React.createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "wm_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  const has = React.useCallback((productId: string) => ids.includes(productId), [ids]);

  const toggle = React.useCallback((productId: string) => {
    setIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev],
    );
  }, []);

  const remove = React.useCallback((productId: string) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const value = React.useMemo(
    () => ({ ids, count: ids.length, has, toggle, remove }),
    [ids, has, toggle, remove],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = React.useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
