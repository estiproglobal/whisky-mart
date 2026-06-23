# 06 — Development Roadmap (Part 6)

> Three investment stages — **MVP (90 days)**, **Growth (12 months)**, **Enterprise (3 years)** — each with scope, team, timeline, and indicative budget.

**How to read budgets:** ranges are indicative and assume a blend of UK/EU senior contractors and full-time hires. They cover **people + infrastructure + licences + compliance + a marketing seed**. Currency: GBP. Swap in your local rates; the *relativities* matter more than the absolutes.

---

## STAGE 1 — MVP (90 Days)
**Goal:** a credible, premium, **revenue-generating** UK whisky store with the seeds of differentiation (AI advisor v1, samples), launched on a stack that won't need re-platforming.

### Scope / features
- **Catalogue & PDPs**: bottles, samples, accessories, gift packs; rich whisky attributes; media; SEO/structured data.
- **Taxonomy & PLPs**: faceted browse (region, price, age, flavour, brand) via Algolia/Typesense.
- **Search**: instant + typo-tolerant; basic semantic search.
- **Cart & checkout**: Stripe (cards + Apple/Google Pay), guest checkout, **age verification**, **UK jurisdiction rules**, tax, shipping, gift options.
- **Accounts**: auth (Clerk/Auth0), addresses, order history, wishlist, compare.
- **Reviews & ratings** (verified purchase) — basic.
- **CMS (Sanity)**: blog + buying guides + a few education pieces (SEO foundation).
- **AI Whisky Advisor v1**: grounded (RAG over catalogue) chat + Gift Finder (rules+AI).
- **Newsletter capture**, abandoned-cart email, back-in-stock alerts.
- **Analytics**: event pipeline + GA4 + PostHog; core dashboards.
- **Ops**: order management, basic inventory, 3PL/fulfilment integration, returns.
- **Compliance baseline**: age-gate, age verification vendor, T&Cs, GDPR, cookie consent, responsible-drinking.

### Explicitly **out** of MVP
Marketplace, auctions, investment, community/forums, native apps, multi-currency beyond display, full membership program (capture interest only).

### Team (6–9 people)
| Role | # |
|------|---|
| Tech lead / architect | 1 |
| Full-stack engineers (Next.js + Medusa/TS) | 2–3 |
| Front-end / design-system engineer | 1 |
| Product designer (UX/UI) | 1 |
| Product manager (part-time founder-led ok) | 0.5–1 |
| DevOps/platform (part-time/contract) | 0.5 |
| QA / content/merchandiser | 0.5–1 |
| AI engineer (can be one of the full-stack) | (shared) |

### Timeline (12 weeks)
- **Wk 1–2:** discovery, design system, architecture, environments/CI, vendor accounts (Stripe, age-verify, Algolia, Sanity).
- **Wk 3–6:** catalogue + PDP + PLP + search; CMS; auth/accounts.
- **Wk 5–8:** cart + checkout + payments + age/jurisdiction + fulfilment; reviews/wishlist.
- **Wk 7–10:** AI advisor v1 + gift finder; content seeding; SEO; analytics.
- **Wk 9–11:** hardening, performance (Core Web Vitals), accessibility, security review, UAT.
- **Wk 12:** soft launch (UK), monitoring, iterate.

### Budget (indicative): **£250k–£450k**
- People (12 wks, blended): £180k–£330k
- Infra + SaaS (Stripe, Algolia, Sanity, Clerk, age-verify, Vercel/AWS, observability): £8k–£20k
- Compliance/legal (terms, licensing review, age-verify): £10k–£30k
- Design/brand polish + photography: £10k–£25k
- Marketing seed (launch, SEO content, paid test): £40k–£60k

---

## STAGE 2 — Growth (12 Months)
**Goal:** evolve from store → **discovery platform + community + membership**, expand to EU (and begin US), and make AI personalisation real. Build the supply side for the marketplace.

### Scope / features (on top of MVP)
- **Membership (WhiskyMart Club)**: Free/Plus/Reserve tiers, members-pay-less, loyalty points, rewards, referrals.
- **Sampling & subscription boxes**: monthly flights, advent calendar, build-your-own; subscription management.
- **Limited-edition drops & ballots**: queue/waiting-room, member early access, anti-bot.
- **Community v1**: profiles, reviews+tasting notes (structured), Q&A (AI-drafted), basic clubs/forums.
- **Content engine**: video (Mux/Cloudflare Stream), podcast integration, WhiskyMart Academy, expanded guides; creator/affiliate program v1.
- **AI maturity**: personalised recommendations (palate fingerprint v1), food-pairing engine, AI support agent, semantic search GA, AI merchandising/auto-tagging internally.
- **Internationalisation**: multi-currency (Stripe), multi-language (i18n + hreflang), EU launch (VAT/IOSS, local payment methods), **jurisdiction engine v2**; begin US via 3PL/partner model.
- **WhiskyVault v1**: digital collection (manual + from-purchase).
- **Marketplace (private beta)**: seller onboarding/KYC, listings, Stripe Connect payouts, authenticity records — invite-only supply.
- **Mobile**: PWA hardening; begin React Native app.
- **CRO program**: experimentation (PostHog), lifecycle marketing, retention loops.
- **Reliability/SRE**: SLOs, on-call, observability maturity; SOC 2 readiness started.

### Team (18–28 people)
| Function | # |
|----------|---|
| Engineering (FE, BE, mobile, data, AI/ML, platform/SRE) | 10–15 |
| Product (PMs) | 2–3 |
| Design (UX/UI, design system, content design) | 2–3 |
| Data/analytics | 1–2 |
| Growth/marketing (SEO, performance, lifecycle, content) | 3–4 |
| Merchandising/category + buyer | 1–2 |
| Ops/compliance/customer support lead | 1–2 |
| Eng leadership (CTO/VP Eng, EM) | 1–2 |

