import type { Article } from "@whiskymart/types";

/**
 * Seed editorial content. Stand-in for the CMS: the ContentRepository is the
 * only consumer, so swapping the source for Sanity later requires no UI changes
 * (see DEFERRED.md). Guide bodies run 700 to 1100 words (4 to 6 min) in the
 * shop-owner voice; shoppable embeds cite real catalogue SKUs.
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
    relatedProductIds: [
      "p_glenfiddich12",
      "p_glenmorangie10",
      "p_talisker10",
      "p_highlandpark12",
      "p_buffalotrace",
      "p_islay_flight",
    ],
    seo: {
      metaTitle: "Best Whisky Under £50 (2026): WhiskyMart Buying Guide",
      metaDescription: "Our picks of the best whisky under £50, from a gentle Speysider to a peppery coastal malt.",
    },
    body: [
      {
        kind: "paragraph",
        text: "Most of the whisky we drink ourselves costs less than £50. That isn't thrift talking. Below that line sit bottles with real character, and the jump to £70 or £90 usually buys you age, scarcity and a heavier box rather than a better dram. Under £50 is where a whisky shop earns its keep, because this is the shelf people actually clear.",
      },
      { kind: "heading", text: "What fifty pounds actually buys" },
      {
        kind: "paragraph",
        text: "At this price you are drinking core-range single malts and honest bourbon, not cask-strength rarities. That is not a compromise. A distillery's twelve-year-old is the bottle it wants to be judged by: made in volume, blended for consistency year to year, and priced to be opened on a wet Wednesday rather than saved for a birthday. The skill is knowing which ones drink above their label, and that is mostly a matter of having poured a lot of them.",
      },
      { kind: "heading", text: "Three we reach for" },
      {
        kind: "paragraph",
        text: "Start in Speyside if you are unsure. Glenfiddich 12 is fresh pear and cream with nothing to trip over, and it is the bottle we hand to anyone who claims they don't like whisky. Glenmorangie 10 comes off the tallest stills in Scotland and drinks tall to match, all citrus, peach and a light floral lift. When you want the sea in the glass instead, Talisker 10 brings black pepper, brine and a curl of smoke, and it does all that for comfortably under the fifty mark.",
      },
      {
        kind: "products",
        productIds: ["p_glenfiddich12", "p_glenmorangie10", "p_talisker10"],
        note: "Sweet, floral and maritime: three directions for the same budget.",
      },
      { kind: "heading", text: "Don't overlook the islands, or America" },
      {
        kind: "paragraph",
        text: "Highland Park 12 is the quiet all-rounder of this price band. It comes from Orkney, balances heather honey against a low hum of peat, and sits in sherry-seasoned oak, which is why it feels dressier than the money suggests. Then there is bourbon, where the value is frankly silly. Buffalo Trace is vanilla, toffee and a little rye spice for under thirty pounds, and it builds an Old Fashioned that shames bottles twice the cost. Neither of these needs an occasion to justify it.",
      },
      {
        kind: "products",
        productIds: ["p_highlandpark12", "p_buffalotrace"],
        note: "An Orkney all-rounder and a Kentucky bargain.",
      },
      { kind: "heading", text: "Age is not the point" },
      {
        kind: "paragraph",
        text: "A number on the label tells you how long the youngest whisky in the bottle sat in wood. It tells you nothing about whether you'll enjoy it. Plenty of no-age-statement bottles drink beautifully, and plenty of older ones are tired and over-oaked. Under £50 you are buying the distillery's judgement rather than a vintage, so trust your own nose over the figure on the front. If a twelve-year-old and a ten-year-old both please you, the ten just saved you money.",
      },
      { kind: "heading", text: "Single malt isn't the only good answer" },
      {
        kind: "paragraph",
        text: "The phrase single malt has done clever marketing work, but all it means is that the whisky came from one distillery and used malted barley. It is not a quality badge. A well-made blend of malt and grain can be rounder and more drinkable than a mediocre single malt at the same price, which is the whole premise of a bottle like Nikka From The Barrel drinking so well for the money. Buy the liquid you like, not the category the label is proud of. Nobody worth sharing a dram with is going to check which box it ticks.",
      },
      { kind: "heading", text: "Where the money leaks" },
      {
        kind: "paragraph",
        text: "If you keep drifting over budget, it is usually one of three habits. You buy the age statement for the number rather than the taste. You pay for heavy presentation you will put straight in the recycling. Or you chase a limited edition you saw sell out online and convince yourself scarcity is flavour. None of that makes the whisky in the glass any better. The under-fifty shelf exists so you can drink well every week instead of drinking grandly twice a year, and the people who enjoy whisky most are almost always the ones who open bottles rather than hoard them.",
      },
      { kind: "heading", text: "The honest way to choose" },
      {
        kind: "paragraph",
        text: "You will waste more money on the wrong £45 bottle than on the right £25 one, so taste before you commit. A flight is the smartest small spend in the shop: four 3cl drams for the price of a couple of pub measures, poured from the same stock we sell. Work out which style you love first, then buy the bottle you already know you'll finish.",
      },
      {
        kind: "products",
        productIds: ["p_islay_flight"],
        note: "Four drams, one evening, no seventy-centilitre regret.",
      },
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
    relatedProductIds: ["p_glencairn_glass", "p_glenlivet12", "p_beginner_flight", "p_wm_dropper"],
    seo: {
      metaTitle: "How to Taste Whisky: WhiskyMart Academy",
      metaDescription: "A beginner-friendly method for nosing and tasting whisky, without the theatre.",
    },
    body: [
      {
        kind: "paragraph",
        text: "Tasting whisky well takes minutes to learn. You don't need a vocabulary or a velvet jacket, and you certainly don't need to sound like a wine list. What you need is a decent glass, a little water and enough patience to sit with the thing for longer than a swallow. Everything below is what we do at the shop counter when someone asks what they're supposed to be noticing.",
      },
      { kind: "heading", text: "Start with the right glass" },
      {
        kind: "paragraph",
        text: "A tumbler looks the part and does nothing for you. It has a wide mouth, so the aromas spread out and escape before they reach your nose. A tulip-shaped glass narrows at the top and funnels everything upward, which is the whole game. The Glencairn is the industry standard for exactly this reason, and it costs less than a single dram of anything decent. Pour a modest measure, about a thumb's width. You are tasting, not settling in for the night.",
      },
      {
        kind: "products",
        productIds: ["p_glencairn_glass"],
        note: "The tasting glass every distillery uses. Start here.",
      },
      { kind: "heading", text: "The nose" },
      {
        kind: "paragraph",
        text: "Most of what you taste is actually smell, so this is the part that matters. Hold the glass a little below your chin and bring it up slowly. Keep your mouth slightly open and take short, gentle sniffs rather than one big inhale. If you dive in like it's a glass of wine, the alcohol gets to the back of your nose before the aroma does and everything just reads as heat. Give it a moment. Fruit, vanilla, smoke and cereal tend to arrive in that rough order.",
      },
      { kind: "heading", text: "The palate" },
      {
        kind: "paragraph",
        text: "Take a small sip and hold it still for a second or two before you swallow. Notice what arrives first and what follows: sweetness usually leads, then spice, then smoke or oak on the back. Texture counts as much as flavour, so ask whether it feels thin and sharp or thick and oily. Then try the single most useful trick in whisky. Add a few drops of water, swirl once, and taste again. Water breaks the surface tension and releases aromas the neat spirit was holding shut, especially on anything bottled at strength.",
      },
      {
        kind: "products",
        productIds: ["p_wm_dropper"],
        note: "A few drops at a time, so you can water it up rather than drown it.",
      },
      { kind: "heading", text: "The finish" },
      {
        kind: "paragraph",
        text: "The finish is whatever stays after you swallow, and it is where cheap whisky and good whisky part company. Time it, roughly. Does the flavour vanish in a second, or does it sit warm on the tongue for half a minute and change as it goes? Long is not automatically better, but a finish that turns bitter or hollow tells you plenty. Some £40 bottles finish better than £200 ones, which is worth knowing before you spend the £200.",
      },
      { kind: "heading", text: "Practise on something forgiving" },
      {
        kind: "paragraph",
        text: "Don't learn on a peat monster or a cask-strength bruiser. Start with a gentle, well-made malt where the notes are easy to pick apart. The Glenlivet 12 is ideal: soft pineapple, vanilla and cream, nothing hiding. Once you can name what you're getting there, harder whiskies stop being intimidating and start being interesting. If you'd rather compare several in one sitting, a beginner's flight lays four side by side so the differences teach themselves.",
      },
      {
        kind: "products",
        productIds: ["p_glenlivet12", "p_beginner_flight"],
        note: "An easy malt to read, and four gentle drams to compare.",
      },
      { kind: "heading", text: "Ignore the theatre" },
      {
        kind: "paragraph",
        text: "Somewhere along the way whisky tasting picked up a lot of ritual that does nothing for the drink. You do not need to swirl it like brandy, warm the glass in your palms, or hold it up to a window to admire the colour, since colour mostly tells you about the cask and sometimes about caramel added for consistency. You do not need ice unless you want a longer, colder, less aromatic drink, which is a perfectly reasonable thing to want on a hot afternoon and a slightly wasteful thing to do to a rare bottle. The one habit worth keeping is going slowly. A dram is not a race, and the whisky changes in the glass over ten minutes as it breathes.",
      },
      { kind: "heading", text: "Build a memory, not a vocabulary" },
      {
        kind: "paragraph",
        text: "The reason experienced drinkers reel off tasting notes is not a better palate. It is practice and comparison. Taste two whiskies side by side and the differences leap out in a way a single glass never shows you: the Speysider suddenly reads as sweet because the Islay next to it reads as smoke. Keep a cheap notebook and jot a line for each bottle, nose, palate, finish, and whether you'd buy it again. Six months in you will have a map of your own taste, which is worth more than anyone else's scores.",
      },
      {
        kind: "quote",
        text: "You are not being tested. If all you taste is honey and smoke, that is a complete and correct answer.",
        cite: "WhiskyMart Academy",
      },
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
    relatedProductIds: [
      "p_lagavulin16",
      "p_ardbeg10",
      "p_laphroaig10",
      "p_bowmore12",
      "p_bunnahabhain12",
      "p_islay_flight",
    ],
    body: [
      {
        kind: "paragraph",
        text: "Islay (say eye-luh) is a small island off Scotland's west coast, nine distilleries strong, with weather that gets into the whisky. The malts taste of peat smoke and sea air, and nowhere else on earth makes anything quite like them. For a lot of drinkers Islay is the deep end, so it helps to understand what you're tasting before you decide whether you love it or run.",
      },
      { kind: "heading", text: "Why so smoky?" },
      {
        kind: "paragraph",
        text: "It starts in the kiln. To turn barley into something you can distil, you first sprout it and then dry it with heat, and on Islay that heat has long come from burning peat cut from the island's own bogs. The smoke soaks into the wet grain and carries phenols, the compounds that read as smoke, which is why you'll see whisky measured in ppm, parts per million of phenol. A gentle hand gives you a campfire wisp. A heavy one gives you tar, iodine and the inside of an old ship's rope locker.",
      },
      { kind: "heading", text: "The two benchmarks" },
      {
        kind: "paragraph",
        text: "If you taste nothing else from the island, taste these two. Lagavulin 16 is the polished one: sixteen years has folded the smoke into dried fruit and long, elegant depth, and it is the bottle we hand to people who swear they hate peat. Ardbeg 10 is the louder cousin, bottled younger and at higher strength, all tar and lime and espresso with the volume turned up. Between them they draw the boundaries of the Islay style.",
      },
      {
        kind: "products",
        productIds: ["p_lagavulin16", "p_ardbeg10"],
        note: "One is polished, the other is louder. Learn the island from both.",
      },
      { kind: "heading", text: "It is not all one note" },
      {
        kind: "paragraph",
        text: "The lazy view is that Islay makes one thing very loudly. It doesn't. Laphroaig 10 pushes the medicinal, seaweed-and-iodine end so far that people genuinely argue about it, which is half the fun. Bowmore 12 sits in the middle: medium smoke wrapped around honey and lemon, and the sensible place to start if the big hitters sound like too much. And then there is the plot twist. Bunnahabhain is an Islay distillery that mostly leaves the peat out altogether, bottling a rich, sherried, faintly salty malt that proves the island has more than one idea.",
      },
      {
        kind: "products",
        productIds: ["p_laphroaig10", "p_bowmore12", "p_bunnahabhain12"],
        note: "The medicinal extreme, the balanced middle, and the unpeated outlier.",
      },
      { kind: "heading", text: "A little geography helps" },
      {
        kind: "paragraph",
        text: "Islay is not a single place with a single taste. The distilleries on the southern shore, Lagavulin, Ardbeg and Laphroaig among them, take the brunt of the Atlantic weather and tend to make the biggest, brawniest, most maritime whiskies. Move round the island and the character shifts. The malts made further from that battered south coast are often lighter and grassier, and the unpeated exceptions sit apart entirely. Knowing roughly where a bottle comes from tells you something real about what to expect from the glass, which is more than you can say for most marketing.",
      },
      { kind: "heading", text: "It nearly disappeared" },
      {
        kind: "paragraph",
        text: "It is easy to forget how close some of this came to being lost. Several of the island's now-famous names sat silent for years in the lean decades when nobody wanted heavily peated whisky, mothballed and one bad winter away from demolition. The current fame is recent, and it was not inevitable. That history is part of why Islay drinkers can be a slightly evangelical bunch. They remember, or have been told often enough, that the thing they love was very nearly allowed to die of unfashionability.",
      },
      { kind: "heading", text: "How to drink it" },
      {
        kind: "paragraph",
        text: "Give an Islay malt room. Pour it, then leave it two or three minutes before you go near it, because the smoke calms and the fruit underneath comes up. Add a few drops of water if the first sip is all bonfire; it opens the sweetness without drowning anything. And eat with it. Peated whisky and strong cheese, or smoked fish, or dark chocolate, is one of the great cheap luxuries. Neat and warm in a cold month, it barely needs the food.",
      },
      { kind: "heading", text: "Where to start without committing" },
      {
        kind: "paragraph",
        text: "A full bottle of heavily peated whisky is a real commitment if you're not yet sure, because there is no hiding from it on a quiet evening and it will sit in the cupboard reproaching you if it turns out not to be your thing. This is exactly what the tasting flight is for. Four island drams, side by side, poured from the same stock we sell, so you can find your own line between campfire and tar before you buy seventy centilitres of either. Start there, take notes, and let the island earn its place in your cupboard rather than ambushing you.",
      },
      {
        kind: "products",
        productIds: ["p_islay_flight"],
        note: "Four Islay drams, so you can find your limit before you buy the bottle.",
      },
    ],
  },
  {
    id: "a_japan",
    type: "article",
    slug: "why-japanese-whisky-keeps-winning",
    title: "Why Japanese Whisky Keeps Winning",
    excerpt: "How Japanese whisky went from curiosity to cult, and the bottles that show why.",
    heroSeed: "blog-japan",
    author: "WhiskyMart Editorial",
    publishedAt: "2026-06-18",
    tags: ["news", "japan", "blend"],
    relatedProductIds: ["p_nikka_ftb", "p_hibiki_harmony", "p_yamazaki12", "p_yamazaki18"],
    body: [
      {
        kind: "paragraph",
        text: "Japanese whisky went from curiosity to cult in barely a decade. Twenty years ago you could buy an aged Yamazaki off the shelf for sensible money. Now the good bottles are allocated, the old ones cost more than a used car, and the empties turn up on auction sites. Something clearly happened. It is worth understanding what, because the hype has outrun the explanation.",
      },
      { kind: "heading", text: "A style of its own" },
      {
        kind: "paragraph",
        text: "The founders learned in Scotland and then quietly did the opposite. Where a Scottish distillery often chases a big, recognisable character, the Japanese houses chase balance, and the best of them get unnervingly close to it. The whisky is precise, clean and layered rather than loud. Nothing sticks out and everything fits, which sounds like faint praise until you taste it next to something clumsier and realise how hard that quiet balance is to build. It is the difference between a soloist and a choir that has rehearsed for years.",
      },
      { kind: "heading", text: "Why it tastes different" },
      {
        kind: "paragraph",
        text: "Two habits set it apart. First, blending. A single Japanese house will run several still shapes and yeast strains under one roof and marry the results, where Scottish blends trade whisky between companies. That gives one team total control over the final balance. Second, the wood. Some of it is aged in Mizunara, a rare and awkward Japanese oak that leaks when you least want it to and takes decades to season, but leaves an unmistakable trace of sandalwood and temple incense that nothing else quite matches.",
      },
      { kind: "heading", text: "Where to start, sensibly" },
      {
        kind: "paragraph",
        text: "Ignore the collector prices and start with the bottle that made Nikka's name abroad. Nikka From The Barrel is a blend of malt and grain married in cask and bottled at 51.4% in a squat little flask, and it punches so far above its money that bartenders buy it by the case. It is spicy, full and faintly fruity, and it is the fairest introduction to the whole category. Buy this before you buy anything with a number and a waiting list.",
      },
      {
        kind: "products",
        productIds: ["p_nikka_ftb"],
        note: "The honest way in: more whisky than the price has any right to deliver.",
      },
      { kind: "heading", text: "Working up the range" },
      {
        kind: "paragraph",
        text: "When you want the softer, more floral side, Hibiki Japanese Harmony is the blend to reach for: rose, lychee and white chocolate, gentle and precise. From there the single malts begin, and Yamazaki 12 is the reference point, the first Japanese single malt and still the one people mean when they say the style clicked for them. It is peach, coconut and a whisper of that Mizunara incense, and it is where the prices start to reflect the scarcity.",
      },
      {
        kind: "products",
        productIds: ["p_hibiki_harmony", "p_yamazaki12"],
        note: "A floral blend, then the single malt that started the fuss.",
      },
      { kind: "heading", text: "Mind what the label doesn't say" },
      {
        kind: "paragraph",
        text: "The boom pulled in a lot of bottles that lean on the word Japanese without being made the way you'd assume. For years the rules were loose enough that whisky distilled elsewhere could be bottled in Japan and sold with the aesthetic, and plenty was. The industry has since agreed tighter standards for what earns the name, but older and cheaper bottles vary, so it pays to buy from someone who can tell you what is actually in the glass. Everything on our Japanese shelf is single-distillery malt or a genuine house blend, and we say which is which.",
      },
      { kind: "heading", text: "The top of the shelf" },
      {
        kind: "paragraph",
        text: "At the very top the whisky is very good and the maths is brutal. Yamazaki 18 is dense, layered and genuinely special, sherry fruit and dark honey and old oak, and it changes hands well above its list price almost everywhere because the aged stock simply doesn't exist in the quantities the world now wants. We stock it as a collector piece, and we are honest that you are paying partly for rarity. Taste the entry blends first. If they win you over, the top of the range is waiting, and it isn't going anywhere except up.",
      },
      {
        kind: "products",
        productIds: ["p_yamazaki18"],
        note: "A collector bottle, priced for scarcity as much as for the liquid.",
      },
      { kind: "heading", text: "Where it goes from here" },
      {
        kind: "paragraph",
        text: "The shortage will ease, slowly, because the distilleries have been laying down far more spirit since the boom caught them out. But wood takes the time it takes, and an eighteen-year-old bottled next year had to be filled into cask eighteen years ago, when nobody was watching. So the aged bottles will stay tight for a while yet. The sensible move is the one that was always sensible. Drink the blends and the young malts now, while they are still fairly priced and genuinely excellent, and treat the old bottles as the occasional splurge rather than the point of the exercise.",
      },
    ],
  },
];
