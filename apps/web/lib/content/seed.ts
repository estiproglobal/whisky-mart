import type { Article } from "@whiskymart/types";

/**
 * Seed editorial content. Stand-in for the CMS: the ContentRepository is the
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
      "The bottles under £50 we pour at home, and why each one earns its place.",
    heroSeed: "guide-under-50",
    author: "WhiskyMart Editorial",
    publishedAt: "2026-06-10",
    tags: ["buying guide", "value", "beginner"],
    relatedProductIds: ["p_glenfiddich12", "p_glenmorangie10", "p_talisker10", "p_islay_flight"],
    seo: {
      metaTitle: "Best Whisky Under £50 (2026): WhiskyMart Buying Guide",
      metaDescription: "Our picks of the best whisky under £50, from a gentle Speysider to a peppery coastal malt.",
    },
    body: [
      {
        kind: "paragraph",
        text: "Most of the whisky we drink ourselves costs less than £50. That isn't thrift talking. Below that line sit bottles with real character; above it, you are often paying for the box.",
      },
      { kind: "heading", text: "Our picks" },
      {
        kind: "products",
        productIds: ["p_glenfiddich12", "p_glenmorangie10", "p_talisker10"],
        note: "Three reliable choices, from sweet to maritime.",
      },
      {
        kind: "paragraph",
        text: "Still deciding? A tasting flight is the smartest £25 you can spend. Try several drams before you commit to seventy centilitres of anything.",
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
    excerpt: "A short, jargon-free method for getting more out of every dram. No swirling theatre required.",
    heroSeed: "edu-taste",
    author: "WhiskyMart Academy",
    publishedAt: "2026-05-28",
    tags: ["education", "beginner", "tasting"],
    relatedProductIds: ["p_glencairn_glass", "p_glenfiddich12"],
    seo: {
      metaTitle: "How to Taste Whisky: WhiskyMart Academy",
      metaDescription: "A beginner-friendly method for nosing and tasting whisky, without the theatre.",
    },
    body: [
      {
        kind: "paragraph",
        text: "Tasting whisky well takes minutes to learn. You don't need vocabulary or a velvet jacket. You need a decent glass and a bit of patience.",
      },
      { kind: "heading", text: "The nose" },
      { kind: "paragraph", text: "Use a tulip-shaped glass. Keep your mouth slightly open and take short sniffs. If you dive in like it's wine, the alcohol gets there before the aroma does." },
      { kind: "heading", text: "The palate" },
      { kind: "paragraph", text: "Take a small sip and let it sit. Notice what arrives first and what follows; sweetness usually leads, smoke and spice come later. A drop of water opens most whiskies up." },
      { kind: "heading", text: "The finish" },
      { kind: "paragraph", text: "The finish is whatever stays after you swallow. Long or short, warming or dry. Some £40 bottles finish better than £200 ones, which is worth knowing before you spend £200." },
      { kind: "heading", text: "Kit, and a bottle to practise on" },
      { kind: "products", productIds: ["p_glencairn_glass", "p_glenfiddich12"], note: "The right glass, and an approachable malt that rewards attention." },
    ],
  },
  {
    id: "a_islay",
    type: "education",
    slug: "islay-whisky-explained",
    title: "Islay Whisky, Explained",
    excerpt: "Why one small Scottish island makes whisky that tastes of smoke and the sea, and where to start with it.",
    heroSeed: "edu-islay",
    author: "WhiskyMart Academy",
    publishedAt: "2026-05-12",
    tags: ["education", "region", "islay", "peated"],
    relatedProductIds: ["p_lagavulin16", "p_ardbeg10", "p_islay_flight"],
    body: [
      {
        kind: "paragraph",
        text: "Islay (say eye-luh) is a small island off Scotland's west coast with an outsized reputation. The malts taste of peat smoke and brine, and nowhere else makes anything quite like them.",
      },
      { kind: "heading", text: "Why so smoky?" },
      {
        kind: "paragraph",
        text: "Barley is dried over peat fires and the smoke soaks into the grain, measured in phenol parts per million. A gentle hand gives a campfire note. A heavy one gives tar and iodine.",
      },
      { kind: "heading", text: "Where to start" },
      { kind: "products", productIds: ["p_lagavulin16", "p_ardbeg10"], note: "Two benchmarks. One is polished; the other is louder." },
      { kind: "paragraph", text: "Not ready for a full bottle? The Islay flight exists for exactly this decision." },
      { kind: "products", productIds: ["p_islay_flight"] },
    ],
  },
  {
    id: "a_japan",
    type: "article",
    slug: "why-japanese-whisky-keeps-winning",
    title: "Why Japanese Whisky Keeps Winning",
    excerpt: "How Japanese whisky went from curiosity to cult, and the bottle that shows why.",
    heroSeed: "blog-japan",
    author: "WhiskyMart Editorial",
    publishedAt: "2026-06-18",
    tags: ["news", "japan", "blend"],
    relatedProductIds: ["p_hibiki_harmony"],
    body: [
      {
        kind: "paragraph",
        text: "Japanese whisky went from curiosity to cult in barely a decade. The style is its own thing. Where Scotland often chases character, the Japanese houses chase balance, and the best of them get unnervingly close to it.",
      },
      { kind: "paragraph", text: "Blenders at houses like Suntory marry malt and grain whiskies from their own distilleries, sometimes finishing them in rare Mizunara oak, which leaves a trace of sandalwood." },
      { kind: "products", productIds: ["p_hibiki_harmony"], note: "A fair place to start with the style." },
    ],
  },
];
