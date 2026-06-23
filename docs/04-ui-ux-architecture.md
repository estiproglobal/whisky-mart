# 04 — UI/UX Architecture (Part 4)

> Page-by-page design, wireframe recommendations, the design system, conversion-optimisation tactics, accessibility standards, and modern design direction.

---

## 1. Design principles (the rules every screen obeys)

1. **Premium, not pretentious.** Editorial elegance (whitespace, refined type, rich photography) that still welcomes beginners. Luxury *feel*, supermarket *clarity*.
2. **Guidance over gatekeeping.** Always offer a "help me choose" path (AI advisor, quiz, guides). Never make the user feel they don't know enough to buy.
3. **Trust is the conversion currency.** Surface authenticity, reviews, provenance, secure-checkout, and responsible-drinking signals everywhere.
4. **Mobile-first, thumb-first.** Most traffic is mobile; design for one-handed use, then scale up.
5. **Speed is a feature.** Core Web Vitals are non-negotiable (LCP < 2.0s, INP < 200ms, CLS < 0.1). Performance = SEO = conversion.
6. **Personalised, not creepy.** Use palate/behaviour data to help, transparently; let users see and control it.
7. **Accessible by default.** WCAG 2.2 AA minimum (§7). Accessibility is both ethical and a larger addressable market.
8. **Consistent system, not bespoke pages.** A design system (tokens + components) so the platform stays coherent as it scales across 100k+ SKUs and many surfaces.

## 2. Design system

- **Foundations:** design tokens (color, type, spacing, radius, shadow, motion) in a single source → Tailwind config + CSS variables; theming for light/dark and seasonal.
- **Brand:** warm, premium palette (deep amber/whisky tones, charcoal, cream, gold accents), an elegant serif for display + clean sans for UI, generous whitespace, high-quality photography and subtle motion.
- **Components:** built on **Radix/shadcn primitives**, accessible by construction (focus, ARIA, keyboard). Catalogued in **Storybook**.
- **Pattern library:** product card, facet filter, AI advisor panel, review block, gift configurator, tasting-note widget, price/stock/badge system, "drop" countdown, vault tile.

---

## 3. Page-by-page architecture

Wireframes below are **low-fidelity ASCII** to convey layout/priority, not pixel design.

### 3.1 Homepage
**Job:** orient every persona in <5 seconds; route them to the right journey; convert intent.

```
┌──────────────────────────────────────────────────────────────┐
│ [≡] WhiskyMart      Search…(prominent)        ♡  👤  🛒  [GBP▾]│  ← sticky header + age-verified state
├──────────────────────────────────────────────────────────────┤
│  MEGA-NAV: Whisky ▾ | Regions ▾ | Brands ▾ | Gifts ▾ | Learn ▾ |
│            Samples | Offers | Community | Sell                  │
├──────────────────────────────────────────────────────────────┤
│  HERO  (editorial image + 1 clear message + CTA)               │
│  "Find your next favourite whisky."  [Ask the Sommelier]       │
├──────────────────────────────────────────────────────────────┤
│  PERSONALISED RAIL: "Recommended for you" / "New here? Start →"│
├──────────────────────────────────────────────────────────────┤
│  SHOP BY: [Beginner] [Under £50] [Peated] [Gifts] [Investment] │  ← intent shortcuts
├──────────────────────────────────────────────────────────────┤
│  RAIL: New & Limited (with countdowns)  → → →                  │
│  RAIL: Best sellers / Top rated         → → →                  │
├──────────────────────────────────────────────────────────────┤
│  STORY BLOCK: Featured distillery / region (editorial + shop)  │
├──────────────────────────────────────────────────────────────┤
│  GIFT FINDER banner | SAMPLES banner | MEMBERSHIP banner       │
├──────────────────────────────────────────────────────────────┤
│  CONTENT RAIL: latest guides/reviews/video (SEO + authority)   │
├──────────────────────────────────────────────────────────────┤
│  TRUST BAR: ★Trustpilot · Authenticity · Secure · Responsible  │
│  FOOTER: full nav, regions, help, legal, age/responsibility    │
└──────────────────────────────────────────────────────────────┘
```
**CRO notes:** one dominant hero CTA; personalised rail above the fold for returning users; intent shortcuts capture all six personas; countdowns create urgency on drops; trust bar reduces anxiety.

### 3.2 Product Detail Page (PDP)
**Job:** give confidence to buy; the single most important conversion surface.

