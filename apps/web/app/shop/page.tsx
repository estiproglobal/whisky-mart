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
        eyebrow="The catalogue"
        title="The whisky archive"
        intro="Explore the full collection — filter by region, flavour and house, or ask the Sommelier if you're not sure where to begin."
      />
      <ProductListing searchParams={sp} />
    </>
  );
}
