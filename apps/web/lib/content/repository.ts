import type { Article, ArticleType, ContentBlock } from "@whiskymart/types";
import { SEED_ARTICLES } from "./seed";

/**
 * ContentRepository — the seam between the UI and editorial content. In-memory
 * over the seed today; swaps to Sanity later with no caller changes (see
 * DEFERRED.md).
 */
export interface ContentRepository {
  list(type?: ArticleType): Promise<Article[]>;
  getBySlug(slug: string): Promise<Article | null>;
  featured(limit?: number): Promise<Article[]>;
  byProduct(productId: string): Promise<Article[]>;
}

const byNewest = (a: Article, b: Article) => b.publishedAt.localeCompare(a.publishedAt);

function referencesProduct(article: Article, productId: string): boolean {
  if (article.relatedProductIds.includes(productId)) return true;
  return article.body.some((b) => b.kind === "products" && b.productIds.includes(productId));
}

export const content: ContentRepository = {
  async list(type) {
    return SEED_ARTICLES.filter((a) => (type ? a.type === type : true)).sort(byNewest);
  },
  async getBySlug(slug) {
    return SEED_ARTICLES.find((a) => a.slug === slug) ?? null;
  },
  async featured(limit = 3) {
    return [...SEED_ARTICLES].sort(byNewest).slice(0, limit);
  },
  async byProduct(productId) {
    return SEED_ARTICLES.filter((a) => referencesProduct(a, productId)).sort(byNewest);
  },
};

/** Estimated reading time in minutes from an article's text blocks. */
export function readingMinutes(article: Article): number {
  const words = article.body.reduce((n, block: ContentBlock) => {
    if (block.kind === "paragraph" || block.kind === "heading" || block.kind === "quote") {
      return n + block.text.split(/\s+/).filter(Boolean).length;
    }
    return n;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

/** All product ids referenced anywhere in an article (related + embedded). */
export function referencedProductIds(article: Article): string[] {
  const ids = new Set<string>(article.relatedProductIds);
  for (const block of article.body) {
    if (block.kind === "products") block.productIds.forEach((id) => ids.add(id));
  }
  return [...ids];
}
