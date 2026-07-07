import type { Metadata } from "next";
import { ProductListing, type ListingSearchParams } from "@/components/plp/product-listing";
import { PageHero } from "@/components/ui/page-hero";

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
      <PageHero
        title="All whisky"
        photoId="shelf"
        intro="The whole shelf, filterable by region, flavour and house. If you'd rather be told, ask the Sommelier."
      />
      <ProductListing searchParams={sp} />
    </>
  );
}
