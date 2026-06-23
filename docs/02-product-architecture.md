# 02 — Product Architecture (Part 2)

> Every major module across Commerce, Customer, Content, Community, and AI — with data ownership, phase, and dependencies.

This document defines **what the platform does**. The technical realisation is in [Doc 03](03-technical-architecture.md); the data model in [Doc 05](05-database-schema.md).

---

## Module map (the whole platform at a glance)

```
┌─────────────────────────────────────────────────────────────────────┐
│                          WHISKYMART PLATFORM                          │
├───────────────┬───────────────┬───────────────┬──────────────────────┤
│   COMMERCE     │   CUSTOMER     │    CONTENT     │   COMMUNITY          │
│ • Catalog      │ • Accounts     │ • Editorial    │ • Profiles           │
│ • Categories   │ • Wishlist     │ • Education    │ • Forums / Q&A       │
│ • Brands       │ • Compare      │ • Buying guides│ • Clubs              │
│ • Distilleries │ • Reviews      │ • Video        │ • Tastings           │
│ • Regions      │ • Ratings      │ • Podcast      │ • Events             │
│ • Age stmts    │ • Loyalty      │ • Newsletter   │ • Creator program    │
│ • Limited eds  │ • Rewards      │                │                      │
│ • Gift packs   │ • Referrals    │                │                      │
│ • Accessories  │ • Subscriptions│                │                      │
│ • Samples      │ • WhiskyVault  │                │                      │
│ • Marketplace  │ • Orders/RMA   │                │                      │
│ • Auctions     │                │                │                      │
│ • Investment   │                │                │                      │
├───────────────┴───────────────┴───────────────┴──────────────────────┤
│                          AI LAYER (cross-cutting)                      │
│  Sommelier Advisor · Recommendations · Food Pairing · Gift Finder ·    │
│  Support Agent · Search (semantic) · Merchandising · Fraud/Trust       │
├───────────────────────────────────────────────────────────────────────┤
│  PLATFORM SERVICES: Identity · Payments · Tax/Duty · Jurisdiction ·     │
│  Inventory · Fulfilment · Notifications · Search · CMS · Analytics      │
└───────────────────────────────────────────────────────────────────────┘
```

---

## A. COMMERCE

### A1. Product Catalog
The heart of the platform. A **flexible product model** that handles bottles, samples, gift packs, accessories, casks, and marketplace listings via a shared schema with type-specific attributes.

- **Product types:** `bottle`, `sample` (3cl/5cl), `gift_pack`, `bundle`, `accessory`, `cask`, `experience` (event/tasting), `digital` (gift card).
- **Rich attributes** (especially for whisky): ABV, age statement, region, distillery, brand, bottler (OB/IB), cask type, cask number, vintage/bottling year, volume, colouring (E150a), chill-filtration, peat level (ppm), limited-edition flag, bottle number/outturn, tasting notes, awards, allergens.
- **Variants:** size (5cl/35cl/70cl/1L), packaging (gift box), engraving.
- **Media:** multiple images, 360° view, video, label scans, provenance docs.
- **Editorial fields:** expert description, story, "why we love it," pairing suggestions.
- **SEO fields:** slug, meta, structured data (Product/Offer/AggregateRating).
- **Phase:** P1.

### A2. Categories & Taxonomy
A **multi-dimensional, faceted taxonomy** — whisky doesn't fit a single tree, so we model it as **tags/facets + curated collections**, not a rigid hierarchy.

Primary navigable dimensions:
- **Type:** Scotch (Single Malt, Blended, Blended Malt, Grain), Bourbon, Rye, Irish, Japanese, World Whisky, plus adjacent (Rum, Cognac, Gin, Tequila, Champagne…).
- **Region:** Speyside, Islay, Highland, Lowland, Campbeltown, Islands (Scotland); Kentucky/Tennessee; Japan; etc.
- **Price band, Age band, Flavour profile, Occasion, Cask finish.**
- **Curated collections:** "Best for beginners," "Under £50," "Peated," "Editor's picks," "Investment-grade," seasonal/gifting.
- **Phase:** P1.

