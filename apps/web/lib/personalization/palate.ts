import type { FlavourAxis } from "@whiskymart/types";

/**
 * Palate profile (Phase 2 personalisation). Built from a short quiz today and
 * stored client-side; a richer server-side profile learned from behaviour
 * (the "palate fingerprint" in docs/02) is the production follow-up — see
 * DEFERRED.md.
 */
export interface PalateProfile {
  flavours: FlavourAxis[]; // preferred flavour axes, most-preferred first
  updatedAt: string;
}

export interface QuizOption {
  label: string;
  flavours: FlavourAxis[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  multi?: boolean;
  options: QuizOption[];
}

export const PALATE_QUIZ: QuizQuestion[] = [
  {
    id: "smoke",
    prompt: "How do you feel about smoky, peaty whisky?",
    options: [
      { label: "Love it — bring the bonfire", flavours: ["smoky", "peaty"] },
      { label: "A gentle wisp is nice", flavours: ["smoky"] },
      { label: "Not for me", flavours: [] },
    ],
  },
  {
    id: "flavours",
    prompt: "Which flavours appeal most? (choose any)",
    multi: true,
    options: [
      { label: "Sweet & honeyed", flavours: ["sweet"] },
      { label: "Fruity", flavours: ["fruity"] },
      { label: "Rich & sherried", flavours: ["rich"] },
      { label: "Spicy", flavours: ["spicy"] },
      { label: "Floral & delicate", flavours: ["floral"] },
    ],
  },
  {
    id: "coast",
    prompt: "A coastal, maritime character?",
    options: [
      { label: "Yes please", flavours: ["maritime"] },
      { label: "No strong preference", flavours: [] },
    ],
  },
];

export const MAX_PALATE_FLAVOURS = 4;

/** Score quiz answers (questionId -> selected option indexes) into ranked flavours. */
export function scoreQuiz(answers: Record<string, number[]>): FlavourAxis[] {
  const counts = new Map<FlavourAxis, number>();
  for (const q of PALATE_QUIZ) {
    for (const idx of answers[q.id] ?? []) {
      const opt = q.options[idx];
      if (!opt) continue;
      for (const f of opt.flavours) counts.set(f, (counts.get(f) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_PALATE_FLAVOURS)
    .map(([flavour]) => flavour);
}

export function buildProfile(answers: Record<string, number[]>): PalateProfile {
  return { flavours: scoreQuiz(answers), updatedAt: new Date().toISOString() };
}
