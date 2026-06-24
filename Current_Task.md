# Current Task

**Last updated:** 2026-06-24
**Owner:** Claude (agent)

---

## What I'm working on right now

**Phase 1 / MVP build — Increment 5: AI Sommelier + Gift Finder → ✅ COMPLETE.**
Next up: **Increment 6 (Content & SEO — blog / buying guides / education + structured data)**.

Increments **1–5** are complete, verified, and live on `main`. We build from `docs/07-ai-development-spec.md` in runnable, tested increments.

**Push policy:** write access confirmed — Claude commits and pushes directly to `origin/main`.
**Standing rule:** update `Current_Task.md` and `Handoff.md` after **every** increment.

> 📌 **Deferred production switches recorded in [`DEFERRED.md`](DEFERRED.md):**
> - **Persistence:** in-memory → **Postgres (Prisma)** (behind `OrderRepository`/`ReviewRepository`).
> - **Payments:** mock → **Stripe** (`STRIPE_SECRET_KEY`) (behind `PaymentProvider`).
> - **AI Sommelier:** grounded mock → **Claude (Anthropic)** (`ANTHROPIC_API_KEY`) (behind `Advisor`).
> - Plus auth, search, age-verification, tax, CMS seams.

### Increment 5 acceptance criteria — ✅ COMPLETE & VERIFIED
- [x] **Interface-first AI:** `Advisor` interface + `GroundedMockAdvisor`; `getAdvisor()` swaps to Claude when `ANTHROPIC_API_KEY` is set.
- [x] **Sommelier** answers NL queries grounded in real catalogue items (no hallucinated products/prices); reasons per pick.
- [x] **Gift Finder** returns ranked gifts from occasion/budget/taste inputs.
- [x] Shared parse + recommendation engine; APIs `POST /api/advisor`, `POST /api/gift-finder`.
- [x] Guardrails: age-gated context, responsible-drinking disclaimer, budget/region respected.
- [x] Tests for parse + engine + advisor + gift; `typecheck` / `lint` / `build` green.
- [x] Pushed to `origin/main`.

**Verification:** `typecheck` ✓ · `lint` ✓ · `test` ✓ (**53 tests**) · `build` ✓ (**40 routes**) · runtime smoke test ✓ ("smoky Islay under £80" → 3 real bottles ≤ £74.95 with reasons; gift finder on-budget; empty query → 400).

## Increment 6 scope (planned)

- **Content & SEO** — blog, buying guides, whisky education (Academy). Interface-first `ContentRepository` (local/MDX content now → **Sanity** later, recorded in `DEFERRED.md`).
- **Structured data** — JSON-LD (Product/Offer/AggregateRating, Article) + metadata/OG; shoppable content linking to products.
- **Surfacing** — content rail on home; guide pages cross-linked to catalogue.

### Increment 6 acceptance criteria (planned)
- [ ] Blog/guide/education pages render from a `ContentRepository`; cross-link to products.
- [ ] JSON-LD structured data on PDP + articles; sitemap/robots.
- [ ] Tests for content repo + structured-data builders; gates green; pushed to `main`.

---

## Completed increments

### Increment 5 — AI Sommelier + Gift Finder ✅
- `Advisor` interface + grounded mock (`lib/advisor/`): NL parse → shared recommendation engine over the live catalogue.
- APIs `POST /api/advisor`, `POST /api/gift-finder`; interactive `/sommelier` chat + `/gift-finder` guided form; home AI-tools section.

### Increment 4 — Accounts, order persistence & reviews ✅
- `OrderRepository`/`ReviewRepository` (in-memory) + `/account` order history + verified-purchase reviews on PDP. `DEFERRED.md` created.

### Increment 3 — Checkout, age verification & payment ✅
- Jurisdiction engine, VAT-aware pricing, `PaymentProvider` + mock, `/api/checkout/*`, multi-step `CheckoutFlow`, confirmation.

### Increment 2 — Search, Wishlist & Recently-viewed ✅
- `/api/search` + relevance; instant-search; wishlist; recently-viewed; PLP active-filter chips.

### Increment 1 — Storefront foundation ✅
- Monorepo, `packages/types`, Next.js 15 + Tailwind, design system, `CatalogRepository`, core pages, age-gate.

---

## MVP overall (Phase 1, tracked across increments)
- [x] Catalogue, PLP, PDP, search, cart, wishlist *(Increments 1–2)*
- [x] Checkout + age verification + UK jurisdiction rules + payment (mock) *(Increment 3)*
- [x] Accounts + order history + reviews *(Increment 4)*
- [x] AI Whisky Advisor v1 (grounded) + Gift Finder *(Increment 5)*
- [ ] CMS/content (blog/guides/education) + SEO + structured data *(Increment 6)*
- [ ] Production swaps: Postgres, Stripe, Claude, real auth/search *(see `DEFERRED.md`)*
- [ ] Analytics + accessibility (WCAG 2.2 AA) + Core Web Vitals budgets *(ongoing)*

## Notes for whoever continues
- Keep every increment runnable, tested, pushed to `main`; update the two context files after each.
- Swappable seams (no UI/API changes to switch): `CatalogRepository`, `PaymentProvider`, `OrderRepository`/`ReviewRepository`, `AccountProvider`, `Advisor`, jurisdiction rules. **Production targets in `DEFERRED.md`.**
