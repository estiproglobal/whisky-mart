import { catalog } from "@/lib/catalog/repository";
import { parseQuery } from "./parse";
import { recommend } from "./engine";
import {
  type Advisor,
  type AdvisorIntent,
  type AdvisorOptions,
  type AdvisorResponse,
  RESPONSIBLE_DISCLAIMER,
} from "./types";

function uniq(arr: string[]): string[] {
  return [...new Set(arr)];
}

function andList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function summariseIntent(intent: AdvisorIntent): string {
  const bits: string[] = [];
  if (intent.flavours.length) bits.push(andList(intent.flavours));
  if (intent.regions.length) bits.push(andList(intent.regions.map(cap)));
  if (intent.likeNames.length) bits.push(`similar to ${andList(intent.likeNames.map(cap))}`);
  if (intent.maxPrice !== undefined) bits.push(`under £${Math.round(intent.maxPrice / 100)}`);
  if (intent.beginner) bits.push("approachable for a newcomer");
  return bits.length ? andList(bits) : "";
}

/**
 * Grounded, rule-based Sommelier. Retrieves real catalogue products via the
 * shared engine — never invents products, prices, or stock. Swapped for a
 * Claude-backed advisor behind the `Advisor` interface (see DEFERRED.md).
 */
export class GroundedMockAdvisor implements Advisor {
  readonly name = "grounded-mock";

  async ask(query: string, options?: AdvisorOptions): Promise<AdvisorResponse> {
    const products = await catalog.getAll();
    const knownNames = uniq([
      ...products.map((p) => p.brand.name.toLowerCase()),
      ...products.flatMap((p) => (p.distillery ? [p.distillery.name.toLowerCase()] : [])),
    ]);

    const intent = parseQuery(query, knownNames);
    // Fall back to the shopper's saved palate when the query has no flavour hint.
    if (intent.flavours.length === 0 && options?.palate?.length) {
      intent.flavours = options.palate;
    }

    let recs = recommend(intent, products, { limit: 3, includeAccessories: intent.gift });
    let relaxed = false;
    if (recs.length === 0) {
      recs = recommend(intent, products, { limit: 3, relaxPrice: true });
      relaxed = true;
    }

    const summary = summariseIntent(intent);
    let message: string;
    if (recs.length === 0) {
      message = "I couldn't find a match in our range just now — try browsing the full collection.";
    } else if (relaxed && intent.maxPrice !== undefined) {
      message = `I couldn't find a perfect match${summary ? ` for ${summary}` : ""}, so here are the closest options:`;
    } else if (summary) {
      message = `Got it — ${summary}. Here ${recs.length === 1 ? "is one" : `are ${recs.length}`} I'd pour for you:`;
    } else {
      message = "Happy to help you choose. Here are a few favourites to start with:";
    }

    return { message, intent, recommendations: recs, disclaimer: RESPONSIBLE_DISCLAIMER };
  }
}
