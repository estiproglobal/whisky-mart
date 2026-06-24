import type { Article } from "@whiskymart/types";

/**
 * Seed editorial content. Stand-in for the CMS — the ContentRepository is the
 * only consumer, so swapping the source for Sanity later requires no UI changes
 * (see DEFERRED.md).
 */
export const SEED_ARTICLES: Article[] = [
  {
    id: "a_under_50",
    type: "guide",
    slug: "best-whisky-under-50",
    title: "The Best Whisky Under £50",
    excerpt:
      "Outstanding bottles that prove you don't need to spend a fortune to drink brilliantly. Our pick of the best whisky under £50.",
    heroSeed: "guide-under-50",
    author: "WhiskyMart Editorial",
    publishedAt: "2026-06-10",
    tags: ["buying guide", "value", "beginner"],
    relatedProductIds: ["p_glenfiddich12", "p_glenmorangie10", "p_talisker10", "p_islay_flight"],
    seo: {
      metaTitle: "Best Whisky Under £50 (2026) — WhiskyMart Buying Guide",
      metaDescription: "Expert picks of the best whisky under £50, from approachable Speyside to coastal Island malts.",
    },
    body: [
      {
        kind: "paragraph",
        text: "Great whisky doesn't have to be expensive. Under £50 you'll find genuinely excellent bottles — from gentle, fruity Speysiders to peppery coastal malts — that suit everyday sipping and make confident gifts.",
      },
      { kind: "heading", text: "Our picks" },
      {
        kind: "products",
        productIds: ["p_glenfiddich12", "p_glenmorangie10", "p_talisker10"],
        note: "Three crowd-pleasers spanning sweet, floral and maritime styles.",
      },
      {
        kind: "paragraph",
        text: "If you're still deciding, a tasting flight is the smartest £25 you can spend — try several before committing to a full bottle.",
      },
      { kind: "products", productIds: ["p_islay_flight"] },
      {
        kind: "quote",
        text: "The best bottle is the one you'll actually reach for on a Tuesday.",
        cite: "WhiskyMart Editorial",
      },
    ],
  },
  {
    id: "a_how_to_taste",
    type: "education",
    slug: "how-to-taste-whisky",
    title: "Whisky 101: How to Taste Like a Pro",
    excerpt: "Nose, palate, finish — a simple, jargon-free method to get far more out of every dram.",
    heroSeed: "edu-taste",
    author: "WhiskyMart Academy",
    publishedAt: "2026-05-28",
    tags: ["education", "beginner", "tasting"],
    relatedProductIds: ["p_glencairn_glass", "p_glenfiddich12"],
    seo: {
      metaTitle: "How to Taste Whisky — WhiskyMart Academy",
      metaDescription: "A beginner-friendly guide to nosing and tasting whisky: nose, palate and finish.",
    },
    body: [
      {
        kind: "paragraph",
        text: "Tasting whisky well is a skill anyone can learn in minutes. Forget the snobbery — here's a simple method.",
      },
      { kind: "heading", text: "1. The nose" },
      { kind: "paragraph", text: "Use a tulip-shaped glass. Keep your mouth slightly open and take short sniffs — don't dive in like it's wine." },
      { kind: "heading", text: "2. The palate" },
      { kind: "paragraph", text: "Take a small sip and let it coat your tongue. Note sweetness, smoke, spice and fruit. A drop of water can open things up." },
      { kind: "heading", text: "3. The finish" },
      { kind: "paragraph", text: "Notice what lingers after you swallow — long or short, warming or dry. That's the finish." },
      { kind: "heading", text: "Kit & a gentle starter" },
      { kind: "products", productIds: ["p_glencairn_glass", "p_glenfiddich12"], note: "The right glass and an approachable malt to practise on." },
    ],
  },
  {
    id: "a_islay",
    type: "education",
    slug: "islay-whisky-explained",
    title: "Islay Whisky, Explained",
    excerpt: "Why the malts of one small Scottish island taste of smoke, peat and the sea — and where to start.",
    heroSeed: "edu-islay",
    author: "WhiskyMart Academy",
    publishedAt: "2026-05-12",
    tags: ["education", "region", "islay", "peated"],
    relatedProductIds: ["p_lagavulin16", "p_ardbeg10", "p_islay_flight"],
    body: [
      {
        kind: "paragraph",
        text: "Islay (eye-luh) is a small island off Scotland's west coast with an outsized reputation. Its malts are famous for peat smoke, brine and a maritime intensity you'll find nowhere else.",
      },
      { kind: "heading", text: "Why so smoky?" },
      {
        kind: "paragraph",
        text: "Barley is dried over peat fires, and the smoke (measured in ppm of phenols) infuses the grain. The result ranges from medicinal and tarry to sweet and coastal.",
      },
      { kind: "heading", text: "Where to start" },
      { kind: "products", productIds: ["p_lagavulin16", "p_ardbeg10"], note: "Two benchmark Islay malts." },
      { kind: "paragraph", text: "Not ready for a full bottle? Our Islay flight is the perfect introduction." },
      { kind: "products", productIds: ["p_islay_flight"] },
    ],
  },
  {
    id: "a_japan",
    type: "article",
    slug: "why-japanese-whisky-keeps-winning",
    title: "Why Japanese Whisky Keeps Winning",
    excerpt: "Precision, patience and a touch of Mizunara oak — the rise of Japanese whisky, and a bottle to try.",
    heroSeed: "blog-japan",
    author: "WhiskyMart Editorial",
    publishedAt: "2026-06-18",
    tags: ["news", "japan", "blend"],
    relatedProductIds: ["p_hibiki_harmony"],
    body: [
      {
        kind: "paragraph",
        text: "Japanese whisky has gone from niche to coveted in barely a decade, sweeping global awards with a style all its own: delicate, precise and harmonious.",
      },
      { kind: "paragraph", text: "Master blenders like Suntory's marry malt and grain whiskies — sometimes finished in rare Mizunara oak — for a subtle, floral complexity." },
      { kind: "products", productIds: ["p_hibiki_harmony"], note: "A perfect entry point to the style." },
    ],
  },
];
