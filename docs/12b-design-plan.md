# Increment 12B design plan: "The Archive"

> The Part 8 process artifact for `CLAUDE_CODE_PROMPT_Increment12B.md`,
> approved by the owner before implementation (session 1: Parts 1, 2, 4, 6, 7).
> Session 2 covers Parts 3 and 5 against the same plan.

## 1. Tokens

Colour (nothing outside this set anywhere; amber exists only inside
photographs):

| Token | Value | Role |
|---|---|---|
| `ground` | `#171210` | page background, dark-first sitewide |
| `surface` | `#211A16` | cards, panels, header |
| `parchment` | `#EFE6D3` | inverse surface: label plates, journal, Sommelier act, checkout panels |
| `ink` | `#14100D` | text on parchment |
| `cream` | `#EDE4D6` | text on dark |
| `copper` | `#C1763B` | the single accent: links on dark, active states, pour-line rules |
| `copper-deep` | `#8F5527` | hover/pressed; textual accent on parchment |

Derived: muted text on dark = cream @ 62%; hairlines = cream @ 14% on dark,
ink @ 15% on parchment.

WCAG AA (computed): cream/ground 14.8:1; cream62/ground 6.2:1; copper/ground
5.2:1; copper/surface 4.8:1; ink/parchment ~15:1. Copper on parchment fails
(2.9:1), so **on parchment all textual accents use `copper-deep`** (4.8:1);
raw copper on parchment appears only in non-text hairlines (the pour line).

Radii: 2px everywhere (`rounded-full` survives only for the cart count dot
and spinners). Borders: 1px at the hairline opacities above.

Deleted from Increment 11: the amber/gold/brass/whisky-ramp palette,
`cask-glow` gradients, `texture-grain`, `edge-sheen`, the credo band, hover
lift/zoom, the `rule-gold` + eyebrow pattern, numbered 01/02/03 markers.

Motion: one orchestrated moment, the homepage hero photo fades and settles
(opacity 0 to 1 with a 1.02 to 1 scale, ~1.4s) with the headline following
(12px rise, 150ms later). CSS keyframes only; the global
`prefers-reduced-motion` guard kills it. Every other interaction is opacity
or underline.

## 2. Type scale (five steps)

Self-hosted via `next/font/google`: **Libre Caslon Display** (display),
**Newsreader** with optical sizing on (body), **Archivo** (utility).
Cormorant Garamond and Inter are removed.

| Step | Spec | Face | Used for |
|---|---|---|---|
| D1 | `clamp(2.8rem, 6vw, 4.5rem)` / 1.05 | Caslon | homepage H1, `/vision` title |
| D2 | `clamp(1.9rem, 3.2vw, 2.75rem)` / 1.08 | Caslon | act and section headings, PDP name, chapter heads |
| D3 | 1.375rem / 1.2 | Caslon | card titles, plate distillery name, PDP price |
| Body | 1.0625rem / 1.65 (sm 0.9375rem) | Newsreader | prose, tasting notes, guides |
| Label | 0.8125rem, +4% tracking (sm 0.75rem) | Archivo | nav, buttons, forms, breadcrumbs, plate data |

Buttons are Archivo sentence case ("Browse the shelf"). All-caps/small-caps
exists only inside the label plate. The eyebrow-label pattern is deleted
sitewide; section headings are Caslon with a thin copper pour line beneath.

## 3. The label plate (signature element)

```
        +---------------------------------+   parchment, 1px ink@15% border,
        |  +---------------------------+  |   inner hairline frame, 2px radius
        |  |       LAGAVULIN           |  |   (Libre Caslon, ink)
        |  |  -----------  -----------  |  |
        |  | ISLAY . EX-BOURBON        |  |   (Archivo small-caps 12px,
        |  |      43% . 16 YEARS       |  |    thin rule separators)
        |  +---------------------------+  |
        +---------------------------------+
```

One component, three variants: `pdp` (full), `card` (compact: name + one
data row; replaces the brand/eyebrow/meta block on product cards),
`featured` (homepage act 2, larger). Data comes off the product (distillery,
region, primary cask, ABV, age); accessories and flights degrade to name +
category. The plate is the only decorated object; everything around it stays
quiet.

## 4. Photography system

Two layers per Part 2:

- **Atmosphere**: 10 to 14 shots (dram in low light, casks, copper still,
  Islay coast, pour, dark shelving, tasting table, cork macro) unified by a
  `<Photo>` wrapper: slight desaturation + ~8% copper overlay, `next/image`
  with explicit `sizes`, AVIF/WebP, hero preloaded. Sources and licences
  recorded per image in `apps/web/public/photo/CREDITS.md`.
