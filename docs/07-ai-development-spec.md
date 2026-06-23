# 07 — AI Development Specification (Part 7)

> A drop-in technical specification for **AI software-engineering platforms** (Claude Code, Cursor, Windsurf, Replit Agent, OpenAI Codex) or a human team to begin building **WhiskyMart.com**. It is written to be actionable: folder structure, API contracts, data models, component hierarchy, user flows, security, testing, deployment, and CI/CD.

> **Agent instruction:** Build the MVP scope ([Doc 06 Stage 1](06-development-roadmap.md)) first. Use the stack in [Doc 03](03-technical-architecture.md). Treat this document as the contract; treat [Doc 05](05-database-schema.md) as the canonical data model. Prefer boring, well-typed, tested code. Do not invent scope beyond the MVP without flagging it.

---

## 1. System architecture (target)

```
apps/
  web        → Next.js storefront (React 19, App Router, RSC, Tailwind)  [public]
  admin      → Next.js admin/merchandising UI                            [internal]
  mobile     → Expo / React Native (Growth phase)                        [public]
services/
  commerce   → Medusa.js (catalog, cart, orders, payments, inventory)    [API]
  ai         → AI service: Sommelier/RAG/recs (NestJS or Next route)     [API]
  search     → indexer + query API (Algolia/Typesense adapters)          [API]
  jurisdiction → compliance/age/tax/duty rules engine (Go or TS)         [API]
  marketplace  → sellers, listings, payouts, auctions, investment (P4)   [API]
packages/
  ui         → shared design-system components (Storybook)
  config     → eslint/tsconfig/tailwind shared config
  types      → shared TS types + zod schemas (generated from DB/GraphQL)
  sdk        → typed client for internal APIs
infra/
  terraform  → IaC (AWS), environments (dev/stage/prod)
  docker     → Dockerfiles, compose for local
```

**Communication:** storefront → BFF (Next route handlers / GraphQL) → services (REST/GraphQL). Async via queue (BullMQ/Redis → SQS at scale). AuthN via Clerk/Auth0 JWT; AuthZ via RBAC middleware. All money operations idempotent.

**Repository strategy:** a **TypeScript monorepo** with **pnpm workspaces + Turborepo** (fast, cached builds; shared types end-to-end).

---

## 2. Folder structure (monorepo, concrete)

```
whisky-mart/
├─ apps/
│  ├─ web/
│  │  ├─ app/                      # Next.js App Router
│  │  │  ├─ (shop)/
│  │  │  │  ├─ page.tsx            # Home
│  │  │  │  ├─ products/[slug]/    # PDP
│  │  │  │  ├─ c/[...facets]/      # PLP / category (faceted)
│  │  │  │  ├─ search/             # search results
│  │  │  │  ├─ cart/  checkout/    # cart + checkout flow
│  │  │  │  └─ gifts/  samples/
│  │  │  ├─ (content)/             # blog, guides, academy (Sanity)
│  │  │  ├─ (account)/account/     # dashboard, vault, orders
│  │  │  ├─ api/                   # route handlers (BFF, webhooks)
│  │  │  └─ layout.tsx
│  │  ├─ components/               # app-specific components
│  │  ├─ lib/                      # data fetching, clients, utils
│  │  └─ tests/  (unit, e2e)
│  └─ admin/  ...
├─ services/
│  ├─ commerce/   (Medusa modules: catalog, cart, order, payment, inventory)
│  ├─ ai/
│  │  ├─ src/
│  │  │  ├─ sommelier/             # advisor: prompt, tools, RAG
│  │  │  ├─ recommendations/
│  │  │  ├─ pairing/  gift-finder/  support/
│  │  │  ├─ rag/                   # retrieval, embeddings, chunking
│  │  │  ├─ guardrails/            # age, responsible-drinking, PII
│  │  │  └─ evals/                 # prompt/RAG eval suite
│  │  └─ tests/
│  ├─ search/    (adapters/algolia.ts, adapters/typesense.ts, indexer/)
│  ├─ jurisdiction/  (rules/, tax/, age/, carriers/)
│  └─ marketplace/   (sellers/, listings/, auctions/, investment/, payouts/)
├─ packages/  ui/  types/  sdk/  config/
├─ infra/     terraform/  docker/  github-actions/
├─ docs/      (this blueprint)
├─ .github/workflows/   ci.yml  deploy.yml  security.yml
├─ turbo.json  pnpm-workspace.yaml  package.json  tsconfig.base.json
└─ README.md
```

---

## 3. API architecture

