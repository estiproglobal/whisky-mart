import { describe, expect, it } from "vitest";
import {
  catalog,
  getPrimaryVariant,
  getProductsByIds,
  relevanceScore,
  resolveCartLines,
} from "./repository";

describe("catalog.search", () => {
  it("returns the full catalogue with no filter", async () => {
    const { items, total } = await catalog.search();
    expect(total).toBeGreaterThan(0);
    expect(items).toHaveLength(total);
  });

  it("filters by region", async () => {
    const { items } = await catalog.search({ region: ["islay"] });
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((p) => p.whisky?.region === "islay")).toBe(true);
  });

  it("filters by flavour axis (smoky)", async () => {
    const { items } = await catalog.search({ flavour: ["smoky"] });
    expect(items.every((p) => (p.flavour?.smoky ?? 0) >= 50)).toBe(true);
  });

  it("matches a free-text query across fields", async () => {
    const { items } = await catalog.search({ query: "lagavulin" });
    expect(items.some((p) => p.slug === "lagavulin-16-year-old")).toBe(true);
  });

  it("filters by product type", async () => {
    const { items } = await catalog.search({ type: ["sample"] });
    expect(items.every((p) => p.type === "sample")).toBe(true);
  });

  it("sorts by price ascending", async () => {
    const { items } = await catalog.search({}, "price_asc");
    const prices = items.map((p) => getPrimaryVariant(p).price.amount);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("builds facet counts that sum to the catalogue size by region", async () => {
    const { facets, total } = await catalog.search();
    const regionTotal = facets.region.reduce((s, f) => s + f.count, 0);
    // Accessories have no region, so region facet total is <= total.
    expect(regionTotal).toBeLessThanOrEqual(total);
    expect(regionTotal).toBeGreaterThan(0);
  });
});

describe("catalog.getRelated", () => {
  it("returns related products excluding the source", async () => {
    const related = await catalog.getRelated("lagavulin-16-year-old");
    expect(related.length).toBeGreaterThan(0);
    expect(related.some((p) => p.slug === "lagavulin-16-year-old")).toBe(false);
  });
});

describe("resolveCartLines", () => {
  it("resolves lines and computes line totals", () => {
    const resolved = resolveCartLines([
      { productId: "p_glencairn_glass", variantId: "v_glencairn_2", quantity: 2 },
    ]);
    expect(resolved).toHaveLength(1);
    expect(resolved[0]!.lineTotal.amount).toBe(3200); // 1600 × 2
  });

  it("drops unknown lines", () => {
    const resolved = resolveCartLines([
      { productId: "nope", variantId: "nope", quantity: 1 },
    ]);
    expect(resolved).toHaveLength(0);
  });
});

describe("getProductsByIds", () => {
  it("returns products preserving the requested order", () => {
    const products = getProductsByIds(["p_ardbeg10", "p_glenfiddich12"]);
    expect(products.map((p) => p.id)).toEqual(["p_ardbeg10", "p_glenfiddich12"]);
  });

  it("skips unknown ids", () => {
    const products = getProductsByIds(["nope", "p_talisker10"]);
    expect(products.map((p) => p.id)).toEqual(["p_talisker10"]);
  });
});

describe("relevanceScore", () => {
  it("ranks exact/prefix title matches above brand-only matches", async () => {
    const lagavulin = (await catalog.getBySlug("lagavulin-16-year-old"))!;
    const glenfiddich = (await catalog.getBySlug("glenfiddich-12-year-old"))!;
    expect(relevanceScore(lagavulin, "lagavulin")).toBeGreaterThan(
      relevanceScore(glenfiddich, "lagavulin"),
    );
  });

  it("returns 0 for an empty query", async () => {
    const p = (await catalog.getBySlug("ardbeg-10-year-old"))!;
    expect(relevanceScore(p, "")).toBe(0);
  });

  it("orders search results by relevance for a free-text query", async () => {
    const { items } = await catalog.search({ query: "ardbeg" }, "relevance");
    expect(items[0]!.slug).toBe("ardbeg-10-year-old");
  });
});
