import { describe, expect, it } from "vitest";
import type { FlavourProfile } from "@whiskymart/types";
import { catalog } from "./repository";
import { aggregateFlavour, describeFlavour, rankedAxes } from "./flavour";

const profile = (p: Partial<FlavourProfile>): FlavourProfile => ({
  smoky: 0,
  peaty: 0,
  sweet: 0,
  fruity: 0,
  spicy: 0,
  floral: 0,
  maritime: 0,
  rich: 0,
  ...p,
});

describe("rankedAxes", () => {
  it("orders present axes by descending intensity", () => {
    expect(rankedAxes(profile({ smoky: 80, sweet: 40, rich: 60 }))).toEqual(["smoky", "rich", "sweet"]);
  });

  it("drops axes below the threshold", () => {
    expect(rankedAxes(profile({ smoky: 80, sweet: 10 }), 20)).toEqual(["smoky"]);
  });
});

describe("describeFlavour", () => {
  it("joins the top axes into a phrase", () => {
    expect(describeFlavour(profile({ smoky: 85, peaty: 80, maritime: 70 }), 3)).toBe(
      "smoky, peaty & maritime",
    );
  });

  it("returns a single word for one dominant axis", () => {
    expect(describeFlavour(profile({ floral: 80 }))).toBe("floral");
  });
});

describe("aggregateFlavour", () => {
  it("averages flavour across products that carry it", async () => {
    const all = await catalog.getAll();
    const islay = all.filter((p) => p.whisky?.region === "islay");
    const agg = aggregateFlavour(islay);
    expect(agg).not.toBeNull();
    // Islay set is smoke-led, so smoky should be the dominant aggregate axis.
    expect(rankedAxes(agg!)[0]).toBe("smoky");
  });

  it("returns null when no product has flavour data", () => {
    expect(aggregateFlavour([])).toBeNull();
  });
});
