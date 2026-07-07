import { describe, expect, it } from "vitest";
import { FEATURED_PRODUCT_ID, getFeaturedProduct, getShelf } from "./home";

describe("homepage acts", () => {
  it("resolves the featured bottle", async () => {
    const featured = await getFeaturedProduct();
    expect(featured?.id).toBe(FEATURED_PRODUCT_ID);
  });

  it("fills one shelf of six bottles with no duplicates and no featured overlap", async () => {
    const shelf = await getShelf(6);
    expect(shelf).toHaveLength(6);
    const ids = shelf.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain(FEATURED_PRODUCT_ID);
    for (const p of shelf) expect(p.type).toBe("bottle");
  });
});
