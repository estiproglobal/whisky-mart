import type {
  CartLineDetailed,
  JurisdictionDecision,
  Money,
  OrderTotals,
  ShippingMethod,
} from "@whiskymart/types";

/**
 * Compute order totals, applying tax according to the jurisdiction decision.
 *
 * - `vatInclusive` markets (e.g. UK): the catalogue price already contains VAT,
 *   so we surface the VAT *component* for transparency and DON'T add it on top.
 * - other markets: destination VAT (+ any duty) is added on top of goods + shipping.
 */
export function calculateTotals(
  items: CartLineDetailed[],
  decision: JurisdictionDecision,
  shipping: ShippingMethod,
): OrderTotals {
  const currency = items[0]?.lineTotal.currency ?? "GBP";
  const m = (amount: number): Money => ({ amount, currency });

  const subtotal = items.reduce((sum, l) => sum + l.lineTotal.amount, 0);
  const shippingAmt = shipping.price.amount;

  let tax = 0;
  let duty = 0;
  let grandTotal: number;

  if (decision.vatInclusive) {
    // VAT already inside the price: tax = base * rate / (100 + rate).
    tax = Math.round(((subtotal + shippingAmt) * decision.taxRatePct) / (100 + decision.taxRatePct));
    grandTotal = subtotal + shippingAmt;
  } else {
    tax = Math.round(((subtotal + shippingAmt) * decision.taxRatePct) / 100);
    duty = Math.round((subtotal * decision.dutyRatePct) / 100);
    grandTotal = subtotal + shippingAmt + tax + duty;
  }

  return {
    subtotal: m(subtotal),
    shipping: m(shippingAmt),
    tax: m(tax),
    duty: m(duty),
    grandTotal: m(grandTotal),
    vatInclusive: decision.vatInclusive,
  };
}
