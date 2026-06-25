# Deploying the WhiskyMart preview

This guide deploys the current build (**a working demo**) and attaches it to
**whiskymart.com**. Two paths: **Vercel** (fastest, click-to-deploy) and a
**single Node container** (most stable for this demo).

> The deploy itself needs *your* hosting + DNS accounts — follow the steps below;
> they take ~15–30 minutes plus DNS propagation.

---

## What this deploys (and the caveats)

✅ Fully working: browsing, search, AI Sommelier, Gift Finder, taste quiz,
multi-currency, multi-language, cart, wishlist, and a checkout that completes
with the **mock** payment + order confirmation.

⚠️ It's a **demo, not a live store**:
- **Payments are mocked** (no real charge).
- **Catalogue is 10 seed products.**
- **Orders/reviews are in-memory.** On **serverless** (Vercel) they may not
  persist across requests/instances (order history & new reviews can look
  empty). Everything client-side (cart, wishlist, palate, currency, language)
  is rock-solid. → For a **stable** demo of order history/reviews, use the
  **single-container** path (Option 2), which is one long-running process.

No environment variables are required to run the demo.

---

## Option 1 — Vercel (fastest) ⚡

1. Go to **vercel.com → Add New → Project**, and **Import** the GitHub repo
   `estiproglobal/whisky-mart`.
2. In the import screen set:
   - **Root Directory:** `apps/web`  ← important (it's a monorepo)
   - **Framework Preset:** Next.js (auto-detected)
   - **Build Command / Install Command / Output:** leave as default
     (Vercel detects pnpm from `pnpm-lock.yaml` and installs the workspace).
   - **Node.js Version:** 22 (matches `.nvmrc`).
   - **Environment Variables:** none required.
3. Click **Deploy**. You'll get a `https://whisky-mart-xxxx.vercel.app` URL.
4. **Attach the domain:** Project → **Settings → Domains → Add** `whiskymart.com`
   and `www.whiskymart.com`. Vercel will show the exact DNS records — typically:
   - Apex `whiskymart.com` → **A** record `76.76.21.21`
   - `www` → **CNAME** `cname.vercel-dns.com`
   - (or switch the domain's nameservers to Vercel's, also shown in the panel)
   Add these at your **domain registrar** (where whiskymart.com is registered).
   TLS is issued automatically once DNS resolves.

**CLI alternative:** `npm i -g vercel` → from `apps/web/` run `vercel` (link) then
`vercel --prod`; add the domain with `vercel domains add whiskymart.com`.

---

## Option 2 — Single Node container (most stable demo) 🐳

A long-running process keeps the in-memory order/review data stable.

**Local test:**
```bash
docker build -t whiskymart .
docker run -p 3000:3000 whiskymart      # http://localhost:3000
```

**Host it** on any container platform (they auto-detect the `Dockerfile`):
- **Render** → New → Web Service → connect repo → Docker → deploy.
- **Railway / Fly.io** → new app from repo (Docker) → deploy.
- **Any VPS** → `docker run` behind a reverse proxy (Caddy/Nginx) for TLS.

Keep it to **1 instance** so the in-memory stores stay coherent.

**Attach the domain:** add `whiskymart.com` as a custom domain in the host, then
at your registrar point DNS to the host (an **A** record to its IP, or a
**CNAME** for `www` to the host's hostname — the host shows the exact values).
TLS is handled by the platform (or Caddy/Let's Encrypt on a VPS).

---

## Optional environment variables (none needed for the demo)

| Var | Enables | Status |
|-----|---------|--------|
| `STRIPE_SECRET_KEY` | Real payments (swaps the mock) | deferred — see `DEFERRED.md` |
| `DATABASE_URL` | Persistent orders/reviews (Postgres) | deferred |
| `ANTHROPIC_API_KEY` | Claude-powered Sommelier | deferred |
| `SANITY_*` | CMS-backed content | deferred |

---

## Post-deploy smoke check

Visit the live URL and confirm:
- [ ] Home loads; age gate appears once; nav works.
- [ ] Switch currency (£→$) and language (EN→DE) — prices/chrome update.
- [ ] PDP → add to basket → `/checkout` → complete (mock card `4242 4242 4242 4242`) → confirmation.
- [ ] Ask the Sommelier a question; take the taste quiz; try the Gift Finder.
- [ ] `whiskymart.com` and `www.whiskymart.com` both resolve over HTTPS.

---

## When this becomes a *real* store
Wire the production swaps in `DEFERRED.md` (Stripe, Postgres, auth, …) and
complete the legal/ops prerequisites (alcohol licence, payment underwriting,
age-verification vendor, real catalogue/tax). See `Handoff.md` → go-live note.
