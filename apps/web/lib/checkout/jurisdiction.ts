import type { JurisdictionDecision } from "@whiskymart/types";

/**
 * Server-side jurisdiction / compliance rules (see docs/09).
 *
 * This is a deliberately small, encoded rules table — the seed of the
 * "jurisdiction engine" described in the blueprint. Every checkout is evaluated
 * here on the server; the client is never trusted to decide shippability.
 */
interface CountryRule {
  label: string;
  allowed: boolean;
  ageMin: number;
  taxRatePct: number;
  dutyRatePct: number;
  vatInclusive: boolean; // true => catalogue price already includes tax (UK model)
  carrierNote?: string;
  reason?: string; // when blocked
  alternative?: string; // when blocked
}

const RULES: Record<string, CountryRule> = {
  GB: {
    label: "United Kingdom",
    allowed: true,
    ageMin: 18,
    taxRatePct: 20,
    dutyRatePct: 0,
    vatInclusive: true,
    carrierNote: "Age-verified delivery — an adult signature (18+) is required.",
  },
  IE: { label: "Ireland", allowed: true, ageMin: 18, taxRatePct: 23, dutyRatePct: 0, vatInclusive: false },
  DE: { label: "Germany", allowed: true, ageMin: 18, taxRatePct: 19, dutyRatePct: 0, vatInclusive: false },
  FR: { label: "France", allowed: true, ageMin: 18, taxRatePct: 20, dutyRatePct: 0, vatInclusive: false },
  NL: { label: "Netherlands", allowed: true, ageMin: 18, taxRatePct: 21, dutyRatePct: 0, vatInclusive: false },
  ES: { label: "Spain", allowed: true, ageMin: 18, taxRatePct: 21, dutyRatePct: 0, vatInclusive: false },
  US: {
    label: "United States",
    allowed: false,
    ageMin: 21,
    taxRatePct: 0,
    dutyRatePct: 0,
    vatInclusive: false,
    reason:
      "We can't yet ship spirits to most US states — direct-to-consumer spirits shipping is licensed state-by-state.",
    alternative: "US shipping is coming via licensed partners. Join the waitlist and we'll notify you.",
  },
};

/** Countries offered in the checkout address selector. */
export const SHIPPABLE_COUNTRIES: Array<{ code: string; label: string; allowed: boolean }> = Object.entries(
  RULES,
)
  .map(([code, r]) => ({ code, label: r.label, allowed: r.allowed }))
  .sort((a, b) => a.label.localeCompare(b.label));

/** Evaluate whether we can ship to `country`, with tax/age parameters. */
export function evaluateJurisdiction(country: string): JurisdictionDecision {
  const code = country.toUpperCase();
  const rule = RULES[code];

  if (!rule) {
    return {
      country: code,
      countryLabel: code,
      allowed: false,
      ageMin: 18,
      taxRatePct: 0,
      dutyRatePct: 0,
      vatInclusive: false,
      reason: "We don't currently ship to this destination.",
      alternative: "We're expanding — check back soon or contact us about your location.",
    };
  }

  return {
    country: code,
    countryLabel: rule.label,
    allowed: rule.allowed,
    ageMin: rule.ageMin,
    taxRatePct: rule.taxRatePct,
    dutyRatePct: rule.dutyRatePct,
    vatInclusive: rule.vatInclusive,
    carrierNote: rule.carrierNote,
    reason: rule.reason,
    alternative: rule.alternative,
  };
}
