import { FLAVOUR_AXES, type FlavourAxis, type Product } from "@whiskymart/types";
import type { AdvisorIntent, Recommendation } from "./types";

const FLAVOUR_LABEL: Record<FlavourAxis, string> = {
  smoky: "smoky",
  peaty: "peaty",
  sweet: "sweet",
  fruity: "fruity",
  spicy: "spicy",
  floral: "floral",
  maritime: "maritime",
  rich: "rich",
};

function primaryPrice(product: Product): number {
  const v = [...product.variants].sort((a, b) => b.sizeMl - a.sizeMl)[0] ?? product.variants[0];
  return v ? v.price.amount : 0;
}

function topFlavours(product: Product, n: number): FlavourAxis[] {
  if (!product.flavour) return [];
  return [...FLAVOUR_AXES]
    .filter((a) => (product.flavour?.[a] ?? 0) > 0)
    .sort((a, b) => (product.flavour?.[b] ?? 0) - (product.flavour?.[a] ?? 0))
    .slice(0, n);
}

function flavourDistance(a: Product, b: Product): number {
  if (!a.flavour || !b.flavour) return Infinity;
  let sum = 0;
  for (const axis of FLAVOUR_AXES) {
    const d = (a.flavour[axis] ?? 0) - (b.flavour[axis] ?? 0);
    sum += d * d;
  }
  return Math.sqrt(sum);
}

function andList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export interface RecommendOptions {
  limit?: number;
  includeAccessories?: boolean;
  relaxPrice?: boolean; // ignore price filters (used for fallback)
}

/**
 * Score and rank catalogue products against an intent. Pure + grounded — it
 * only ever returns real products with real prices.
 */
export function recommend(
  intent: AdvisorIntent,
  products: Product[],
  options: RecommendOptions = {},
): Recommendation[] {
  const { limit = 3, includeAccessories = false, relaxPrice = false } = options;

  // Resolve any "like X" references to a target flavour profile.
  const target = intent.likeNames.length
    ? products.find(
        (p) =>
          intent.likeNames.includes(p.brand.name.toLowerCase()) ||
          intent.likeNames.some((n) => p.title.toLowerCase().includes(n)),
      )
    : undefined;

  const candidates = products.filter((p) => {
    if (!includeAccessories && p.type === "accessory") return false;
    if (intent.regions.length && !(p.whisky && intent.regions.includes(p.whisky.region))) return false;
    if (!relaxPrice) {
      const price = primaryPrice(p);
      if (intent.maxPrice !== undefined && price > intent.maxPrice) return false;
      if (intent.minPrice !== undefined && price < intent.minPrice) return false;
    }
    return true;
  });

  const scored = candidates.map((p) => {
    let score = 0;

    // Requested flavours
    for (const axis of intent.flavours) score += (p.flavour?.[axis] ?? 0) / 100 * 30;

    // Similarity to a referenced whisky
    if (target) {
      if (p.id === target.id) score += 5;
      else score += Math.max(0, 40 - flavourDistance(p, target) / 4);
    }

    // Beginner-friendliness
    if (intent.beginner) {
      if (p.flavourTags.includes("beginner")) score += 25;
      score -= ((p.flavour?.peaty ?? 0) + (p.flavour?.smoky ?? 0)) / 12;
    }

    // Quality / popularity
    score += p.ratingAvg * 2 + p.ratingCount / 120;
    if (p.badges.includes("bestseller")) score += 3;
    if (p.badges.includes("award")) score += 3;

    return { product: p, reason: buildReason(p, intent, target), score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

function buildReason(product: Product, intent: AdvisorIntent, target?: Product): string {
  const parts: string[] = [];

  const matched = intent.flavours.filter((a) => (product.flavour?.[a] ?? 0) >= 40);
  const flavourWords = (matched.length ? matched : topFlavours(product, 2)).map((a) => FLAVOUR_LABEL[a]);
  if (flavourWords.length) parts.push(andList(flavourWords));

  if (product.whisky?.region) parts.push(`a classic ${cap(product.whisky.region)}`);
  if (target && product.id !== target.id) parts.push(`in the style of ${target.brand.name}`);
  if (intent.beginner && product.flavourTags.includes("beginner")) parts.push("approachable for a newcomer");
  if (intent.maxPrice !== undefined && primaryPrice(product) <= intent.maxPrice) parts.push("within your budget");

  const sentence = parts.length ? cap(parts.join(", ")) : "A well-loved WhiskyMart pick";
  return `${sentence}.`;
}
