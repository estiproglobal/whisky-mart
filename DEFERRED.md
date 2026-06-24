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

## 3. Other interface-first seams (swap when scaling)

| Capability | Now (dev) | Production target | Seam |
|------------|-----------|-------------------|------|
| Catalogue/data | Seed array | Medusa / API | `CatalogRepository` (`lib/catalog/repository.ts`) |
| Auth / account | Mock localStorage account | Clerk / Auth0 + server sessions | `AccountProvider` (`components/account/`) |
| Search | Seed + `relevanceScore()` over `/api/search` | Algolia / Typesense + vector | `/api/search` route + repository |
| Age verification | Self-declared gate + checkout checkbox | Persona / Veriff / Yoti | checkout `age` step + `/api/checkout/pay` |
| Jurisdiction/tax | Encoded rules table | Tax engine (Stripe Tax / Avalara) + fuller rules | `lib/checkout/jurisdiction.ts` |
| CMS/content | Static | Sanity | (Increment 6) |

---

## How to use this file
- When you implement a switch, move its row/section to a short "Done" note with
  the date and the commit, and delete the obsolete dev caveats.
- Keep `Project_Context.md` (architecture) and `Current_Task.md` (active work) in
  sync with anything promoted from here.
