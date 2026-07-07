import { describe, expect, it } from "vitest";
import { Product } from "@whiskymart/types";
import { SEED_PRODUCTS } from "./seed";

const bottles = SEED_PRODUCTS.filter((p) => p.type === "bottle");
const price = (p: (typeof SEED_PRODUCTS)[number]) => p.variants[0]!.price.amount;

describe("seed catalogue integrity (Increment 12B, Part 3)", () => {
  it("every product parses against the domain schema", () => {
    for (const p of SEED_PRODUCTS) {
      expect(() => Product.parse(p), p.id).not.toThrow();
    }
  });

  it("ids, slugs and variant SKUs are unique", () => {
    const ids = SEED_PRODUCTS.map((p) => p.id);
    const slugs = SEED_PRODUCTS.map((p) => p.slug);
    const skus = SEED_PRODUCTS.flatMap((p) => p.variants.map((v) => v.sku));
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(skus).size).toBe(skus.length);
  });

  it("holds 45 to 55 SKUs with real stock depth", () => {
    expect(SEED_PRODUCTS.length).toBeGreaterThanOrEqual(45);
    expect(SEED_PRODUCTS.length).toBeLessThanOrEqual(55);
    expect(bottles.length).toBeGreaterThanOrEqual(35);
    expect(SEED_PRODUCTS.filter((p) => p.type === "sample").length).toBeGreaterThanOrEqual(3);
    expect(SEED_PRODUCTS.filter((p) => p.type === "accessory").length).toBeGreaterThanOrEqual(4);
  });

  it("covers every advertised region", () => {
    const regions = new Set(bottles.map((p) => p.whisky?.region));
    for (const r of [
      "islay",
      "speyside",
      "highland",
      "islands",
      "campbeltown",
      "lowland",
      "ireland",
      "japan",
      "kentucky",
    ]) {
      expect(regions.has(r as never), r).toBe(true);
    }
  });

  it("spreads across the price tiers, with collector anchors", () => {
    const entry = bottles.filter((p) => price(p) >= 2500 && price(p) <= 4500);
    const core = bottles.filter((p) => price(p) > 4500 && price(p) <= 9000);
    const premium = bottles.filter((p) => price(p) > 9000 && price(p) <= 25000);
    const collector = bottles.filter((p) => price(p) > 25000 && price(p) <= 150000);
    expect(entry.length).toBeGreaterThanOrEqual(8);
    expect(core.length).toBeGreaterThanOrEqual(10);
    expect(premium.length).toBeGreaterThanOrEqual(1);
    expect(collector.length).toBeGreaterThanOrEqual(4);
  });

  it("keeps whisky data plausible (ABV and age ranges)", () => {
    for (const p of bottles) {
      const w = p.whisky!;
      expect(w.abv, p.id).toBeGreaterThanOrEqual(40);
      expect(w.abv, p.id).toBeLessThanOrEqual(65);
      if (w.ageYears !== null && w.ageYears !== undefined) {
        expect(w.ageYears, p.id).toBeGreaterThanOrEqual(3);
        expect(w.ageYears, p.id).toBeLessThanOrEqual(50);
      }
    }
  });
});
