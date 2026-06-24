import type { Metadata } from "next";
import { ProductListing, type ListingSearchParams } from "@/components/plp/product-listing";

export const metadata: Metadata = {
  title: "Shop all whisky",
  description: "Browse and filter the full WhiskyMart range by region, flavour and brand.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ListingSearchParams>;
}) {
  const sp = await searchParams;
  return (
    <>
      <div className="border-b border-whisky-100 bg-white">
        <div className="container-page py-8">
          <h1 className="font-display text-3xl text-charcoal">All whisky</h1>
          <p className="mt-2 max-w-2xl text-charcoal/60">
            Explore the full range. Filter by region, flavour and brand — or ask the Sommelier if
            you&apos;re not sure where to start.
          </p>
        </div>
      </div>
      <ProductListing searchParams={sp} />
    </>
  );
}
