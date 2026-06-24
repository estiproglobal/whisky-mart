import { describe, expect, it } from "vitest";
import { resolveCartLines } from "@/lib/catalog/repository";
import { evaluateJurisdiction } from "./jurisdiction";
import { findShippingMethod } from "./shipping";
import { calculateTotals } from "./pricing";

// Glenfiddich 12 (v_gf12_70) is £39.95 = 3995 minor units.
const lines = [{ productId: "p_glenfiddich12", variantId: "v_gf12_70", quantity: 1 }];

describe("calculateTotals", () => {
  it("treats UK VAT as inclusive (not added on top)", () => {
    const items = resolveCartLines(lines);
    const decision = evaluateJurisdiction("GB");
    const shipping = findShippingMethod(3995, "standard")!;
    const totals = calculateTotals(items, decision, shipping);

    expect(totals.subtotal.amount).toBe(3995);
    expect(totals.shipping.amount).toBe(495); // under the £100 free threshold
    // grand total = goods + shipping (VAT already inside)
    expect(totals.grandTotal.amount).toBe(4490);
    // VAT component = 4490 * 20 / 120
    expect(totals.tax.amount).toBe(748);
    expect(totals.vatInclusive).toBe(true);
  });

  it("adds destination VAT for EU markets", () => {
    const items = resolveCartLines(lines);
    const decision = evaluateJurisdiction("DE");
    const shipping = findShippingMethod(3995, "standard")!;
    const totals = calculateTotals(items, decision, shipping);

    expect(totals.tax.amount).toBe(853); // (3995 + 495) * 19%
    expect(totals.grandTotal.amount).toBe(5343); // goods + shipping + tax
    expect(totals.vatInclusive).toBe(false);
  });

  it("gives free standard shipping over £100", () => {
    const method = findShippingMethod(12000, "standard")!;
    expect(method.price.amount).toBe(0);
  });
});
