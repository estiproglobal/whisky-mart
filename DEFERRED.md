# Deferred Production Switches

A register of integrations intentionally built **interface-first** with a dev
implementation now, to be swapped for the production implementation later. Each
is designed so the swap touches **one binding**, not callers (UI/API). This is
the on-the-record list so these are not forgotten.

> Principle: depend on an interface, not a vendor. The blueprint's composability
> (see `docs/03`) is realised by these seams.

---

## 1. Persistence — in-memory → **PostgreSQL** (planned)

- **Status:** interface-first since **Increment 4**.
- **Now:** `OrderRepository` and `ReviewRepository` (`apps/web/lib/db/types.ts`) are
  implemented in-memory (`apps/web/lib/db/memory.ts`), bound in `apps/web/lib/db/index.ts`.
- **Limitations (accepted for dev):** data resets on server restart; not shared
  across multiple instances; not safe for production.
- **Switch later to Postgres:**
  1. Add Prisma + a Postgres datasource (models per `docs/05-database-schema.md`).
  2. Implement `PrismaOrderRepository` / `PrismaReviewRepository` against the
     same interfaces in `apps/web/lib/db/`.
  3. Change the two bindings in `apps/web/lib/db/index.ts` to the Prisma impls.
  4. Add `DATABASE_URL`; run migrations in CI before deploy (`docs/07` §10).
  - **No changes needed** in API routes (`/api/checkout/pay`, `/api/orders`,
    `/api/products/[id]/reviews`) or UI.

## 2. Payments — mock → **Stripe (test mode → live)** (planned)

- **Status:** interface-first since **Increment 3**.
- **Now:** `PaymentProvider` interface + `MockPaymentProvider`
  (`apps/web/lib/checkout/payment.ts`). `getPaymentProvider()` returns the mock.
- **Switch later to Stripe:**
  1. `pnpm add stripe` in `apps/web`.
  2. Implement `StripePaymentProvider implements PaymentProvider` (create +
     confirm a PaymentIntent; never handle raw PANs in production — use Stripe
     Elements / a client-side token, see `docs/03` §2.7 and `docs/07` §8).
  3. In `getPaymentProvider()`, return the Stripe provider when
     **`STRIPE_SECRET_KEY`** is set (the `if (process.env.STRIPE_SECRET_KEY)`
     branch is already stubbed in `payment.ts`).
  4. Add env: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`.
  5. Add a webhook route (`/api/webhooks/stripe`) to confirm payment + finalise
     orders out-of-band.
  - **No changes needed** in `/api/checkout/pay` or the checkout UI contract.
- **Note:** alcohol is a high-risk MCC — confirm processor underwriting before
  going live (`docs/09` §7).

---

## 3. AI Sommelier — grounded mock → **Claude (Anthropic)** (planned)

- **Status:** interface-first since **Increment 5**.
- **Now:** an `Advisor` interface (`apps/web/lib/advisor/types.ts`) with a
  grounded, rule-based implementation (`GroundedMockAdvisor`) that retrieves real
  catalogue products via a shared engine — no LLM, no hallucinated products/prices.
  `getAdvisor()` (`apps/web/lib/advisor/index.ts`) returns the mock. Powers
  `/api/advisor` (Sommelier) and `/api/gift-finder`.
- **Switch later to Claude:**
  1. `pnpm add @anthropic-ai/sdk` in `apps/web`.
  2. Implement `ClaudeAdvisor implements Advisor` — RAG over the catalogue +
     tasting notes (retrieve with the existing engine, then have Claude phrase
     the response and rank), using the **latest Claude model**. Keep the
     grounding contract: cite only retrieved products; never invent price/stock.
  3. In `getAdvisor()`, return `ClaudeAdvisor` when **`ANTHROPIC_API_KEY`** is set
     (branch already noted in `index.ts`).
  4. Add env: `ANTHROPIC_API_KEY`. Add prompt-eval tests (grounding, refusals,
     responsible-drinking) per `docs/07` §9.
  - **No changes needed** in `/api/advisor`, `/api/gift-finder`, or the UI.
- **Guardrails (already in the mock, keep in Claude):** age-gated context,
  responsible-drinking disclaimer, no fabricated price/stock.

## 4. Content/CMS — seed content → **Sanity** (planned)

- **Status:** interface-first since **Increment 6**.
- **Now:** a `ContentRepository` (`apps/web/lib/content/repository.ts`) over seed
  articles (`seed.ts`). Content is a structured block model (`ContentBlock`)
  supporting shoppable product embeds. Powers `/guides`, `/guides/[slug]`, the
  home "Guides & stories" rail, and PDP "Featured in our guides".
- **Switch later to Sanity:**
  1. Create a Sanity project; model `Article` + portable-text/blocks to match
     the `Article`/`ContentBlock` types.
  2. Implement `SanityContentRepository implements ContentRepository`; map
     portable text → our `ContentBlock[]` (or extend the renderer).
  3. Rebind `content` in `repository.ts` to the Sanity-backed impl.
  4. Add env: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`; add a
     revalidation webhook (`/api/webhooks/cms`) for ISR.
  - **No changes needed** in the guide pages, home rail, PDP, or `sitemap.ts`.

