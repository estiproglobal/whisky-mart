# Handoff

**Date:** 2026-06-24
**From:** Claude (agent session)
**To:** Repo owner (estiproglobal) / next agent session

---

## Completed

- **Platform blueprint** (11 docs: `README.md` + `docs/00`–`docs/09`) authored, covering all 7 Parts + benchmark analysis + compliance dossier.
- **Context files:** `Project_Context.md`, `Current_Task.md`, `Handoff.md`, plus `.gitignore`.
- **Delivered to GitHub:** all blueprint + context files are **live in `estiproglobal/whisky-mart` on `main`** (uploaded manually by the owner). Verified via repo screenshot.
- **Repo Actions setting** changed to "Read and write permissions" (helps future in-repo CI/CD `GITHUB_TOKEN`; does not affect this session's push access).
- **MVP build — Increment 1 (Storefront foundation): ✅ COMPLETE & VERIFIED.**
  - Monorepo: pnpm workspaces + Turborepo; `tsconfig.base.json`; root scripts.
  - `packages/types`: shared domain model + zod (Product, Variant, WhiskyDetails, FlavourProfile, ProductFilter, Cart…).
  - `apps/web`: Next.js 15 (App Router) + TypeScript + Tailwind (whisky design tokens).
  - Design system: Button, ProductCard, Badge, StarRating, FlavourBars, ProductRail, SiteHeader/Footer, SearchBox, AgeGate.
  - Data layer: seed catalogue (10 products) + swappable `CatalogRepository` with faceted search, sort, related, cart resolution.
  - Pages: Home (hero, shortcuts, rails, sommelier teaser, trust bar), Shop/PLP (faceted, URL-driven), 12 category collections, Search, PDP (buy box, key facts, flavour bars, tasting notes, sample CTA, related), Cart (qty/remove/summary), Sommelier teaser, 404.
  - Cart: client context + localStorage persistence + header indicator.
  - Quality gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (16) · `build` ✓ (30 routes) · runtime smoke test ✓.
- **Repo reconciled:** adopted `origin/main` as base; restored `.gitignore` + `apps/web/.eslintrc.json` (dropped by the web-UI folder upload); preserved the owner's Claude GitHub Action workflows.
- **MVP build — Increment 2 (Search, Wishlist & Recently-viewed): ✅ COMPLETE & VERIFIED, pushed to `main`.**
  - `GET /api/search` + `relevanceScore()`; instant-search autocomplete; wishlist (provider + hearts + page); recently-viewed; PLP active-filter chips.
- **MVP build — Increment 3 (Checkout, age verification & payment): ✅ COMPLETE & VERIFIED, pushed to `main`.**
  - Jurisdiction engine (`lib/checkout/jurisdiction.ts`) — server-authoritative shippability + tax/age rules (UK allowed; US/unknown blocked with reason).
  - VAT-aware pricing (`pricing.ts`, UK inclusive / EU added), shipping methods (free standard over £100).
  - `PaymentProvider` interface + `MockPaymentProvider` (declines a card ending 0002). Stripe swaps in behind it when `STRIPE_SECRET_KEY` is set.
  - API: `POST /api/checkout/quote`, `POST /api/checkout/pay` (re-validates jurisdiction + age server-side).
  - Multi-step `CheckoutFlow`, order summary, `/checkout/confirmation`; cart checkout button enabled.
  - Quality gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (36) · `build` ✓ (36 routes) · runtime smoke test ✓ (quote allowed/blocked; pay success/age/jurisdiction/decline).

## In-progress

- **Increment 4 — Accounts, order persistence & reviews** is the active/next task (not yet started). Scope + acceptance criteria in `Current_Task.md`.

## Blocked by

- **Nothing blocking.** Write access confirmed — Claude pushes directly to `origin/main`.
- **Decision resolved:** payment uses a **mock provider** behind a `PaymentProvider` interface; real Stripe test mode swaps in later behind the same interface (add `STRIPE_SECRET_KEY`).
- **Heads-up for Increment 4:** orders are **not yet persisted** (returned from the pay API and held in `sessionStorage` for the confirmation page only). Increment 4 should add an `OrderRepository` / persistence layer.

## Next Action

1. **Claude — Increment 4:** Accounts, order persistence & reviews. Add an `OrderRepository`/persistence layer (orders survive), a lightweight account (profile + addresses + order history), and verified-purchase reviews that render on the PDP and aggregate ratings.
2. **Then (suggested order):** real Stripe test mode behind the existing `PaymentProvider` · (5) AI Whisky Advisor v1 (RAG) + Gift Finder · (6) CMS (Sanity) + content/SEO.
3. Keep every increment runnable, tested, and pushed to `main`; update the two context files after each.

## How to run

```bash
pnpm install
pnpm build        # production build (30 routes)
pnpm test         # 16 unit tests
pnpm --filter @whiskymart/web dev   # local dev at http://localhost:3000
```
