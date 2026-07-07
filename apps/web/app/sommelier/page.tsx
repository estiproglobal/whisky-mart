"use client";

import * as React from "react";
import { Send, Loader2 } from "lucide-react";
import type { AdvisorResponse } from "@/lib/advisor/types";
import { RecommendationGrid, type RecItem } from "@/components/advisor/recommendation-grid";
import { usePalate } from "@/components/personalization/palate-provider";
import { Button } from "@/components/ui/button";

interface Turn {
  id: string;
  role: "user" | "advisor";
  text: string;
  recs?: RecItem[];
  disclaimer?: string;
}

const EXAMPLES = [
  "A gift under £75 for a peat lover",
  "Something smoky but balanced",
  "Similar to Lagavulin 16",
  "A first whisky for a beginner",
];

export default function SommelierPage() {
  const { palate } = usePalate();
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    setInput("");
    setTurns((t) => [...t, { id: crypto.randomUUID(), role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: q, palate: palate?.flavours ?? [] }),
      });
      const data = (await res.json()) as AdvisorResponse;
      setTurns((t) => [
        ...t,
        {
          id: crypto.randomUUID(),
          role: "advisor",
          text: data.message,
          recs: data.recommendations.map((r) => ({ product: r.product, reason: r.reason })),
          disclaimer: data.disclaimer,
        },
      ]);
    } catch {
      setTurns((t) => [
        ...t,
        { id: crypto.randomUUID(), role: "advisor", text: "Sorry, the shelf isn't answering just now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="font-display text-d1 text-cream">Tell it what you love.</h1>
          <span aria-hidden="true" className="mx-auto mt-4 block h-px w-12 bg-copper" />
          <p className="mx-auto mt-5 max-w-xl text-body-sm text-cream-muted">
            Name a bottle you liked, or a budget, or the person it&apos;s for. The Sommelier answers
            from our own shelf and shows its reasoning.
          </p>
        </div>

        <div className="mt-10 rounded border border-line-dark bg-surface p-5 sm:p-7">
          {turns.length === 0 ? (
            <div className="py-4">
              <p className="text-center text-body-sm text-cream-muted">Try asking…</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => ask(ex)}
                    className="rounded border border-line-dark bg-ground px-4 py-2 font-sans text-body-sm text-cream/85 transition-opacity hover:opacity-75"
                  >
                    “{ex}”
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {turns.map((turn) =>
                turn.role === "user" ? (
                  <div key={turn.id} className="flex justify-end">
                    <p className="max-w-[80%] rounded border border-line-light bg-parchment px-4 py-2.5 text-body-sm text-ink">
                      {turn.text}
                    </p>
                  </div>
                ) : (
                  <div key={turn.id} className="space-y-4">
                    <p className="max-w-[90%] rounded border border-line-dark bg-ground px-4 py-3 text-body-sm text-cream/90">
                      {turn.text}
                    </p>
                    {turn.recs && turn.recs.length > 0 ? <RecommendationGrid items={turn.recs} /> : null}
                    {turn.disclaimer ? <p className="font-sans text-label-sm text-cream/55">{turn.disclaimer}</p> : null}
                  </div>
                ),
              )}
              {loading ? (
                <p className="flex items-center gap-2 text-body-sm text-cream-muted">
                  <Loader2 className="h-4 w-4 animate-spin" /> Checking the shelf…
                </p>
              ) : null}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="mt-5 flex items-center gap-2 rounded border border-line-dark bg-ground p-2 focus-within:border-cream/40"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your Sommelier…"
              className="h-11 w-full bg-transparent px-3 font-sans text-body-sm text-cream outline-none placeholder:text-cream/40"
            />
            <Button type="submit" disabled={!input.trim() || loading} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
