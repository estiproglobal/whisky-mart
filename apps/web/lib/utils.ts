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
