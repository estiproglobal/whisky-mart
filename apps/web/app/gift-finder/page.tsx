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

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-whisky-100 px-4 py-1.5 text-sm font-medium text-whisky-800">
            <Gift className="h-4 w-4" /> Gift Finder
          </span>
          <h1 className="mt-5 font-display text-4xl text-charcoal">Find the perfect whisky gift.</h1>
          <p className="mt-3 text-charcoal/70">Answer three quick questions and we&apos;ll do the rest.</p>
        </div>

        <form onSubmit={find} className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-card">
          <div>
            <p className="mb-2 text-sm font-medium text-charcoal/80">Occasion</p>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOccasion(o)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm",
                    occasion === o ? "border-whisky-500 bg-whisky-50 text-whisky-700" : "border-whisky-200 text-charcoal/80",
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-charcoal/80">Budget</p>
            <div className="flex flex-wrap gap-2">
              {BUDGETS.map((b, i) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => setBudgetIdx(i)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm",
                    budgetIdx === i ? "border-whisky-500 bg-whisky-50 text-whisky-700" : "border-whisky-200 text-charcoal/80",
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-charcoal/80">Tastes they enjoy (optional)</p>
            <div className="flex flex-wrap gap-2">
              {FLAVOUR_AXES.map((axis) => (
                <button
                  key={axis}
                  type="button"
                  onClick={() => toggleTaste(axis)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm capitalize",
                    taste.includes(axis) ? "border-whisky-500 bg-whisky-50 text-whisky-700" : "border-whisky-200 text-charcoal/80",
                  )}
                >
                  {axis}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={forBeginner}
              onChange={(e) => setForBeginner(e.target.checked)}
              className="h-4 w-4 rounded border-whisky-300 text-whisky-600 focus:ring-whisky-500"
            />
            They&apos;re new to whisky
          </label>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Finding gifts…
              </>
            ) : (
              <>
                <Gift className="h-4 w-4" /> Find gifts
              </>
            )}
          </Button>
        </form>

        {result ? (
          <div className="mt-10 space-y-4">
            <p className="font-display text-xl text-charcoal">{result.message}</p>
            <RecommendationGrid items={recs} />
            <p className="text-xs text-charcoal/40">{result.disclaimer}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