## 5. Currency / FX — static rates → **live FX**, GBP-settlement → **multi-currency settlement** (planned)

- **Status:** interface-first since **Increment 7** (Phase 2).
- **Now:** `RatesProvider` with **static** illustrative rates (`apps/web/lib/market/currency.ts`),
  base GBP. Prices are stored in GBP and converted **for display only** in the
  shopper's chosen currency (`<Price>` + `CurrencyProvider`, cookie-persisted).
  Payment still settles in **GBP** (a `SettlementNote` tells non-GBP shoppers).
- **Switch later:**
  1. Implement a live `RatesProvider` (e.g. ECB/openexchangerates) with caching;
     swap the binding — `<Price>`/`displayMoney` are unchanged.
  2. For true **multi-currency settlement**, use Stripe presentment currencies
     (depends on the Stripe swap, §2) and record the settlement currency on the
     order. Remove the `SettlementNote`.
  3. Consider per-market price lists (not just FX conversion) for psychological
     pricing, and currency inference from the jurisdiction/geo.

## 6. i18n — UI message catalogue → **TMS/CMS + locale-routed SEO** (planned)

- **Status:** interface-first since **Increment 8** (Phase 2).
- **Now:** a local message catalogue (`apps/web/lib/i18n/messages.ts`, en/de/fr)
  + `LocaleProvider`/`useT`/`LocaleSwitcher`. Server + first render are English
  (English-canonical, SSG preserved); the saved locale is applied client-side
  after mount (`<html lang>` updated). The **core chrome** (nav, footer, age
  gate) is translated.
- **Switch later:**
  1. **Locale-routed URLs** (`/de/...`, `/fr/...`) via an `app/[locale]/` segment
     + middleware locale detection, so each language has a real URL — then add
     **`hreflang`** alternates for SEO. (This is the bigger refactor; the message
     layer above is reused.)
  2. Move strings to a **TMS** (e.g. Crowdin/Locize) or **Sanity** for translator
     workflows; translate full page bodies + product/content data per locale.
  3. Localise formats already partly handled (Intl currency/date).

## 7. Other interface-first seams (swap when scaling)

| Capability | Now (dev) | Production target | Seam |
|------------|-----------|-------------------|------|
| Catalogue/data | Seed array | Medusa / API | `CatalogRepository` (`lib/catalog/repository.ts`) |
| Auth / account | Mock localStorage account | Clerk / Auth0 + server sessions | `AccountProvider` (`components/account/`) |
| Search | Seed + `relevanceScore()` over `/api/search` | Algolia / Typesense + vector | `/api/search` route + repository |
| Age verification | Self-declared gate + checkout checkbox | Persona / Veriff / Yoti | checkout `age` step + `/api/checkout/pay` |
| Jurisdiction/tax | Encoded rules table | Tax engine (Stripe Tax / Avalara) + fuller rules | `lib/checkout/jurisdiction.ts` |

---

## How to use this file
- When you implement a switch, move its row/section to a short "Done" note with
  the date and the commit, and delete the obsolete dev caveats.
- Keep `Project_Context.md` (architecture) and `Current_Task.md` (active work) in
  sync with anything promoted from here.
