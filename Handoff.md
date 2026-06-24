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
  - `Advisor` interface + `GroundedMockAdvisor` (NL parse → shared engine over the live catalogue); `/api/advisor` + `/api/gift-finder`; interactive `/sommelier` + `/gift-finder`. Grounded; Claude swaps in via `ANTHROPIC_API_KEY`.
- **MVP build — Increment 6 (Content & SEO): ✅ COMPLETE & VERIFIED, pushed to `main`.**
  - `ContentRepository` (`lib/content/`); `/guides` + `/guides/[slug]` (SSG); JSON-LD (Product/Article/Breadcrumb); `sitemap.xml` + `robots.txt`; home rail + PDP cross-linking. `DEFERRED.md` updated (Sanity).
- 🎉 **Phase-1 MVP feature set complete (Increments 1–6).**
- **Phase 2 — Increment 7 (Multi-currency): ✅ COMPLETE & VERIFIED, pushed to `main`.**
  - Interface-first currency layer (`lib/market/currency.ts`): `RatesProvider` (static FX → live later), GBP→currency conversion, locale formatting.
  - `CurrencyProvider` (cookie-persisted), `<Price>` (currency-aware), header `CurrencySwitcher`, `SettlementNote`.
  - All price displays converted to `<Price>`. **Static generation preserved** — server renders GBP-canonical; the saved currency is applied client-side after mount (no hydration mismatch, no forced dynamic rendering).
  - Payment still settles in GBP (display-only conversion) — recorded in `DEFERRED.md` (live FX + multi-currency settlement).
  - Quality gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (72) · `build` ✓ (SSG preserved) · runtime smoke ✓.
- Committed earlier: `screenshots.mjs` (Playwright capture, `apps/web/scripts/`).

## In-progress

- **Nothing in flight.** Phase 2 has begun (multi-currency done); next increments are i18n and personalisation.

## Blocked by

- **Nothing blocking.** Write access confirmed — Claude pushes directly to `origin/main`.
- **Deferred production switches recorded in `DEFERRED.md`:** Postgres (persistence), Stripe (payments), Claude (AI Sommelier), **Sanity (content)**, plus auth/search/age-verification/tax. Each swaps behind an existing interface.

## Next Action

1. **Claude — continue Phase 2:** (8) i18n / multi-language (message catalogue + locale switch + `hreflang`, interface-first translation source), then (9) personalisation (palate profile + "Recommended for you" rails + advisor uses the profile).
2. **In parallel / when ready:** production swaps from `DEFERRED.md` (Postgres, Stripe, Claude, Sanity, live FX, real auth/search), plus analytics + accessibility + CWV + CI.
3. Keep every increment runnable, tested, and pushed to `main`; update the two context files after each.

## How to run

```bash
pnpm install
pnpm build        # production build (30 routes)
pnpm test         # 16 unit tests
pnpm --filter @whiskymart/web dev   # local dev at http://localhost:3000
```