```
┌───────────────────────────┬──────────────────────────────────┐
│  GALLERY                   │  Brand · Distillery (linked)      │
│  [main image / 360 / video]│  ★★★★☆ 4.6 (212)  ·  In stock      │
│  [thumb][thumb][thumb]     │  H1: Lagavulin 16 Year Old        │
│  [Scan/AR view]            │  £74.95  (Members £67.45)         │
│                            │  Size: [70cl▾]  Qty: [1]          │
│                            │  [ADD TO BASKET]  [♡ Wishlist]    │
│                            │  ✓ Free del over £X · Age-checked │
│                            │  [Buy a 3cl sample £6.95]  ← try  │
│                            │  [+ Add gift wrap & message]      │
├───────────────────────────┴──────────────────────────────────┤
│  KEY FACTS (scannable): Region | Age | ABV | Cask | Style ppm  │
├────────────────────────────────────────────────────────────────┤
│  FLAVOUR PROFILE (visual wheel/bars)  +  "Tastes like…" chips   │
├────────────────────────────────────────────────────────────────┤
│  TABS: Description | Tasting notes | Reviews | Pairing | Q&A    │
│   • Expert + AI-summarised notes  • Food pairing (AI)           │
│   • "Ask about this whisky" → AI advisor inline                 │
├────────────────────────────────────────────────────────────────┤
│  COMPARE / SIMILAR: "If you like this…"  · "Cheaper alt"        │
│  REVIEWS: verified-purchase, photos, flavour ratings, helpful   │
│  FROM THE MARKETPLACE: other sellers/conditions (P4)            │
│  ADD TO VAULT (own this? track it) (P3)                         │
├────────────────────────────────────────────────────────────────┤
│  STICKY MOBILE BAR: price + [ADD TO BASKET]                     │
└────────────────────────────────────────────────────────────────┘
```
**CRO notes:** price + CTA above fold; **sample CTA** de-risks; members-price nudges sign-up; flavour profile + AI Q&A reduce uncertainty; verified reviews + structured data drive trust + rich snippets; sticky mobile buy-bar; clear stock/urgency.

### 3.3 Category / Listing Page (PLP)
**Job:** powerful, fast filtering across a deep catalogue without overwhelming.

```
┌───────────────┬────────────────────────────────────────────────┐
│  FILTERS       │  H1 + intro (SEO) · Sort:[Relevance▾]  view:▤▦  │
│  (faceted)     │  Active filters: [Islay ✕][£50–100 ✕] Clear all │
│  Region ▸      ├────────────────────────────────────────────────┤
│  Price ▸       │  [card][card][card][card]                       │
│  Age ▸         │  [card][card][card][card]   ← product cards:    │
│  Flavour ▸     │  image · name · ★ · price · badges(New/Ltd/Award)│
│  Brand ▸       │  quick: ♡  ⇄compare  +basket                    │
│  Cask ▸        │  [card][card][card][card]                       │
│  ABV ▸         │  … infinite scroll / paginate (SEO-safe)        │
│  Availability  │                                                 │
│  Offers/Members│  AI: "Not sure? Describe what you like →"       │
└───────────────┴────────────────────────────────────────────────┘
```
**CRO notes:** instant (Algolia/Typesense) faceting; mobile filters in a bottom sheet; compare + wishlist from the card; AI fallback for the undecided; SEO copy + internal links; "X results" + clear active filters.

### 3.4 Search experience
- **Prominent, always-visible** search with instant results (products + content + brands + distilleries), recent/popular queries, and **typo tolerance**.
- **Semantic/NL search**: "smoky island whisky like an old Ardbeg under £100" returns sensible results via vector + LLM re-ranking.
- **Zero-result rescue:** AI advisor takes over ("Tell me what you're after"), suggests alternatives.
- **Visual search (P3):** scan/upload a bottle → identify → buy / add to vault.
- **Scoped tabs:** Products · Guides · Brands · Community.

### 3.5 Mobile UX
- **PWA**, installable, offline-tolerant browsing, push (drops, price-drops, allocations).
- **Thumb-zone** primary actions; sticky buy-bar; bottom-sheet filters; one-tap wallets (Apple/Google Pay) for near-frictionless checkout.
- **Scan** (camera) for vault/identify; large tap targets; lazy-loaded media; aggressive perf budget.
- Native apps (P2/P3) for collectors: vault, scan, allocations, auctions, push.

### 3.6 Checkout flow
**Job:** maximise completion while meeting alcohol-compliance obligations (age + jurisdiction).

