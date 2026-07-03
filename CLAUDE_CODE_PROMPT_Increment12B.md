# Claude Code Prompt — Increment 12B: "The Archive" (buyer-demo edition)

> Supersedes `CLAUDE_CODE_PROMPT_Increment12.md`. Paste everything below
> the line into Claude Code from the repo root. Model note at the bottom.

---

Read `Project_Context.md`, `Current_Task.md`, `Handoff.md`, `DEFERRED.md`,
and `PATH_B_PLAN.md` first, then `docs/04-ui-ux-architecture.md` for the
component map. Work on branch `increment-12b-the-archive`. All existing
tests stay green throughout. Application behaviour (routing, checkout flow,
APIs, provider bindings) must not change except where this spec adds pages
or data — this increment is presentation, content, catalog data, and
credibility.

## Purpose

This site's job has changed. It is no longer a proto-business; it is a
**sales asset**. It will be shown to prospective buyers of the
WhiskyMart.com domain + brand + build. Success criterion: a drinks-industry
buyer lands on the homepage and, within 90 seconds, can visualise the
finished business they would build on this foundation. Every decision below
serves believability and vision, in that order.

The current design fails that test for five diagnosable reasons:

1. Every product and lifestyle image is an SVG/gradient placeholder.
2. The Increment 11 aesthetic (hairline rules, flat tiles, broadsheet
   restraint, ink CTAs) is a recognisable default look that AI-generated
   design converges on. A design-literate buyer will clock it.
3. The homepage is six near-identical product rails recycling ~8 SKUs (the
   Islay flight appears three times on one page). A 10-SKU shop reads as
   fake at any polish level.
4. The copy is dense with AI tells: colon-splices as sentence glue,
   rule-of-three lists, an eyebrow label above every section, adjective
   flattery ("beautifully judged"), significance inflation.
5. Fabricated social proof ("What our members are pouring" with zero
   members; invented rating counts) — the single fastest way to lose a
   buyer's trust during diligence.

## Part 1 — Design system: "The Archive"

Replace the Increment 11 token layer. Concept: a distiller's private
archive — warehouse dark, paper records, copper stills. Not a broadsheet,
not a cream-and-terracotta landing page.

**Colour tokens** (define once; derive everything):

- `--ground: #171210` (peat/char — primary page ground; the site is
  dark-first)
- `--surface: #211A16` (oak — cards, panels)
- `--parchment: #EFE6D3` (paper — the *inverse* surface for the journal
  and label plates, not the default background)
