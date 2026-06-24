/**
 * @whiskymart/types — shared domain types for the WhiskyMart platform.
 *
 * Aligned to docs/05-database-schema.md. These are the canonical shapes the
 * storefront, services, search, and AI layer all agree on. Zod schemas are
 * exported alongside the inferred TypeScript types so the same definition can
 * validate API boundaries at runtime.
 */
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Enums                                                                      */
/* -------------------------------------------------------------------------- */

export const ProductType = z.enum([
  "bottle",
  "sample",
  "gift_pack",
  "bundle",
  "accessory",
  "cask",
  "experience",
  "digital",
]);
export type ProductType = z.infer<typeof ProductType>;

export const ProductStatus = z.enum(["draft", "active", "archived", "out_of_stock"]);
export type ProductStatus = z.infer<typeof ProductStatus>;

export const BottlerType = z.enum(["OB", "IB", "NA"]); // Official / Independent / N/A
export type BottlerType = z.infer<typeof BottlerType>;

/** Scotch-centric but extensible whisky regions. */
export const WhiskyRegion = z.enum([
  "speyside",
  "islay",
  "highland",
  "lowland",
  "campbeltown",
  "islands",
  "kentucky",
  "tennessee",
  "ireland",
  "japan",
  "world",
]);
export type WhiskyRegion = z.infer<typeof WhiskyRegion>;

/** Canonical flavour axes used for the flavour wheel + palate model. */
export const FLAVOUR_AXES = [
  "smoky",
  "peaty",
  "sweet",
  "fruity",
  "spicy",
  "floral",
  "maritime",
  "rich",
] as const;
export type FlavourAxis = (typeof FLAVOUR_AXES)[number];

/* -------------------------------------------------------------------------- */
/*  Value objects                                                              */
/* -------------------------------------------------------------------------- */

/** Money is stored as integer minor units + ISO-4217 currency. */
export const Money = z.object({
  amount: z.number().int(), // minor units, e.g. 7495 = £74.95
  currency: z.string().length(3).default("GBP"),
});
export type Money = z.infer<typeof Money>;

/** A 0–100 score per flavour axis. */
export const FlavourProfile = z.object({
  smoky: z.number().min(0).max(100),
  peaty: z.number().min(0).max(100),
  sweet: z.number().min(0).max(100),
  fruity: z.number().min(0).max(100),
  spicy: z.number().min(0).max(100),
  floral: z.number().min(0).max(100),
  maritime: z.number().min(0).max(100),
  rich: z.number().min(0).max(100),
});
export type FlavourProfile = z.infer<typeof FlavourProfile>;

export const TastingNote = z.object({
  nose: z.string(),
  palate: z.string(),
  finish: z.string(),
});
export type TastingNote = z.infer<typeof TastingNote>;

/* -------------------------------------------------------------------------- */
/*  Catalogue entities                                                         */
/* -------------------------------------------------------------------------- */

export const Brand = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});
export type Brand = z.infer<typeof Brand>;

export const Distillery = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  region: WhiskyRegion,
  foundedYear: z.number().int().optional(),
});
export type Distillery = z.infer<typeof Distillery>;

/** Whisky-specific structured attributes (1:1 with a bottle/sample/cask). */
export const WhiskyDetails = z.object({
  abv: z.number(), // % alcohol by volume
  ageYears: z.number().int().nullable(), // null = NAS (No Age Statement)
  region: WhiskyRegion,
  caskType: z.array(z.string()).default([]),
  peatPpm: z.number().int().optional(),
  chillFiltered: z.boolean().optional(),
  naturalColour: z.boolean().optional(),
  limitedEdition: z.boolean().default(false),
  outturn: z.number().int().optional(),
});
export type WhiskyDetails = z.infer<typeof WhiskyDetails>;

export const Variant = z.object({
  id: z.string(),
  sku: z.string(),
  sizeMl: z.number().int(),
  price: Money,
  memberPrice: Money.optional(),
  inStock: z.boolean().default(true),
});
export type Variant = z.infer<typeof Variant>;

export const ProductImage = z.object({
  /** Deterministic gradient seed used by the placeholder renderer. */
  seed: z.string(),
  alt: z.string(),
});
export type ProductImage = z.infer<typeof ProductImage>;

export const Product = z.object({
  id: z.string(),
  type: ProductType,
  title: z.string(),
  slug: z.string(),
  brand: Brand,
  distillery: Distillery.optional(),
  bottlerType: BottlerType.default("OB"),
  status: ProductStatus.default("active"),
  description: z.string(),
  story: z.string().optional(),
  whisky: WhiskyDetails.optional(),
  variants: z.array(Variant).min(1),
  image: ProductImage,
  flavour: FlavourProfile.optional(),
  tastingNote: TastingNote.optional(),
  flavourTags: z.array(z.string()).default([]),
  ratingAvg: z.number().min(0).max(5).default(0),
  ratingCount: z.number().int().default(0),
  badges: z.array(z.enum(["new", "limited", "award", "bestseller", "exclusive"])).default([]),
});
export type Product = z.infer<typeof Product>;

/* -------------------------------------------------------------------------- */
/*  Search / faceting                                                          */
/* -------------------------------------------------------------------------- */

export interface ProductFilter {
  type?: ProductType[];
  region?: WhiskyRegion[];
  flavour?: FlavourAxis[];
  tags?: string[]; // match any of these flavour tags
  minPrice?: number; // minor units
  maxPrice?: number; // minor units
  minAge?: number;
  maxAge?: number;
  brand?: string[];
  badges?: string[];
  inStockOnly?: boolean;
  query?: string;
}

export type ProductSort = "relevance" | "price_asc" | "price_desc" | "rating" | "age" | "newest";

export interface FacetCount {
  value: string;
  label: string;
  count: number;
}

export interface ProductSearchResult {
  items: Product[];
  total: number;
  facets: {
    region: FacetCount[];
    flavour: FacetCount[];
    brand: FacetCount[];
  };
}

/* -------------------------------------------------------------------------- */
/*  Cart                                                                       */
/* -------------------------------------------------------------------------- */

export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartLineDetailed extends CartLine {
  product: Product;
  variant: Variant;
  lineTotal: Money;
}
