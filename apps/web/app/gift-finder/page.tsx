"use client";

import * as React from "react";
import { Gift, Loader2 } from "lucide-react";
import { FLAVOUR_AXES, type FlavourAxis } from "@whiskymart/types";
import type { AdvisorResponse } from "@/lib/advisor/types";
import { RecommendationGrid, type RecItem } from "@/components/advisor/recommendation-grid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OCCASIONS = ["Birthday", "Thank you", "Celebration", "Just because"];
const BUDGETS: Array<{ label: string; value?: number }> = [
  { label: "Under £40", value: 4000 },
  { label: "Under £75", value: 7500 },
  { label: "Under £150", value: 15000 },
  { label: "No limit", value: undefined },
];

export default function GiftFinderPage() {
  const [occasion, setOccasion] = React.useState(OCCASIONS[0]!);
  const [budgetIdx, setBudgetIdx] = React.useState(1);
  const [taste, setTaste] = React.useState<FlavourAxis[]>([]);
  const [forBeginner, setForBeginner] = React.useState(false);
  const [result, setResult] = React.useState<AdvisorResponse | null>(null);
  const [loading, setLoading] = React.useState(false);

  function toggleTaste(axis: FlavourAxis) {
    setTaste((t) => (t.includes(axis) ? t.filter((a) => a !== axis) : [...t, axis]));
  }

  async function find(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/gift-finder", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ occasion, budgetMax: BUDGETS[budgetIdx]!.value, taste, forBeginner }),
      });
      setResult((await res.json()) as AdvisorResponse);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const recs: RecItem[] = (result?.recommendations ?? []).map((r) => ({ product: r.product, reason: r.reason }));

  const chip = (active: boolean) =>
    cn(
      "rounded-md border px-4 py-2 text-sm transition-colors",
      active
        ? "border-charcoal bg-charcoal text-cream"
        : "border-line bg-cream text-charcoal/80 hover:border-charcoal",
    );

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="rule-gold" />
            <span className="overline text-whisky-700">The art of gifting</span>
            <span className="rule-gold" />
          </div>
          <h1 className="mt-6 font-display text-[2.75rem] leading-[1.02] tracking-tightest text-charcoal sm:text-[3.4rem]">
            Find the perfect whisky gift.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-charcoal/60">
            Three considered questions — occasion, budget, taste. We&apos;ll narrow the shelf to a
            handful they&apos;ll remember.
          </p>
        </div>

        <form onSubmit={find} className="mt-10 space-y-8 rounded-lg border border-line bg-ivory p-6 sm:p-8">
          <fieldset>
            <legend className="overline text-whisky-700">01 · Occasion</legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {OCCASIONS.map((o) => (
                <button key={o} type="button" onClick={() => setOccasion(o)} className={chip(occasion === o)}>
                  {o}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="overline text-whisky-700">02 · Budget</legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {BUDGETS.map((b, i) => (
                <button key={b.label} type="button" onClick={() => setBudgetIdx(i)} className={chip(budgetIdx === i)}>
                  {b.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="overline text-whisky-700">03 · Taste they enjoy</legend>
            <p className="mt-1 text-xs text-charcoal/45">Optional — choose any that apply.</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {FLAVOUR_AXES.map((axis) => (
                <button
                  key={axis}
                  type="button"
                  onClick={() => toggleTaste(axis)}
                  className={cn(chip(taste.includes(axis)), "capitalize")}
                >
                  {axis}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center gap-2.5 border-t border-gold/15 pt-6 text-sm">
            <input
              type="checkbox"
              checked={forBeginner}
              onChange={(e) => setForBeginner(e.target.checked)}
              className="h-4 w-4 rounded border-whisky-300 text-whisky-600 focus:ring-whisky-500"
            />
            They&apos;re new to whisky
          </label>

          <Button type="submit" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Curating gifts…
              </>
            ) : (
              <>
                <Gift className="h-4 w-4" /> Find gifts
              </>
            )}
          </Button>
        </form>

        {result ? (
          <div className="mt-12 space-y-5">
            <p className="font-display text-2xl text-charcoal">{result.message}</p>
            <RecommendationGrid items={recs} />
            <p className="text-xs text-smoke">{result.disclaimer}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
