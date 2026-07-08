import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Money } from "@whiskymart/types";

/** Merge Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format integer minor units as a localized currency string. */
export function formatMoney(money: Money, locale = "en-GB"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
  }).format(money.amount / 100);
}

/** Human age label: a number, or "NAS" for no-age-statement whiskies. */
export function formatAge(ageYears: number | null | undefined): string {
  if (ageYears === null || ageYears === undefined) return "NAS";
  return `${ageYears} Year${ageYears === 1 ? "" : "s"}`;
}

/**
 * Human bottle-size label from millilitres. The trade convention is
 * centilitres for whole values (700 ml → "70cl", 30 ml → "3cl"), falling back
 * to millilitres for odd sizes. Returns "" for non-liquid items (sizeMl 0),
 * so callers can decide their own placeholder.
 */
export function formatVolume(sizeMl: number | null | undefined): string {
  if (!sizeMl || sizeMl <= 0) return "";
  const cl = sizeMl / 10;
  return Number.isInteger(cl) ? `${cl}cl` : `${sizeMl}ml`;
}

/** Region slug → display name ("islay" → "Islay", "kentucky" → "Kentucky"). */
export function formatRegion(region: string | null | undefined): string {
  if (!region) return "";
  return region.charAt(0).toUpperCase() + region.slice(1);
}

/**
 * Cask slug → reader form ("ex-bourbon" → "Ex-bourbon cask", "ex-sherry" →
 * "Ex-sherry cask", "mizunara" → "Mizunara oak"). Display-layer only; the seed
 * data keeps its slugs. Unknown `ex-` slugs gain a trailing "cask".
 */
const CASK_LABELS: Record<string, string> = {
  "ex-bourbon": "Ex-bourbon cask",
  "ex-sherry": "Ex-sherry cask",
  "european-oak": "European oak",
  "new-american-oak": "New American oak",
  port: "Port cask",
  mizunara: "Mizunara oak",
};
export function formatCask(cask: string | null | undefined): string {
  if (!cask) return "";
  if (CASK_LABELS[cask]) return CASK_LABELS[cask];
  const titled = cask.charAt(0).toUpperCase() + cask.slice(1);
  return cask.startsWith("ex-") ? `${titled} cask` : titled;
}