**Pattern:** GraphQL for storefront composite reads; REST for commands/webhooks/partner API. All endpoints typed (zod request/response validation), versioned (`/api/v1`), authenticated, rate-limited, idempotent for writes that touch money.

### 3.1 Core REST endpoints (MVP)

```
# Catalog
GET    /api/v1/products?facets=...&sort=...&page=...     # via search service
GET    /api/v1/products/:slug
GET    /api/v1/brands/:slug   /distilleries/:slug   /regions/:slug
GET    /api/v1/collections/:slug

# Search
GET    /api/v1/search?q=...&type=products|content        # keyword + semantic
POST   /api/v1/search/semantic   { query }               # vector + LLM rerank

# Cart
POST   /api/v1/carts                                     # create
GET    /api/v1/carts/:id
POST   /api/v1/carts/:id/items                           # add (idempotency-key)
PATCH  /api/v1/carts/:id/items/:itemId
DELETE /api/v1/carts/:id/items/:itemId

# Checkout (jurisdiction + age gated)
POST   /api/v1/checkout/:cartId/shipping-address         # → jurisdiction check
POST   /api/v1/checkout/:cartId/age-verify               # Persona/Veriff flow
POST   /api/v1/checkout/:cartId/payment-intent           # Stripe PI (idempotent)
POST   /api/v1/checkout/:cartId/complete

# Account
GET/PATCH /api/v1/me
GET    /api/v1/me/orders   /wishlists   /reviews   /vault
POST   /api/v1/wishlists/:id/items
POST   /api/v1/reviews                                   # verified-purchase

# AI
POST   /api/v1/ai/sommelier      { sessionId, message, context }   # SSE stream
POST   /api/v1/ai/gift-finder    { recipient, occasion, budget, taste }
POST   /api/v1/ai/pairing        { productId | dish }
POST   /api/v1/ai/support        { sessionId, message }   # tool-using agent

# Webhooks (verified signatures)
POST   /api/v1/webhooks/stripe
POST   /api/v1/webhooks/age-verification
POST   /api/v1/webhooks/cms        # Sanity → revalidate ISR
```

### 3.2 GraphQL (storefront composite) — example

```graphql
type Query {
  product(slug: String!): Product
  products(filter: ProductFilter, sort: ProductSort, page: Int): ProductConnection!
  me: User
  cart(id: ID!): Cart
}
type Mutation {
  addToCart(cartId: ID!, variantId: ID!, qty: Int!): Cart!
  askSommelier(sessionId: ID, message: String!): SommelierReply!  # streamed via subscription/SSE
}
type Product {
  id: ID!  slug: String!  title: String!
  brand: Brand  distillery: Distillery  region: Region
  whisky: WhiskyDetails               # abv, age, cask, ppm...
  variants: [Variant!]!
  price(currency: Currency, member: Boolean): Money!
  ratingAvg: Float  ratingCount: Int
  flavourProfile: FlavourProfile
  reviews(first: Int): ReviewConnection!
  similar: [Product!]!                # vector similarity
}
```

### 3.3 Marketplace / partner API (P4)
REST + webhooks: `POST /sellers`, `POST /listings`, `GET /orders`, `POST /shipments`, webhook `listing.sold`, `payout.paid`. OAuth2 client credentials per seller.

---

## 4. Database models (code-level)

Use **Prisma** (or Drizzle) over PostgreSQL for app services; Medusa manages its own commerce tables. Below: representative models for the platform-specific domains (full model in [Doc 05](05-database-schema.md)). pgvector enabled.