- **Product**: no producer pack shots. A dark niche stage per card/PDP
  (atmosphere backdrop heavily darkened), a generic bottle render per format
  (tall Speyside, squat round-shoulder Islay, Japanese, glassware, flight
  box) with no fake label text, and the compact `<LabelPlate>` carrying
  identity.

Sandbox constraint (recorded at planning time): the environment's network
policy blocked all image hosts, so the plumbing, manifest and credits ship
first and binaries land once the owner allowlists the CDNs.

## 5. Homepage (six acts)

The six-rail scaffolding is deleted, not re-skinned.

```
ACT 1  HERO         full-bleed atmosphere photo, scrim low-left,
                    D1 headline, one CTA + one text link, no badges,
                    fade-and-settle on load
ACT 2  FEATURED     one SKU as a story: niche image, D2 head, 60-90 words
                    of tasting prose, featured LabelPlate, price, one CTA;
                    hardcoded featuredProductId
ACT 3  THE SHELF    ONE rail, "On the shelf this month", 6 SKUs, single
                    query excluding the featured bottle; no duplicates
ACT 4  SOMMELIER    parchment split panel: two sentences + CTA left; a
                    worked exchange right (one user line, one grounded
                    reply rendering a real mini product card); Gift Finder
                    text link below
ACT 5  JOURNAL      parchment; three guide covers, magazine-style
                    (cover photo, kicker, title, reading time)
ACT 6  ROAD AHEAD   one line: "The shop is chapter one." + text link to
                    /vision; no imagery
```

Category pages, PDP, guides, checkout, and account get the token/type/photo
retrofit within their existing structure; checkout stays maximally plain
(parchment form panels, no decoration).

## 6. `/vision` (designed now, built in session 2)

Single long-form parchment editorial, ~68ch column, Newsreader body. Five
chapters (shop, discovery, community, collectors' market, AI platform),
each: one atmosphere photo, a Caslon D2 chapter heading, 80 to 120 words of
plain English, one concrete example moment set indented. Future phases are
framed honestly as roadmap. Ends with a short factual foundation paragraph
and one link back to the shop.

## 7. Copy rules (Part 6, enforced)

No colon-splices as sentence glue; no em dashes (see `CLAUDE.md`); no
rule-of-three lists in prose; ban list ("beautifully judged", "exceptional",
"elevate", "journey", "seamless", "the moment it was made for", "stands as",
"testament"; "curated" at most once sitewide); specific beats evocative;
varied sentence length; a knowledgeable friend who owns a small whisky shop;
British English; buttons say what they do. A scripted audit (ripgrep for the
ban list, colon-splice patterns in marketing strings, and the em-dash
codepoint) runs before commit.

## 8. Credibility fixes (verified against code before implementation)

- "What our members are pouring" (`app/page.tsx`) dies with the homepage.
- Invented rating counts come off cards; PDP keeps the labelled house
  rating without a count; the three seeded reviews are re-attributed
  plainly to the WhiskyMart tasting team.
- The duplicated hero bottle render (`hero-bottle.tsx`, body + reflection)
  is deleted with act 1.
- Header icon links: verified `aria-label`s in rendered HTML.
- Footer colophon: "WhiskyMart is currently a demonstration storefront.
  Payments and fulfilment are simulated."
- Age gate, responsible-drinking lines, Sommelier guardrails untouched.
- Scope addition (owner-approved): the footer linked to `/about`, `/help`
  and `/sell`, none of which existed. A small `/about` page is added;
  "Sell with us" points at `/vision`; `/help` becomes a short factual
  delivery note.

## 9. Check against the five failure modes

1. **Placeholder imagery**: photography system above; the guaranteed floor
   is full plumbing + the niche/plate product system.
2. **Recognisable AI-default design**: first instincts caught and revised:
   eyebrow labels killed (the plate is the only labelled device); uppercase
   letterspaced buttons changed to Archivo sentence case; film grain
   deleted (it is itself a tell); Cormorant Garamond replaced by Libre
   Caslon Display; hover lift/zoom replaced by opacity/underline.
3. **Six near-identical rails**: acts alternate ground and layout
   (full-bleed photo / split feature / one rail / parchment split / covers /
   one line); one product appears at most once per page.
4. **AI-tell copy**: hard rules + scripted audit + a manual cadence pass.
5. **Fabricated social proof**: removed or honestly re-attributed; nothing
   claims members, customers or review volumes that do not exist.
