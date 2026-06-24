import { NextResponse, type NextRequest } from "next/server";
import { resolveCartLines } from "@/lib/catalog/repository";
import { evaluateJurisdiction } from "@/lib/checkout/jurisdiction";
import { getShippingMethods, findShippingMethod } from "@/lib/checkout/shipping";
import { calculateTotals } from "@/lib/checkout/pricing";
import type { QuoteRequest, QuoteResponse } from "@/lib/checkout/contracts";

/**
 * POST /api/checkout/quote — jurisdiction decision + shipping options + totals.
 * The client uses this to show shipping/tax and to gate restricted destinations.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<QuoteRequest>;
  const lines = body.lines ?? [];
  const items = resolveCartLines(lines);

  if (items.length === 0) {
    return NextResponse.json({ error: "Your basket is empty." }, { status: 400 });
  }

  const currency = items[0]!.lineTotal.currency;
  const subtotal = items.reduce((sum, l) => sum + l.lineTotal.amount, 0);
  const shippingMethods = getShippingMethods(subtotal, currency);
  const decision = evaluateJurisdiction(body.country ?? "");

  if (!decision.allowed) {
    const res: QuoteResponse = { decision, shippingMethods, totals: null, currency };
    return NextResponse.json(res);
  }

  const method = findShippingMethod(subtotal, body.shippingMethodId ?? "standard", currency) ?? shippingMethods[0]!;
  const totals = calculateTotals(items, decision, method);

  const res: QuoteResponse = { decision, shippingMethods, totals, currency };
  return NextResponse.json(res);
}
