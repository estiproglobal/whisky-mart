import type { Product } from "@whiskymart/types";
import { catalog } from "@/lib/catalog/repository";

/**
 * Homepage act data (see docs/12b-design-plan.md §5). One featured bottle,
 * one shelf; a product appears at most once per page, so the shelf query
 * always excludes the featured bottle.
 */

/** Act two: the bottle told as a story this month. */
export const FEATURED_PRODUCT_ID = "p_lagavulin16";

/** The Sommelier act's worked exchange recommends this bottle. */
export const SOMMELIER_EXCHANGE_PRODUCT_ID = "p_talisker10";

export async function getFeaturedProduct(): Promise<Product | undefined> {
  const all = await catalog.getAll();
  return all.find((p) => p.id === FEATURED_PRODUCT_ID);
}

/** Act three: one rail, six bottles, no overlap with the featured bottle.
    Capped at core-range prices so the collector tier doesn't crowd out the
    bottles the shop actually pours; the £250+ shelf lives on the PLP and
    anchors the /vision collectors' chapter instead. */
const SHELF_MAX_PRICE = 9000;

export async function getShelf(count = 6): Promise<Product[]> {
  const all = await catalog.getAll();
  return all
    .filter(
      (p) =>
        p.type === "bottle" &&
        p.id !== FEATURED_PRODUCT_ID &&
        p.variants.some((v) => v.inStock && v.sizeMl >= 500 && v.price.amount <= SHELF_MAX_PRICE),
    )
    .sort((a, b) => b.ratingAvg - a.ratingAvg)
    .slice(0, count);
}

export async function getExchangeProduct(): Promise<Product | undefined> {
  const all = await catalog.getAll();
  return all.find((p) => p.id === SOMMELIER_EXCHANGE_PRODUCT_ID);
}
