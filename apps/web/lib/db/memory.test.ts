import { describe, expect, it } from "vitest";
import type { Order } from "@whiskymart/types";
import { memoryOrders, memoryReviews } from "./memory";

function makeOrder(over: Partial<Order> = {}): Order {
  const money = (amount: number) => ({ amount, currency: "GBP" });
  return {
    id: crypto.randomUUID(),
    orderNumber: "WM-TEST-001",
    status: "paid",
    email: "buyer@example.com",
    shippingAddress: { fullName: "A B", line1: "1 St", line2: "", city: "London", postcode: "E1", country: "GB" },
    shipToCountry: "GB",
    items: [
      {
        productId: "p_ardbeg10",
        variantId: "v_ard10_70",
        title: "Ardbeg 10",
        sizeMl: 700,
        quantity: 1,
        unitPrice: money(5295),
        lineTotal: money(5295),
      },
    ],
    totals: {
      subtotal: money(5295),
      shipping: money(495),
      tax: money(965),
      duty: money(0),
      grandTotal: money(5790),
      vatInclusive: true,
    },
    shippingMethod: { id: "standard", label: "Standard", price: money(495), etaDays: "3–5 days" },
    ageConfirmed: true,
    placedAt: new Date().toISOString(),
    ...over,
  };
}

describe("memoryOrders", () => {
  it("creates and retrieves an order by id and email", async () => {
    const order = await memoryOrders.create(makeOrder({ email: "alice@example.com" }));
    expect(await memoryOrders.get(order.id)).toEqual(order);
    const list = await memoryOrders.listByEmail("ALICE@example.com"); // case-insensitive
    expect(list.some((o) => o.id === order.id)).toBe(true);
  });

  it("does not return another customer's orders", async () => {
    await memoryOrders.create(makeOrder({ email: "bob@example.com" }));
    const list = await memoryOrders.listByEmail("nobody@example.com");
    expect(list).toHaveLength(0);
  });
});

describe("memoryReviews", () => {
  it("creates a review and aggregates the summary", async () => {
    const pid = `p_test_${Math.random().toString(36).slice(2)}`;
    await memoryReviews.create({ productId: pid, author: "X", rating: 4, title: "Good", body: "Nice" }, false);
    await memoryReviews.create({ productId: pid, author: "Y", rating: 5, title: "Great", body: "Lovely" }, true);

    const list = await memoryReviews.listByProduct(pid);
    expect(list).toHaveLength(2);

    const summary = await memoryReviews.summary(pid);
    expect(summary.count).toBe(2);
    expect(summary.average).toBe(4.5);
  });

  it("flags verified purchases and returns zero summary for unknown products", async () => {
    const review = await memoryReviews.create(
      { productId: "p_only", author: "Z", rating: 5, title: "T", body: "B" },
      true,
    );
    expect(review.verifiedPurchase).toBe(true);
    expect(await memoryReviews.summary("p_never_reviewed")).toEqual({ average: 0, count: 0 });
  });
});
