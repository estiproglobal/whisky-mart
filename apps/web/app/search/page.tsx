import type { Metadata } from "next";
import { ProductListing, type ListingSearchParams } from "@/components/plp/product-listing";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<ListingSearchParams>;
}) {
  const sp = await searchParams;
  const query = sp.q ?? "";
  return (
    <>
      <PageHero
        eyebrow="Search"
        title={query ? `Results for “${query}”` : "Search the cellar"}
      />
      <ProductListing searchParams={sp} />
    </>
  );
}
