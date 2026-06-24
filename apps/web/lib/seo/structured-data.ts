import type { Article, Product } from "@whiskymart/types";
import { getPrimaryVariant } from "@/lib/catalog/repository";

const SITE = "https://www.whiskymart.com";

/** schema.org Product + Offer (+ AggregateRating) for a PDP. */
export function productJsonLd(product: Product) {
  const variant = getPrimaryVariant(product);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: variant.sku,
    brand: { "@type": "Brand", name: product.brand.name },
    url: `${SITE}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: variant.price.currency,
      price: (variant.price.amount / 100).toFixed(2),
      availability: variant.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE}/products/${product.slug}`,
    },
  };
  if (product.ratingCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingAvg,
      reviewCount: product.ratingCount,
    };
  }
  return data;
}

/** schema.org Article for a content/guide page. */
export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": article.type === "guide" ? "Article" : "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "WhiskyMart" },
    url: `${SITE}/guides/${article.slug}`,
    keywords: article.tags.join(", "),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  };
}
