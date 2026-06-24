import { NextResponse, type NextRequest } from "next/server";
import { Address, type Order, type OrderItemSnapshot } from "@whiskymart/types";
import { resolveCartLines } from "@/lib/catalog/repository";
import { evaluateJurisdiction } from "@/lib/checkout/jurisdiction";
import { findShippingMethod } from "@/lib/checkout/shipping";
import { calculateTotals } from "@/lib/checkout/pricing";
import { getPaymentProvider } from "@/lib/checkout/payment";
import type { PayRequest, PayResponse } from "@/lib/checkout/contracts";

function fail(error: string, field?: string, status = 400) {
  return NextResponse.json<PayResponse>({ ok: false, error, field }, { status });
}

function generateOrderNumber(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `WM-${t}-${r}`;
}

/**
 * POST /api/checkout/pay — server-authoritative order placement.
 * Re-runs the jurisdiction + age + totals checks (never trusts the client),
 * charges via the payment provider, and returns the created order.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<PayRequest>;

  // 1) Basket
  const items = resolveCartLines(body.lines ?? []);
  if (items.length === 0) return fail("Your basket is empty.");

  // 2) Address
  const parsedAddress = Address.safeParse(body.address);
  if (!parsedAddress.success) return fail("Please complete your delivery address.", "address");
  const address = parsedAddress.data;

  // 3) Jurisdiction (server-authoritative)
  const decision = evaluateJurisdiction(address.country);
  if (!decision.allowed) return fail(decision.reason ?? "We can't ship to this destination.", "country");

  // 4) Age confirmation (compliance gate)
  if (!body.ageConfirmed) {
    return fail(`You must confirm you are ${decision.ageMin} or over.`, "age");
  }

  // 5) Email
  if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
    return fail("Please enter a valid email address.", "email");
  }

  // 6) Shipping + totals
  const currency = items[0]!.lineTotal.currency;
  const subtotal = items.reduce((sum, l) => sum + l.lineTotal.amount, 0);
  const method = findShippingMethod(subtotal, body.shippingMethodId ?? "", currency);
  if (!method) return fail("Please choose a delivery method.", "shipping");
  const totals = calculateTotals(items, decision, method);

  // 7) Payment
  if (!body.card) return fail("Please enter your payment details.", "card");
  const provider = getPaymentProvider();
  const result = await provider.pay({
    amount: totals.grandTotal.amount,
    currency,
    card: body.card,
    metadata: { country: decision.country },
  });
  if (!result.ok) return fail(result.error ?? "Payment failed.", "card", 402);

  // 8) Create order
  const orderItems: OrderItemSnapshot[] = items.map((l) => ({
    productId: l.productId,
    variantId: l.variantId,
    title: l.product.title,
    sizeMl: l.variant.sizeMl,
    quantity: l.quantity,
    unitPrice: l.variant.price,
    lineTotal: l.lineTotal,
  }));

  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(),
    status: "paid",
    email: body.email,
    shippingAddress: address,
    shipToCountry: decision.country,
    items: orderItems,
    totals,
    shippingMethod: method,
    ageConfirmed: true,
    placedAt: new Date().toISOString(),
  };

  // NOTE: orders are not yet persisted — Increment 4 wires Postgres/Medusa.
  return NextResponse.json<PayResponse>({ ok: true, order });
}
