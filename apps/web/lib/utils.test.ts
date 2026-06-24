import { describe, expect, it } from "vitest";
import { formatAge, formatMoney } from "./utils";

describe("formatMoney", () => {
  it("formats GBP minor units as pounds", () => {
    expect(formatMoney({ amount: 7495, currency: "GBP" })).toBe("£74.95");
  });

  it("handles whole amounts", () => {
    expect(formatMoney({ amount: 1600, currency: "GBP" })).toBe("£16.00");
  });
});

describe("formatAge", () => {
  it("returns NAS for null age", () => {
    expect(formatAge(null)).toBe("NAS");
    expect(formatAge(undefined)).toBe("NAS");
  });

  it("pluralises correctly", () => {
    expect(formatAge(12)).toBe("12 Years");
    expect(formatAge(1)).toBe("1 Year");
  });
});