### A3. Brands & A4. Distilleries
First-class entities (not just tags) with their own pages, story, region, history, image/logo, and a feed of their products and editorial. Distilleries can become **branded storefronts** (revenue stream 6) in later phases. Drives SEO and discovery.
- **Phase:** P1 (pages), P2+ (storefronts).

### A5. Regions
Geographic entities with maps, characteristics, flavour signatures, and product feeds. Strong **educational + SEO** asset.
- **Phase:** P1.

### A6. Age Statements & A7. Flavour/Style facets
Structured, filterable attributes. Age bands (NAS, <10, 10–15, 16–20, 21+), flavour profiles (smoky, sweet, fruity, spicy, maritime…). Power the search/filter system and the AI palate model.
- **Phase:** P1.

### A8. Limited Editions & Allocations
Special handling for scarce products: outturn/bottle numbering, **ballot/raffle** mechanics, **member early-access**, per-customer purchase limits, queue/waitlist, anti-bot protection. A key engagement + fairness feature (and membership driver).
- **Phase:** P2 (basic), P3 (ballots).

### A9. Gift Packs, Bundles & Gifting
Curated bundles, gift-wrapping, gift messaging, scheduled delivery, **gift cards**, corporate gifting (bulk, branded). Integrated with the **Gift Finder AI**.
- **Phase:** P1 (basic), P2 (concierge/corporate).

### A10. Accessories
Glassware, decanters, water droppers, books, storage, hip flasks. High-margin attach sales, basket-builders.
- **Phase:** P1.

### A11. Samples (sampling-first discovery)
3cl/5cl samples decanted from bottles — our modern "Drinks by the Dram." Enables **flights**, **try-before-you-buy**, advent calendars, and low-risk discovery. A core acquisition + conversion mechanism.
- **Phase:** P1 (catalogue), P2 (subscription flights).

### A12. Marketplace (3P sellers) — *Phase 4*
Third-party listings under the unified catalogue. Seller onboarding/KYC, listing management, inventory sync, order routing, settlements/payouts, ratings, dispute resolution, optional **WhiskyMart-Fulfilled**. Buyers experience one seamless catalogue; sellers get reach.

### A13. Auctions — *Phase 4*
Timed online auctions for rare/collectible bottles. Bidding engine, reserve/no-reserve, proxy bids, watchlists, seller commission + buyer's premium, authentication, settlement, shipping. Benchmarked against Whisky Auctioneer.

### A14. Investment & Casks — *Phase 4*
Cask investment marketplace + rare-bottle investment. Listings with provenance, valuation data, **custody/storage** (bonded warehouse), insurance, portfolio dashboard, exit options (resale/auction/bottling). Benchmarked against Cask Trade / Whisky Partners. Heavily compliance- and trust-gated.

---

## B. CUSTOMER FEATURES

### B1. Accounts & Identity
Unified account spanning shopper, member, seller, collector, investor roles (RBAC). Email/social/passkey auth, profile, addresses, payment methods, **mandatory age verification**, communication preferences, GDPR/CCPA controls (export/delete).
- **Phase:** P1.

### B2. Wishlist & Saved items
Multiple named lists (e.g. "To try," "Gift ideas," "Bucket list"), price-drop & back-in-stock alerts, shareable lists, "notify on allocation."
- **Phase:** P1.

### B3. Compare Products
Side-by-side comparison of bottles (price, ABV, age, region, flavour, reviews, AI verdict). Strong for considered purchases and beginners.
- **Phase:** P1.

### B4. Reviews & Ratings
Verified-purchase reviews, structured **tasting notes** (nose/palate/finish), star + flavour-wheel ratings, photos, helpful-voting, moderation, AI summarisation ("what reviewers say"). Major SEO + trust + data asset; feeds the palate model.
- **Phase:** P1 (basic), P2 (structured notes + AI summary).

### B5. Loyalty Program (WhiskyMart Points)
Earn points on purchases, reviews, referrals, profile completion, tastings attended (mirrors The W Club). Redeem for discounts/exclusives/experiences. Tiered status (e.g. Bronze→Gold) with escalating perks.
- **Phase:** P2.

