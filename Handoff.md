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
  - Jurisdiction engine, VAT-aware pricing, `PaymentProvider` + `MockPaymentProvider`, `/api/checkout/quote` + `/pay`, multi-step `CheckoutFlow`, confirmation.
- **MVP build — Increment 4 (Accounts, order persistence & reviews): ✅ COMPLETE & VERIFIED, pushed to `main`.**
  - Interface-first `OrderRepository`/`ReviewRepository` (in-memory), `/account` order history, verified-purchase reviews on PDP. `DEFERRED.md` created.
- **MVP build — Increment 5 (AI Sommelier + Gift Finder): ✅ COMPLETE & VERIFIED, pushed to `main`.**
  - **Interface-first AI:** `Advisor` interface (`lib/advisor/types.ts`) + `GroundedMockAdvisor` (NL `parse.ts` → shared `engine.ts` over the live catalogue). `getAdvisor()` swaps to Claude when `ANTHROPIC_API_KEY` is set.
  - APIs: `POST /api/advisor` (Sommelier), `POST /api/gift-finder`.
  - UI: interactive `/sommelier` (chat thread + grounded recommendation cards with reasons), `/gift-finder` (guided form), home AI-tools section + nav.
  - Grounded — only ever returns real products/prices; budget/region respected; responsible-drinking disclaimer.
  - **`DEFERRED.md` updated** with the Claude/`ANTHROPIC_API_KEY` swap.
  - Quality gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (53) · `build` ✓ (40 routes) · runtime smoke test ✓ (smoky-Islay-under-£80 → 3 real bottles ≤ £74.95; gift finder on-budget; empty → 400).

## In-progress

- **Increment 6 — Content & SEO (blog / buying guides / education + structured data)** is the active/next task (not yet started). Scope + acceptance criteria in `Current_Task.md`.

## Blocked by

- **Nothing blocking.** Write access confirmed — Claude pushes directly to `origin/main`.
- **Deferred production switches recorded in `DEFERRED.md`:** Postgres (persistence), Stripe (payments), **Claude (AI Sommelier)**, plus auth/search/age-verification/tax/CMS. Each swaps behind an existing interface.
- **For Increment 6:** content will be interface-first too — a `ContentRepository` (local/MDX) now, **Sanity** later.

## Next Action

1. **Claude — Increment 6:** Content & SEO — blog, buying guides, whisky education; interface-first `ContentRepository` (local/MDX now → Sanity later); JSON-LD structured data (Product/Article) + sitemap/robots; content rail + cross-linking to products.
2. **Then:** production swaps from `DEFERRED.md` (Postgres, Stripe, Claude, real auth/search) as infra/keys become available.
3. Keep every increment runnable, tested, and pushed to `main`; update the two context files after each.

## How to run

```bash
pnpm install
pnpm build        # production build (30 routes)
pnpm test         # 16 unit tests
pnpm --filter @whiskymart/web dev   # local dev at http://localhost:3000
```
