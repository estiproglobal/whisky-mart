# 09 — Compliance & Regulatory Dossier

> Alcohol e-commerce is shaped less by what you *can build* than by what you're *allowed to sell, to whom, and where*. This dossier turns compliance from a blocker into a **competitive moat** — the "jurisdiction engine" that lets WhiskyMart.com expand into markets competitors avoid.

> **This is not legal advice.** It is an engineering + operations brief. Engage specialist alcohol/e-commerce counsel per market before launch. Laws change; the **jurisdiction engine** is designed to encode rules that legal keeps current.

---

## 1. Why compliance is core architecture (not an add-on)

A single customer action — "ship this bottle to this address" — must be evaluated against: **product type**, **origin**, **destination jurisdiction**, **buyer age/identity**, **applicable taxes/duties**, **licensing**, and **permitted carrier**. Getting this wrong risks fines, seizure, criminal liability, and loss of payment processing. So we build a **server-side jurisdiction engine** ([Doc 05 `jurisdiction_rules`](05-database-schema.md)) that every checkout must pass.

```
checkout: cart + ship-to address
  → JurisdictionEngine.evaluate(productTypes, originRegion, destination, buyer)
      ├─ allowed?            (can we ship this category here at all?)
      ├─ licence required?   (do we/seller hold the right licence?)
      ├─ age requirement     (min age + verification method for jurisdiction)
      ├─ tax & duty          (VAT/sales tax/excise/customs)
      ├─ carrier constraints (which carriers/services may carry alcohol here)
      └─ quantity limits     (per-shipment/per-period caps)
  → DECISION: allow | allow-with-conditions | block(+reason+alternative)
```
**Principle:** never trust the client; enforce server-side; log every decision (`audit_logs`) for regulators.

---

## 2. Age verification (every market, no exceptions)

- **At account/checkout:** verify the buyer is of legal purchase age (18 UK/EU; **21 US**; varies elsewhere). Use a dedicated vendor — **Persona / Veriff / Yoti / Token of Trust** — supporting document scan, database checks, and age-estimation, with re-verification expiry.
- **At delivery:** in many jurisdictions (notably the US), the **carrier must check ID and obtain an adult signature (21+) on delivery** — an "adult signature required" service. USPS **cannot** carry alcohol; **FedEx/UPS** can, but only under a licensed-shipper agreement.
- **Store** verification status + audit trail (`age_verifications`); gate the AI advisor and all purchase flows; never assist or sell to minors.

---

## 3. United Kingdom (Launch — Wave 1)

- **Licensing:** premises/personal licence regime under the Licensing Act 2003 for selling alcohol (incl. online dispatch from a licensed premises).
- **Age:** 18+; "Challenge 25" good practice; verify online + delivery confirmation.
- **Tax:** VAT (20%) + UK excise duty (paid upstream/duty-paid stock for retail).
- **Carriers:** standard couriers with age-verified delivery options.
- **Why first:** simplest single-jurisdiction launch, mature logistics, English/GBP. Establish operations + brand here.

## 4. European Union (Wave 2)

- **Cross-border within EU** is easier than US but still requires care: **VAT** handling (OSS/IOSS schemes), **excise duty** (destination-country duty; EMCS/duty-paid considerations for B2C cross-border), country-specific age (mostly 18, some 16 for certain drinks — but spirits typically 18), labelling/language, and **deposit-return**/packaging rules in some states.
- **Practical model:** local fulfilment / bonded stock per region or duty-paid country stock rather than naive cross-border shipping of every order. Local payment methods (iDEAL, Bancontact, SOFORT/SEPA, Klarna).
- **Markets to prioritise:** DE, FR, NL, ES, IT + Ireland.

## 5. United States (Wave 3 — hardest, highest-value)

The US is the largest market **and** the most complex, due to the post-Prohibition **three-tier system** and **state-by-state** control:

- **Federal:** TTB permits; **Webb-Kenyon Act**; **USPS prohibition** on alcohol (federal crime to ship via USPS).
- **State patchwork:** wine ships to ~47 states; **spirits DTC is prohibited or severely restricted in most states** (e.g. AL, AR, MS, UT, parts of OK ban or heavily restrict). Whether a sale is legal depends on **origin state + destination state + product category**.
- **Age:** 21+; **carrier ID check + adult signature on delivery** mandatory, no exceptions.
- **Tax:** state + local sales tax (economic nexus) + excise; **per-state licensing** to ship.
- **Carriers:** FedEx/UPS only, under licensed agreements; USPS never.
- **Recommended model:** **do not attempt naive nationwide DTC spirits shipping.** Use a **licensed-retailer/marketplace/3PL partner model** (e.g. partner with licensed in-state retailers/fulfilment, or operate via a compliant marketplace structure), gated by the jurisdiction engine state-by-state. Treat the US as a phased, partner-enabled rollout, not a flip-the-switch market.
- **Market size:** US alcohol e-commerce ≈ **$74bn (2025)**, projected **~$87bn (2026)** — worth the complexity, done right.

## 6. Asia-Pacific & rest-of-world (Waves 4–5)

