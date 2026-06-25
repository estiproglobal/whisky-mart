"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/wordmark";
import { useT } from "@/components/i18n/locale-provider";

const STORAGE_KEY = "wm_age_ok";

/**
 * Lightweight client-side age gate (UK 18+). This is the storefront courtesy
 * gate only — binding age verification happens server-side at checkout via a
 * dedicated provider (see docs/09-compliance-and-regulatory.md §2).
 */
export function AgeGate() {
  const { t } = useT();
  const [state, setState] = React.useState<"loading" | "ok" | "ask" | "denied">("loading");

  React.useEffect(() => {
    setState(localStorage.getItem(STORAGE_KEY) === "1" ? "ok" : "ask");
  }, []);

  function confirm() {
    localStorage.setItem(STORAGE_KEY, "1");
    setState("ok");
  }

  if (state === "ok" || state === "loading") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-lg border border-line bg-cream p-9 text-center shadow-lift">
        <div className="flex justify-center text-charcoal">
          <Wordmark />
        </div>
        <div className="mt-6 flex justify-center">
          <span className="rule-gold" />
        </div>
        <h1 id="age-gate-title" className="mt-6 font-display text-[1.75rem] leading-tight tracking-tightest text-charcoal">
          {t("ageGate.question")}
        </h1>
        <p className="mt-3 text-sm text-charcoal/70">{t("ageGate.subtitle")}</p>

        {state === "denied" ? (
          <p className="mt-7 rounded-md border border-line bg-parchment/70 p-4 text-sm text-whisky-900">
            {t("ageGate.denied")}
          </p>
        ) : (
          <div className="mt-7 flex gap-3">
            <Button onClick={confirm} className="flex-1">
              {t("ageGate.yes")}
            </Button>
            <Button variant="outline" onClick={() => setState("denied")} className="flex-1">
              {t("ageGate.no")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