```prisma
// schema.prisma (excerpt)
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL"); extensions = [pgvector] }

model User {
  id               String   @id @default(uuid())
  email            String   @unique
  displayName      String?
  dob              DateTime?
  ageVerified      Boolean  @default(false)
  ageVerifiedAt    DateTime?
  locale           String   @default("en-GB")
  preferredCurrency String  @default("GBP")
  country          String?
  roles            UserRole[]
  addresses        Address[]
  orders           Order[]
  reviews          Review[]
  wishlists        Wishlist[]
  loyalty          LoyaltyAccount?
  vaultItems       VaultItem[]
  palate           PalateProfile?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  @@index([country])
}

model Product {
  id            String   @id @default(uuid())
  type          ProductType
  title         String
  slug          String   @unique
  description   String?
  brandId       String?
  distilleryId  String?
  status        ProductStatus @default(DRAFT)
  isMarketplace Boolean  @default(false)
  sellerId      String?
  whisky        WhiskyDetails?
  variants      Variant[]
  reviews       Review[]
  ratingAvg     Float    @default(0)
  ratingCount   Int      @default(0)
  flavourVector Unsupported("vector(64)")?   // pgvector
  seo           Json?
  createdAt     DateTime @default(now())
  @@index([title])
}

model WhiskyDetails {
  productId     String   @id
  product       Product  @relation(fields: [productId], references: [id])
  abv           Decimal?
  ageYears      Int?     // null = NAS
  regionId      String?
  caskType      String[]
  vintageYear   Int?
  bottlingYear  Int?
  peatPpm       Int?
  chillFiltered Boolean?
  naturalColour Boolean?
  limitedEdition Boolean @default(false)
  outturn       Int?
}

model Variant {
  id          String  @id @default(uuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id])
  sku         String  @unique
  sizeMl      Int
  priceAmount Int     // minor units
  memberPriceAmount Int?
  currency    String  @default("GBP")
  inventory   InventoryItem?
}

model Order {
  id            String   @id @default(uuid())
  orderNumber   String   @unique
  userId        String?
  status        OrderStatus @default(PENDING)
  currency      String
  shipToCountry String
  grandTotal    Int
  ageCheckStatus AgeCheckStatus @default(REQUIRED)
  jurisdictionDecision Json
  items         OrderItem[]
  payments      Payment[]
  placedAt      DateTime?
  @@index([shipToCountry])
}

model Payment {
  id              String  @id @default(uuid())
  orderId         String
  provider        String  @default("stripe")
  intentId        String  @unique
  amount          Int
  currency        String
  status          PaymentStatus
  idempotencyKey  String  @unique
}

model PalateProfile {
  userId        String  @id
  user          User    @relation(fields: [userId], references: [id])
  flavourVector Unsupported("vector(64)")
  preferences   Json
  confidence    Float   @default(0)
  source        String
  updatedAt     DateTime @updatedAt
}

enum ProductType { BOTTLE SAMPLE GIFT_PACK BUNDLE ACCESSORY CASK EXPERIENCE DIGITAL }
enum ProductStatus { DRAFT ACTIVE ARCHIVED OUT_OF_STOCK }
enum OrderStatus { PENDING PAID PROCESSING SHIPPED DELIVERED CANCELLED REFUNDED ON_HOLD }
enum PaymentStatus { REQUIRES_ACTION AUTHORIZED CAPTURED FAILED REFUNDED }
enum AgeCheckStatus { REQUIRED PASSED AT_DELIVERY }
```

---

## 5. AI subsystem specification

### 5.1 Sommelier (RAG advisor) — reference flow
```
user message
  → guardrails.preCheck (age verified? responsible-drinking intent? PII?)
  → retrieve: embed(query) → vector search (products, notes, reviews, education)
  → assemble grounded context (+ user palate profile + cart/history)
  → Claude (latest model) with system prompt + tools + prompt-cached static context
       tools: searchCatalog(filters), getProduct(id), addToCart(variantId),
              getOrderStatus(orderId), buildFlight(criteria)
  → stream response (SSE) with citations to products/content
  → guardrails.postCheck (no medical claims, no over-consumption encouragement)
  → log ai_messages (tokens, latency, grounded_sources) for evals
```
**System prompt principles:** persona = knowledgeable, warm whisky sommelier; always ground recommendations in retrieved catalogue; cite products by id; never fabricate prices/stock (read from tools); promote responsible drinking; refuse to advise minors; stay in-domain.

**Model choice:** use the **latest Claude models** via the Claude API — an Opus-class model for the conversational advisor/agentic support, a faster/cheaper Claude for bulk tasks (tagging, summarising reviews, generating SEO copy). Use **prompt caching** for large static context (policies, taxonomy) and **streaming** for UX.

### 5.2 Recommendations
Hybrid: collaborative filtering (purchase/co-view) + content embeddings (flavour vectors) + LLM re-ranking with the user's palate profile. Served from `recommendation_cache` with TTL; recomputed on signals (purchase, review, vault add).

### 5.3 Guardrails (non-negotiable)
- Age-gate every AI surface; never assist minors.
- Responsible-drinking framing; no health/medical claims; no encouragement of excess.
- Strict grounding (RAG); no fabricated stock/price/availability — read via tools.
- PII minimisation in prompts/logs; output validation; human-in-loop for support actions that change state (refunds, address changes).
- Evaluation suite (golden questions, factuality, refusal correctness) gating prompt/model changes in CI.

---

## 6. Component hierarchy (web, MVP)

