import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog/repository";
import { content } from "@/lib/content/repository";

const SITE = "https://www.whiskymart.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([catalog.getAll(), content.list()]);

  const staticRoutes = ["", "/shop", "/guides", "/sommelier", "/gift-finder", "/c/bestsellers", "/c/samples"].map(
    (path) => ({ url: `${SITE}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 }),
  );

  const productRoutes = products.map((p) => ({
    url: `${SITE}/products/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${SITE}/guides/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
