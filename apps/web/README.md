# @whiskymart/web

The WhiskyMart.com storefront — Next.js 15 (App Router) + TypeScript + Tailwind.

This is **MVP Increment 1: the storefront foundation**. It runs entirely on a
seed catalogue through a swappable data layer (`lib/catalog/repository.ts`), so
a real backend (Medusa / API) can replace the source without touching the UI.

## Run

From the repo root:

```bash
pnpm install
pnpm --filter @whiskymart/web dev     # http://localhost:3000
```

## Scripts

```bash
pnpm --filter @whiskymart/web build       # production build
pnpm --filter @whiskymart/web test        # vitest unit/component tests
pnpm --filter @whiskymart/web typecheck   # tsc --noEmit
pnpm --filter @whiskymart/web lint        # eslint
```

## What's here

| Area | Path |
|------|------|
| Pages (App Router) | `app/` — home, `shop`, `c/[slug]`, `products/[slug]`, `search`, `cart`, `sommelier` |
| Design-system components | `components/` |
| Cart (client context + localStorage) | `components/cart/` |
| Data layer (seed + repository) | `lib/catalog/` |
| Shared domain types | `../../packages/types` (`@whiskymart/types`) |
| Design tokens | `tailwind.config.ts`, `app/globals.css` |

## What's intentionally stubbed (next increments)

- **Checkout / payment / age verification** — buttons present, flow lands in Increment 3.
- **AI Sommelier** — teaser page now; conversational RAG advisor in Increment 5.
- **Accounts / wishlist / reviews persistence** — Increment 4.
- **Real product data & images** — swap the seed source for Medusa/API; replace gradient placeholders with `next/image` + CDN.