```
<RootLayout>
  <Providers> (theme, cart, auth, currency, analytics)
  <Header> <MegaNav/> <SearchBar/> <CurrencySwitcher/> <CartButton/> <AccountMenu/> </Header>
  <AgeGate/>                         # interstitial / persisted
  <main>
    Home: <Hero/> <PersonalizedRail/> <IntentShortcuts/> <ProductRail/>* <StoryBlock/> <ContentRail/> <TrustBar/>
    PLP:  <FacetSidebar/> <ActiveFilters/> <SortControl/> <ProductGrid><ProductCard/>*</ProductGrid> <AiFallbackCTA/>
    PDP:  <Gallery/> <BuyBox> <PriceBlock/><VariantSelect/><AddToCart/><SampleCTA/><WishlistBtn/> </BuyBox>
          <KeyFacts/> <FlavourProfile/> <Tabs:[Desc|Notes|Reviews|Pairing|QA]/> <SimilarProducts/> <AddToVault/>
    Cart/Checkout: <CartLineItem/>* <OrderSummary/> <ExpressPay/> <CheckoutStepper>
          <DeliveryStep/><AgeVerifyStep/><ShippingStep/><PaymentStep/><ReviewStep/></CheckoutStepper>
    Account: <DashboardNav/> <Overview/> <Orders/> <Vault/> <Wishlist/> <Memberships/> <Palate/> <Privacy/>
  </main>
  <SommelierWidget/>                 # persistent AI advisor (drawer)
  <Footer/>
</RootLayout>
```
Components live in `packages/ui` (generic) and `apps/web/components` (app-specific). All accessible (Radix), documented in Storybook, covered by unit + visual tests.

---

## 7. Key user flows

1. **Discover → Buy (newcomer):** Home → Ask Sommelier / quiz → recommended bottle or sample → PDP → add sample + bottle → checkout (age verify) → confirmation → lifecycle email.
2. **Gift:** Home/Gift banner → Gift Finder (recipient/occasion/budget/taste) → curated picks → add gift wrap + message + scheduled delivery → checkout.
3. **Search → Compare → Buy (enthusiast):** semantic search → PLP facets → compare 3 → PDP reviews/notes → buy → add to vault.
4. **Member journey:** see member price on PDP → join Plus at checkout → earn points → ballot entry for a drop.
5. **Sell (P4):** seller onboarding/KYC → create listing → authentication → sale → Stripe Connect payout.
6. **Collect/Invest (P4):** scan bottle → add to vault → see valuation → list for sale / send to auction; or browse casks → buy → custody → portfolio dashboard.

---

## 8. Security requirements
- **Transport:** TLS 1.3 everywhere; HSTS; secure cookies (HttpOnly, SameSite).
- **AuthN/Z:** Clerk/Auth0 JWT; RBAC middleware on every protected route; least privilege; passkeys + MFA for staff/sellers.
- **Payments:** tokenise via Stripe (PCI SAQ-A; never store PAN); idempotency keys; webhook signature verification.
- **Secrets:** AWS Secrets Manager/Doppler; no secrets in repo; rotated; `.env` git-ignored; CI secret scanning.
- **Data protection:** encryption at rest (KMS), field-level encryption for PII (dob, verification refs); GDPR/CCPA export+delete; data residency by region.
- **Compliance gates:** age verification + jurisdiction engine enforced server-side at checkout (never client-trust); audit logging of compliance decisions.
- **AppSec:** input validation (zod) on all boundaries; output encoding (XSS); parameterised queries (no raw SQL injection); CSRF protection; rate limiting; bot management (Cloudflare) on drops/auctions/checkout; dependency + SAST/DAST scanning (Snyk/CodeQL/Dependabot).
- **AI security:** prompt-injection defenses (treat retrieved/user content as untrusted; tool allow-lists; no secret exposure in prompts); guardrails (§5.3).
- **Operational:** WAF/DDoS, least-privilege IAM, network segmentation, audit logs, incident runbooks, SOC 2 readiness from Growth.

---

## 9. Testing framework
| Layer | Tooling | Gate |
|-------|---------|------|
| Unit | **Vitest** (TS) | required, ≥80% on critical modules |
| Component/UI | Testing Library + Storybook + Chromatic (visual) | required for `packages/ui` |
| Integration/API | Vitest + Supertest; test DB (Testcontainers) | required for services |
| E2E | **Playwright** (checkout, age-gate, search, AI) | required in CI on PR |
| Accessibility | axe + Playwright + Lighthouse CI | release gate (WCAG 2.2 AA) |
| Performance | Lighthouse CI (CWV budgets) | release gate |
| Load | k6 (drops, auctions, checkout spikes) | pre-launch + before drops |
| Security | Snyk, CodeQL, npm audit, secret scan, OWASP ZAP | required |
| AI evals | custom eval harness (factuality, grounding, refusal, regression) | gate on prompt/model change |
| Contract | Pact (consumer-driven) for service APIs | Growth+ |

