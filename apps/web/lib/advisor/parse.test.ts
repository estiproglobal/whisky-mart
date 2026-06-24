import { describe, expect, it } from "vitest";
import { parseQuery } from "./parse";

describe("parseQuery", () => {
  it("extracts flavour, region and a max price", () => {
    const intent = parseQuery("a smoky islay whisky under £80");
    expect(intent.flavours).toContain("smoky");
    expect(intent.regions).toContain("islay");
    expect(intent.maxPrice).toBe(8000);
  });

  it("detects a referenced whisky and a flavour", () => {
    const intent = parseQuery("like Lagavulin but a bit sweeter", ["lagavulin"]);
    expect(intent.likeNames).toContain("lagavulin");
    expect(intent.flavours).toContain("sweet");
  });

  it("flags beginner and gift intent", () => {
    const intent = parseQuery("a gift for a beginner");
    expect(intent.beginner).toBe(true);
    expect(intent.gift).toBe(true);
  });

  it("handles an 'around £X' range", () => {
    const intent = parseQuery("something around £50");
    expect(intent.minPrice).toBe(3750);
    expect(intent.maxPrice).toBe(6250);
  });

  it("maps maritime synonyms", () => {
    expect(parseQuery("coastal and briny").flavours).toContain("maritime");
  });
});
