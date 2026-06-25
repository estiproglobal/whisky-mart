# Project Context — WhiskyMart.com

> Persistent context for anyone (human or AI agent) picking up this project. Read this first.

---

## What this project is

**WhiskyMart.com** is a plan to transform a premium, 14-year-aged exact-match domain (registered 17 July 2012) into the world's leading **whisky commerce, content, community, and collector ecosystem** — not merely an online store.

This repository contains the **strategic + technical blueprint** (10 documents under `README.md` + `docs/`) **and** the application now being built from it (`apps/web`, `packages/`). The blueprint is the contract; the app is built in tested increments (see `Current_Task.md`/`Handoff.md`).

**The thesis:** the category leaders are each incomplete — The Whisky Exchange is prestigious but supplier-owned (Pernod Ricard) and innovation-slowed; Master of Malt is deep but dated and un-personalised; The Whisky Shop is loyalty-strong but retail-bound; and the investment/auction/data world is run by entirely separate companies. **No one unifies buy → discover → learn → belong → collect → invest under one trusted, AI-native brand.** WhiskyMart.com will.

## The five-phase vision

1. **Phase 1** — Premium Whisky E-Commerce Store (MVP, 90 days)
2. **Phase 2** — Global Whisky Discovery Platform
3. **Phase 3** — Whisky Community & Membership Network
4. **Phase 4** — Collectors & Investment Marketplace
5. **Phase 5** — AI-Powered Personalised Whisky Platform (AI is woven through all phases)

## Architecture (target)

- **Posture:** MACH / composable (Microservices, API-first, Cloud-native, Headless). Start as a **modular monolith**; extract services only at proven bottlenecks. Build a *platform*, not a store, so the marketplace (P4) and AI layer (P5) are extensions, not rewrites.
- **Monorepo:** pnpm workspaces + Turborepo (`apps/`, `services/`, `packages/`, `infra/`).
- **Frontend:** Next.js (React 19, App Router, RSC) + TypeScript + Tailwind + shadcn/Radix; PWA → React Native later.
- **Commerce core:** Medusa.js (TS) — Shopify Plus is the documented fast-launch fallback.
- **Data:** PostgreSQL (+ pgvector) primary; Redis cache/queues; ClickHouse analytics; S3/R2 objects.
- **Search:** Algolia → Typesense/Meilisearch at scale + vector index (hybrid keyword + semantic).
- **AI:** Claude (Anthropic) API as primary reasoning engine; RAG over catalogue + tasting corpus; strict guardrails.
- **Payments:** Stripe (+ Connect for marketplace, Billing for subscriptions, Tax); Adyen at scale.
- **Auth + age:** Clerk/Auth0 + dedicated age-verification vendor (Persona/Veriff/Yoti).
- **CMS:** Sanity (headless, structured content).
- **Cloud/edge:** AWS (Terraform, ECS/EKS) + Cloudflare (CDN/WAF/Bot/R2/Stream). MVP can start on Vercel + managed services.

Full detail: `docs/03-technical-architecture.md` (stack + justified alternatives), `docs/05-database-schema.md` (ERD), `docs/07-ai-development-spec.md` (folders, APIs, models, CI/CD).

## Key decisions (and why)

| Decision | Rationale |
|----------|-----------|
| Composable/MACH, not a turnkey store | The 5-phase vision (marketplace, auction, investment, AI) exceeds any single SaaS; avoids a painful re-platform at peak growth. |
| Medusa.js for the commerce core | Owns data + economics + extensibility for the P4 marketplace and acquisition value; TS end-to-end. Shopify is the speed fallback. |
| PostgreSQL + pgvector | One DB for transactional integrity **and** AI/semantic search; JSONB for flexible whisky attributes. |
| Claude as the AI brain | Strong reasoning, long context for RAG, tool use, reliability — the Sommelier is the headline differentiator. |
| Compliance as encoded architecture | A server-side **jurisdiction engine** turns regulation into a moat (sell where rivals won't). |
| Eight diversified revenue streams | Shifts valuation from a retailer multiple to a platform multiple; de-risks the business. |
| Modular monolith first | Composability paid up front conceptually, but no premature microservice sprawl. |

## Important constraints

- **Regulatory (hard, local):** alcohol sale/shipping is jurisdiction-specific. US spirits DTC is severely restricted (3-tier system, state-by-state, USPS prohibited, FedEx/UPS licensed-only, 21+ ID + adult signature on delivery). EU = VAT/OSS/IOSS + per-country excise. **Age verification is mandatory everywhere.** See `docs/09-compliance-and-regulatory.md`.
- **Payments:** alcohol is a high-risk MCC — confirm processor underwriting early; keep a backup processor.
- **Trust/authenticity:** collectible whisky has a counterfeit problem; provenance/authentication (NFC/QR, verified sellers, escrow) is core, not optional.
- **Responsible marketing:** age-gate everything incl. the AI advisor; no targeting minors; no health claims; no encouraging excess; comply with ASA/CAP/TTB-style codes.
- **Data/privacy:** GDPR/CCPA; the palate model = profiling → requires DPIA, transparency, export/delete.
- **AI guardrails:** RAG-grounded (no fabricated price/stock), human-in-loop for state-changing support actions, eval suite gating prompt/model changes.

## Success criteria

Millions of annual visitors; 100k+ SKUs; multi-currency + multi-language from Growth; category-leading conversion via AI guidance + sampling + social proof; near-zero fraud via authentication; and **acquisition-attractiveness** to a drinks major / marketplace / luxury group (the TWE→Pernod playbook, at a platform multiple).

## Repository layout

```
README.md                              # index + thesis
docs/00-executive-summary.md           # the thesis in 10 minutes
docs/01-business-architecture.md       # Part 1
docs/02-product-architecture.md        # Part 2 (all modules)
docs/03-technical-architecture.md      # Part 3 (stack + alternatives)
docs/04-ui-ux-architecture.md          # Part 4 (wireframes, CRO, a11y)
docs/05-database-schema.md             # Part 5 (ERD-level)
docs/06-development-roadmap.md          # Part 6 (MVP/Growth/Enterprise)
docs/07-ai-development-spec.md          # Part 7 (build-ready spec)
docs/08-competitive-benchmark-analysis.md
docs/09-compliance-and-regulatory.md
Project_Context.md                     # this file
Current_Task.md                        # active work + acceptance criteria
Handoff.md                             # status snapshot
DEFERRED.md                            # planned production swaps (Postgres, Stripe, …)
```

> **Build status:** **Phase-1 MVP feature-complete** on `main` (Increments 1–6:
> storefront · search/wishlist · checkout+compliance+payment · accounts/
> persistence/reviews · AI Sommelier+Gift Finder · content+SEO). **Phase 2
> complete** — multi-currency (7) + i18n (8) + personalisation (9). **Increment
> 10: "The Private Cask Room" luxury/editorial design overhaul complete**
> (palette + `next/font/google` Cormorant Garamond/Inter + UI primitives;
> behaviour unchanged). 85 tests, all gates green. **Deployed to a Vercel
> preview** (`whisky-mart-web.vercel.app`, auto-deploy on push); whiskymart.com
> held pending design sign-off. Interface-first throughout — production
> integrations + real photography are recorded in `DEFERRED.md`.
