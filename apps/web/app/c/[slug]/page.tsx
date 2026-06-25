import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ProductFilter } from "@whiskymart/types";
import { ProductListing, type ListingSearchParams } from "@/components/plp/product-listing";
import { PageHero } from "@/components/ui/page-hero";

interface Collection {
  title: string;
  intro: string;
  base: ProductFilter;
}

/** Curated collections / category landing pages. */
const COLLECTIONS: Record<string, Collection> = {
  islay: { title: "Islay", intro: "Smoky, peaty and maritime — the malts of Scotland's whisky island.", base: { region: ["islay"] } },
  speyside: { title: "Speyside", intro: "Elegant, fruity and approachable — the heart of single malt.", base: { region: ["speyside"] } },
  highland: { title: "Highland", intro: "Diverse and characterful malts from Scotland's largest region.", base: { region: ["highland"] } },
  islands: { title: "Islands", intro: "Coastal malts with a maritime backbone.", base: { region: ["islands"] } },
  japan: { title: "Japanese Whisky", intro: "Delicate, precise and harmonious.", base: { region: ["japan"] } },
  ireland: { title: "Irish Whiskey", intro: "Smooth, triple-distilled and characterful.", base: { region: ["ireland"] } },
  bestsellers: { title: "Best sellers", intro: "The bottles our community reaches for most.", base: { badges: ["bestseller"] } },
  samples: { title: "Samples & flights", intro: "Try before you commit — 3cl samples and curated flights.", base: { type: ["sample"] } },
  beginners: { title: "Great for beginners", intro: "Approachable, easy-to-love whiskies to start your journey.", base: { tags: ["beginner"] } },
  peated: { title: "Peated whisky", intro: "For lovers of smoke and peat.", base: { flavour: ["peaty"] } },
  "under-50": { title: "Under £50", intro: "Outstanding whisky that won't break the bank.", base: { maxPrice: 5000 } },
  gifts: { title: "Gifts", intro: "Memorable whisky gifts for every occasion.", base: {} },
};

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];
  if (!collection) return { title: "Not found" };
  return { title: collection.title, description: collection.intro };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ListingSearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const collection = COLLECTIONS[slug];
  if (!collection) notFound();

  return (
    <>
      <PageHero eyebrow="Collection" title={collection.title} intro={collection.intro} />
      <ProductListing searchParams={sp} base={collection.base} />
    </>
  );
}
