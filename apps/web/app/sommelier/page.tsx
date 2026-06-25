"use client";

import * as React from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
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
  "I like Lagavulin but want something sweeter under £80",
  "A peated whisky for a beginner",
  "Something fruity from Speyside",
  "A smoky gift under £100",
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
        { id: crypto.randomUUID(), role: "advisor", text: "Sorry — I couldn't reach the cellar just now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-whisky-100 px-4 py-1.5 text-sm font-medium text-whisky-800">
            <Sparkles className="h-4 w-4" /> WhiskyMart Sommelier
          </span>
          <h1 className="mt-5 font-display text-4xl text-charcoal">Tell me what you love.</h1>
          <p className="mt-3 text-charcoal/70">
            Describe a whisky you enjoyed, a flavour, a budget or an occasion — I&apos;ll recommend bottles
            from our range, with reasons.
          </p>
        </div>

        {turns.length === 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => ask(ex)}
                className="rounded-full border border-whisky-200 px-4 py-1.5 text-sm text-charcoal/80 hover:border-whisky-500 hover:text-whisky-700"
              >
                {ex}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {turns.map((turn) =>
              turn.role === "user" ? (
                <div key={turn.id} className="flex justify-end">
                  <p className="max-w-[80%] rounded-2xl bg-charcoal px-4 py-2.5 text-sm text-cream">
                    {turn.text}
                  </p>
                </div>
              ) : (
                <div key={turn.id} className="space-y-4">
                  <p className="max-w-[90%] rounded-2xl bg-whisky-50 px-4 py-2.5 text-charcoal">{turn.text}</p>
                  {turn.recs && turn.recs.length > 0 ? <RecommendationGrid items={turn.recs} /> : null}
                  {turn.disclaimer ? <p className="text-xs text-charcoal/40">{turn.disclaimer}</p> : null}
                </div>
              ),
            )}
            {loading ? (
              <p className="flex items-center gap-2 text-sm text-charcoal/50">
                <Loader2 className="h-4 w-4 animate-spin" /> Choosing for you…
              </p>
            ) : null}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="sticky bottom-4 mt-8 flex items-center gap-2 rounded-2xl border border-whisky-200 bg-white p-2 shadow-card"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Sommelier…"
            className="h-11 w-full bg-transparent px-3 text-sm outline-none placeholder:text-charcoal/40"
          />
          <Button type="submit" disabled={!input.trim() || loading} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
