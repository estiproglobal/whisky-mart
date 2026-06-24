import {
  FLAVOUR_AXES,
  type CartLine,
  type CartLineDetailed,
  type FacetCount,
  type FlavourAxis,
  type Money,
  type Product,
  type ProductFilter,
  type ProductSearchResult,
  type ProductSort,
  type Variant,
} from "@whiskymart/types";
import { SEED_PRODUCTS } from "./seed";

/**
 * CatalogRepository — the single seam between the UI and the product data
 * source. The in-memory implementation below reads from the seed catalogue;
 * a later increment swaps it for Medusa / an API without changing callers.
 */
export interface CatalogRepository {
  getAll(): Promise<Product[]>;
  getBySlug(slug: string): Promise<Product | null>;
  getRelated(slug: string, limit?: number): Promise<Product[]>;
  search(filter?: ProductFilter, sort?: ProductSort): Promise<ProductSearchResult>;
}

/** The representative variant for display/pricing (largest size, else first). */
export function getPrimaryVariant(product: Product): Variant {
  return [...product.variants].sort((a, b) => b.sizeMl - a.sizeMl)[0] ?? product.variants[0]!;
}

/**
 * Resolve client-held cart lines (product/variant ids) into full detail.
 * Sync + seed-backed for now; becomes an API call in a later increment.
 */
export function resolveCartLines(lines: CartLine[]): CartLineDetailed[] {
  const out: CartLineDetailed[] = [];
  for (const line of lines) {
    const product = SEED_PRODUCTS.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant) continue;
    const lineTotal: Money = {
      amount: variant.price.amount * line.quantity,
      currency: variant.price.currency,
    };
    out.push({ ...line, product, variant, lineTotal });
  }
  return out;
}

const FLAVOUR_THRESHOLD = 50; // a product "is smoky" if smoky >= 50

function hasFlavour(product: Product, axis: FlavourAxis): boolean {
  return (product.flavour?.[axis] ?? 0) >= FLAVOUR_THRESHOLD;
}

function matchesQuery(product: Product, query: string): boolean {
  const haystack = [
    product.title,
    product.brand.name,
    product.distillery?.name ?? "",
    product.description,
    ...product.flavourTags,
    product.whisky?.region ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function applyFilter(product: Product, filter: ProductFilter): boolean {
  const price = getPrimaryVariant(product).price.amount;

  if (filter.query && !matchesQuery(product, filter.query)) return false;
  if (filter.type?.length && !filter.type.includes(product.type)) return false;
  if (filter.region?.length && !filter.region.includes(product.whisky?.region as never)) return false;
  if (filter.flavour?.length && !filter.flavour.some((axis) => hasFlavour(product, axis))) return false;
  if (filter.tags?.length && !filter.tags.some((t) => product.flavourTags.includes(t))) return false;
  if (filter.brand?.length && !filter.brand.includes(product.brand.slug)) return false;
  if (filter.badges?.length && !filter.badges.some((b) => product.badges.includes(b as never))) return false;
  if (filter.minPrice !== undefined && price < filter.minPrice) return false;
  if (filter.maxPrice !== undefined && price > filter.maxPrice) return false;
  if (filter.minAge !== undefined && (product.whisky?.ageYears ?? -1) < filter.minAge) return false;
  if (filter.maxAge !== undefined && (product.whisky?.ageYears ?? Infinity) > filter.maxAge) return false;
  if (filter.inStockOnly && !product.variants.some((v) => v.inStock)) return false;

  return true;
}

function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const out = [...products];
  switch (sort) {
    case "price_asc":
      return out.sort((a, b) => getPrimaryVariant(a).price.amount - getPrimaryVariant(b).price.amount);
    case "price_desc":
      return out.sort((a, b) => getPrimaryVariant(b).price.amount - getPrimaryVariant(a).price.amount);
    case "rating":
      return out.sort((a, b) => b.ratingAvg - a.ratingAvg);
    case "age":
      return out.sort((a, b) => (b.whisky?.ageYears ?? -1) - (a.whisky?.ageYears ?? -1));
    case "newest":
      return out.sort(
        (a, b) => Number(b.badges.includes("new")) - Number(a.badges.includes("new")),
      );
    case "relevance":
    default:
      return out;
  }
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function buildFacets(products: Product[]): ProductSearchResult["facets"] {
  const region = new Map<string, number>();
  const brand = new Map<string, number>();
  const flavour = new Map<string, number>();

  for (const p of products) {
    if (p.whisky?.region) region.set(p.whisky.region, (region.get(p.whisky.region) ?? 0) + 1);
    brand.set(p.brand.slug, (brand.get(p.brand.slug) ?? 0) + 1);
    for (const axis of FLAVOUR_AXES) {
      if (hasFlavour(p, axis)) flavour.set(axis, (flavour.get(axis) ?? 0) + 1);
    }
  }

  const toFacet = (m: Map<string, number>, label: (k: string) => string): FacetCount[] =>
    [...m.entries()]
      .map(([value, count]) => ({ value, label: label(value), count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const brandName = new Map(products.map((p) => [p.brand.slug, p.brand.name]));

  return {
    region: toFacet(region, titleCase),
    flavour: toFacet(flavour, titleCase),
    brand: toFacet(brand, (slug) => brandName.get(slug) ?? slug),
  };
}

/** In-memory implementation backed by the seed catalogue. */
export const catalog: CatalogRepository = {
  async getAll() {
    return SEED_PRODUCTS;
  },

  async getBySlug(slug) {
    return SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
  },

  async getRelated(slug, limit = 4) {
    const product = SEED_PRODUCTS.find((p) => p.slug === slug);
    if (!product) return [];
    const region = product.whisky?.region;
    return SEED_PRODUCTS.filter((p) => p.slug !== slug)
      .map((p) => ({
        p,
        score:
          (p.whisky?.region && p.whisky.region === region ? 2 : 0) +
          p.flavourTags.filter((t) => product.flavourTags.includes(t)).length,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.p);
  },

  async search(filter = {}, sort = "relevance") {
    // Facets are computed over the query-matched set so counts stay stable as
    // the shopper toggles individual facets.
    const queryMatched = SEED_PRODUCTS.filter((p) =>
      filter.query ? matchesQuery(p, filter.query) : true,
    );
    const filtered = queryMatched.filter((p) => applyFilter(p, filter));
    const items = sortProducts(filtered, sort);

    return {
      items,
      total: items.length,
      facets: buildFacets(queryMatched),
    };
  },
};
