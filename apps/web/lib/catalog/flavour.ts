import {
  FLAVOUR_AXES,
  type FlavourAxis,
  type FlavourProfile,
  type Product,
} from "@whiskymart/types";

/** Display labels for the canonical flavour axes (single source of truth). */
export const FLAVOUR_LABELS: Record<FlavourAxis, string> = {
  smoky: "Smoky",
  peaty: "Peaty",
  sweet: "Sweet",
  fruity: "Fruity",
  spicy: "Spicy",
  floral: "Floral",
  maritime: "Maritime",
  rich: "Rich",
};

/** Axes present in a profile (>= `min`), ordered by descending intensity. */
export function rankedAxes(flavour: FlavourProfile, min = 1): FlavourAxis[] {
  return FLAVOUR_AXES.filter((a) => flavour[a] >= min).sort((a, b) => flavour[b] - flavour[a]);
}

/**
 * Mean flavour profile across the products that carry flavour data. Returns
 * null when none do (e.g. an accessories-only set), so callers can skip the
 * visual rather than render a flat, meaningless chart.
 */
export function aggregateFlavour(products: Product[]): FlavourProfile | null {
  const withFlavour = products.filter(
    (p): p is Product & { flavour: FlavourProfile } => Boolean(p.flavour),
  );
  if (withFlavour.length === 0) return null;

  const out = {
    smoky: 0,
    peaty: 0,
    sweet: 0,
    fruity: 0,
    spicy: 0,
    floral: 0,
    maritime: 0,
    rich: 0,
  } satisfies FlavourProfile;

  for (const p of withFlavour) {
    for (const axis of FLAVOUR_AXES) out[axis] += p.flavour[axis];
  }
  for (const axis of FLAVOUR_AXES) out[axis] = Math.round(out[axis] / withFlavour.length);
  return out;
}

/**
 * A short human phrase from the strongest axes, e.g. "smoky, peaty & maritime".
 * `min` keeps faint background notes out of the description.
 */
export function describeFlavour(flavour: FlavourProfile, n = 3, min = 20): string {
  const top = rankedAxes(flavour, min)
    .slice(0, n)
    .map((a) => FLAVOUR_LABELS[a].toLowerCase());
  if (top.length === 0) return "";
  if (top.length === 1) return top[0]!;
  return `${top.slice(0, -1).join(", ")} & ${top[top.length - 1]}`;
}