### B6. Rewards & Perks
Birthday rewards, milestone gifts, surprise-and-delight for top customers, members-only pricing and early access.
- **Phase:** P2/P3.

### B7. Referrals
"Give £10, get £10" double-sided referral with tracking, fraud checks, and viral loops. Lowers CAC.
- **Phase:** P2.

### B8. Subscriptions
Membership tiers (B5/Doc 01), sample/box subscriptions, "auto-replenish my favourite," with self-serve pause/skip/cancel and dunning management.
- **Phase:** P3 (membership), P2 (boxes).

### B9. WhiskyVault (digital collection) — *differentiator*
A digital record of bottles a user owns (added manually, via purchase, or by scanning bottle NFC/QR). Tracks estimated value (from our valuation data), provenance/authentication, "open vs sealed," and offers one-click **list for sale / send to auction / insure**. Bridges retail → community → marketplace → investment. **This is a flywheel feature unique to WhiskyMart.**
- **Phase:** P3 (collection), P4 (valuation + sell).

### B10. Orders, Tracking & RMA
Order history, real-time tracking, age-verified delivery status, returns/refunds (within alcohol regulations), re-order, invoices, duties/customs visibility for international.
- **Phase:** P1.

---

## C. CONTENT FEATURES

> Content is our **lowest-CAC acquisition channel** and the engine of SEO authority. Master of Malt and TWE built dominance partly on content; we out-execute with structure + AI + community.

### C1. Editorial Blog / Magazine
News, releases, interviews, distillery features, opinion. Authored + (assisted) by AI, human-edited. Tagged to products/brands/regions for cross-linking.
- **Phase:** P1.

### C2. Whisky Education ("WhiskyMart Academy")
Structured learning paths: "Whisky 101," "How to taste," "Regions explained," "Cask types," "Reading a label," glossary. Gamified (badges) and tied to the AI advisor.
- **Phase:** P1 (core), P2 (gamified paths).

### C3. Buying Guides
High-intent, SEO-optimised, conversion-focused guides ("Best whisky under £50," "Best gift whiskies," "Best beginner Scotch"), dynamically linked to live catalogue + AI picks.
- **Phase:** P1.

### C4. Reviews (Editorial) & Tasting notes
Expert tasting notes + scores, complementing UGC reviews. Authority signal + structured data.
- **Phase:** P1.

### C5. Video
Product videos, distillery films, "how to taste," tasting livestreams (shoppable). Hosted via Mux/Cloudflare Stream, embedded on PDPs and content.
- **Phase:** P2.

### C6. Podcast Integration
Embed/host a WhiskyMart podcast (RSS ingest, episode pages, show notes linked to products), plus syndication to Spotify/Apple. Brand authority + retention.
- **Phase:** P2/P3.

### C7. Newsletter & Lifecycle content
Segmented newsletters (new releases, deals, education, allocations), powered by the personalisation engine. Major retention + revenue channel.
- **Phase:** P1 (basic), P2 (personalised).

---

## D. COMMUNITY FEATURES

> Community is the **retention + trust + UGC moat** none of the three incumbents has truly cracked. It turns a store into a destination.

### D1. User Profiles
Public profiles: collection (opt-in from WhiskyVault), reviews, tasting notes, badges, followers/following, "palate fingerprint." Reputation drives marketplace trust.
- **Phase:** P3.

### D2. Forums / Q&A
Discussion boards by topic (regions, distilleries, collecting, investment, beginners) + a Q&A where the **AI advisor drafts answers** that experts/community verify. SEO long-tail goldmine.
- **Phase:** P3.

### D3. Clubs
Interest-based and local clubs (e.g. "Islay lovers," "London collectors"), with membership, discussions, group buys, and club-exclusive bottlings.
- **Phase:** P3.

### D4. Tastings (virtual & in-person)
Bookable tasting events, virtual livestream tastings with synchronised sample packs ("tasting kits"), host tools, recordings. Monetisable + community-building.
- **Phase:** P3.

