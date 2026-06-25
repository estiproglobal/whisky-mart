import type { ProductFilter, ProductSort } from "@whiskymart/types";
import { catalog } from "@/lib/catalog/repository";
import { ProductCard } from "@/components/product-card";
import { FacetSidebar } from "./facet-sidebar";
import { SortSelect } from "./sort-select";
import { ActiveFilters } from "./active-filters";

export interface ListingSearchParams {
  region?: string;
  flavour?: string;
  brand?: string;
  sort?: string;
  q?: string;
}

const SORTS: ProductSort[] = ["relevance", "price_asc", "price_desc", "rating", "age", "newest"];

function parseSort(value: string | undefined): ProductSort {
  return SORTS.includes(value as ProductSort) ? (value as ProductSort) : "relevance";
}

/**
 * Server component that powers PLP, category, and search pages. `base` lets a
 * category page pre-apply a filter (e.g. region) that the shopper can refine.
 */
export async function ProductListing({
  searchParams,
  base = {},
}: {
  searchParams: ListingSearchParams;
  base?: ProductFilter;
}) {
  const csv = (v: string | undefined) => (v ? v.split(",").filter(Boolean) : undefined);
  const sort = parseSort(searchParams.sort);

  const filter: ProductFilter = {
    ...base,
    region: (csv(searchParams.region) as ProductFilter["region"]) ?? base.region,
    flavour: (csv(searchParams.flavour) as ProductFilter["flavour"]) ?? base.flavour,
    brand: csv(searchParams.brand) ?? base.brand,
    query: searchParams.q ?? base.query,
  };

  const { items, total, facets } = await catalog.search(filter, sort);

  return (
    <div className="container-page grid grid-cols-1 gap-10 py-12 sm:py-14 lg:grid-cols-[270px_1fr]">
      <aside className="lg:sticky lg:top-40 lg:self-start">
        <div className="rounded-2xl border border-gold/20 bg-ivory p-6">
          <FacetSidebar facets={facets} />
        </div>
      </aside>

      <div>
        <div className="mb-5 flex items-center justify-between border-b border-gold/15 pb-4">
          <p className="text-sm tracking-wide text-charcoal/60">
            <span className="font-medium text-charcoal">{total}</span> {total === 1 ? "bottle" : "bottles"}
          </p>
          <SortSelect value={sort} />
        </div>

        <ActiveFilters />

        {items.length === 0 ? (
          <div className="rounded-2xl border border-gold/20 bg-ivory p-12 text-center">
            <p className="font-display text-2xl text-charcoal">Nothing on this shelf</p>
            <p className="mt-2 text-sm text-charcoal/60">
              Try removing a filter — or ask the WhiskyMart Sommelier to help you choose.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