- **Singapore, Japan, Australia, Hong Kong:** high-value collector/investor demand; import duty, GST/consumption tax, local entity/licence requirements, gifting culture. Often best via local entity + bonded/3PL.
- **Middle East:** highly restricted; approach only via **licensed channels / travel-retail / gifting** where lawful, with cultural and legal sensitivity. Geo-fence aggressively.
- **Canada:** provincial liquor-board monopolies complicate DTC; partner/licensed model.

## 7. Payments & financial compliance

- **High-risk MCC:** alcohol is a regulated category; confirm acquirer/underwriting acceptance early (**Stripe/Adyen**), maintain a **backup processor**, and follow card-scheme rules for age-restricted goods.
- **PCI-DSS:** minimise scope via tokenisation (Stripe; SAQ-A). Never store PAN.
- **Marketplace (P4):** KYC/AML on sellers (Stripe Connect), sanctions screening, payout compliance, escrow for high-value items.
- **Investment/cask products (P4):** may trigger **financial-promotion / investment-marketing rules** in some jurisdictions (e.g. UK FCA expectations around how returns are advertised), plus custody, bonded-warehouse, and insurance obligations. **Specialist counsel required**; avoid promising/implying guaranteed returns.

## 8. Data protection & privacy

- **GDPR (UK/EU):** lawful basis, consent for marketing, **data export + erasure**, DPIA for profiling (the palate model = profiling — document it), data residency, processor agreements, breach notification.
- **CCPA/CPRA (US):** opt-out of sale/share, access/delete rights.
- **AI-specific:** transparency about AI use, no sensitive-data inference beyond stated purpose, human review for consequential actions, guardrails (age, responsible-drinking).
- **Audit:** `audit_logs` + `consents` + `data_requests` tables ([Doc 05](05-database-schema.md)).

## 9. Responsible marketing & advertising

- Follow alcohol advertising codes (e.g. **UK ASA/CAP**, EU national rules, US TTB labelling/advertising under 27 CFR Part 5): no targeting minors, no encouraging excess, no health/therapeutic claims, responsible-drinking messaging, age-gating of all marketing surfaces and the AI advisor.
- Influencer/creator program must carry the same responsible-marketing constraints + clear affiliate disclosure.

## 10. Authenticity, anti-counterfeit & provenance (trust moat)

- Collectible whisky has a **counterfeit problem**; trust is the moat. Build:
  - **NFC/QR bottle authentication** and a **provenance chain** (`authenticity_records`).
  - **Verified sellers** + **escrow** + condition disclosure on the marketplace/auctions.
  - Expert authentication / certificate-of-authenticity workflow for high-value lots.
  - Optional tamper-evidence and (where it adds real value) blockchain-backed provenance.

## 11. Operational compliance checklist (per market, before launch)

- [ ] Specialist legal review (sale, shipping, advertising, data) for the market.
- [ ] Required licences obtained (retailer/shipper/per-state where applicable).
- [ ] Jurisdiction-engine rules encoded + tested (allowed categories, age, tax/duty, carriers, limits).
- [ ] Age-verification vendor live (online) + age-verified-delivery service contracted (carrier).
- [ ] Payment processor underwriting confirmed for the market/MCC.
- [ ] Tax registration + calculation (Stripe Tax/Avalara) configured (VAT/OSS/IOSS/sales tax/excise).
- [ ] Fulfilment/3PL/bonded warehousing in place; carrier alcohol agreements signed.
- [ ] Returns/RMA policy compliant with local alcohol-return law.
- [ ] Privacy notices, consent, data-residency, DPIA (for profiling) complete.
- [ ] Responsible-drinking + advertising-code compliance reviewed (incl. AI + creators).
- [ ] Audit logging + reporting in place for regulators.

## 12. How compliance becomes an advantage

Most competitors avoid hard jurisdictions or ship naively and absorb risk. By treating compliance as **encoded, testable architecture**, WhiskyMart.com can:
- **Expand into more markets, faster and safer** than rivals.
- **Convert "restricted" dead-ends into alternatives/waitlists** (don't lose the customer).
- **Win trust** with authenticity/provenance — the single biggest unmet need in collectible whisky.
- **De-risk the business** for a future acquirer (clean, auditable, compliant operations command a premium).

---

## Sources
- DTC alcohol shipping & age verification — [Sovos](https://sovos.com/blog/ship/direct-to-consumer-dtc-shipping-essentials-age-verification/); [Avalara](https://www.avalara.com/us/en/learn/whitepapers/getting-it-right-the-4-steps-to-age-verification-for-direct-shippers.html); [Token of Trust](https://tokenoftrust.com/blog/sell-alcohol-online-legally/); [Persona](https://withpersona.com/blog/age-verification-online-alcohol-retailers).
- Regulations overview — [BottlePOS](https://bottlepos.com/blog/alcohol-e-commerce-regulations); [Bottlecapps checklist](https://www.bottlecapps.com/blogs/ecommerce-alcohol-compliance-checklist-age-verification-to-shipping-laws/); [Corporate Compliance Insights](https://www.corporatecomplianceinsights.com/raising-bar-alcohol-compliance-ecommerce/); [eCFR 27 CFR Part 5](https://www.ecfr.gov/current/title-27/chapter-I/subchapter-A/part-5).
- Multi-store compliance commerce — [Spree Commerce](https://spreecommerce.org/alcohol-spirits-ecommerce/).

---

*Return to → [README index](../README.md) · [00 Executive Summary](00-executive-summary.md)*
