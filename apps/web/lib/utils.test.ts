import { describe, expect, it } from "vitest";
import { formatAge, formatMoney, formatVolume, formatRegion, formatCask } from "./utils";

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

describe("formatVolume", () => {
  it("renders millilitres as centilitres for whole values", () => {
    expect(formatVolume(700)).toBe("70cl");
    expect(formatVolume(30)).toBe("3cl");
    expect(formatVolume(120)).toBe("12cl");
  });

  it("falls back to millilitres for non-whole centilitres", () => {
    expect(formatVolume(75)).toBe("75ml");
  });

  it("returns an empty string for non-liquid items", () => {
    expect(formatVolume(0)).toBe("");
    expect(formatVolume(null)).toBe("");
    expect(formatVolume(undefined)).toBe("");
  });
});

describe("formatRegion", () => {
  it("capitalises region slugs", () => {
    expect(formatRegion("islay")).toBe("Islay");
    expect(formatRegion("speyside")).toBe("Speyside");
    expect(formatRegion("kentucky")).toBe("Kentucky");
    expect(formatRegion("")).toBe("");
    expect(formatRegion(null)).toBe("");
  });
});

describe("formatCask", () => {
  it("renders cask slugs as reader-friendly labels", () => {
    expect(formatCask("ex-bourbon")).toBe("Ex-bourbon cask");
    expect(formatCask("ex-sherry")).toBe("Ex-sherry cask");
    expect(formatCask("mizunara")).toBe("Mizunara oak");
    expect(formatCask("new-american-oak")).toBe("New American oak");
    expect(formatCask("port")).toBe("Port cask");
  });

  it("never returns a raw hyphenated slug for known casks", () => {
    for (const slug of ["ex-bourbon", "ex-sherry", "european-oak", "new-american-oak"]) {
      expect(formatCask(slug)).not.toBe(slug);
    }
    expect(formatCask("")).toBe("");
    expect(formatCask(null)).toBe("");
  });
});