### Timeline (quarters)
- **Q1:** membership + loyalty + referrals; samples/boxes; community v1; AI recs v1.
- **Q2:** i18n + multi-currency + EU launch; content/video/podcast; AI pairing + support agent.
- **Q3:** marketplace private beta; WhiskyVault v1; drops/ballots; native app beta.
- **Q4:** US partner launch; CRO/retention scale; marketplace expansion prep; SOC 2 readiness.

### Budget (indicative, year-1 all-in): **£2.5m–£4.5m**
- People (18–28, annualised blended): £1.8m–£3.2m
- Infra + SaaS at growing scale: £150k–£350k
- Compliance/legal (EU/US licensing, SOC 2 prep, data): £100k–£250k
- Marketing/growth (paid, content, partnerships, brand): £400k–£700k
- Content/photo/video production: £80k–£150k

---

## STAGE 3 — Enterprise (3 Years)
**Goal:** the full ecosystem — **public marketplace + auctions + cask/bottle investment + data products + retail media + global, compliant operations** — engineered for millions of visitors and acquisition-grade scale.

### Scope / features (cumulative)
- **Full public marketplace**: open seller onboarding, WhiskyMart-Fulfilled (bonded warehousing), promoted listings, ratings, disputes, escrow on high-value items, tiered commissions.
- **Auctions platform**: timed auctions, proxy bidding, anti-snipe, settlements, integrated with vault + authentication.
- **Investment & cask exchange**: cask brokerage, fractional ownership, custody/storage, insurance, portfolio dashboard, exit/bottling; valuation/pricing **data product + public API**.
- **Provenance/authentication at scale**: NFC/QR bottle authentication, blockchain-optional provenance chain, anti-counterfeit program.
- **AI platform (Phase 5)**: deeply personalised everything; mature palate model; agentic concierge across buying/collecting/investing; AI ops (pricing, demand, fraud/trust scoring, content at scale).
- **Retail media network**: self-serve brand advertising (search/category placements, sponsored content) — high-margin revenue.
- **Global operations**: APAC + selective MEA/Canada; regional warehouses/3PL; full multi-region data residency; localized everything.
- **Enterprise hardening**: SOC 2 Type II / ISO 27001, multi-region HA/DR, advanced fraud, full composability (extract services where scale demands), B2B/trade portal.
- **Native apps (iOS/Android) GA**: vault, scan-to-shop, auctions, allocations, push.

### Team (60–110 people across)
- **Engineering** (multiple squads): Commerce, Marketplace, Auctions/Investment, AI/ML, Data Platform, Mobile, Platform/SRE/Security — 35–60.
- **Product & Design**: 10–18.
- **Data/ML/Analytics**: 5–10.
- **Growth/Marketing/Content/Creator**: 8–15.
- **Category/Merchandising/Buying/Trade**: 5–10.
- **Ops/Compliance/Legal/Finance/Support**: 8–15.
- **Leadership**: CTO, VP Eng, VP Product, VP Growth, Heads of Data/Security/Ops.

### Timeline (years)
- **Year 1 (post-Growth):** marketplace GA, auctions, WhiskyVault valuation, US scale, SOC 2.
- **Year 2:** investment/cask exchange, retail media network, APAC, data API GA, native apps GA.
- **Year 3:** global optimisation, ML platform maturity, B2B/trade, acquisition-readiness (clean data room, audited financials, defensible IP).

### Budget (indicative, cumulative over 3 years): **£18m–£35m**
- People (scaling team): £13m–£24m
- Infra + SaaS + AI at scale: £1.5m–£3.5m
- Compliance/legal/licensing/insurance (multi-jurisdiction, investment products): £1m–£2.5m
- Warehousing/bonded/custody capex + 3PL: £1m–£3m
- Marketing/brand/partnerships/retail-media build: £2m–£4m

> **Note:** investment/cask + auction features carry **material regulatory and financial-services considerations** (custody, insurance, possibly financial-promotion rules in some jurisdictions). Budget assumes specialist legal counsel; see [Doc 09](09-compliance-and-regulatory.md).

---

## Cross-stage milestones & gates

| Gate | Criteria to proceed |
|------|---------------------|
| MVP → Growth | Stable UK ops, positive unit economics signal, CWV green, LTV:CAC trending >3:1, content/SEO traction |
| Growth → Enterprise | Membership + repeat-rate proof, marketplace beta liquidity, multi-region compliance proven, SOC 2 readiness |
| Enterprise → Exit-ready | Platform revenue mix shifting to marketplace/media/data, defensible data + community moat, audited financials, clean IP |

## Risk register (top risks & mitigations)
| Risk | Mitigation |
|------|------------|
| Regulatory/shipping complexity (esp. US spirits DTC) | Compliance engine + 3PL/licensed-partner model + phased market entry |
| Marketplace cold-start (liquidity) | Seed supply first (bottlers/retailers), low intro fees, WhiskyMart-Fulfilled, authentication trust |
| Payment processing for high-risk MCC | Early underwriting with Stripe/Adyen; backup processor |
| Counterfeits / fraud | Authentication layer, verified sellers, escrow, ML trust scoring |
| AI hallucination / responsible-drinking | RAG grounding, guardrails, human-in-loop, eval suite |
| Over-engineering early | Modular monolith first; extract services only at proven bottlenecks |
| Talent/burn | Blend contractors + hires; ruthless MVP scoping; build-vs-buy discipline |

---

*Continue to → [07 AI Development Specification](07-ai-development-spec.md)*
