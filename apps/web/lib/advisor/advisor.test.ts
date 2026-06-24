import { describe, expect, it } from "vitest";
import { catalog, getPrimaryVariant } from "@/lib/catalog/repository";
import { parseQuery } from "./parse";
import { recommend } from "./engine";
import { getAdvisor } from "./index";
import { giftFind } from "./gift";

const products = await catalog.getAll();
const ids = new Set(products.map((p) => p.id));

describe("recommend (engine)", () => {
  it("ranks a smoky request toward smoky whiskies", () => {
    const recs = recommend(parseQuery("something really smoky"), products, { limit: 3 });
    expect(recs.length).toBeGreaterThan(0);
    expect((recs[0]!.product.flavour?.smoky ?? 0)).toBeGreaterThanOrEqual(60);
  });

  it("never exceeds a max price", () => {
    const recs = recommend(parseQuery("a whisky under £40"), products, { limit: 5 });
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) expect(getPrimaryVariant(r.product).price.amount).toBeLessThanOrEqual(4000);
  });

  it("respects a region filter", () => {
    const recs = recommend(parseQuery("a speyside malt"), products, { limit: 5 });
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) expect(r.product.whisky?.region).toBe("speyside");
  });

  it("excludes accessories unless requested", () => {
    const recs = recommend(parseQuery("any whisky"), products, { limit: 20 });
    expect(recs.every((r) => r.product.type !== "accessory")).toBe(true);
  });

  it("only ever returns real catalogue products (grounded)", () => {
    const recs = recommend(parseQuery("smoky and sweet under £100"), products, { limit: 5 });
    for (const r of recs) expect(ids.has(r.product.id)).toBe(true);
  });
});

describe("getAdvisor().ask (grounded mock)", () => {
  it("returns grounded recommendations within budget", async () => {
    const res = await getAdvisor().ask("a smoky whisky under £100");
    expect(res.recommendations.length).toBeGreaterThan(0);
    for (const r of res.recommendations) {
      expect(ids.has(r.product.id)).toBe(true);
      expect(getPrimaryVariant(r.product).price.amount).toBeLessThanOrEqual(10000);
    }
    expect(res.disclaimer).toMatch(/responsibl/i);
  });

  it("falls back gracefully when nothing fits the budget", async () => {
    const res = await getAdvisor().ask("a whisky under £5");
    // relax path still returns real options rather than dead-ending
    expect(res.recommendations.length).toBeGreaterThan(0);
  });
});

describe("giftFind", () => {
  it("returns gift recommendations within budget", async () => {
    const res = await giftFind({ occasion: "Birthday", budgetMax: 6000, taste: ["sweet"], forBeginner: true });
    expect(res.recommendations.length).toBeGreaterThan(0);
    for (const r of res.recommendations) {
      expect(getPrimaryVariant(r.product).price.amount).toBeLessThanOrEqual(6000);
    }
  });
});
