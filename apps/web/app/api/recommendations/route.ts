import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { FLAVOUR_AXES } from "@whiskymart/types";
import { catalog } from "@/lib/catalog/repository";
import { recommend } from "@/lib/advisor/engine";
import type { AdvisorIntent } from "@/lib/advisor/types";

const Body = z.object({ flavours: z.array(z.enum(FLAVOUR_AXES)).default([]) });

/**
 * POST /api/recommendations — palate-based "recommended for you".
 * Grounded: returns real catalogue products via the shared recommendation engine.
 */
export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid palate." }, { status: 400 });
  }

  const products = await catalog.getAll();
  const intent: AdvisorIntent = {
    flavours: parsed.data.flavours,
    regions: [],
    beginner: false,
    gift: false,
    likeNames: [],
    rawQuery: "palate",
  };
  const recommendations = recommend(intent, products, { limit: 4 }).map((r) => ({
    product: r.product,
    reason: r.reason,
  }));

  return NextResponse.json({ recommendations });
}