### D5. Events
Calendar of festivals, distillery visits, masterclasses, launches; ticketing; partner/sponsored events.
- **Phase:** P3/P4.

### D6. Creator / Ambassador Program
Onboard whisky reviewers/influencers as creators: affiliate links, creator storefronts, revenue share, featured content. Scales trusted UGC + acquisition at low cost.
- **Phase:** P3/P4.

---

## E. AI LAYER (cross-cutting — woven through all phases)

> AI is the spine of differentiation. All AI features share a common foundation: a **RAG knowledge base** (catalogue + tasting notes + reviews + education) + a **palate/behaviour model** per user + **Claude** as the reasoning engine, with strict guardrails (no medical/over-consumption advice, age-gated, responsible-drinking framing).

### E1. AI Whisky Advisor / Sommelier ("Ask WhiskyMart")
Conversational sommelier available site-wide. Understands natural language ("I like Lagavulin but want something sweeter under £80"), grounds answers in live catalogue + reviews + the user's history, and recommends with reasoning. Powers discovery, PDP Q&A, and onboarding quizzes.
- **Phase:** P1 (grounded advisor v1), P5 (deeply personalised).

### E2. Product Recommendations
"Because you liked…," "Complete the flight," "Customers with your palate also bought," homepage/PDP/cart/email personalisation. Hybrid: collaborative filtering + content/flavour embeddings + LLM re-ranking.
- **Phase:** P2 (baseline), P5 (advanced).

### E3. Food Pairing Engine
"What pairs with this whisky?" / "I'm having X for dinner — which whisky?" Structured pairing knowledge + LLM reasoning, surfaced on PDPs and as a standalone tool.
- **Phase:** P2.

### E4. Gift Finder
Guided AI flow (recipient, occasion, budget, taste) → curated, confidence-ranked gift suggestions with gifting add-ons. High-converting, seasonal hero feature.
- **Phase:** P1 (rules+AI v1), P2 (full AI).

### E5. AI Customer Support Agent
Deflects/answers order, shipping, product, and policy questions; grounded in our help content + order data; escalates to humans with context. Tooled to perform actions (track order, start return) with guardrails.
- **Phase:** P2.

### E6. Semantic & Visual Search
Natural-language and vector search ("smoky island whisky like an old Ardbeg under £100"), plus **image search** ("scan a bottle to identify/buy/add to vault"). See [Doc 03 §Search](03-technical-architecture.md).
- **Phase:** P2 (semantic), P3 (visual/scan).

### E7. AI Merchandising & Pricing
Auto-generate SEO copy/metadata at catalogue scale, auto-tag flavour profiles from notes, demand-aware pricing suggestions, fraud/trust scoring on marketplace listings, review/abuse moderation.
- **Phase:** P2+ (internal tools).

### E8. Palate Fingerprint
A learned per-user taste model (from purchases, reviews, ratings, quiz, vault) that personalises every surface and powers recommendations, gifting, and the advisor. **Proprietary data asset + acquisition moat.**
- **Phase:** P2 (v1), P5 (mature).

---

## Module → Phase summary

| Module group | P1 | P2 | P3 | P4 | P5 |
|--------------|:--:|:--:|:--:|:--:|:--:|
| Catalog, categories, brands, regions, accessories, gifts, samples | ● | ● | | | |
| Accounts, wishlist, compare, reviews, orders | ● | ● | | | |
| Loyalty, rewards, referrals, subscriptions, boxes | | ● | ● | | |
| Content (blog, academy, guides, video, podcast, newsletter) | ◐ | ● | ● | | |
| Community (profiles, forums, clubs, tastings, events, creators) | | | ● | ● | |
| WhiskyVault | | | ● | ● | |
| Marketplace, auctions, investment/casks | | | ◐ | ● | |
| AI advisor, gift finder, recommendations, pairing, support, search | ◐ | ● | ● | ● | ● |
| Palate fingerprint & deep personalisation | | ◐ | ● | ● | ● |

● = core delivery · ◐ = initial/partial

---

*Continue to → [03 Technical Architecture](03-technical-architecture.md)*
