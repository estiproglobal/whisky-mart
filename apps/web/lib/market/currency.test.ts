import { describe, expect, it } from "vitest";
import {
  convertFromGbp,
  displayMoney,
  formatMoneyIn,
  isSupportedCurrency,
  staticRates,
  SUPPORTED_CURRENCIES,
} from "./currency";

const rates = staticRates.getRates();

describe("isSupportedCurrency", () => {
  it("accepts supported codes and rejects others", () => {
    expect(isSupportedCurrency("GBP")).toBe(true);
    expect(isSupportedCurrency("EUR")).toBe(true);
    expect(isSupportedCurrency("ZZZ")).toBe(false);
    expect(isSupportedCurrency(undefined)).toBe(false);
  });
});

describe("convertFromGbp", () => {
  it("returns the same amount for GBP", () => {
    expect(convertFromGbp(7495, "GBP", rates)).toBe(7495);
  });

  it("converts to EUR using the rate and rounds to minor units", () => {
    // 7495 * 1.18 = 8844.1 -> 8844
    expect(convertFromGbp(7495, "EUR", rates)).toBe(8844);
  });

  it("falls back to rate 1 for an unknown currency", () => {
    expect(convertFromGbp(1000, "ZZZ", rates)).toBe(1000);
  });
});

describe("formatMoneyIn", () => {
  it("formats GBP", () => {
    expect(formatMoneyIn(7495, "GBP")).toBe("£74.95");
  });

  it("formats USD", () => {
    expect(formatMoneyIn(1000, "USD")).toBe("$10.00");
  });
});

describe("displayMoney", () => {
  it("formats a GBP base amount in the selected currency", () => {
    expect(displayMoney({ amount: 1000, currency: "GBP" }, "GBP", rates)).toBe("£10.00");
    // 1000 * 1.27 = 1270 -> $12.70
    expect(displayMoney({ amount: 1000, currency: "GBP" }, "USD", rates)).toBe("$12.70");
  });
});

describe("SUPPORTED_CURRENCIES", () => {
  it("includes GBP and uses unique codes", () => {
    const codes = SUPPORTED_CURRENCIES.map((c) => c.code);
    expect(codes).toContain("GBP");
    expect(new Set(codes).size).toBe(codes.length);
  });
});
