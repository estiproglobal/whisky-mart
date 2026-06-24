import type { FlavourAxis, WhiskyRegion } from "@whiskymart/types";
import type { AdvisorIntent } from "./types";

const FLAVOUR_KEYWORDS: Array<[RegExp, FlavourAxis]> = [
  [/\bsmok/, "smoky"],
  [/\bpeat/, "peaty"],
  [/\bsweet/, "sweet"],
  [/\bfruit/, "fruity"],
  [/\bfloral|flower/, "floral"],
  [/\bspic/, "spicy"],
  [/\bmaritime|coastal|sea|brin|salt/, "maritime"],
  [/\brich|sherr|christmas|dried fruit/, "rich"],
];

const REGION_KEYWORDS: Array<[RegExp, WhiskyRegion]> = [
  [/\bislay\b/, "islay"],
  [/\bspeyside\b/, "speyside"],
  [/\bhighland/, "highland"],
  [/\blowland/, "lowland"],
  [/\bcampbeltown/, "campbeltown"],
  [/\bisland/, "islands"],
  [/\bjapan/, "japan"],
  [/\birish|ireland/, "ireland"],
  [/\bkentucky|bourbon/, "kentucky"],
  [/\btennessee/, "tennessee"],
];

/** Parse a free-text query into structured intent. `knownNames` are lowercased
 *  brand/distillery names used to detect "like X" references. */
export function parseQuery(query: string, knownNames: string[] = []): AdvisorIntent {
  const q = query.toLowerCase();

  const flavours = FLAVOUR_KEYWORDS.filter(([re]) => re.test(q)).map(([, f]) => f);
  const regions = REGION_KEYWORDS.filter(([re]) => re.test(q)).map(([, r]) => r);

  let maxPrice: number | undefined;
  let minPrice: number | undefined;
  const under = q.match(/(?:under|below|less than|up to|<)\s*£?\s*(\d+)/);
  if (under) maxPrice = Number(under[1]) * 100;
  const over = q.match(/(?:over|above|more than|>)\s*£?\s*(\d+)/);
  if (over) minPrice = Number(over[1]) * 100;
  const around = q.match(/(?:around|about|roughly|~)\s*£?\s*(\d+)/);
  if (around) {
    const n = Number(around[1]) * 100;
    minPrice = Math.round(n * 0.75);
    maxPrice = Math.round(n * 1.25);
  }

  const beginner = /\bbeginner|new to|just start|first whisky|getting into|novice\b/.test(q);
  const gift = /\bgift|present|for (my|a)\b/.test(q);

  const likeNames = knownNames.filter((name) => name.length > 2 && q.includes(name));

  return { flavours, regions, maxPrice, minPrice, beginner, gift, likeNames, rawQuery: query };
}
