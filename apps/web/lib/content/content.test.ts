import { describe, expect, it } from "vitest";
import { content, readingMinutes, referencedProductIds } from "./repository";

describe("ContentRepository", () => {
  it("lists articles newest-first", async () => {
    const list = await content.list();
    expect(list.length).toBeGreaterThan(0);
    for (let i = 1; i < list.length; i++) {
      expect(list[i - 1]!.publishedAt >= list[i]!.publishedAt).toBe(true);
    }
  });

  it("filters by type", async () => {
    const guides = await content.list("guide");
    expect(guides.length).toBeGreaterThan(0);
    expect(guides.every((a) => a.type === "guide")).toBe(true);
  });

  it("gets an article by slug", async () => {
    const a = await content.getBySlug("best-whisky-under-50");
    expect(a?.title).toMatch(/under £50/i);
  });

  it("finds articles by a related product", async () => {
    const a = await content.byProduct("p_lagavulin16");
    expect(a.some((x) => x.slug === "islay-whisky-explained")).toBe(true);
  });

  it("finds articles that embed a product (not just related)", async () => {
    // Talisker is embedded in the under-£50 guide's products block.
    const a = await content.byProduct("p_talisker10");
    expect(a.some((x) => x.slug === "best-whisky-under-50")).toBe(true);
  });

  it("computes reading time and referenced products", async () => {
    const a = (await content.getBySlug("best-whisky-under-50"))!;
    expect(readingMinutes(a)).toBeGreaterThan(0);
    const ids = referencedProductIds(a);
    expect(ids).toContain("p_glenfiddich12");
    expect(ids).toContain("p_islay_flight");
  });
});
