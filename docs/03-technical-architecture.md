# 03 — Technical Architecture (Part 3)

> The recommended technology stack, **with justification and alternatives compared**. Architectural posture, layer-by-layer decisions, and scalability planning.

---

## 1. Architectural posture: composable / MACH

**Decision:** Build on a **MACH** foundation — **M**icroservices, **A**PI-first, **C**loud-native, **H**eadless — rather than a monolithic off-the-shelf store.

**Why:** the five-phase vision spans commerce, a two-sided marketplace, auctions, cask investment, content, community, and ML. No single SaaS does all of this well. A composable architecture lets us:
- adopt **best-of-breed** per capability (search, payments, CMS, AI);
- add the marketplace (P4) and AI layer (P5) as **extensions, not rewrites**;
- swap any component without re-platforming;
- scale hot paths (search, catalogue) independently of cold paths (CMS, admin).

**The trade-off (stated honestly):** composability has higher up-front complexity and cost than a turnkey store. We mitigate this by **not over-decomposing early** — Phase 1 is a *modular monolith* (one well-structured commerce backend) that exposes clean APIs, and we extract services only when scale or team boundaries demand it. This is "MACH-ready," not "100 microservices on day one."

```
                         ┌──────────────────────────┐
                         │   Clients (Web/PWA/Mobile)│
                         │   Next.js · React Native  │
                         └────────────┬──────────────┘
                                      │  HTTPS / GraphQL+REST
                         ┌────────────▼──────────────┐
                         │   Edge / CDN / WAF (CF)    │
                         └────────────┬──────────────┘
                         ┌────────────▼──────────────┐
                         │   API Gateway / BFF        │
                         │   (Next API routes / GW)   │
                         └──┬─────┬─────┬─────┬─────┬──┘
        ┌───────────────────┘     │     │     │     └────────────────┐
   ┌────▼────┐   ┌────────┐  ┌────▼───┐ ┌▼──────┐ ┌──────┐     ┌──────▼─────┐
   │Commerce │   │ Search │  │  AI    │ │ CMS   │ │Identity│    │Marketplace │
   │ core    │   │ Algolia│  │ service│ │Sanity │ │ Auth  │    │/Auction/   │
   │(Medusa) │   │/Typesns│  │(Claude)│ │       │ │       │    │Investment  │
   └────┬────┘   └────────┘  └───┬────┘ └───────┘ └───────┘    └──────┬─────┘
        │                        │                                    │
   ┌────▼─────────────────────────────────────────────────────────────▼────┐
   │  Data layer: PostgreSQL(+pgvector) · Redis · ClickHouse · S3 · Kafka/SQS │
   └─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer-by-layer recommendations

For each layer: **the recommendation**, the **alternatives considered**, and **why we chose it**.

### 2.1 Frontend

**Recommendation: Next.js (React 19, App Router) + TypeScript**, deployed on **Vercel** (or self-hosted on AWS via OpenNext) with React Server Components, ISR for catalogue pages, and a **PWA** for mobile-web. Styling with **Tailwind CSS** + a component library (**shadcn/ui** / Radix) and a custom design system.

| Alternative | Verdict |
|-------------|---------|
| **Next.js** ✅ | Best SSR/ISR for SEO-critical commerce, huge ecosystem, RSC reduces client JS, first-class Vercel + edge, easy AI streaming UIs. **Chosen.** |
| Remix / React Router 7 | Excellent, but smaller commerce ecosystem; Next has stronger ISR + image + i18n tooling for catalogue scale. |
| Nuxt (Vue) | Fine, but React talent pool + commerce integrations (Medusa, Shopify Hydrogen) are deeper. |
| Astro | Great for content/SEO, weaker for highly interactive app surfaces (cart, advisor, marketplace). Could power the *content* sub-site. |
| Shopify Hydrogen | Only if we commit to Shopify backend (see §3). |

**Why:** SEO is existential in this category (content + catalogue), and Next's hybrid rendering (SSG/ISR/SSR/streaming) gives us fast, crawlable pages *and* rich interactivity (AI advisor, configurators) in one framework.

**Mobile:** start with an installable **PWA**; add **React Native (Expo)** apps in the Growth phase (shared TS types/business logic). Native app matters for collectors (vault, scan, push, allocations).

### 2.2 Backend / Commerce core

**Recommendation: Medusa.js** (open-source, TypeScript, modular commerce framework) as the commerce backbone, complemented by **purpose-built services** (in NestJS/TypeScript or Go for hot paths) for marketplace, auctions, investment, and the jurisdiction engine.

| Alternative | Verdict |
|-------------|---------|
| **Medusa.js** ✅ | Open-source, TS end-to-end (shared types with Next), modular architecture, marketplace-friendly, no per-GMV fees, full control of data & checkout. Fastest-growing OSS commerce. **Chosen for control + extensibility.** |
| **Shopify (Plus) / Hydrogen** | Fastest time-to-revenue, world-class checkout, payments, fraud, hosting. **But:** GMV/transaction fees, limited backend control, marketplace/auction/investment don't fit its model, data lives in Shopify. **Recommended as a pragmatic Phase-1 accelerator** if speed-to-market trumps control — then migrate or run hybrid. |
| **commercetools / Saleor** | Enterprise-grade, API-first. commercetools is powerful but six-figure licences and heavyweight; Saleor (Python/GraphQL) is strong but a different language ecosystem than our TS-centric stack. Reconsider at enterprise scale. |
| **Custom from scratch** | Maximum control, far too slow/expensive — reinventing carts, promotions, tax. Rejected. |
| **WooCommerce / Magento** | PHP monoliths, scaling and composability pain, weaker for marketplace/AI ambitions. Rejected. |

**The build-vs-buy decision (be explicit):**

> **If the priority is launching revenue in 90 days with minimal team → start on Shopify (Plus)** for the storefront and migrate the differentiated layers (marketplace, investment, AI, community) as separate services around it.
> **If the priority is owning the platform, data, and economics for a P4 marketplace + acquisition value → build the core on Medusa from the start.**

This blueprint recommends **Medusa** because the long-term thesis (marketplace, investment, data moat, acquisition multiple) is undermined by ceding the core, data, and economics to a third party. Shopify remains the explicit fallback if board priorities favour speed.

**Services language:** TypeScript (NestJS) for most services to share the Medusa/Next type ecosystem; **Go** for latency- or throughput-critical services (auction bidding engine, search indexing pipeline, jurisdiction engine) where it pays off.

### 2.3 Database (primary)

**Recommendation: PostgreSQL** (managed: **AWS Aurora PostgreSQL** or Neon/Supabase early) as the system of record, with the **pgvector** extension for embeddings.

| Alternative | Verdict |
|-------------|---------|
| **PostgreSQL** ✅ | ACID, relational integrity for orders/payments/inventory, JSONB for flexible product attributes, **pgvector** for AI search in the same DB, mature ecosystem, easy to operate. **Chosen.** |
| MySQL/MariaDB | Comparable, but Postgres's JSONB, extensions, and pgvector tilt it decisively for our AI + flexible-catalogue needs. |
| MongoDB | Flexible, but we need strong transactional guarantees for money/inventory; modelling orders/ledgers in a document DB invites pain. Use only for specific document-shaped data if at all. |
| DynamoDB / Spanner | Reserve for specific hyperscale needs later (e.g. event store). Premature for P1–P3. |

**Polyglot persistence (right tool per job):**
- **PostgreSQL** — transactional core (users, products, orders, payments, inventory, loyalty, marketplace, vault) + pgvector.
- **Redis** — caching, sessions, rate-limiting, cart, queues (BullMQ), real-time auction state, leaderboards.
- **ClickHouse** — analytics/event warehouse (clickstream, recommendations features, dashboards) — columnar, blazing for aggregations.
- **S3 / R2** — media, documents, provenance scans, backups.
- **Search index** — Algolia/Typesense (see §2.4).
- **(Optional) Kafka/Kinesis/SQS** — event backbone for async workflows (order events, inventory sync, marketplace settlements).

### 2.4 Search & discovery engine

**Recommendation:** **Algolia** for Phase 1 speed and best-in-class relevance/typo-tolerance/merchandising; with **Typesense or Meilisearch** as the **self-hosted alternative** when search volume makes Algolia's pricing material. Plus a **vector index** (**pgvector** initially, **Pinecone/Qdrant/Weaviate** at scale) for **semantic + AI search**.

| Alternative | Verdict |
|-------------|---------|
| **Algolia** ✅ (P1) | Instant, typo-tolerant, great faceting/merchandising/personalisation, easy React widgets. Best UX fastest. Cost grows with usage. |
| **Typesense / Meilisearch** ✅ (scale) | Open-source, self-hosted, very fast, predictable cost. Great migration target from Algolia. |
| **Elasticsearch / OpenSearch** | Most powerful/flexible, but heavier to operate and tune; choose if we need complex queries/log+search unification at enterprise scale. |
| **Postgres FTS only** | Fine for MVP fallback, not for faceted, typo-tolerant, personalised discovery at scale. |

**Hybrid search** is the differentiator: keyword (Algolia/Typesense) **+** vector similarity (embeddings of products/notes) **+** LLM re-ranking → enables "smoky island whisky like an old Ardbeg under £100" and the AI advisor.

### 2.5 Authentication & Identity

**Recommendation:** **Clerk** or **Auth0** for managed auth in P1 (fast, secure, passkeys/social/MFA), or **Supabase Auth/Better-Auth** if we want OSS/self-hosted. Add **age verification** via **Persona / Veriff / Yoti** (separate, dedicated compliance vendor — see [Doc 09](09-compliance-and-regulatory.md)).

| Alternative | Verdict |
|-------------|---------|
| **Clerk** ✅ | Excellent DX, passkeys, orgs (good for B2B/sellers), pre-built UI, MFA. Great for TS/Next. |
| **Auth0** | Enterprise-grade, mature, more expensive; strong if we need heavy enterprise SSO later. |
| Supabase Auth / Better-Auth / Keycloak | OSS/self-host control; more ops burden. Reconsider at scale for cost/control. |
| Roll-your-own | Don't — auth is a security minefield. Rejected. |

Identity is **role-based** (shopper, member, seller, collector, investor, staff) and feeds the jurisdiction + compliance engine (verified age/region gates checkout).

### 2.6 CMS (content & merchandising)

**Recommendation:** **Sanity** (headless, structured content, real-time, great DX, GROQ, portable text) for editorial/education/guides; commerce merchandising (collections, banners) handled in the commerce core + a thin merchandising service.

| Alternative | Verdict |
|-------------|---------|
| **Sanity** ✅ | Structured, flexible schema (perfect for guides/education/distillery pages), live preview, excellent for our content-as-SEO-engine strategy. |
| Contentful | Strong enterprise headless CMS; pricier, slightly less flexible modelling than Sanity. |
| Storyblok | Great visual editing for marketers; good alternative. |
| Strapi (OSS) | Self-hosted control; more ops. Viable cost-saver. |
| WordPress (headless) | Familiar to editors + huge plugin/SEO ecosystem; consider if the content team is WP-native. |

### 2.7 Payments

**Recommendation:** **Stripe** as primary (multi-currency, subscriptions/Billing, Connect for marketplace payouts, Radar fraud, Tax). Add **Adyen** at enterprise scale/global acquiring optimisation. Local methods via Stripe (iDEAL, Bancontact, SEPA, Klarna/BNPL). **Stripe Connect** is the marketplace settlement backbone (P4).

| Alternative | Verdict |
|-------------|---------|
| **Stripe** ✅ | Best DX, multi-currency, Billing (subscriptions), **Connect** (marketplace payouts/escrow), Radar, Tax, global coverage. One platform covers retail + subscriptions + marketplace. **Chosen.** |
| **Adyen** | Superior at very large scale for acquiring rates, local methods, unified global. Add later. |
| Braintree / PayPal | PayPal as an *additional* wallet method (trust for some buyers), not the core. |
| Shopify Payments | Only if on Shopify backend. |

Note: alcohol is a **regulated/high-risk MCC** — confirm processor acceptance and underwriting early (covered in [Doc 09](09-compliance-and-regulatory.md)).

### 2.8 APIs

**Recommendation:** **GraphQL** (via the BFF) for the storefront client (efficient, typed, great for composite product+content+AI views) **+ REST** for service-to-service and webhooks/integrations. Schema-first, typed end-to-end (TS types generated from GraphQL + DB). Public **partner/seller API** (REST + webhooks) for the marketplace. API gateway for auth, rate-limiting, versioning.

- **Internal:** event-driven (Kafka/SQS) for async (orders, inventory, settlements, notifications).
- **External integrations:** ERP/3PL/warehouse, tax (Avalara/Stripe Tax), age-verification, carriers, accounting, valuation-data feeds.

### 2.9 Analytics & Data

**Recommendation:** **First-party event pipeline** (Segment or open-source **Snowplow/RudderStack**) → **ClickHouse** / a warehouse (**BigQuery/Snowflake** at scale) → **dbt** transforms → **Metabase/Looker** dashboards. Product analytics via **PostHog** (also feature flags + session replay, self-hostable). **GA4** for marketing attribution.

| Layer | Choice | Why |
|-------|--------|-----|
| Event collection | Snowplow/RudderStack (OSS) or Segment | First-party, durable, privacy-controllable; **cookieless-resilient** |
| Warehouse | ClickHouse → BigQuery/Snowflake | Cheap fast aggregation now; scale later |
| Product analytics | PostHog | Funnels, replay, flags, experiments, self-host option |
| Marketing | GA4 + server-side tagging | Attribution, ads |
| BI | Metabase (early) → Looker | Self-serve dashboards |

**Why first-party:** post-cookie, our proprietary behavioural + palate data is both a personalisation asset and an acquisition moat — owning the pipeline matters.

### 2.10 Cloud infrastructure

**Recommendation:** **AWS** as primary cloud (broadest services, mature, enterprise/acquirer-friendly), IaC with **Terraform**, containers on **ECS Fargate** (simpler) or **EKS** (k8s, at scale). **Aurora PostgreSQL**, **ElastiCache (Redis)**, **S3**, **SQS/MSK**, **CloudFront** (or Cloudflare).

| Alternative | Verdict |
|-------------|---------|
| **AWS** ✅ | Broadest, most mature, best hiring pool, acquirer-friendly. **Chosen.** |
| GCP | Excellent data/ML (BigQuery, Vertex); strong alternative, esp. if data-team-led. |
| Azure | Strong if enterprise/Microsoft-aligned; less default for this profile. |
| Vercel + managed services (Neon/Upstash/Planetscale) | **Recommended for P1/MVP** — minimal ops, fast. Graduate to AWS as scale/cost/control demand. |

**Pragmatic path:** **Vercel (frontend) + managed Postgres (Neon/Aurora Serverless) + Upstash Redis + managed services** for MVP → consolidate onto AWS with Terraform as the team and traffic grow.

### 2.11 CDN, Edge & Media

**Recommendation:** **Cloudflare** (CDN + WAF + DDoS + Bot Management + R2 object storage + Images + Stream for video + edge workers). Pairs with Vercel/CloudFront.

**Why:** category-leading WAF/bot protection (critical for **limited-edition drops** and **scraping/auction sniping**), cheap egress (R2), image optimisation, and edge compute for personalisation/geo/jurisdiction routing.

### 2.12 Security layer

(Full detail in [Doc 07 §Security](07-ai-development-spec.md) and [Doc 09](09-compliance-and-regulatory.md).)
- **WAF + DDoS + bot management** (Cloudflare) — protects drops, auctions, checkout.
- **Secrets management** (AWS Secrets Manager / Doppler), no secrets in code.
- **Encryption** in transit (TLS 1.3) + at rest (KMS); field-level encryption for PII.
- **PCI-DSS** scope minimised by tokenising via Stripe (SAQ-A).
- **AuthN/Z:** MFA, passkeys, RBAC, least privilege, signed webhooks.
- **Compliance:** GDPR/CCPA (data export/delete), audit logging, SOC 2 readiness as an enterprise/acquisition signal.
- **AppSec:** SAST/DAST/dependency scanning (Snyk/Dependabot), secret scanning, pen-tests, rate limiting, idempotency keys on payments.
- **Fraud:** Stripe Radar + custom rules + ML trust scoring on marketplace.

### 2.13 AI infrastructure

**Recommendation:** **Claude (Anthropic) via the Claude API** as the primary reasoning model for the Sommelier, gift finder, pairing, support agent, and content/merchandising assist — chosen for strong reasoning, long context (large catalogue/RAG context), tool use, and reliability. Use the **latest Claude models** (e.g. Opus-class for complex reasoning/agents, a faster/cheaper Claude for high-volume tasks like tagging/summarisation).

- **RAG stack:** embeddings → pgvector/Pinecone → retrieval → Claude with grounded prompts + citations. Knowledge base = catalogue + tasting notes + reviews + education + policies.
- **Orchestration:** a thin **AI service** (TS) using the official SDK; tool-use for actions (search catalogue, fetch order, add to vault); **prompt caching** to cut cost on large static context (catalogue/policies).
- **Guardrails:** age-gating, responsible-drinking framing, no medical claims, PII handling, output validation, eval suite + human-in-the-loop for support actions.
- **Self-hosted/open models** (Llama/Mistral via Bedrock/together) considered for cost-sensitive bulk tasks (embeddings, tagging) — used where they're good enough, with Claude for the customer-facing reasoning that defines the brand.

---

## 3. Stack summary table

| Layer | Recommendation | Strong alternative |
|-------|----------------|--------------------|
| Frontend | Next.js + TS + Tailwind (PWA), React Native later | Remix; Nuxt; Hydrogen (if Shopify) |
| Commerce core | Medusa.js (TS) | Shopify Plus (speed); commercetools/Saleor (enterprise) |
| Services | NestJS (TS), Go for hot paths | — |
| Primary DB | PostgreSQL (Aurora) + pgvector | MySQL; (MongoDB for niche docs) |
| Cache/queue | Redis (ElastiCache/Upstash) + BullMQ | — |
| Analytics store | ClickHouse → BigQuery/Snowflake | — |
| Search | Algolia → Typesense/Meilisearch + vector | Elasticsearch/OpenSearch |
| Auth | Clerk / Auth0 | Supabase/Better-Auth/Keycloak |
| Age verification | Persona / Veriff / Yoti | Token of Trust |
| CMS | Sanity | Contentful; Storyblok; Strapi |
| Payments | Stripe (+Connect, Billing, Tax) | Adyen (scale); PayPal (wallet) |
| Tax/duty | Stripe Tax / Avalara | TaxJar |
| Cloud | AWS (Terraform, ECS/EKS) | GCP; Vercel+managed (MVP) |
| CDN/Edge/Sec | Cloudflare (CDN/WAF/Bot/R2/Stream) | CloudFront + AWS WAF |
| AI | Claude API + RAG (pgvector/Pinecone) | OSS models (Bedrock) for bulk tasks |
| Observability | OpenTelemetry + Grafana/Datadog; Sentry | New Relic |
| CI/CD | GitHub Actions + Terraform + Docker | GitLab CI |

---

## 4. Scalability planning

**Targets:** millions of annual visitors (peaks at product drops — 10–100× baseline for minutes), 100k+ SKUs, global low latency.

| Concern | Strategy |
|---------|----------|
| Traffic spikes (drops/auctions) | Edge caching + queue-based "waiting room" (Cloudflare) + autoscaling stateless services + Redis-backed inventory reservations + bot management |
| Read-heavy catalogue | ISR/edge caching of catalogue pages; search served by Algolia/Typesense, not the DB; read replicas |
| Write-heavy bursts (drops, bidding) | Idempotent APIs, optimistic concurrency, atomic stock decrement in Redis/Postgres, event queue to smooth spikes |
| Global latency | Multi-region CDN; regional read replicas; edge personalisation; region-aware data residency for compliance |
| Catalogue scale (100k+ SKUs) | Async indexing pipeline to search; denormalised read models; CDN for media |
| Cost at scale | Migrate Algolia→Typesense, Vercel→AWS, prompt-cache AI, tiered storage, right-size with autoscaling |
| Data growth/analytics | ClickHouse/warehouse separation from OLTP; CDC pipeline (Debezium) |
| Marketplace settlements | Event-sourced ledger, reconciliation jobs, Stripe Connect |

**Principle:** **stateless services + managed stateful stores + cache aggressively + async the non-critical path.** Decompose into services only at proven bottlenecks/team boundaries, not speculatively.

---

*Continue to → [04 UI/UX Architecture](04-ui-ux-architecture.md)*
