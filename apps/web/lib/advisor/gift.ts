import { z } from "zod";
import { FLAVOUR_AXES } from "@whiskymart/types";
import { catalog } from "@/lib/catalog/repository";
import { recommend } from "./engine";
import { type AdvisorIntent, type AdvisorResponse, RESPONSIBLE_DISCLAIMER } from "./types";

export const GiftFinderInput = z.object({
  occasion: z.string().optional(),
  budgetMax: z.number().int().positive().optional(), // minor units
  taste: z.array(z.enum(FLAVOUR_AXES)).default([]),
  forBeginner: z.boolean().default(false),
});
export type GiftFinderInput = z.infer<typeof GiftFinderInput>;

/** Map structured gift inputs to an intent and return grounded recommendations. */
export async function giftFind(input: GiftFinderInput): Promise<AdvisorResponse> {
  const products = await catalog.getAll();

  const intent: AdvisorIntent = {
    flavours: input.taste,
    regions: [],
    maxPrice: input.budgetMax,
    beginner: input.forBeginner,
    gift: true,
    likeNames: [],
    rawQuery: `gift:${input.occasion ?? ""}`,
  };

  let recs = recommend(intent, products, { limit: 3, includeAccessories: true });
  if (recs.length === 0) {
    recs = recommend(intent, products, { limit: 3, includeAccessories: true, relaxPrice: true });
  }

  const occasion = input.occasion ? ` for ${input.occasion.toLowerCase()}` : "";
  const message =
    recs.length === 0
      ? "I couldn't find a gift match just now — browse our gift collection for ideas."
      : `Here ${recs.length === 1 ? "is a gift" : `are ${recs.length} gifts`}${occasion} they'll love:`;

  return { message, intent, recommendations: recs, disclaimer: RESPONSIBLE_DISCLAIMER };
}
