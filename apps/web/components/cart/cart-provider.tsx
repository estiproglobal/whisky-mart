"use client";

import * as React from "react";
import type { CartLine } from "@whiskymart/types";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  add: (line: CartLine) => void;
  remove: (variantId: string) => void;
  setQty: (variantId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);
const STORAGE_KEY = "wm_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);

  // Hydrate from localStorage once on mount.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage may be unavailable */
    }
  }, [lines]);

  const add = React.useCallback((line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId);
      if (existing) {
        return prev.map((l) =>
          l.variantId === line.variantId ? { ...l, quantity: l.quantity + line.quantity } : l,
        );
      }
      return [...prev, line];
    });
  }, []);

  const remove = React.useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const setQty = React.useCallback((variantId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)),
    );
  }, []);

  const clear = React.useCallback(() => setLines([]), []);

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  const value = React.useMemo(
    () => ({ lines, count, add, remove, setQty, clear }),
    [lines, count, add, remove, setQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
