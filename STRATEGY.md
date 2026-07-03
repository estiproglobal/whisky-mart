# Strategy: What WhiskyMart Is Actually For
**Decision (July 2026): Path B chosen. See PATH_B_PLAN.md.**

> Read after `Project_Context.md`. This document reframes the exit plan against
> market reality. It supersedes the implicit assumption that a polished demo
> alone sells for $100k+.

---

## 1. What buyers pay for

Web assets sell on three things, in descending order of price power:

1. **Revenue.** Content/e-commerce assets trade at roughly 30–40× monthly net
   profit on the established marketplaces (Empire Flippers, FE International,
   private deals). A site netting $3k/month is a ~$100k asset. A site netting
   $0/month is not an asset; it is inventory.
2. **Audience.** Traffic and an email list can sell without revenue, but at a
   steep discount, and only when the audience is large and provably engaged.
3. **The domain.** WhiskyMart.com is a 14-year-aged, exact-match, two-word
   .com. That has genuine end-user value — realistic range low five figures
   to perhaps $20–35k with the right strategic buyer and patience. It does
   not reach $100k on its own.

A codebase with mock payments, in-memory persistence, ~10 seed SKUs, no
traffic, and no customers adds **credibility**, not price. It helps a buyer
believe the story. It is not the story. Comparable "built, no revenue"
starter sites on Flippa clear $500–$5,000.

## 2. Why the imagined buyer will not pay

The plan assumed an established whisky business buys the build. They will
not, for structural reasons:

- They already have engineers and a working storefront. Rebuilding this is
  cheaper for them than integrating unfamiliar code.
- The regulatory moat described in the blueprint (jurisdiction engine, age
  verification) is currently an encoded rules table, not a licensed,
  underwritten operation. The hard part of alcohol commerce is licenses and
  processor relationships, which do not exist in this repo and cannot be
  transferred from it.
- "What our members are pouring" with zero members is the kind of claim a
  diligence process finds in minutes, and it taints every other claim.

## 3. The constraint that shapes everything

The owner cannot operate the store: no alcohol licenses, high-risk MCC,
US three-tier system, and jurisdictional distance (see `docs/09`). Any plan
that requires selling a bottle is dead on arrival. Any plan must monetise
**around** the bottle: content, referral, data, audience.

## 4. The two viable paths

### Path A — Build the real business (the only $100k+ route)

Reposition WhiskyMart as an **editorial whisky platform with a
commerce-ready chassis**:

- Publish genuinely good whisky content: buying guides, region explainers,
  honest reviews, price-tracking, "best under £50/£100" evergreen pages.
- Monetise via affiliate links to licensed retailers (The Whisky Exchange
  via AWIN; Flaviar; others — **verify current programme terms before
  building around any of them**), plus display ads once traffic supports it
  (Mediavine/Raptive thresholds ~50k sessions/month).
- The palate quiz and Sommelier become **email-capture engines**. The list
  is a first-class asset in the eventual sale.
- The storefront remains live as the "upside story": a buyer acquires a
  revenue-producing content business *plus* a commerce platform ready to
  activate. That is a better listing than either alone.

Honest expectations: 18–30 months of consistent publishing (1–3 quality
pieces/week) before revenue supports a $100k valuation. Whisky is a
competitive but monetisable niche; the domain is a real head start for SEO
trust signals. This path also survives failure gracefully — even a
half-built version increases what Path B fetches.

### Path B — Package and sell now

Finish Increment 12 (design/credibility overhaul), write a buyer-facing
one-pager, and list domain + brand + build as a package (Flippa, Afternic,
direct outreach to distilleries and drinks-adjacent founders entering D2C).
Realistic outcome: **$10–35k**, not $100k. Fast, clean, done in weeks.

### The decision rule

If you cannot commit to ~18 months of weekly publishing (or paying someone
to), take Path B and redeploy the capital and attention into EstiPro, which
already has revenue mechanics. A stalled Path A converges to Path B's price
anyway, minus a year.

## 5. What does NOT change

Increment 12 — the design, catalog-depth, and copy-credibility overhaul in
`ROADMAP.md` — is required under **both** paths. Path A needs it because
readers and affiliate partners judge the surface. Path B needs it because
the demo is the sales asset. Build it next regardless.

## 6. Claims hygiene (both paths, non-negotiable)

- No fabricated social proof. Remove or reframe "members," invented review
  counts, and ratings until they are real or clearly labelled illustrative.
- No implication that checkout ships real whisky while payments are mocked.
  A visible "demonstration storefront" notice in the footer is honest and,
  to a buyer, reads as diligence-ready rather than weak.
- Product imagery of real brands (Lagavulin, Macallan, etc.): standard
  retailer practice is producer-supplied pack shots, but a non-selling demo
  has weaker footing. Prefer original/licensed photography and treated
  compositions; keep brand pack shots minimal and replaceable.
