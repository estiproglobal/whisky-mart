# Current Task

**Last updated:** 2026-06-23
**Owner:** Claude (agent)

---

## What I'm working on right now

**Phase 1 / MVP build — Increment 2: Search, Wishlist & Recently-viewed → ✅ COMPLETE.**
Next up: **Increment 3 (checkout + age verification + Stripe test mode + UK jurisdiction rules)**.

The blueprint is live in GitHub (`estiproglobal/whisky-mart`, `main`). We build the app from `docs/07-ai-development-spec.md` in runnable, tested increments. Increment 1 delivered the storefront foundation; Increment 2 added discovery + save features.

**Push policy:** the session's GitHub integration now has **write access** — Claude pushes directly to `origin/main`. (Increment 1 was pushed manually by the owner; from Increment 2 on, pushes are automatic.)

## Increment 2 scope (this session)

- **Instant search** — debounced header autocomplete backed by `GET /api/search` (the first API-layer endpoint), keyboard-navigable, with product thumbnails + "view all results".
- **Search relevance** — `relevanceScore()` ranks free-text queries (exact/prefix/brand/tag weighting) so the best match leads.
- **Wishlist** — `WishlistProvider` (localStorage), heart toggle on cards + PDP, header indicator with count, and `/account/wishlist` page.
- **Recently viewed** — tracker on PDP + rails on Home and PDP (localStorage, most-recent-first, capped).
- **PLP polish** — removable active-filter chips.

### Increment 2 acceptance criteria — ✅ COMPLETE & VERIFIED
- [x] `GET /api/search` returns relevance-ranked results; enforces a 2-char minimum.
- [x] Instant-search dropdown with keyboard nav + view-all.
- [x] Wishlist persists, toggles from card + PDP, shows header count, lists on `/account/wishlist`.
- [x] Recently-viewed tracked and rendered on Home + PDP.
- [x] Active-filter chips on PLP.
- [x] `typecheck` ✓ · `lint` ✓ · `test` ✓ (**21 tests**) · `build` ✓ (**32 routes**) · runtime smoke test ✓.
- [x] Pushed to `origin/main`.

## Acceptance criteria

### Increment 1 (this session) — ✅ COMPLETE & VERIFIED
- [x] Monorepo builds (`pnpm install` + `pnpm build` succeed). Build: **30 pages generated**.
- [x] `apps/web` renders Home, PLP, PDP from seed data (verified via `next start` smoke test — all routes 200, 404 for unknown).
- [x] Shared domain types in `packages/types`, consumed by the web app.
- [x] Design system: tokens (whisky palette) + base components (Button, ProductCard, Badge, StarRating, FlavourBars, rails, header/footer).
- [x] Age-gate present and functional (client-side gate).
- [x] Tests passing (**16 tests**); **lint + typecheck clean**.
- [x] Manual push guide provided to the owner.

**Verification summary:** `pnpm typecheck` ✓ · `pnpm lint` ✓ (no warnings/errors) · `pnpm test` ✓ (16/16) · `pnpm build` ✓ (30 routes) · runtime smoke test ✓ (home, PDP, category filter, shop facet, search, cart, sommelier, 404).

### MVP overall (Phase 1, tracked across increments)
- [ ] Catalogue, PLP, PDP, search, cart, checkout, accounts, wishlist, reviews.
- [ ] Stripe checkout + age verification + UK jurisdiction rules.
- [ ] AI Whisky Advisor v1 (RAG over catalogue) + Gift Finder.
- [ ] CMS (Sanity) for blog/guides; SEO + structured data.
- [ ] Analytics + accessibility (WCAG 2.2 AA) + Core Web Vitals budgets.

## Notes for whoever continues
- Build incrementally; keep every increment runnable and green.
- Data-access layer is deliberately abstracted so the seed/mock source can be swapped for Medusa or an API without touching UI.
- Next increments (suggested order): (2) search + cart, (3) checkout + age verification + Stripe test mode, (4) accounts + wishlist + reviews, (5) AI advisor v1, (6) CMS + content.
