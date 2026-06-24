import { describe, expect, it } from "vitest";
import { catalog } from "@/lib/catalog/repository";
import { content } from "@/lib/content/repository";
import { articleJsonLd, breadcrumbJsonLd, productJsonLd } from "./structured-data";

interface ProductLd {
  "@type": string;
  offers: { price: string; priceCurrency: string; availability: string };
  aggregateRating?: { reviewCount: number };
}
interface ArticleLd {
  "@type": string;
  headline: string;
  datePublished: string;
}
interface BreadcrumbLd {
  itemListElement: Array<{ position: number; name: string }>;
}

const lagavulin = (await catalog.getBySlug("lagavulin-16-year-old"))!;
const glassSet = (await catalog.getBySlug("glencairn-whisky-glass-set-of-2"))!;
const guide = (await content.getBySlug("best-whisky-under-50"))!;

describe("productJsonLd", () => {
  it("builds a Product with a priced Offer", () => {
    const data = productJsonLd(lagavulin) as unknown as ProductLd;
    expect(data["@type"]).toBe("Product");
    expect(data.offers.price).toBe("74.95");
    expect(data.offers.priceCurrency).toBe("GBP");
    expect(data.offers.availability).toMatch(/InStock/);
  });

  it("includes AggregateRating when the product has reviews", () => {
    const data = productJsonLd(lagavulin) as unknown as ProductLd;
    expect(data.aggregateRating?.reviewCount).toBe(lagavulin.ratingCount);
  });

  it("works for accessories (no whisky details)", () => {
    const data = productJsonLd(glassSet) as unknown as ProductLd;
    expect(data["@type"]).toBe("Product");
    expect(data.offers.price).toBe("16.00");
  });
});

describe("articleJsonLd", () => {
  it("builds an Article with headline and date", () => {
    const data = articleJsonLd(guide) as unknown as ArticleLd;
    expect(data["@type"]).toBe("Article");
    expect(data.headline).toBe(guide.title);
    expect(data.datePublished).toBe(guide.publishedAt);
  });
});

describe("breadcrumbJsonLd", () => {
  it("numbers items in order", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
    ]) as unknown as BreadcrumbLd;
    expect(data.itemListElement[0]!.position).toBe(1);
    expect(data.itemListElement[1]!.name).toBe("Guides");
  });
});
