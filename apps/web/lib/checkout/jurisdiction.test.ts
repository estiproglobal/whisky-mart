import { describe, expect, it } from "vitest";
import { evaluateJurisdiction, SHIPPABLE_COUNTRIES } from "./jurisdiction";

describe("evaluateJurisdiction", () => {
  it("allows the UK with VAT-inclusive pricing and age 18", () => {
    const d = evaluateJurisdiction("GB");
    expect(d.allowed).toBe(true);
    expect(d.ageMin).toBe(18);
    expect(d.vatInclusive).toBe(true);
    expect(d.taxRatePct).toBe(20);
  });

  it("is case-insensitive on the country code", () => {
    expect(evaluateJurisdiction("gb").allowed).toBe(true);
  });

  it("blocks the US (spirits DtC) with a reason and age 21", () => {
    const d = evaluateJurisdiction("US");
    expect(d.allowed).toBe(false);
    expect(d.ageMin).toBe(21);
    expect(d.reason).toBeTruthy();
    expect(d.alternative).toBeTruthy();
  });

  it("blocks unknown destinations", () => {
    const d = evaluateJurisdiction("ZZ");
    expect(d.allowed).toBe(false);
    expect(d.reason).toBeTruthy();
  });

  it("adds destination VAT for EU markets (not inclusive)", () => {
    const d = evaluateJurisdiction("DE");
    expect(d.allowed).toBe(true);
    expect(d.vatInclusive).toBe(false);
    expect(d.taxRatePct).toBe(19);
  });

  it("exposes a sorted list of shippable countries", () => {
    expect(SHIPPABLE_COUNTRIES.length).toBeGreaterThan(0);
    expect(SHIPPABLE_COUNTRIES.some((c) => c.code === "GB")).toBe(true);
  });
});
