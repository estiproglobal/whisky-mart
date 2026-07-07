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
      "rounded border px-4 py-2 font-sans text-body-sm transition-opacity",
      active
        ? "border-copper bg-copper text-ink"
        : "border-line-dark bg-ground text-cream/85 hover:opacity-75",
    );

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="font-display text-d1 text-cream">Find them the right bottle.</h1>
          <span aria-hidden="true" className="mx-auto mt-4 block h-px w-12 bg-copper" />
          <p className="mx-auto mt-5 max-w-xl text-body-sm text-cream-muted">
            Answer three questions and we&apos;ll shortlist from the shelf. If they&apos;re new to
            whisky, say so; it changes the answer.
          </p>
        </div>

        <form onSubmit={find} className="mt-10 space-y-8 rounded border border-line-dark bg-surface p-6 sm:p-8">
          <fieldset>
            <legend className="font-sans text-label text-cream">The occasion</legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {OCCASIONS.map((o) => (
                <button key={o} type="button" onClick={() => setOccasion(o)} className={chip(occasion === o)}>
                  {o}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-sans text-label text-cream">The budget</legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {BUDGETS.map((b, i) => (
                <button key={b.label} type="button" onClick={() => setBudgetIdx(i)} className={chip(budgetIdx === i)}>
                  {b.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-sans text-label text-cream">Tastes they enjoy</legend>
            <p className="mt-1 font-sans text-label-sm text-cream/55">Optional. Choose any that apply.</p>
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

          <label className="flex items-center gap-2.5 border-t border-line-dark pt-6 font-sans text-body-sm text-cream/85">
            <input
              type="checkbox"
              checked={forBeginner}
              onChange={(e) => setForBeginner(e.target.checked)}
              className="h-4 w-4 rounded border-line-dark bg-ground accent-[#C1763B]"
            />
            They&apos;re new to whisky
          </label>

          <Button type="submit" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Checking the shelf…
              </>
            ) : (
              <>
                <Gift className="h-4 w-4" aria-hidden="true" /> Find gifts
              </>
            )}
          </Button>
        </form>

        {result ? (
          <div className="mt-12 space-y-5">
            <p className="font-display text-d3 text-cream">{result.message}</p>
            <RecommendationGrid items={recs} />
            <p className="font-sans text-label-sm text-cream/55">{result.disclaimer}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
