"use client";

import * as React from "react";
import type { FlavourAxis } from "@whiskymart/types";
import type { PalateProfile } from "@/lib/personalization/palate";

interface PalateContextValue {
  palate: PalateProfile | null;
  ready: boolean;
  setFlavours: (flavours: FlavourAxis[]) => void;
  clear: () => void;
}

const PalateContext = React.createContext<PalateContextValue | null>(null);
const STORAGE_KEY = "wm_palate";

export function PalateProvider({ children }: { children: React.ReactNode }) {
  const [palate, setPalate] = React.useState<PalateProfile | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPalate(JSON.parse(raw) as PalateProfile);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = React.useCallback((next: PalateProfile | null) => {
    setPalate(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setFlavours = React.useCallback(
    (flavours: FlavourAxis[]) => persist({ flavours, updatedAt: new Date().toISOString() }),
    [persist],
  );

  const clear = React.useCallback(() => persist(null), [persist]);

  const value = React.useMemo(
    () => ({ palate, ready, setFlavours, clear }),
    [palate, ready, setFlavours, clear],
  );

  return <PalateContext.Provider value={value}>{children}</PalateContext.Provider>;
}

export function usePalate(): PalateContextValue {
  const ctx = React.useContext(PalateContext);
  if (!ctx) throw new Error("usePalate must be used within a PalateProvider");
  return ctx;
}
