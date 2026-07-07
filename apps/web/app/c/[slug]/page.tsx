import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ProductFilter } from "@whiskymart/types";
import { ProductListing, type ListingSearchParams } from "@/components/plp/product-listing";
import { PageHero } from "@/components/ui/page-hero";
import { CollectionStory, type CollectionCopy } from "@/components/collection/collection-story";
import { catalog } from "@/lib/catalog/repository";
import { aggregateFlavour } from "@/lib/catalog/flavour";

interface Collection {
  title: string;
  /** One-line summary: used for the hero strapline and page metadata. */
  intro: string;
  /** Short editorial story (lead paragraph first). */
  story: string[];
  copy: CollectionCopy;
  /** Show the data-driven flavour signature (off for mixed, non-flavour sets). */
  signature: boolean;
  /** Atmosphere photo slot for the category header (lib/photo/manifest). */
  photoId: string;
  base: ProductFilter;
}

/** Collection landing pages. */
const COLLECTIONS: Record<string, Collection> = {
  islay: {
    title: "Islay",
    intro: "Peat smoke, sea air and no apologies.",
    story: [
      "Islay is a small island off Scotland's west coast with nine working distilleries and weather that gets into the whisky. Barley dried over peat fires gives the malts their smoke. The sea does the rest.",
      "The range is wider than its reputation suggests. At one end you get tar, iodine and bonfires; at the other, smoke folded into citrus and vanilla so gently you barely notice it arrive. Water helps. Patience helps more.",
    ],
    copy: {
      bestFor: "Drinkers who want intensity and a finish that outlasts the conversation.",
      collectorInterest: "High. Aged Islay statements and limited releases hold their value.",
      giftSuitability: "A confident gift for a known peat lover. For the curious, send a flight instead.",
    },
    signature: true,
    photoId: "islay-coast",
    base: { region: ["islay"] },
  },
  speyside: {
    title: "Speyside",
    intro: "Orchard fruit, honey and the gentlest way in.",
    story: [
      "More than half of Scotland's malt distilleries crowd along the River Spey. The house style is orchard fruit, honey and gentle oak. Sherry casks, where they're used, add dried fruit and spice underneath.",
      "It's the easiest place to start and a hard place to leave. Several of the most collected names in whisky sit within a few miles of each other here.",
    ],
    copy: {
      bestFor: "Newcomers, and anyone who prefers fruit and honey to smoke.",
      collectorInterest: "Very high. Many of the world's most sought-after distilleries are Speyside.",
      giftSuitability: "Hard to get wrong.",
    },
    signature: true,
    photoId: "casks",
    base: { region: ["speyside"] },
  },
  highland: {
    title: "Highland",
    intro: "Scotland's biggest region, and its least predictable.",
    story: [
      "The Highlands run from the coast to the glens, and the whisky runs with them. There is no single Highland style. A floral, citrus-led malt and a heathery, muscular one can come from distilleries fifty miles apart.",
      "That breadth is the point. Whatever you already like, some corner of the Highlands makes a version of it.",
    ],
    copy: {
      bestFor: "Explorers who want range, from light and floral to rich and full-bodied.",
      collectorInterest: "Strong. Several blue-chip names sit among the glens.",
      giftSuitability: "Versatile. A style here suits almost everyone.",
    },
    signature: true,
    photoId: "barley",
    base: { region: ["highland"] },
  },
  islands: {
    title: "Islands",
    intro: "Sea air, pepper and honey from Scotland's scattered isles.",
    story: [
      "Skye, Orkney, Arran, Mull and their neighbours make malts with salt on the breeze. The smoke is usually gentler than Islay's, and there's often honey and black pepper where you'd expect tar.",
      "Few distilleries, fierce loyalties. The island shelf is small and it does not stay in stock long.",
    ],
    copy: {
      bestFor: "Anyone who likes a little smoke and a lot of coast.",
      collectorInterest: "Solid. The distilleries are few and well loved.",
      giftSuitability: "Characterful without being a dare.",
    },
    signature: true,
    photoId: "islay-coast",
    base: { region: ["islands"] },
  },
  japan: {
    title: "Japanese Whisky",
    intro: "Balance over force, and scarcity to match.",
    story: [
      "Japanese whisky is built on blending. Malt and grain from a house's own distilleries are married for balance rather than force, sometimes finished in rare Mizunara oak, which leaves a trace of sandalwood you won't find anywhere else.",
      "Demand emptied the warehouses years ago. Aged stock is scarce, prices reflect it, and the best bottles still disappear quickly.",
    ],
    copy: {
      bestFor: "Drinkers who value finesse and subtlety.",
      collectorInterest: "Very high. Scarcity has made Japanese bottlings fiercely collected.",
      giftSuitability: "Refined and memorable.",
    },
    signature: true,
    photoId: "pour",
    base: { region: ["japan"] },
  },
  ireland: {
    title: "Irish Whiskey",
    intro: "Triple-distilled, creamy and underrated.",
    story: [
      "Irish whiskey is usually triple-distilled, which makes it rounder and softer in the mouth. The style to know is single pot still, made from malted and unmalted barley together. It tastes creamy and spicy at once, and nobody else makes it.",
      "It spent decades overlooked. That's changing, and the good bottles are still fairly priced.",
    ],
    copy: {
      bestFor: "Anyone who likes creamy spice and no smoke.",
      collectorInterest: "Rising. Single pot still releases are increasingly sought after.",
      giftSuitability: "Soft, welcoming and easy to love.",
    },
    signature: true,
    photoId: "still",
    base: { region: ["ireland"] },
  },
  bestsellers: {
    title: "Best sellers",
    intro: "The bottles we sell most, for good reason.",
    story: [
      "These are the bottles that leave the shop fastest. No theme connects them except that people finish them and buy them again.",
      "If you're not sure where to begin, begin here.",
    ],
    copy: {
      bestFor: "Anyone wanting a sure thing.",
      collectorInterest: "Mixed. These are chosen for drinking first, though a few collectible names sit among them.",
      giftSuitability: "Reliable at every budget.",
    },
    signature: true,
    photoId: "shelf",
    base: { badges: ["bestseller"] },
  },
  samples: {
    title: "Samples & flights",
    intro: "Taste it for the price of a dram, not a bottle.",
    story: [
      "A 3cl sample holds two honest pours. It's the cheapest way to find out whether a £70 bottle deserves your £70, and our flights group them so you can walk a region in an evening.",
      "Every sample is decanted from the same stock we sell; what you taste is what you'd pour.",
    ],
    copy: {
      bestFor: "Explorers, gift-buyers and anyone narrowing down a full bottle.",
      collectorInterest: "None. These are for drinking.",
      giftSuitability: "A tasting night in a box.",
    },
    signature: true,
    photoId: "tasting-table",
    base: { type: ["sample"] },
  },
  beginners: {
    title: "Great for beginners",
    intro: "Gentle first bottles with nothing to prove.",
    story: [
      "Whisky should be a pleasure from the first pour, so these bottles are forgiving. No aggressive smoke, no cask-strength heat, nothing that needs explaining or apologising for.",
      "Start gentle. The peat monsters will still be here when you're ready.",
    ],
    copy: {
      bestFor: "First bottles and building confidence.",
      collectorInterest: "Not the point. These are made to be opened.",
      giftSuitability: "The safest choice for someone new to whisky.",
    },
    signature: true,
    photoId: "glass-pair",
    base: { tags: ["beginner"] },
  },
  peated: {
    title: "Peated whisky",
    intro: "Smoke, from a wisp to a bonfire.",
    story: [
      "Peated whisky starts in the kiln, where smouldering peat dries the barley and leaves phenols behind. A light hand gives you a campfire wisp. A heavy one gives you tar, iodine and arguments at the dinner table.",
      "It isn't only an Islay habit. Peat turns up across Scotland and well beyond it, and this shelf collects the lot.",
    ],
    copy: {
      bestFor: "Confirmed smoke-seekers.",
      collectorInterest: "High. Heavily peated limited editions are keenly collected.",
      giftSuitability: "Only for someone who already loves smoke. Otherwise send a flight.",
    },
    signature: true,
    photoId: "islay-coast",
    base: { flavour: ["peaty"] },
  },
  "under-50": {
    title: "Under £50",
    intro: "The bottles we actually drink on a Tuesday.",
    story: [
      "Under £50 sits most of the whisky we drink ourselves. A gentle Speysider for weeknights, or a peppery coastal malt when the weather turns. None of it needs a special occasion.",
      "The best bottle is the one you'll open. These get opened.",
    ],
    copy: {
      bestFor: "Everyday drinking and dependable gifts.",
      collectorInterest: "Low. Bought to be enjoyed, not stored.",
      giftSuitability: "Generous without being reckless.",
    },
    signature: false,
    photoId: "shelf",
    base: { maxPrice: 5000 },
  },
  gifts: {
    title: "Gifts",
    intro: "The right bottle for the right person.",
    story: [
      "A good whisky gift is a bottle matched to its drinker, not the most expensive thing on the shelf. Tell us who it's for and the Gift Finder will shortlist honestly.",
      "When in doubt, give a flight. Letting someone find their own favourite is the most generous gift there is.",
    ],
    copy: {
      bestFor: "Every kind of recipient, from curious to committed.",
      collectorInterest: "Spans the range, from everyday bottles to limited editions.",
      giftSuitability: "That's the idea.",
    },
    signature: false,
    photoId: "cork",
    base: {},
  },
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

  // The editorial band describes the collection itself (its base filter), not
  // the shopper's refinements, so it stays stable as filters change.
  const { items } = await catalog.search(collection.base);
  const flavoured = items.filter((p) => p.flavour);
  const signature = collection.signature ? aggregateFlavour(items) : null;

  // "Start here" = the best-rated, in-stock, drinkable item in the collection.
  const startHere =
    [...items]
      .filter((p) => p.type !== "accessory" && p.variants.some((v) => v.inStock))
      .sort((a, b) => b.ratingAvg - a.ratingAvg)[0] ?? null;

  return (
    <>
      <PageHero title={collection.title} intro={collection.intro} photoId={collection.photoId} />
      <CollectionStory
        story={collection.story}
        copy={collection.copy}
        signature={signature}
        signatureCount={flavoured.length}
        startHere={startHere ? { title: startHere.title, slug: startHere.slug } : null}
      />
      <ProductListing searchParams={sp} base={collection.base} />
    </>
  );
}
