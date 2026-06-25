"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { PALATE_QUIZ, scoreQuiz } from "@/lib/personalization/palate";
import { usePalate } from "./palate-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PalateQuiz() {
  const { palate, setFlavours } = usePalate();
  const [answers, setAnswers] = React.useState<Record<string, number[]>>({});
  const [done, setDone] = React.useState(false);

  function toggle(qid: string, idx: number, multi: boolean) {
    setAnswers((prev) => {
      const cur = prev[qid] ?? [];
      if (multi) {
        return { ...prev, [qid]: cur.includes(idx) ? cur.filter((i) => i !== idx) : [...cur, idx] };
      }
      return { ...prev, [qid]: [idx] };
    });
  }

  function submit() {
    setFlavours(scoreQuiz(answers));
    setDone(true);
  }

  const answeredCount = PALATE_QUIZ.filter((q) => (answers[q.id]?.length ?? 0) > 0).length;
  const canSubmit = answeredCount > 0;

  return (
    <div className="space-y-8 rounded-2xl bg-white p-6 shadow-card">
      {PALATE_QUIZ.map((q) => (
        <fieldset key={q.id}>
          <legend className="font-display text-lg text-charcoal">{q.prompt}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {q.options.map((opt, idx) => {
              const selected = (answers[q.id] ?? []).includes(idx);
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => toggle(q.id, idx, !!q.multi)}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm",
                    selected
                      ? "border-whisky-500 bg-whisky-50 text-whisky-700"
                      : "border-whisky-200 text-charcoal/80 hover:border-whisky-400",
                  )}
                >
                  {selected ? <Check className="h-3.5 w-3.5" /> : null}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex items-center gap-3">
        <Button onClick={submit} disabled={!canSubmit}>
          {done ? "Update my palate" : "Save my palate"}
        </Button>
        {done && palate ? (
          <span className="text-sm text-charcoal/60">
            Saved:{" "}
            {palate.flavours.length ? (
              <span className="capitalize text-whisky-700">{palate.flavours.join(", ")}</span>
            ) : (
              "we'll keep it broad"
            )}
          </span>
        ) : null}
      </div>
    </div>
  );
}
