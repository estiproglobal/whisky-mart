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
  eyebrow: string;
  /** One-line summary — used for the hero strapline and page metadata. */
  intro: string;
  /** Short editorial story (lead paragraph first). */
  story: string[];
  copy: CollectionCopy;
  /** Show the data-driven flavour signature (off for mixed, non-flavour sets). */
  signature: boolean;
  base: ProductFilter;
}

/** Curated collections / category landing pages. */
const COLLECTIONS: Record<string, Collection> = {
  islay: {
    title: "Islay",
    eyebrow: "Region",
    intro: "Smoky, peaty and maritime — the malts of Scotland's whisky island.",
    story: [
      "Islay is a small, wind-scoured island off Scotland's west coast whose malts are unlike anywhere else — peat smoke drawn from the land itself, sea-spray and brine, and a depth that has made the island a place of pilgrimage for collectors.",
      "Barley dried over peat fires carries phenols measured in ppm, and the result ranges from medicinal and tarry to sweet and coastal. These are not quiet drams: an Islay malt rewards patience and a little water, opening from smoke into citrus, vanilla and a long, maritime finish.",
    ],
    copy: {
      bestFor: "Drinkers who want intensity — smoke, brine and a finish that lingers.",
      collectorInterest: "High. Distillery age statements and limited Islay releases hold their value keenly.",
      giftSuitability: "A confident gift for an established peat lover — pair with a flight for the curious.",
    },
    signature: true,
    base: { region: ["islay"] },
  },
  speyside: {
    title: "Speyside",
    eyebrow: "Region",
    intro: "Elegant, fruity and approachable — the heart of single malt.",
    story: [
      "Speyside is the heart of single malt — more distilleries than any other Scottish region, gathered along the River Spey. The house style is elegance: orchard fruit, honey, gentle oak and, where sherry casks are used, a deeper seam of dried fruit and spice.",
      "It is the most welcoming doorway into whisky and, at the same time, home to some of the most collected names in the world — refined enough for the connoisseur, generous enough for a first dram.",
    ],
    copy: {
      bestFor: "Newcomers and anyone who prefers fruit and honey to smoke.",
      collectorInterest: "Very high — Speyside holds many of the most sought-after distilleries.",
      giftSuitability: "Excellent. Polished, crowd-pleasing and hard to get wrong.",
    },
    signature: true,
    base: { region: ["speyside"] },
  },
  highland: {
    title: "Highland",
    eyebrow: "Region",
    intro: "Diverse and characterful malts from Scotland's largest region.",
    story: [
      "The Highlands are Scotland's largest whisky region, and its most varied — there is no single Highland style, only a vast geography running from delicate, floral coastal malts to robust, heathery drams from the glens.",
      "That breadth is the appeal: whatever you love in a whisky, the Highlands hold a version of it. A region to explore slowly.",
    ],
    copy: {
      bestFor: "Explorers who want range — from light and floral to rich and full-bodied.",
      collectorInterest: "Strong, with several blue-chip distilleries among the glens.",
      giftSuitability: "Versatile and safe — a style here suits almost everyone.",
    },
    signature: true,
    base: { region: ["highland"] },
  },
  islands: {
    title: "Islands",
    eyebrow: "Region",
    intro: "Coastal malts with a maritime backbone.",
    story: [
      "Beyond Islay, Scotland's islands — Skye, Orkney, Arran, Mull and more — produce malts with a maritime backbone: smoke tempered by sea air, pepper, honey and salt.",
      "Coastal and characterful, the island malts sit between Highland elegance and Islay intensity.",
    ],
    copy: {
      bestFor: "Those who like a little smoke and a lot of sea air.",
      collectorInterest: "Solid — the island distilleries are few and fiercely loved.",
      giftSuitability: "A characterful gift with broad appeal.",
    },
    signature: true,
    base: { region: ["islands"] },
  },
  japan: {
    title: "Japanese Whisky",
    eyebrow: "Region",
    intro: "Delicate, precise and harmonious.",
    story: [
      "Japanese whisky has gone from niche to coveted in barely a decade, prized for a style all its own: delicate, precise and harmonious, built on the pursuit of balance over force.",
      "Master blenders marry malt and grain — sometimes finished in rare Mizunara oak — for a subtle, floral complexity that has swept global awards.",
    ],
    copy: {
      bestFor: "Drinkers who value finesse, balance and subtlety.",
      collectorInterest: "Exceptional — scarcity has made Japanese bottlings among the most collected in the world.",
      giftSuitability: "A refined, memorable gift.",
    },
    signature: true,
    base: { region: ["japan"] },
  },
  ireland: {
    title: "Irish Whiskey",
    eyebrow: "Region",
    intro: "Smooth, triple-distilled and characterful.",
    story: [
      "Irish whiskey is traditionally triple-distilled for a smooth, rounded character — and at its most distinctive in the single pot still style, where malted and unmalted barley give a creamy, spicy complexity found nowhere else.",
      "Approachable yet deep, it is one of whisky's most rewarding and under-explored corners.",
    ],
    copy: {
      bestFor: "Anyone who likes smooth, creamy spice without smoke.",
      collectorInterest: "Rising — single pot still releases are increasingly sought after.",
      giftSuitability: "Smooth and welcoming — an easy gift to love.",
    },
    signature: true,
    base: { region: ["ireland"] },
  },
  bestsellers: {
    title: "Best sellers",
    eyebrow: "Collection",
    intro: "The bottles our cabinet reaches for most.",
    story: [
      "The bottles our cabinet reaches for most — a cross-section of styles that have earned their place through balance, value and sheer drinkability.",
      "If you are not sure where to begin, begin here. These are the drams we recommend again and again.",
    ],
    copy: {
      bestFor: "Anyone wanting a sure thing — proven, well-loved bottles.",
      collectorInterest: "Mixed — chosen for drinking pleasure first, with several collectible names among them.",
      giftSuitability: "Reliably excellent gifts across every budget.",
    },
    signature: true,
    base: { badges: ["bestseller"] },
  },
  samples: {
    title: "Samples & flights",
    eyebrow: "Tasting",
    intro: "Try before you commit — 3cl samples and curated flights.",
    story: [
      "The smartest way to find your favourite: try before you commit. Our 3cl samples and curated flights let you explore a region or a style for the price of a couple of drams, not a full bottle.",
      "Every sample is decanted from the same stock we sell — what you taste is exactly what you'll pour.",
    ],
    copy: {
      bestFor: "Explorers, gift-buyers and anyone narrowing down a full-bottle purchase.",
      collectorInterest: "Low by design — these are for tasting, not the shelf.",
      giftSuitability: "An ideal low-commitment gift, or a tasting night in a box.",
    },
    signature: true,
    base: { type: ["sample"] },
  },
  beginners: {
    title: "Great for beginners",
    eyebrow: "Collection",
    intro: "Approachable, easy-to-love whiskies to start your journey.",
    story: [
      "Whisky should be a pleasure from the first pour. These are the bottles we hand to people starting out — approachable, forgiving and easy to love, with none of the rough edges that put newcomers off.",
      "Start gentle. The smoke and the cask-strength rarities will still be here when you want them.",
    ],
    copy: {
      bestFor: "First-timers and anyone building confidence.",
      collectorInterest: "Not the point — these are made to be opened and enjoyed.",
      giftSuitability: "The safest gift for someone new to whisky.",
    },
    signature: true,
    base: { tags: ["beginner"] },
  },
  peated: {
    title: "Peated whisky",
    eyebrow: "Tasting",
    intro: "For lovers of smoke and peat.",
    story: [
      "For lovers of smoke. Peated whiskies are made from barley dried over peat fires, and the phenols that carry through — measured in ppm — give everything from a gentle campfire wisp to full medicinal, tarry intensity.",
      "Not only an Islay story: peat turns up across Scotland and beyond. This is the shelf for the smoke-seekers.",
    ],
    copy: {
      bestFor: "Confirmed peat-heads and anyone chasing smoke and intensity.",
      collectorInterest: "High — heavily peated limited editions are keenly collected.",
      giftSuitability: "Only for someone who already loves smoke — otherwise, gift a flight.",
    },
    signature: true,
    base: { flavour: ["peaty"] },
  },
  "under-50": {
    title: "Under £50",
    eyebrow: "Collection",
    intro: "Outstanding whisky that won't break the bank.",
    story: [
      "Great whisky doesn't have to be expensive. Under £50 you'll find genuinely excellent bottles — gentle Speysiders, peppery coastal malts and more — that suit everyday sipping and make confident gifts.",
      "Proof that the best bottle is the one you'll actually reach for on a Tuesday.",
    ],
    copy: {
      bestFor: "Everyday drinking and dependable, affordable gifts.",
      collectorInterest: "Low — bought to be enjoyed, not stored away.",
      giftSuitability: "Outstanding value gifts that never feel cheap.",
    },
    signature: false,
    base: { maxPrice: 5000 },
  },
  gifts: {
    title: "Gifts",
    eyebrow: "Collection",
    intro: "Memorable whisky gifts for every occasion.",
    story: [
      "A memorable whisky gift is really a memorable experience — the right bottle for the right person, properly presented. From a first single malt to a collector's centrepiece, the cabinet holds something for every occasion.",
      "Not sure where to start? A tasting flight is the most generous low-risk gift there is — let them find their own favourite.",
    ],
    copy: {
      bestFor: "Every kind of recipient — from the curious to the committed collector.",
      collectorInterest: "Spans the range, from everyday bottles to limited editions.",
      giftSuitability: "The whole point — chosen to give well.",
    },
    signature: false,
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
  // the shopper's refinements — so it stays stable as filters change.
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
      <PageHero eyebrow={collection.eyebrow} title={collection.title} intro={collection.intro} />
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
