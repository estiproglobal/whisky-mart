# Current Task

**Last updated:** 2026-06-24
**Owner:** Claude (agent)

---

## What I'm working on right now

**Phase 1 / MVP build — Increment 3: Checkout, age verification & payment → ✅ COMPLETE.**
Next up: **Increment 4 (Accounts, order persistence & reviews)**.

Increments **1** (foundation), **2** (search/wishlist/recently-viewed), and **3** (checkout) are complete, verified, and live on `main`. We build from `docs/07-ai-development-spec.md` in runnable, tested increments.

**Push policy:** the session's GitHub integration has **write access** — Claude commits and pushes directly to `origin/main`.

**Standing rule:** update `Current_Task.md` and `Handoff.md` after **every** increment.

> ✅ **Resolved decision:** payment built against a **mock provider** behind a `PaymentProvider` interface (`lib/checkout/payment.ts`). Real Stripe test mode swaps in behind the same interface when `STRIPE_SECRET_KEY` is set — no caller changes.

### Increment 3 acceptance criteria — ✅ COMPLETE & VERIFIED
- [x] Multi-step checkout (delivery → age → shipping → payment → review → confirmation).
- [x] Server-authoritative jurisdiction check (UK allowed; US/unknown blocked with reason, not a dead-end).
- [x] Correct totals — UK VAT-inclusive; EU VAT added on top; free standard shipping over £100.
- [x] Mock payment succeeds; order created; confirmation shown; cart cleared.
- [x] Failure paths enforced server-side: age-not-confirmed → 400, blocked destination → 400, declined card → 402.
- [x] Tests for jurisdiction + pricing + payment; `typecheck` / `lint` / `build` green.
- [x] Pushed to `origin/main`.

**Verification:** `typecheck` ✓ · `lint` ✓ · `test` ✓ (**36 tests**) · `build` ✓ (**36 routes**) · runtime smoke test ✓ (quote allowed/blocked; pay success/age/jurisdiction/decline).

## Increment 4 scope (planned)

- **Persistence layer** — orders are not yet stored. Introduce a repository-backed store (per `docs/05`/`docs/07`; likely Prisma + Postgres, or a dev-friendly store behind the same interface) so orders/reviews survive.
- **Accounts** — lightweight auth + profile + saved addresses + **order history** (`docs/02` B1).
- **Reviews & ratings** — verified-purchase reviews with structured tasting notes; show on PDP; feed `ratingAvg`/`ratingCount` (`docs/02` B4).

### Increment 4 acceptance criteria (planned)
- [ ] Orders persist and appear in a customer order history.
- [ ] Account sign-in/profile/addresses (mock or real auth behind an interface).
- [ ] Reviews can be submitted and render on the PDP; ratings aggregate.
- [ ] Tests for persistence + reviews; gates green; pushed to `main`.

---

## Completed increments

### Increment 3 — Checkout, age verification & payment ✅
- Jurisdiction engine (`lib/checkout/jurisdiction.ts`), shipping + VAT-aware pricing, `PaymentProvider` interface + `MockPaymentProvider`.
- API: `POST /api/checkout/quote`, `POST /api/checkout/pay` (server-authoritative compliance + payment).
- Multi-step `CheckoutFlow`, order summary, confirmation page; cart "Secure checkout" enabled.
- Gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (36) · `build` ✓ (36 routes) · smoke test ✓.

### Increment 2 — Search, Wishlist & Recently-viewed ✅
- `GET /api/search` + `relevanceScore()`; instant-search autocomplete; wishlist (provider + hearts + page); recently-viewed; PLP active-filter chips.

### Increment 1 — Storefront foundation ✅
- Monorepo (pnpm + Turborepo), `packages/types`, `apps/web` (Next.js 15 + Tailwind); design system; swappable `CatalogRepository`; Home/PLP/PDP/Cart/category/search/404; age-gate.

---

## MVP overall (Phase 1, tracked across increments)
- [x] Catalogue, PLP, PDP, search, cart, wishlist *(Increments 1–2)*
- [x] Checkout + age verification + UK jurisdiction rules + payment (mock) *(Increment 3)*
- [ ] Accounts + order history + reviews *(Increment 4)*
- [ ] Real payment (Stripe test mode) behind the existing `PaymentProvider` interface
- [ ] AI Whisky Advisor v1 (RAG over catalogue) + Gift Finder *(Increment 5)*
- [ ] CMS (Sanity) for blog/guides; SEO + structured data *(Increment 6)*
- [ ] Analytics + accessibility (WCAG 2.2 AA) + Core Web Vitals budgets *(ongoing)*

## Notes for whoever continues
- Keep every increment runnable, tested, and pushed to `main`; update the two context files after each.
- Abstractions in place to swap implementations without touching UI: `CatalogRepository` (data), `PaymentProvider` (payments), jurisdiction rules table (compliance). Add an `OrderRepository` in Increment 4 for persistence.
- Orders currently return from `POST /api/checkout/pay` and are stored client-side in `sessionStorage` for the confirmation page only — **not persisted** yet.