Test data via factories/fixtures; deterministic seeds; no live payments (Stripe test mode); golden datasets for AI evals.

---

## 10. Deployment process
- **Environments:** `dev` → `staging` → `production`, each with isolated infra (Terraform workspaces), DB, secrets.
- **Artifacts:** Docker images (services), Vercel deploys (web/admin) or containerised on AWS via OpenNext.
- **DB migrations:** Prisma Migrate / Medusa migrations; **forward-only**, reviewed, run in CI before deploy; backups + point-in-time recovery; migration dry-run on staging.
- **Release strategy:** trunk-based + short-lived PR branches; **preview deployment per PR**; **blue/green or canary** to production; feature flags (PostHog/LaunchDarkly) to decouple deploy from release.
- **Rollback:** instant via flags + previous image/Vercel deployment; DB migrations designed reversible/expand-contract.
- **Observability:** OpenTelemetry traces, structured logs, metrics (Grafana/Datadog), error tracking (Sentry), uptime + SLO alerts, on-call.

---

## 11. CI/CD workflow (GitHub Actions)

```yaml
# .github/workflows/ci.yml (illustrative)
name: ci
on: [pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo lint typecheck            # eslint + tsc
      - run: pnpm turbo test                       # vitest unit/integration (Testcontainers)
      - run: pnpm turbo build                      # build all apps/services
      - run: pnpm exec playwright test             # e2e (against preview)
      - run: pnpm exec lhci autorun                # Lighthouse CI (perf + a11y budgets)
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/analyze@v3      # SAST
      - run: npx snyk test || true                 # dependency scan
      - uses: gitleaks/gitleaks-action@v2          # secret scan
  ai-evals:
    if: contains(github.event.pull_request.labels.*.name, 'ai')
    runs-on: ubuntu-latest
    steps:
      - run: pnpm --filter @wm/ai eval             # AI grounding/refusal/factuality gate
```

```yaml
# .github/workflows/deploy.yml (illustrative)
name: deploy
on: { push: { branches: [main] } }
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile && pnpm turbo build
      - run: pnpm db:migrate:deploy                # forward-only migrations
      - run: ./infra/deploy.sh staging             # terraform apply + image push/canary
      # e2e smoke on staging → manual approval → promote
  deploy-production:
    needs: deploy-staging
    environment: { name: production }              # requires approval
    runs-on: ubuntu-latest
    steps:
      - run: ./infra/deploy.sh production --canary  # blue/green / canary + health checks
```

**Pipeline gates (must pass to merge/deploy):** lint, typecheck, unit/integration, e2e, a11y + perf budgets, security scans, (AI evals if AI-touched). Production deploy requires green staging + approval; canary with auto-rollback on SLO breach.

---

## 12. Environment variables (contract — names only)
```
DATABASE_URL  REDIS_URL  CLICKHOUSE_URL
STRIPE_SECRET_KEY  STRIPE_WEBHOOK_SECRET  STRIPE_CONNECT_CLIENT_ID
CLERK_SECRET_KEY  CLERK_PUBLISHABLE_KEY        # or AUTH0_*
AGE_VERIFICATION_API_KEY  AGE_VERIFICATION_WEBHOOK_SECRET
ALGOLIA_APP_ID  ALGOLIA_ADMIN_KEY  ALGOLIA_SEARCH_KEY   # or TYPESENSE_*
SANITY_PROJECT_ID  SANITY_DATASET  SANITY_API_TOKEN
ANTHROPIC_API_KEY                                  # Claude API (AI layer)
S3_BUCKET  AWS_REGION  CLOUDFLARE_*  
POSTHOG_KEY  GA4_ID  SENTRY_DSN
TAX_PROVIDER_KEY  (Stripe Tax / Avalara)
JWT_SIGNING_KEY  ENCRYPTION_KEY
```
All injected via secrets manager; never committed.

---

## 13. Definition of Done (per feature)
- Typed, validated (zod) at boundaries; no `any` on public APIs.
- Unit + integration tests; e2e for user-facing flows; a11y checked.
- Meets CWV budget; responsive + accessible (WCAG 2.2 AA).
- Observability: logs/metrics/traces + error handling.
- Security reviewed (authz, input validation, secrets); compliance gates server-side where relevant.
- Docs/Storybook updated; feature-flagged if risky; migration reversible.

---

*Continue to → [08 Competitive Benchmark Analysis](08-competitive-benchmark-analysis.md)*
