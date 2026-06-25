# Current Task

**Last updated:** 2026-06-25
**Owner:** Claude (agent)

---

## What I'm working on right now

**Increment 10 — "The Private Cask Room" design overhaul → ✅ COMPLETE.**
Full luxury/editorial redesign. Live preview auto-deploys from `main` to Vercel (`whisky-mart-web.vercel.app`); **whiskymart.com domain held until sign-off.**

### Increment 10 acceptance — ✅ COMPLETE & VERIFIED
- [x] **Tokens & type:** restrained luxury palette (obsidian/charcoal/oak · cream/ivory/parchment · cask amber · antique brass · burgundy · smoke); **fonts via `next/font/google` — Cormorant Garamond (display) + Inter (body)**; cask-glow gradients + film-grain texture; soft shadows only.
- [x] **Brand:** swappable SVG `Monogram` + `Wordmark` (amber accent) + `app/icon.svg` favicon.
- [x] **Primitives:** `LuxurySection`, `PageHero`, `EditorialCard`, `TrustBar`, refined `Button`, `Badge`.
- [x] **Header:** restrained utility bar (lang/currency/age note) + clean spacious nav + minimal switchers.
- [x] **Homepage:** immersive cask-glow hero + micro-trust row; curated collections (The Cabinet, New & Limited, Under £50, Tasting Flights); editorial brand band ("Buy the bottle…") with Discover/Collect/Belong; premium Sommelier + Gift Finder service cards.
- [x] **Product cards:** bottle-led, warm lit surface, refined badges/price, save control.
- [x] **PLP:** archive-style filter panel + page hero + roomier grid.
- [x] **PDP:** dossier — sticky buy panel + delivery/age note + key facts; Tasting Profile, Cask & Maturation, Distillery Story, Delivery/Age/Returns sections.
- [x] **Sommelier:** private-concierge panel + elegant prompt chips. **Gift Finder:** editorial 01/02/03 guided steps.
- [x] **Footer:** dark catalogue footer; responsible-drinking + 18+ clearly legible.
- [x] Behaviour/logic/tests unchanged. `typecheck` ✓ · `lint` ✓ · `test` ✓ (85) · `build` ✓ (51 pages, fonts fetched).

Phase-1 MVP (1–6) + Phase 2 (7–9) + design overhaul (10) are complete and live on the Vercel preview (auto-deploy on push). **Domain attach is the final step after design sign-off.**

> ⚠️ Imagery: still gradient/SVG placeholders (warm, lit) — real product/lifestyle **photography** is the one remaining asset to fully land the aesthetic (owner-provided or stock licence). Recorded in `DEFERRED.md`.

### Increment 9 acceptance criteria — ✅ COMPLETE & VERIFIED
- [x] Interface-first palate profile (`lib/personalization/palate.ts`): quiz → ranked flavour axes; `PalateProvider` (localStorage).
- [x] `/taste` quiz page; "Recommended for you" rail on home + `/taste` (grounded via `/api/recommendations`).
- [x] Sommelier seeds from the saved palate when a query lacks a flavour hint.
- [x] SSG preserved (rail renders server fallback, swaps to palate picks client-side).
- [x] Tests (`scoreQuiz`, profile, caps); `typecheck` / `lint` / `build` green (85 tests).
- [x] Pushed to `origin/main`. (Learned palate fingerprint + server-side profile recorded in `DEFERRED.md`.)

### Increment 8 acceptance criteria — ✅ COMPLETE & VERIFIED
- [x] Interface-first i18n: message catalogue (`lib/i18n/`, en/de/fr) + `translate()` with English/key fallback.
- [x] `LocaleProvider` (cookie-persisted) + `useT` + header `LocaleSwitcher`; `<html lang>` updates on switch.
- [x] Core chrome translated (nav, footer, age gate); static generation preserved (English-canonical server render, preference applied client-side).
- [x] Tests (translate fallback, catalogue integrity across locales); `typecheck` / `lint` / `build` green (78 tests).
- [x] Pushed to `origin/main`. (Locale-routed URLs + `hreflang` + full-content translation recorded in `DEFERRED.md`.)

**Push policy:** write access confirmed — Claude commits and pushes directly to `origin/main`.
**Standing rule:** update `Current_Task.md` and `Handoff.md` after **every** increment.

> 📌 **Deferred production switches recorded in [`DEFERRED.md`](DEFERRED.md):**
> Postgres (persistence) · Stripe (payments) · Claude (AI Sommelier) · Sanity (content) · **live FX + multi-currency settlement** · plus auth, search, age-verification, tax. Each swaps behind an existing interface.

