# Current Task

**Last updated:** 2026-06-24
**Owner:** Claude (agent)

---

## What I'm working on right now

**Phase 1 / MVP build — Increment 3: Checkout, age verification & payment → ▶ NEXT / ACTIVE.**

Increments **1** (storefront foundation) and **2** (search, wishlist, recently-viewed) are complete, verified, and live on `main`. We build from `docs/07-ai-development-spec.md` in runnable, tested increments.

**Push policy:** the session's GitHub integration has **write access** — Claude commits and pushes directly to `origin/main`.

> ⚠️ **Open decision before building Increment 3 (awaiting owner):** use **real Stripe test-mode keys** (owner adds `STRIPE_SECRET_KEY`) **or** a **mock payment provider** behind the same interface (runs with no secrets). Default if unspecified: build against a mock provider so the flow runs end-to-end with zero secrets, then swap in Stripe behind the same interface.

## Increment 3 scope (planned)

- **Multi-step checkout:** delivery address → age verification → shipping method → payment → review → confirmation (per `docs/04` §3.6).
- **Jurisdiction/compliance engine (server-side):** "can we ship this here?" (UK first) + tax/duty estimate; restricted destinations get an explanation, not a dead-end (per `docs/09`).
- **Payment:** Stripe test-mode `PaymentIntent` via `POST /api/checkout/*` — or a mock provider behind a `PaymentProvider` interface (see open decision above).
- **Order:** create order on success, confirmation page, clear the cart.
- **Age verification:** step-up at checkout (lightweight if already gated) — modelled on `docs/09` §2.

### Increment 3 acceptance criteria (planned)
- [ ] Checkout flow renders and progresses through all steps.
- [ ] Jurisdiction check runs server-side; blocks/allows by destination with a clear message.
- [ ] Totals correct (subtotal + shipping + tax/duty estimate).
- [ ] Payment succeeds in test/mock mode; order confirmation shown; cart cleared.
- [ ] Tests for jurisdiction rules + totals; `typecheck` / `lint` / `build` green.
- [ ] Pushed to `origin/main`.

---

## Completed increments

### Increment 2 — Search, Wishlist & Recently-viewed ✅ (pushed `d0a0693`)
- `GET /api/search` (first API endpoint) + `relevanceScore()` ranking.
- Instant-search header autocomplete (debounced, keyboard-navigable, thumbnails, view-all).
- Wishlist: `WishlistProvider` (localStorage) + hearts on cards/PDP + header count + `/account/wishlist`.
- Recently-viewed tracker + rails (Home, PDP). PLP active-filter chips.
- Gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (21) · `build` ✓ (32 routes) · smoke test ✓.

### Increment 1 — Storefront foundation ✅ (pushed)
- Monorepo (pnpm + Turborepo), `packages/types`, `apps/web` (Next.js 15 + Tailwind tokens).
- Design system + swappable `CatalogRepository` (faceted search, sort, related, cart).
- Pages: Home, Shop/PLP, 12 category collections, Search, PDP, Cart, Sommelier teaser, 404. Age-gate.
- Gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (16) · `build` ✓ (30 routes) · smoke test ✓.

---

## MVP overall (Phase 1, tracked across increments)
- [x] Catalogue, PLP, PDP, search, cart, wishlist *(Increments 1–2)*
- [ ] Checkout + age verification + UK jurisdiction rules + payment *(Increment 3)*
- [ ] Accounts + reviews *(Increment 4)*
- [ ] AI Whisky Advisor v1 (RAG over catalogue) + Gift Finder *(Increment 5)*
- [ ] CMS (Sanity) for blog/guides; SEO + structured data *(Increment 6)*
- [ ] Analytics + accessibility (WCAG 2.2 AA) + Core Web Vitals budgets *(ongoing)*

## Notes for whoever continues
- Build incrementally; keep every increment runnable, tested, and pushed to `main`.
- The data-access layer (`lib/catalog/repository.ts`) is abstracted so the seed source swaps for Medusa/API without touching UI. Apply the same pattern to payments (a `PaymentProvider` interface) and jurisdiction (a rules service).