```
BASKET → [Express: Apple/Google Pay/PayPal]  OR  guest/login
   │
   ▼
1) DELIVERY  (address + jurisdiction check → can we ship this here?)
   │  ⓘ if restricted: explain + suggest alternatives, don't dead-end
   ▼
2) AGE VERIFICATION  (lightweight if already verified; step-up if not)
   ▼
3) SHIPPING METHOD  (incl. age-verified-at-delivery notice, dates, duties for intl)
   ▼
4) PAYMENT  (Stripe; cards/wallets/BNPL/local methods; tokenised)
   ▼
5) REVIEW  (taxes/duties shown, gift options, responsible-drinking note)
   ▼
   ORDER CONFIRMED  → tracking + account + cross-sell samples/accessories
```
**CRO notes:** **single-page/accordion** checkout, express wallets first, guest checkout, address autocomplete, progress clarity, no surprise costs (show duty/tax early), trust + security badges, **don't dead-end restricted destinations** — convert to an allowed alternative or waitlist. Persisted basket; abandoned-cart recovery.

### 3.7 Customer Dashboard ("My WhiskyMart")
```
┌──────────────────────────────────────────────────────────────┐
│  Hi, Ewan · 1,240 points (Gold) · WhiskyMart Plus ✓           │
├───────────────┬──────────────────────────────────────────────┤
│ NAV:          │  OVERVIEW: orders in transit · points · recs  │
│ • Overview    │  "Recommended for your palate" rail           │
│ • Orders/track│  RE-ORDER favourites · allocations you can buy │
│ • WhiskyVault │  ─────────────────────────────────────────────│
│ • Wishlist    │  VAULT: collection value, bottles, sealed/open │
│ • Reviews     │  REWARDS: points history, perks, referrals     │
│ • Subscriptions│ MEMBERSHIP: tier, benefits, ballots entered   │
│ • Addresses   │  PALATE: your flavour fingerprint (editable)   │
│ • Payments    │  MARKETPLACE: your listings/sales (P4)         │
│ • Preferences │  INVESTMENTS: casks/portfolio (P4)             │
│ • Privacy/Data│  SUPPORT: AI agent + contact                   │
└───────────────┴──────────────────────────────────────────────┘
```
Self-serve everything; the dashboard is where retail, community, vault, marketplace, and investment converge into one identity.

---

## 4. Conversion-optimisation (CRO) tactics — catalogue

| Lever | Tactic |
|-------|--------|
| **Reduce risk** | 3cl samples, verified reviews, generous info, AI advisor, clear returns/auth |
| **Reduce friction** | Express wallets, guest checkout, address/age autofill, persisted cart |
| **Build urgency** | Stock levels, drop countdowns, "X sold today," allocation limits |
| **Social proof** | Ratings, review counts, "best seller/top rated/award" badges, UGC photos |
| **Personalise** | Recommended rails, recently viewed, palate-based merchandising, lifecycle email |
| **Increase AOV** | Bundles, "complete the flight," accessory attach, free-delivery threshold, gift add-ons |
| **Capture & recover** | Newsletter/sample offer on entry, exit-intent, abandoned-cart, back-in-stock/price-drop alerts |
| **Member conversion** | Members-pay-less price shown on PDP/checkout (proven by The W Club) |
| **A/B everything** | PostHog/feature-flag experimentation as a standing practice |

## 5. Personalisation surfaces
Homepage rails, PLP ranking, PDP "similar/cheaper," search ranking, email/push, gift finder, and the advisor — all powered by the **palate fingerprint** + behaviour, with a visible, user-editable preference centre (transparency builds trust and improves data).

## 6. Modern design trends to adopt (judiciously)
- **Editorial commerce** (magazine-like storytelling fused with shopping).
- **Conversational/agentic UI** (the Sommelier as a first-class, persistent helper).
- **Tasteful motion & micro-interactions** (feedback, delight — never blocking).
- **Dark mode + theming**; **bento-grid** content layouts; large, confident typography.
- **3D/AR** product views and **scan-to-shop**; shoppable video/livestream tastings.
- **Glass/elevation** sparingly for premium feel; avoid trend-chasing that harms clarity or a11y.

## 7. Accessibility standards (WCAG 2.2 AA — mandatory)
- Full **keyboard** operability; visible focus; logical tab/reading order.
- **Contrast** ≥ 4.5:1 (text) / 3:1 (UI/large); never colour-only meaning (esp. stock/flavour).
- Semantic HTML + **ARIA** only where needed; proper headings/landmarks; labelled forms with clear errors.
- **Alt text** for all product/editorial imagery; captions/transcripts for video/podcast.
- Respect `prefers-reduced-motion`; no motion-triggered seizures; pause/stop for carousels.
- Touch targets ≥ 44px; responsive zoom to 200% without loss; screen-reader tested (NVDA/VoiceOver).
- **Automated (axe/Lighthouse) + manual** audits in CI; accessibility is a release gate, not an afterthought.

---

*Continue to → [05 Database Schema](05-database-schema.md)*
