import type { Metadata } from "next";
import { ProductListing, type ListingSearchParams } from "@/components/plp/product-listing";

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
      <div className="border-b border-whisky-100 bg-white">
        <div className="container-page py-8">
          <h1 className="font-display text-3xl text-charcoal">
            {query ? `Results for “${query}”` : "Search"}
          </h1>
        </div>
      </div>
      <ProductListing searchParams={sp} />
    </>
  );
}
