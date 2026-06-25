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
  "A gift under £75",
  "Something smoky but balanced",
  "Similar to Lagavulin 16",
  "Beginner-friendly Japanese whisky",
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
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="rule-gold" />
            <span className="overline text-whisky-700">Private concierge</span>
            <span className="rule-gold" />
          </div>
          <h1 className="mt-6 font-display text-[2.75rem] leading-[1.02] tracking-tightest text-charcoal sm:text-[3.4rem]">
            Tell me what you love.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-charcoal/60">
            Describe a whisky you enjoyed, a flavour, a budget or an occasion — your Sommelier will
            recommend bottles from our cellar, with the reasoning behind each.
          </p>
        </div>

        <div className="mt-10 rounded-lg border border-line bg-ivory p-5 sm:p-7">
          {turns.length === 0 ? (
            <div className="py-4">
              <p className="text-center text-sm text-charcoal/55">Try asking…</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => ask(ex)}
                    className="rounded-md border border-line bg-cream px-4 py-2 text-sm text-charcoal/80 transition-colors hover:border-charcoal hover:text-charcoal"
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
                    <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-charcoal px-4 py-2.5 text-sm text-cream">
                      {turn.text}
                    </p>
                  </div>
                ) : (
                  <div key={turn.id} className="space-y-4">
                    <p className="max-w-[90%] rounded-2xl rounded-bl-sm bg-parchment/70 px-4 py-3 text-charcoal">
                      {turn.text}
                    </p>
                    {turn.recs && turn.recs.length > 0 ? <RecommendationGrid items={turn.recs} /> : null}
                    {turn.disclaimer ? <p className="text-xs text-smoke">{turn.disclaimer}</p> : null}
                  </div>
                ),
              )}
              {loading ? (
                <p className="flex items-center gap-2 text-sm text-charcoal/50">
                  <Loader2 className="h-4 w-4 animate-spin" /> Selecting from the cellar…
                </p>
              ) : null}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="mt-5 flex items-center gap-2 rounded-md border border-line bg-cream p-2 focus-within:border-charcoal/40"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your Sommelier…"
              className="h-11 w-full bg-transparent px-3 text-sm outline-none placeholder:text-charcoal/40"
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