- `--ink: #14100D` (text on parchment)
- `--cream-text: #EDE4D6` (text on dark)
- `--copper: #C1763B` (the single accent: links, active states, the thin
  "pour line" rule under section headings; fully replaces amber #FF8A1E)
- `--copper-deep: #8F5527` (hover/pressed)
- Muted text on dark: cream at 62% opacity; hairlines at 14%.

All text pairs must pass WCAG AA. No other hues anywhere; amber may only
exist inside photographs.

**Typography** (self-host via `next/font`, all on Google Fonts):

- Display: **Libre Caslon Display** — headlines, product names, PDP price.
  Leading 1.05–1.1, generous sizes, never letterspaced.
- Body: **Newsreader** (optical sizing on) — paragraphs, tasting notes,
  guide bodies. This is what makes the editorial pages read like a
  magazine instead of a SaaS site.
- Utility: **Archivo** — nav, buttons, forms, label-plate data, card
  prices, breadcrumbs. Small labels 12–13px, +4% tracking, sentence case.
  All-caps/small-caps allowed only inside the label plate.

Five-step type scale; homepage H1 at clamp(2.8rem, 6vw, 4.5rem). Kill the
eyebrow-label-above-every-section pattern sitewide; the label plate is the
only place small-caps labelling appears, because there it mimics an actual
bottle label and therefore means something.

**Signature element — the label plate.** Build `<LabelPlate>` once: a
bordered parchment plate typeset like a distillery label — distillery name
in Libre Caslon, then REGION · CASK · ABV · AGE in small-caps Archivo with
thin rule separators. Prominent on PDP, compact variant on product cards,
featured on the homepage bottle act. This is the one memorable device.
Everything around it stays quiet: no numbered 01/02/03 markers, no icon
grids, no badges beyond what checkout compliance requires.

**Motion:** one orchestrated moment — a slow fade-and-settle of the
homepage hero image and headline on load. All other interaction feedback is
opacity/underline. Respect `prefers-reduced-motion`.

**Radii/borders:** 2px radius everywhere; borders 1px cream@14% on dark,
1px ink@15% on parchment.

## Part 2 — Photography system

Replace every gradient/SVG placeholder. Two layers:

**A. Atmosphere photography.** Source 10–14 images from Unsplash/Pexels
(licenses permitting commercial use; record source URL + license per image
in a new `apps/web/public/photo/CREDITS.md`). Shot list: dram glass in low
warm light; oak casks in a warehouse; copper still detail; peaty/coastal
Islay landscape; a pour close-up; bottles on dark shelving with labels
illegible; a tasting table; cork-and-capsule macro. Unify mixed sources
with one treatment: a reusable `<Photo>` wrapper applying slight
desaturation plus a ~8% copper overlay so everything reads as one shoot.
Used for: homepage hero (full-bleed), featured-bottle act, guide covers,
category headers, Sommelier and Gift Finder panels, About, `/vision`.

**B. Product imagery.** Do not hotlink producer pack shots (the demo does
not stock these brands; keep it clean for a buyer's diligence). Build a
consistent dark "niche" stage per card/PDP: an atmosphere photo heavily
darkened as the backdrop, a realistic generic bottle rendering per format
(tall Speyside, squat Islay round-shoulder, Japanese, glassware, flight
box) as the subject, and the product's `<LabelPlate>` carrying its
identity. Photography carries mood; the plate carries the brand. Where
genuinely free-licensed real bottle photos exist, prefer them, credit
them, and run them through the same treatment. Update `DEFERRED.md` §8 to
describe this system as the current state of the imagery seam.

Performance: everything through `next/image` with explicit `sizes`,
AVIF/WebP, hero preloaded. Lighthouse performance ≥ 85 with images live.

## Part 3 — Catalog expansion (45–55 SKUs)

Believability now depends on stock depth. Expand the seed catalog:

- Coverage: Islay, Speyside, Highland, Islands, Campbeltown, Lowland,
  Irish, Japanese, American (bourbon/rye), plus 4–6 glassware/accessory
  SKUs and 3–4 tasting flights.
- Data must be **accurate to real bottlings**: correct distillery, region,
  age statement, ABV, cask type, and GBP pricing within plausible range of
  current UK retail. Write honest, specific tasting notes (no "notes of
  excellence"). If unsure of a bottling's details, choose a better-known
  expression you can be confident about rather than inventing.
- Structure the homepage shelf and PLP queries so no product appears twice
  on any one page.
- Include a spread of price tiers: entry (£25–45), core (£45–90), premium
  (£90–250), and 4–5 collector-tier bottles (£250–1500) so the collector/
  investment story on `/vision` has visible anchors in the catalog.

## Part 4 — Homepage restructure (six acts)

Delete the six-rail scaffolding; do not re-skin it. New structure:

1. **Hero.** Full-bleed atmosphere photo, dark scrim. New headline (Part
   5 rules), one primary CTA ("Browse the shelf"), one text link ("Ask the
   Sommelier"). No trust-badge row.
2. **The featured bottle.** One SKU told as a story: large image, Libre
   Caslon headline, 60–90 words of specific tasting prose, its
   `<LabelPlate>`, price, one CTA. Hardcode via a `featuredProductId`
   constant.
3. **The shelf.** ONE rail, 6 items, single query, no duplicates with the
   featured bottle. Title: "On the shelf this month".
4. **The Sommelier.** This is the demo's star witness — the one thing no
   competitor storefront shows. Split panel on parchment: left, two short
   sentences on what it does + CTA; right, a real worked exchange (one
   user line, one grounded recommendation rendering an actual mini product
   card from the catalog). Below, one text link to the Gift Finder. Make
   the `/sommelier` page itself shine: seed 3–4 tappable example prompts
   that produce impressive grounded answers from the existing mock.
5. **The journal.** Parchment section; three guide covers with
   photography, magazine-style (cover, kicker, title, reading time).
6. **The road ahead.** Quiet, short act: one line ("The shop is chapter
   one.") and a text link to `/vision`. No imagery needed; let it be the
   calm beat before the footer.

Category pages, PDP, guides, checkout, and account get the token/type/
photo retrofit within their existing structure. Checkout stays maximally
plain and trustworthy.

## Part 5 — `/vision`: the buyer-visualization page

New editorial page, linked from the footer and homepage act 6. This is
the five-phase blueprint (`docs/00`/`01`) rendered for a reader, not a
repo. Treat it as the business plan a prospective owner can see
themselves implementing.

- Format: a single long-form editorial page on parchment, Newsreader body,
  one atmosphere photo per phase. Five chapters — the shop, discovery,
  community, the collectors' market, the AI platform — each: a Libre
  Caslon chapter heading, 80–120 words of plain-English description of
  what it is and why it compounds on the previous chapter, and one
  concrete example moment ("a collector lists a 1989 Springbank; provenance
  verified, escrow held, 8% commission").
- Every future-phase description is framed honestly as roadmap ("Chapter
  two builds…", "planned"), never as an existing feature. No fake UI
  screenshots of unbuilt phases.
- End with a short factual paragraph on the foundation: composable
  architecture, documented one-binding production swaps, compliance
  research done. One link: "Browse the shop — chapter one is live."
- Tone identical to the rest of the site: confident, specific, dry. This
  page must not read like an investor deck.

## Part 6 — Copy rewrite (humanization rules, sitewide)

Rewrite all marketing copy: homepage, section intros, category
descriptions, About, Sommelier/Gift Finder framing, empty states, the seed
guides, and `/vision`. Hard rules:

- **No colon-splices as sentence glue** ("Occasion, budget, taste. We'll
  narrow the shelf…" — this pattern is everywhere; eliminate it). No em
  dashes either.
- **No rule-of-three (or five) lists in prose.** "Discover, buy, learn,
  collect and invest" — gone. One thing per sentence.
- **Ban list:** "beautifully judged", "exceptional", "elevate", "journey",
  "seamless", "the moment it was made for", "stands as", "testament",
  "curated" (allowed once sitewide).
- **Specific beats evocative.** Bad: "chosen for its character and
  provenance." Good: "nine years in ex-bourbon casks a hundred metres from
  the Atlantic, and it tastes like it."
- **Vary sentence length.** If a block reads with an even mid-length
  cadence throughout, rewrite it.
- **Voice:** a knowledgeable friend who owns a small whisky shop. Dry,
  confident, occasionally funny, never salesy. British English.
- Buttons say what they do: "Browse the shelf", "Ask the Sommelier",
  "Read the guide". Never "Explore" or "Discover more".

After drafting, audit your own copy for remaining AI tells and fix them
before committing.

## Part 7 — Credibility fixes (non-negotiable)

- Remove fabricated social proof. "What our members are pouring" is gone.
  Remove or clearly mark illustrative rating counts; keep the review
  system but seed it honestly (a handful of reviews plainly attributed to
  the house tasting team, or none at all).
- Fix the duplicated hero image render on the homepage.
- Header icon links currently expose raw paths as accessible text
  ("/account/wishlist"): give wishlist/account/cart proper icons with
  `aria-label`s.
- Footer colophon, quiet and factual: "WhiskyMart is currently a
  demonstration storefront. Payments and fulfilment are simulated." Style
  as a colophon, not a warning banner. To a buyer this reads as
  diligence-ready, not weak.
- Keep the age gate, responsible-drinking lines, and Sommelier guardrails
  exactly as they are.

## Part 8 — Process and gates

- Existing increment discipline: plan → implement → test → update
  `Current_Task.md`/`Handoff.md` → PR from `increment-12b-the-archive`;
  no direct pushes to `main`.
- **Before writing code**, produce a short written design plan: final
  tokens, type scale, ASCII wireframes of the homepage and `/vision`.
  Check it against the five failure modes at the top. If any part matches
  the Increment 11 look or a generic template answer you would produce for
  any e-commerce brief, revise it and state what changed and why.
- **After implementing**, review each homepage act, one PDP, the
  Sommelier page, and `/vision` against Parts 1–7 (screenshots against the
  dev server if available, otherwise a written walkthrough). Apply the
  "remove one accessory" test: cut at least one decorative element you
  were tempted to keep.
- Update `DEFERRED.md` §8 (imagery) and add `photo/CREDITS.md`.
- Gates: `pnpm lint`, `pnpm typecheck`, full test suite green (extend
  tests where catalog size or new pages need coverage), Lighthouse
  perf ≥ 85 / a11y ≥ 95 on home + PDP + `/vision`, visible keyboard focus,
  reduced-motion respected, 390px mobile checked on every touched page.
- Split the work into two commits/sessions if context gets heavy:
  (1) design system + homepage + copy + credibility, (2) catalog data +
  `/vision` + imagery plumbing. The PR ships them together.

---

## Model recommendation (not part of the prompt)

Run session 1 (design, copy, self-critique — the taste-heavy half) with
**Claude Opus 4.8** in Claude Code, or **Claude Fable 5** if your plan
exposes it there. Run session 2 (catalog data entry, image plumbing,
credits file — mechanical against a written spec) with **Claude Sonnet
4.6** to save budget. One caveat that no model removes: **spot-check the
catalog data yourself against a UK retailer's live listings** (prices, age
statements, ABVs) before merging. A whisky-literate buyer will open the
Islay page first, and one wrong age statement costs more credibility than
the entire redesign buys.
