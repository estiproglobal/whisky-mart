# 00 — Executive Summary

**Prepared by:** Office of the CTO / Enterprise & E-Commerce Architecture
**For:** Owner & Board, WhiskyMart.com
**Status:** Strategic blueprint v1.0

---

## 1. The opportunity

Whisky is one of the few consumer categories that is simultaneously a **daily-drinker**, a **gift**, a **hobby**, a **status symbol**, and an **alternative asset class**. That breadth is the opportunity. A single customer can be, over their lifetime, a £40 bottle buyer, a £300 gift buyer, a £2,000 collector, and a £25,000 cask investor. **No incumbent captures that whole journey.**

- The Whisky Exchange (TWE) was acquired by **Pernod Ricard in 2021** for an undisclosed sum on ~£70m revenue. It is now a strategic asset of a drinks conglomerate — excellent catalogue, slowing innovation, conflicted incentives (it favours Pernod brands).
- **Master of Malt** pioneered sampling ("Drinks by the Dram"), has deep catalogue and SEO, but runs on ageing UX and limited community/marketplace functionality.
- **The Whisky Shop** leads on **membership (The W Club)** and omnichannel retail, but is fundamentally a bricks-and-clicks retailer, not a platform.
- A separate, **fragmented investment/auction ecosystem** (Whisky Auctioneer, Cask Trade, Whisky Partners, Whiskystats) operates *outside* the retail brands entirely.

**The gap:** there is no trusted, modern, AI-native brand that unifies **buy → discover → learn → belong → collect → invest**. WhiskyMart.com — a premium exact-match domain held since 2012 — is positioned to be that brand.

## 2. What we are building

A **composable commerce platform** that grows through five phases (store → discovery → community → marketplace/investment → AI personalisation), all on one account, one wallet, one identity, one loyalty currency.

### Strategic differentiators (our "unfair advantages")

| # | Differentiator | Why it wins |
|---|----------------|-------------|
| 1 | **AI Whisky Advisor (WhiskyMart Sommelier)** | A genuinely useful RAG-grounded sommelier that knows the catalogue, the customer's palate, and the world's tasting data — embedded in discovery, PDP, gifting, and support. |
| 2 | **Unified retail + marketplace + investment** | One identity spans buying a £45 bottle, flipping a rare bottle on the marketplace, and tracking a cask portfolio. Competitors silo these. |
| 3 | **Provenance & authenticity layer** | NFC/QR bottle authentication, verified collection ("WhiskyVault"), and a transparent secondary market — the trust moat in a category plagued by fakes. |
| 4 | **Sampling-first discovery** | A modern take on "Drinks by the Dram": low-risk 3cl samples + AI flight builder that converts browsers into confident full-bottle buyers. |
| 5 | **Creator & community flywheel** | UGC reviews, tasting notes, clubs, and a creator program that generates SEO content and trust at near-zero marginal cost. |
| 6 | **Compliance-as-a-feature** | Built-in age verification + jurisdiction-aware fulfilment that lets us expand into markets competitors avoid. |

## 3. Business model (eight revenue streams)

1. **First-party retail margin** (own-inventory bottle sales) — the volume engine.
2. **Marketplace commission** (3P sellers: independent bottlers, retailers, collectors) — high-margin, asset-light.
3. **Membership subscriptions** (WhiskyMart Club: tiered, e.g. Free / Plus / Reserve).
4. **Sampling & subscription boxes** (monthly tasting flights, advent calendars).
5. **Auction & investment fees** (seller/buyer premiums, cask brokerage, custody/storage).
6. **Media & brand partnerships** (sponsored content, distillery storefronts, retail media network).
7. **Data & insight products** (pricing/valuation API à la Whiskystats; B2B trade tools).
8. **Financial/ancillary** (insurance, white-glove logistics, gifting concierge, FX margin).

See [Business Architecture](01-business-architecture.md) for unit economics and marketplace take-rates.

## 4. Recommended technology posture

A **MACH / composable** architecture (Microservices, API-first, Cloud-native, Headless) — *not* a monolithic off-the-shelf store — because the five-phase vision spans commerce, marketplace, auction, content, and ML, which no single SaaS covers well.

**Headline recommendation:**

- **Commerce core:** **Medusa.js** (open-source, TypeScript, modular) for control + marketplace extensibility, with **Shopify** as a pragmatic Phase-1 accelerator option (decision matrix in [Doc 03](03-technical-architecture.md)).
- **Frontend:** **Next.js (React, App Router) on Vercel/edge**, TypeScript, server components.
- **Search & discovery:** **Algolia** (or self-hosted **Typesense/Meilisearch**) + a vector index (**pgvector / Pinecone**) for semantic + AI search.
- **Data:** **PostgreSQL** (primary, with pgvector), **Redis** (cache/sessions/queues), **ClickHouse** (analytics/events), **S3-compatible** object storage.
- **AI:** **Claude (Anthropic)** as the primary reasoning/sommelier model via the Claude API, RAG over the catalogue + tasting corpus, with guardrails.
- **Payments:** **Stripe** (primary, multi-currency) + **Adyen** at enterprise scale; **age/ID verification** via Persona/Veriff.
- **Cloud:** **AWS** (or GCP) with IaC (Terraform), containerised services (ECS/Fargate or EKS), Cloudflare CDN/WAF.

Full justification, alternatives compared, and a build-vs-buy decision matrix are in [Technical Architecture](03-technical-architecture.md).

## 5. Roadmap & investment (summary)

| Stage | Horizon | Headline scope | Team | Indicative budget* |
|-------|---------|----------------|------|--------------------|
| **MVP** | 90 days | Premium store: catalogue, search, cart, checkout, accounts, age-gate, CMS, basic AI advisor, UK launch | 6–9 people | **£250k–£450k** |
| **Growth** | 12 months | Marketplace beta, membership, sampling, community v1, multi-currency/lang, mature AI, US/EU expansion | 18–28 people | **£2.5m–£4.5m** (yr-1 all-in) |
| **Enterprise** | 3 years | Full marketplace, auction + cask investment exchange, data products, retail media, global ops, ML platform | 60–110 people | **£18m–£35m** (cumulative) |

\* Budgets are indicative ranges covering people, infrastructure, licences, compliance, and marketing seed. Detailed breakdowns in [Development Roadmap](06-development-roadmap.md).

## 6. Success criteria (how we know it worked)

- **Scale:** sustains millions of annual visitors and 100k+ SKUs without re-platforming.
- **Global:** multi-currency, multi-language, jurisdiction-aware fulfilment from Growth phase.
- **Conversion:** category-leading CVR via AI guidance, sampling, social proof, and frictionless checkout (target +30–50% vs. category baseline).
- **Trust:** authentication/provenance and verified marketplace reduce fraud to near-zero and build the brand moat.
- **Defensibility & exit:** proprietary palate/behaviour data, community, and marketplace liquidity make WhiskyMart.com an **attractive acquisition** for a drinks major, a marketplace, or a luxury group — the same playbook that took TWE to Pernod Ricard, but at a higher multiple because of the platform and data assets.

## 7. The single most important decision

**Build a platform, not a store.** Every architectural choice in this blueprint is made so that adding the marketplace (Phase 4) or the AI layer (Phase 5) is an *extension*, not a *rewrite*. The cost of composability is paid up front; the cost of a monolith is paid — far more painfully — at re-platform time, exactly when growth is hottest.

---

*Continue to → [01 Business Architecture](01-business-architecture.md)*
