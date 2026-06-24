# Current Task

**Last updated:** 2026-06-24
**Owner:** Claude (agent)

---

## What I'm working on right now

**Phase 1 / MVP build — Increment 4: Accounts, order persistence & reviews → ✅ COMPLETE.**
Next up: **Increment 5 (AI Whisky Advisor / Sommelier v1 + Gift Finder)**.

Increments **1–4** are complete, verified, and live on `main`. We build from `docs/07-ai-development-spec.md` in runnable, tested increments.

**Push policy:** write access confirmed — Claude commits and pushes directly to `origin/main`.
**Standing rule:** update `Current_Task.md` and `Handoff.md` after **every** increment.

> 📌 **Deferred production switches are recorded in [`DEFERRED.md`](DEFERRED.md):**
> - **Persistence:** in-memory now → **Postgres (Prisma)** later, behind the `OrderRepository`/`ReviewRepository` interfaces.
> - **Payments:** mock now → **Stripe** later (set `STRIPE_SECRET_KEY`), behind the `PaymentProvider` interface.
> - Plus auth, search, age-verification, tax, CMS seams. Switching touches one binding, not callers.

### Increment 4 acceptance criteria — ✅ COMPLETE & VERIFIED
- [x] **Interface-first persistence:** `OrderRepository` + `ReviewRepository` (`lib/db/`), in-memory impl, single binding to swap for Postgres later.
- [x] Orders **persist** on checkout and appear in **order history** (`/api/orders?email=`, shown on `/account`).
- [x] **Accounts:** mock sign-in/profile + order history (real auth deferred — see `DEFERRED.md`).
- [x] **Reviews:** submit + render on PDP; aggregate summary; **verified-purchase** flagged by cross-checking the buyer's orders.
- [x] Tests for the persistence layer; `typecheck` / `lint` / `build` green.
- [x] Pushed to `origin/main`.

**Verification:** `typecheck` ✓ · `lint` ✓ · `test` ✓ (**40 tests**) · `build` ✓ (**38 routes**) · runtime smoke test ✓ (order placed → persists → appears in history £79.90; reviews 4.5→4.7 avg after a verified-purchase review; invalid review → 400; account → 200).

## Increment 5 scope (planned)

- **AI Whisky Advisor ("Sommelier") v1** — conversational, RAG-grounded over the catalogue + tasting notes; recommends with reasoning; replaces the teaser at `/sommelier`.
- **Gift Finder** — guided flow (recipient, occasion, budget, taste) → ranked picks.
- **Interface-first AI:** an `Advisor` interface with a grounded retrieval-based mock now; **Claude (Anthropic) via `ANTHROPIC_API_KEY`** swapped in behind it (record in `DEFERRED.md`). Guardrails: age-gated, responsible-drinking framing, no fabricated price/stock (read from the catalogue).

### Increment 5 acceptance criteria (planned)
- [ ] Sommelier answers NL queries grounded in real catalogue items (no hallucinated products/prices).
- [ ] Gift Finder returns ranked suggestions from inputs.
- [ ] Works with the mock advisor (no key); Claude used when `ANTHROPIC_API_KEY` is set.
- [ ] Tests for retrieval/grounding; gates green; pushed to `main`.

---

## Completed increments

### Increment 4 — Accounts, order persistence & reviews ✅
- `OrderRepository`/`ReviewRepository` interfaces + in-memory store (`lib/db/`). Orders persist on pay.
- APIs: `GET /api/orders`, `GET|POST /api/products/[id]/reviews` (verified-purchase via order cross-check).
- Mock `AccountProvider`; `/account` dashboard (profile + order history). PDP customer-reviews section + form.
- Gates: `typecheck` ✓ · `lint` ✓ · `test` ✓ (40) · `build` ✓ (38 routes) · smoke test ✓.

### Increment 3 — Checkout, age verification & payment ✅
- Jurisdiction engine, VAT-aware pricing, `PaymentProvider` + mock; `/api/checkout/quote` + `/pay`; multi-step `CheckoutFlow`; confirmation.

### Increment 2 — Search, Wishlist & Recently-viewed ✅
- `/api/search` + `relevanceScore()`; instant-search; wishlist; recently-viewed; PLP active-filter chips.

### Increment 1 — Storefront foundation ✅
- Monorepo, `packages/types`, Next.js 15 + Tailwind, design system, `CatalogRepository`, Home/PLP/PDP/Cart/category/search/404, age-gate.

---

## MVP overall (Phase 1, tracked across increments)
- [x] Catalogue, PLP, PDP, search, cart, wishlist *(Increments 1–2)*
- [x] Checkout + age verification + UK jurisdiction rules + payment (mock) *(Increment 3)*
- [x] Accounts + order history + reviews *(Increment 4)*
- [ ] AI Whisky Advisor v1 (RAG) + Gift Finder *(Increment 5)*
- [ ] CMS (Sanity) for blog/guides; SEO + structured data *(Increment 6)*
- [ ] Production swaps: Postgres, Stripe, real auth/search *(see `DEFERRED.md`)*
- [ ] Analytics + accessibility (WCAG 2.2 AA) + Core Web Vitals budgets *(ongoing)*

## Notes for whoever continues
- Keep every increment runnable, tested, pushed to `main`; update the two context files after each.
- Abstractions to swap without touching UI/API: `CatalogRepository`, `PaymentProvider`, `OrderRepository`/`ReviewRepository`, `AccountProvider`, jurisdiction rules. **Production targets recorded in `DEFERRED.md`.**
- In-memory persistence resets on restart and isn't multi-instance safe — fine for dev, replaced by Postgres.
