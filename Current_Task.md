# Current Task

**Last updated:** 2026-06-23
**Owner:** Claude (agent)

---

## What I'm working on right now

**Phase 1 / MVP build — Increment 1: Storefront foundation → ✅ COMPLETE.**
Next up: **Increment 2 (search + cart polish)** then **Increment 3 (checkout + age verification + Stripe test mode)**.

The blueprint is complete and live in GitHub (`estiproglobal/whisky-mart`, `main`). We are building the application from `docs/07-ai-development-spec.md`. Increment 1 delivered a runnable, tested storefront foundation (monorepo, design system, catalogue/PLP/PDP/cart over a swappable data layer).

**Push policy:** all pushes to GitHub are **manual by the repo owner**. Claude provides a step-by-step push/upload guide with every increment (the session's GitHub integration is read-only; the owner pushes from their own machine).

## Current increment scope (Increment 1)

A runnable Next.js storefront skeleton with seed data:
- Monorepo scaffold (pnpm workspaces + Turborepo, shared TS/ESLint config).
- `packages/types` — shared domain types (Product, Variant, WhiskyDetails, Review…) aligned to `docs/05-database-schema.md`.
- `apps/web` — Next.js (App Router) + TypeScript + Tailwind + design tokens (whisky theme).
- Core chrome: header (nav, search, cart, account), footer, age-gate.
- Seed catalogue + typed data-access layer (mockable, swappable for Medusa/API later).
- Pages: Home (hero + rails), Category/PLP (faceted), Product/PDP (buy box, key facts, flavour profile).
- Unit tests (Vitest) + the app builds green.

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
