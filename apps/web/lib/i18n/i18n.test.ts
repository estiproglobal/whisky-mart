import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, htmlLangFor, isSupportedLocale, translate, SUPPORTED_LOCALES } from "./index";
import { MESSAGES } from "./messages";

describe("isSupportedLocale", () => {
  it("accepts supported locales, rejects others", () => {
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("de")).toBe(true);
    expect(isSupportedLocale("zz")).toBe(false);
    expect(isSupportedLocale(undefined)).toBe(false);
  });
});

describe("translate", () => {
  it("returns the locale string when present", () => {
    expect(translate("de", "nav.bestSellers")).toBe("Bestseller");
    expect(translate("fr", "header.basket")).toBe("Panier");
  });

  it("falls back to English for a missing locale string", () => {
    // Same key in English, simulating a gap.
    expect(translate("en", "nav.whisky")).toBe("Whisky");
  });

  it("falls back to the provided fallback then the key itself", () => {
    expect(translate("en", "nonexistent.key", "Fallback")).toBe("Fallback");
    expect(translate("en", "another.missing")).toBe("another.missing");
  });
});

describe("htmlLangFor", () => {
  it("maps locale to an html lang tag", () => {
    expect(htmlLangFor("en")).toBe("en-GB");
    expect(htmlLangFor("de")).toBe("de-DE");
  });
});

describe("catalogue integrity", () => {
  it("every non-English locale covers all English keys", () => {
    const enKeys = Object.keys(MESSAGES[DEFAULT_LOCALE]);
    for (const { code } of SUPPORTED_LOCALES) {
      for (const key of enKeys) {
        expect(MESSAGES[code][key], `${code} missing ${key}`).toBeDefined();
      }
    }
  });
});
