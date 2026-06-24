import { describe, expect, it } from "vitest";
import { MockPaymentProvider, validateCard, type CardInput } from "./payment";

const validCard: CardInput = { number: "4242424242424242", expMonth: 12, expYear: 2099, cvc: "123" };

describe("validateCard", () => {
  it("accepts a well-formed card", () => {
    expect(validateCard(validCard)).toBeNull();
  });

  it("rejects a short number", () => {
    expect(validateCard({ ...validCard, number: "1234" })).toMatch(/card number/i);
  });

  it("rejects an expired card", () => {
    expect(validateCard({ ...validCard, expYear: 2000 })).toMatch(/expired/i);
  });

  it("rejects a bad CVC", () => {
    expect(validateCard({ ...validCard, cvc: "1" })).toMatch(/cvc/i);
  });
});

describe("MockPaymentProvider", () => {
  const provider = new MockPaymentProvider();

  it("succeeds for a valid card", async () => {
    const res = await provider.pay({ amount: 4490, currency: "GBP", card: validCard });
    expect(res.ok).toBe(true);
    expect(res.status).toBe("succeeded");
    expect(res.intentId).toMatch(/^pi_mock_/);
  });

  it("declines a card ending 0002", async () => {
    const res = await provider.pay({
      amount: 4490,
      currency: "GBP",
      card: { ...validCard, number: "4000000000000002" },
    });
    expect(res.ok).toBe(false);
    expect(res.status).toBe("failed");
    expect(res.error).toMatch(/declined/i);
  });
});
