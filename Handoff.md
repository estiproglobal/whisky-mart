# Handoff

**Date:** 2026-06-25
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
- **Deployment prep (Option A — preview/demo): DONE.** Added `DEPLOY.md` (Vercel + single-container runbook + DNS for whiskymart.com), `Dockerfile` + `.dockerignore` (single-instance, stable demo), `.nvmrc` (Node 22). Clean production build verified (50 static pages). The deploy itself is **owner-action** (connect Vercel/host + point DNS) — cannot be done from the sandbox (no host/DNS credentials; Docker daemon unavailable).

- **Increment 10 — "The Private Cask Room" design overhaul: ✅ COMPLETE & VERIFIED, pushed to `main`.**
  - Luxury palette + `next/font/google` (Cormorant Garamond + Inter); cask-glow + grain textures; soft shadows.
  - Brand (`components/brand/`), primitives (`components/ui/`: LuxurySection, PageHero, EditorialCard, TrustBar, Button, Badge), premium header/footer.
  - Redesigned: homepage (hero + curated collections + editorial band + service cards), product cards, PLP (archive filters), PDP (dossier + sticky buy panel), Sommelier (concierge), Gift Finder (guided steps), guides/article cards.
  - **No behaviour/logic/route/test changes.** Gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (85) · `build` ✓ (51 pages).
- **Increment 11 — "The Cabinet, refined" (stricter luxury pass): ✅ COMPLETE & VERIFIED, MERGED to `main` (PR #3, squash → `8b2e329`), now in Vercel production.**
  - Token-led restraint: tightened/architectural **radius scale**, near-hairline **shadows**, refined warm-paper palette + new `line` hairline token, bronze-leaning amber/gold, subtler glows, `prefers-reduced-motion` guard.
  - **CTA hierarchy:** `primary` → ink/charcoal (luxe default); amber demoted to a dark-surface `accent` (hero + ink service card); uppercase letter-spaced buttons.
  - **Product cards → flat hairline tiles** (no floating white card / shadow / lift) + gentle image zoom; **product placeholder → dim lit display niche** (spotlight + reflection).
  - Quieter **badges/chips** (letter-spaced labels, squared tiles); home **credo band**; refined primitives + hero scale; `/taste` uses `PageHero`; refined article reading view; elevated age gate.
  - **Cohesion sweep:** every `bg-white` utility surface → warm ivory tiles with hairlines.
  - **37 files, presentational only — no behaviour/logic/route/test changes.** Gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (85) · `build` ✓ (51 pages, SSG preserved).
  - ⚙️ Sandbox build note: `turbo run build` doesn't forward `NODE_EXTRA_CA_CERTS`, so `next/font` fails TLS in-sandbox; build with `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt npx next build` from `apps/web` (CI/Vercel unaffected).

## In-progress

- **Nothing in flight.** Increment 11 **merged to `main`** (PR #3) and **design signed off** by the owner; Vercel auto-deployed it to **production**. The feature branch `claude/amazing-meitner-cmly8g` is now stale (safe to delete).
- **Deploy pipeline LIVE:** Vercel ↔ `main` → production at `whisky-mart-web.vercel.app`. **`whiskymart.com` not yet attached** (owner/DNS action — `DEPLOY.md`).

## Blocked by

- **Nothing blocking.** Write access confirmed — Claude pushes directly to `origin/main`.
- **Deferred production switches recorded in `DEFERRED.md`:** Postgres (persistence), Stripe (payments), Claude (AI Sommelier), **Sanity (content)**, plus auth/search/age-verification/tax. Each swaps behind an existing interface.

## Next Action

1. **Attach `whiskymart.com`** — design is signed off and live in production, so point the custom domain in Vercel → Domains (DNS steps in `DEPLOY.md`). Owner/DNS action.
2. **(Optional) Provide photography** — real bottle/lifestyle images are the one asset that will fully land the luxury aesthetic (placeholders are now museum-like but synthetic).
3. **Then — go-live as a real store / hardening:** wire the `DEFERRED.md` swaps (Stripe → Postgres → real auth → Claude → Sanity → live FX) + analytics/a11y/CWV/CI, alongside the legal/merchant prerequisites (alcohol licence, payment underwriting, age-verification vendor).
4. **OR Phase 3** — Community & Membership per `docs/02`.
5. Keep every increment runnable, tested, and pushed to `main`; update the two context files after each.

## How to run

```bash
pnpm install
pnpm build        # production build (30 routes)
pnpm test         # 16 unit tests
pnpm --filter @whiskymart/web dev   # local dev at http://localhost:3000
```
