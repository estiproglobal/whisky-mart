# Current Task

**Last updated:** 2026-06-24
**Owner:** Claude (agent)

---

## What I'm working on right now

**Phase 1 / MVP build — Increment 6: Content & SEO → ✅ COMPLETE.**
🎉 **The Phase-1 MVP feature set is now complete** (Increments 1–6 done, verified, live on `main`).

Next options (awaiting direction): **(a) production hardening** — wire the deferred swaps (Postgres, Stripe, Claude, real auth/search) and add analytics + accessibility/CWV polish; or **(b) start Phase 2** (Global Whisky Discovery — multi-currency/language, richer personalisation) per `docs/`.

**Push policy:** write access confirmed — Claude commits and pushes directly to `origin/main`.
**Standing rule:** update `Current_Task.md` and `Handoff.md` after **every** increment.

> 📌 **Deferred production switches recorded in [`DEFERRED.md`](DEFERRED.md):**
> Postgres (persistence) · Stripe (payments) · Claude (AI Sommelier) · Sanity (content) · plus auth, search, age-verification, tax. Each swaps behind an existing interface — one binding, no caller changes.

### Increment 6 acceptance criteria — ✅ COMPLETE & VERIFIED
- [x] **Interface-first content:** `ContentRepository` (`lib/content/`) over seed articles; structured `ContentBlock` model with shoppable product embeds.
- [x] **Pages:** `/guides` hub + `/guides/[slug]` (SSG) for buying guides, education and journal.
- [x] **Structured data:** `Product` JSON-LD on PDP, `Article` + breadcrumb JSON-LD on guides.
- [x] **SEO plumbing:** `sitemap.xml` (products + guides + static) and `robots.txt` (disallows checkout/cart/account/api).
- [x] **Cross-linking:** home "Guides & stories" rail; PDP "Featured in our guides"; guides link to products.
- [x] Tests for content repo + structured-data builders; `typecheck` / `lint` / `build` green.
- [x] Pushed to `origin/main`.

**Verification:** `typecheck` ✓ · `lint` ✓ · `test` ✓ (**64 tests**) · `build` ✓ (4 SSG guides + sitemap/robots) · runtime smoke test ✓ (guides render embedded products + Article JSON-LD; PDP Product JSON-LD + Featured-in; sitemap/robots correct; 404 for unknown guide).

---

## Completed increments

### Increment 6 — Content & SEO ✅
- `ContentRepository` + seed articles; `/guides` + `/guides/[slug]`; JSON-LD (Product/Article/Breadcrumb); `sitemap.ts` + `robots.ts`; home rail + PDP cross-linking.

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

## MVP overall (Phase 1) — ✅ FEATURE-COMPLETE
- [x] Catalogue, PLP, PDP, search, cart, wishlist *(Increments 1–2)*
- [x] Checkout + age verification + UK jurisdiction rules + payment (mock) *(Increment 3)*
- [x] Accounts + order history + reviews *(Increment 4)*
- [x] AI Whisky Advisor v1 (grounded) + Gift Finder *(Increment 5)*
- [x] Content (blog/guides/education) + SEO + structured data *(Increment 6)*
- [ ] Production swaps: Postgres, Stripe, Claude, Sanity, real auth/search *(see `DEFERRED.md`)*
- [ ] Analytics + accessibility (WCAG 2.2 AA) + Core Web Vitals budgets *(hardening)*

## Stats
- **64 tests** across 11 files · **~45 routes** · all gates green (`typecheck`, `lint`, `build`, runtime smoke).

## Notes for whoever continues
- Keep every increment runnable, tested, pushed to `main`; update the two context files after each.
- Swappable seams (no UI/API changes to switch): `CatalogRepository`, `PaymentProvider`, `OrderRepository`/`ReviewRepository`, `AccountProvider`, `Advisor`, `ContentRepository`, jurisdiction rules. **Production targets in `DEFERRED.md`.**