### Increment 7 acceptance criteria — ✅ COMPLETE & VERIFIED
- [x] Interface-first currency layer (`lib/market/currency.ts`): supported currencies, `RatesProvider` (static FX now → live later), GBP→currency conversion + locale formatting.
- [x] `CurrencyProvider` (cookie-persisted) + `<Price>` (currency-aware) + header `CurrencySwitcher`.
- [x] All price displays converted to `<Price>` (cards, PDP, search, cart, checkout, order summary, confirmation, account).
- [x] Static generation preserved (server renders GBP-canonical; preference applied client-side post-mount — no hydration mismatch, no forced dynamic).
- [x] `SettlementNote` shown to non-GBP shoppers (payment still settles GBP — see `DEFERRED.md`).
- [x] Tests for conversion/formatting; `typecheck` / `lint` / `build` green.
- [x] Pushed to `origin/main`.

**Verification:** `typecheck` ✓ · `lint` ✓ · `test` ✓ (**72 tests**) · `build` ✓ (SSG/static preserved) · runtime smoke ✓ (switcher present; GBP server-default; pages 200).

## Completed increments

### Increment 9 — Personalisation ✅ (Phase 2)
- Palate quiz + `PalateProvider`; `/taste`; "Recommended for you" rail (home + `/taste`) via `/api/recommendations`; Sommelier seeds from saved palate. SSG preserved.

### Increment 8 — Multi-language / i18n ✅ (Phase 2)
- `lib/i18n/` message catalogue (en/de/fr) + `translate()`; `LocaleProvider`/`useT`/`LocaleSwitcher`; core chrome translated; static generation preserved.

### Increment 7 — Multi-currency ✅ (Phase 2)
- `lib/market/currency.ts` (`RatesProvider`, conversion, formatting); `CurrencyProvider`/`<Price>`/`CurrencySwitcher`/`SettlementNote`; all price displays currency-aware; static generation preserved.

### Increment 6 — Content & SEO ✅
- `ContentRepository` + `/guides`; JSON-LD (Product/Article/Breadcrumb); sitemap/robots; home rail + PDP cross-linking.

### Increment 5 — AI Sommelier + Gift Finder ✅
- `Advisor` interface + grounded mock; `/api/advisor` + `/api/gift-finder`; interactive `/sommelier` + `/gift-finder`.

### Increment 4 — Accounts, order persistence & reviews ✅
- `OrderRepository`/`ReviewRepository` (in-memory); `/account` order history; verified-purchase reviews.

### Increment 3 — Checkout, age verification & payment ✅
- Jurisdiction engine, VAT-aware pricing, `PaymentProvider` + mock, `/api/checkout/*`, multi-step checkout, confirmation.

### Increment 2 — Search, Wishlist & Recently-viewed ✅
- `/api/search` + relevance; instant-search; wishlist; recently-viewed; PLP active-filter chips.

### Increment 1 — Storefront foundation ✅
- Monorepo, `packages/types`, Next.js 15 + Tailwind, design system, `CatalogRepository`, core pages, age-gate.

---

## Roadmap status
- [x] **Phase 1 MVP** — storefront, search, checkout+compliance, accounts/reviews, AI, content/SEO *(Increments 1–6)*
- [x] **Phase 2 — Global Discovery** — multi-currency ✅ *(7)* · i18n ✅ *(8)* · personalisation ✅ *(9)*
- [ ] Production swaps: Postgres, Stripe, Claude, Sanity, live FX, real auth/search *(see `DEFERRED.md`)*
- [ ] Analytics + accessibility (WCAG 2.2 AA) + Core Web Vitals budgets *(ongoing)*

## Stats
- **85 tests** across 14 files · ~48 routes · all gates green (`typecheck`, `lint`, `build`, runtime smoke).

## Notes for whoever continues
- Keep every increment runnable, tested, pushed to `main`; update the two context files after each.
- Swappable seams (no UI/API changes to switch): `CatalogRepository`, `PaymentProvider`, `OrderRepository`/`ReviewRepository`, `AccountProvider`, `Advisor`, `ContentRepository`, `RatesProvider`, jurisdiction rules. **Production targets in `DEFERRED.md`.**
- Multi-currency is **display-only** today (GBP settlement). `screenshots.mjs` (in `apps/web/scripts/`) captures journeys locally where a browser is available.
