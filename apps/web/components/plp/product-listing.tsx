import type { ProductFilter, ProductSort } from "@whiskymart/types";
import { catalog } from "@/lib/catalog/repository";
import { ProductCard } from "@/components/product-card";
import { FacetSidebar } from "./facet-sidebar";
import { SortSelect } from "./sort-select";

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
    <div className="container-page grid grid-cols-1 gap-8 py-8 lg:grid-cols-[260px_1fr]">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <FacetSidebar facets={facets} />
      </div>

      <div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-charcoal/60">
            {total} {total === 1 ? "result" : "results"}
          </p>
          <SortSelect value={sort} />
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card">
            <p className="font-display text-xl text-charcoal">No matches</p>
            <p className="mt-2 text-sm text-charcoal/60">
              Try removing a filter — or ask the WhiskyMart Sommelier to help you choose.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
