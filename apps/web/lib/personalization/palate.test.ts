import { describe, expect, it } from "vitest";
import { buildProfile, MAX_PALATE_FLAVOURS, PALATE_QUIZ, scoreQuiz } from "./palate";

describe("scoreQuiz", () => {
  it("maps quiz answers to flavour axes", () => {
    // smoke: option 0 -> [smoky, peaty]; flavours: option 0 -> [sweet]
    const flavours = scoreQuiz({ smoke: [0], flavours: [0] });
    expect(flavours).toContain("smoky");
    expect(flavours).toContain("peaty");
    expect(flavours).toContain("sweet");
  });

  it("supports multi-select for the flavours question", () => {
    const flavours = scoreQuiz({ flavours: [0, 2, 3] }); // sweet, rich, spicy
    expect(flavours).toEqual(expect.arrayContaining(["sweet", "rich", "spicy"]));
  });

  it("returns nothing for 'no preference' answers", () => {
    // smoke option 2 -> []; coast option 1 -> []
    expect(scoreQuiz({ smoke: [2], coast: [1] })).toEqual([]);
  });

  it("caps the number of flavours", () => {
    const flavours = scoreQuiz({ smoke: [0], flavours: [0, 1, 2, 3, 4], coast: [0] });
    expect(flavours.length).toBeLessThanOrEqual(MAX_PALATE_FLAVOURS);
  });

  it("ignores out-of-range option indexes", () => {
    expect(scoreQuiz({ smoke: [99] })).toEqual([]);
  });
});

describe("buildProfile", () => {
  it("wraps flavours with a timestamp", () => {
    const p = buildProfile({ coast: [0] }); // maritime
    expect(p.flavours).toContain("maritime");
    expect(typeof p.updatedAt).toBe("string");
  });
});

describe("PALATE_QUIZ", () => {
  it("has questions with options", () => {
    expect(PALATE_QUIZ.length).toBeGreaterThan(0);
    expect(PALATE_QUIZ.every((q) => q.options.length > 0)).toBe(true);
  });
});
