import type { FlavourAxis, Product, WhiskyRegion } from "@whiskymart/types";

/** Structured intent parsed from a natural-language query (or gift inputs). */
export interface AdvisorIntent {
  flavours: FlavourAxis[];
  regions: WhiskyRegion[];
  maxPrice?: number; // minor units
  minPrice?: number; // minor units
  beginner: boolean;
  gift: boolean;
  likeNames: string[]; // brands/distilleries the user referenced ("like Lagavulin")
  rawQuery: string;
}

export interface Recommendation {
  product: Product;
  reason: string;
  score: number;
}

export interface AdvisorResponse {
  message: string;
  intent: AdvisorIntent;
  recommendations: Recommendation[];
  disclaimer: string;
}

/**
 * The Sommelier abstraction. The grounded mock is used today; a Claude-backed
 * implementation swaps in behind this interface when ANTHROPIC_API_KEY is set
 * (see DEFERRED.md). Callers (API routes, UI) depend only on this.
 */
export interface Advisor {
  readonly name: string;
  ask(query: string): Promise<AdvisorResponse>;
}

export const RESPONSIBLE_DISCLAIMER =
  "WhiskyMart recommends savouring whisky responsibly. You must be 18 or over to purchase.";
