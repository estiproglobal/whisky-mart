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
- **Phase 2 — Increment 8 (Multi-language / i18n): ✅ COMPLETE & VERIFIED, pushed to `main`.**
  - Interface-first i18n: `lib/i18n/` message catalogue (en/de/fr) + `translate()` (English/key fallback).
  - `LocaleProvider` (cookie-persisted) + `useT` + header `LocaleSwitcher`; `<html lang>` updates on switch.
  - Core chrome translated (header nav, footer, age gate); header/footer converted to client components.
  - Static generation preserved (English-canonical server render; preference applied client-side after mount).
  - `DEFERRED.md` updated: locale-routed URLs + `hreflang` + TMS/CMS content translation deferred.
  - Quality gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (78) · `build` ✓ (SSG preserved) · runtime smoke ✓.
- **Phase 2 — Increment 9 (Personalisation): ✅ COMPLETE & VERIFIED, pushed to `main`.**
  - Interface-first palate profile (`lib/personalization/palate.ts`): quiz → ranked flavour axes; `PalateProvider` (localStorage).
  - `/taste` quiz page; "Recommended for you" rail (home + `/taste`) grounded via `POST /api/recommendations`; `PalateQuiz`, `RecommendedRail`.
  - Sommelier seeds from the saved palate when a query lacks a flavour hint (`Advisor.ask` gained an optional `palate`).
  - SSG preserved (rail renders server fallback, swaps to palate picks client-side).
  - `DEFERRED.md` updated: learned palate fingerprint + server-side profile.
  - Quality gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (85) · `build` ✓ · runtime smoke ✓.
- Committed earlier: `screenshots.mjs` (Playwright capture, `apps/web/scripts/`).

## In-progress

- **Nothing in flight.** 🎉 **Phase 1 (MVP) and Phase 2 (Global Discovery) are both feature-complete** on `main`. Awaiting direction: production hardening / go-live, or Phase 3.

## Blocked by

- **Nothing blocking.** Write access confirmed — Claude pushes directly to `origin/main`.
- **Deferred production switches recorded in `DEFERRED.md`:** Postgres (persistence), Stripe (payments), Claude (AI Sommelier), **Sanity (content)**, plus auth/search/age-verification/tax. Each swaps behind an existing interface.

## Next Action (awaiting owner direction)

1. **Go-live / production hardening** — wire the `DEFERRED.md` swaps (Postgres → Stripe → real auth → Claude → Sanity → live FX), add analytics + accessibility (WCAG 2.2 AA) + CWV budgets + CI, and deploy to the domain. (See the go-live note for the owner: a demo on the domain is ~1 day; a real transacting store is a few weeks, gated mostly by legal/merchant — alcohol licence, Stripe high-risk underwriting, age-verification vendor.)
2. **OR Phase 3** — Community & Membership (profiles, clubs, tastings, loyalty) per `docs/02`.
3. Keep every increment runnable, tested, and pushed to `main`; update the two context files after each.

## How to run

```bash
pnpm install
pnpm build        # production build (30 routes)
pnpm test         # 16 unit tests
pnpm --filter @whiskymart/web dev   # local dev at http://localhost:3000
```
