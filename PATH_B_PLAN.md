# Path B Plan: Build the Demo, Package It, Sell It

> Supersedes Increments 12–16 in `ROADMAP.md`. Decision made: sell the
> domain + brand + build as a package. Target outcome: an honest $10–35k,
> with upside if a strategic buyer bites. Everything below serves one
> question a buyer asks in the first 90 seconds: "can I see the business
> I'd be buying?"

---

## Step 1 — Increment 12B: "The Archive" (build the demo)

One combined increment. Full executable spec in
`CLAUDE_CODE_PROMPT_Increment12B.md`. Contents:

- New design system (dark peat/oak, parchment, copper; Libre Caslon Display
  + Newsreader + Archivo; the label-plate signature element).
- Real photography replacing every SVG/gradient placeholder.
- Homepage rebuilt as a six-act editorial page (hero → featured bottle →
  the shelf → the Sommelier → the journal → the road ahead).
- Catalog expanded to 45–55 accurate, real-world SKUs.
- `/vision` page: the five-phase blueprint as a buyer-readable editorial
  roadmap.
- Sitewide copy rewrite to humanization rules; fabricated social proof
  removed; demo colophon added; hero duplicate and icon-link bugs fixed.

Acceptance gates are in the prompt. Estimated effort: one focused Claude
Code session for design + copy, a second for catalog data (the data needs
human spot-checking — invented age statements or absurd prices will be
noticed by exactly the whisky-literate buyer you want).

## Step 2 — Package (1 week, mostly writing)

- `SALE_PACKAGE.md` → export as a 2-page PDF one-pager:
  - The asset: WhiskyMart.com (registered 2012, exact-match .com), brand
    system (logo package, design system), working Next.js storefront demo
    (link), AI Sommelier demo, 10-document business/technical blueprint,
    compliance research (docs/09), 45+ SKU seed catalog, content system.
  - The opportunity, in the buyer's language: "a launch-ready whisky
    commerce and content platform; plug in Stripe, licenses, and inventory"
    — with the interface-first swap list (`DEFERRED.md`) reframed as a
    feature: every production integration is a documented one-binding swap.
  - What it is NOT (no revenue, no traffic, no licenses). Honesty here is
    a selling tool; it pre-empts diligence and marks you as serious.
  - Price: anchor high with a justification (domain age, build cost to
    replicate, blueprint depth), expect negotiation. Suggested ask
    $45–60k, walk-away floor you decide privately.
- Screenshots/screen recording of the finished demo (homepage, PDP,
  Sommelier exchange, vision page) for listings.
- Clean the repo for transfer: squash noise, confirm no secrets in
  history, MIT-or-transfer licensing note, `TRANSFER.md` checklist
  (domain, Vercel project, repo, logo source files).

## Step 3 — Sell (ongoing, parallel channels)

1. **Direct outreach (highest expected value).** Build a list of ~50
   plausible strategic buyers: craft/new-world distilleries without D2C,
   drinks-industry marketers, whisky content creators with audiences but
   no platform, e-commerce operators in adjacent verticals, domain-plus-
   business investors. Short, human email (you already have the cold-email
   muscle from EstiPro): one line on what it is, link to the live demo,
   the one-pager attached. The demo does the selling.
2. **Marketplaces.** Afternic/Sedo for domain-led interest; Flippa for the
   site+domain package. Expect low anchors there; treat marketplace bids
   as your floor, not your target.
3. **Whisky-world visibility.** A single well-written post in whisky
   business/enthusiast communities ("I built this, I'm not the right
   owner, looking for one") occasionally outperforms every marketplace.

**Discipline:** set a 90-day sell window after Step 2. If no acceptable
offer, decide once: drop the price, or park the site live (it costs
nothing on Vercel) and let the domain age while you refocus on EstiPro.
Do not drift into rebuilding features to impress a buyer who hasn't
appeared — every additional increment past 12B has near-zero effect on
price.
