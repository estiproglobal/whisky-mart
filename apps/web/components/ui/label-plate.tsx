import * as React from "react";
import type { Product } from "@whiskymart/types";
import { cn } from "@/lib/utils";

/**
 * The signature element of "The Archive": a bordered parchment plate typeset
 * like a distillery label. Brand name in Libre Caslon, then
 * REGION · CASK · ABV · AGE in caps Archivo with thin rule separators.
 * This is the only place on the site where all-caps labelling appears,
 * because here it mimics an actual bottle label.
 *
 * Variants: `card` (compact, on product cards), `pdp` (full, on the product
 * page), `featured` (large, homepage act two).
 */
type PlateVariant = "card" | "pdp" | "featured";

function plateData(product: Product): string[] {
  const w = product.whisky;
  if (product.type === "sample") {
    const drams = product.variants.length > 0 ? product.variants[0] : undefined;
    return ["Tasting flight", drams && drams.sizeMl ? `${drams.sizeMl / 10}cl drams` : ""].filter(Boolean);
  }
  if (!w) return ["Accessory"];
  const cask = w.caskType.length > 0 ? w.caskType[0] : "";
  const age = w.ageYears ? `${w.ageYears} years` : "No age statement";
  return [w.region, cask, `${w.abv}% ABV`, age].filter(Boolean) as string[];
}

/** The expression line: the product title with the leading brand stripped. */
function expressionOf(product: Product): string {
  const stripped = product.title.replace(new RegExp(`^(The\\s+)?${product.brand.name}\\s*`, "i"), "").trim();
  return stripped === product.title ? "" : stripped;
}

const NAME_SIZE: Record<PlateVariant, string> = {
  card: "text-[1.05rem] leading-snug",
  pdp: "text-d3",
  featured: "text-[1.6rem] leading-tight",
};

const FRAME_PAD: Record<PlateVariant, string> = {
  card: "px-3 py-2.5",
  pdp: "px-5 py-4",
  featured: "px-6 py-5",
};

export function LabelPlate({
  product,
  variant = "card",
  className,
}: {
  product: Product;
  variant?: PlateVariant;
  className?: string;
}) {
  const data = plateData(product);
  const expression = expressionOf(product);

  return (
    <div className={cn("rounded border border-line-light bg-parchment p-1 text-ink", className)}>
      <div className={cn("rounded-sm border border-line-light text-center", FRAME_PAD[variant])}>
        <p className={cn("font-display", NAME_SIZE[variant])}>{product.brand.name}</p>
        {expression ? (
          <p className="mt-1 font-sans text-label-sm text-ink/75">{expression}</p>
        ) : null}
        <span aria-hidden="true" className="mx-auto mt-2.5 block h-px w-8 bg-ink/25" />
        <p
          className={cn(
            "mt-2.5 flex flex-wrap items-center justify-center font-sans uppercase text-ink/80",
            variant === "card" ? "gap-x-2 gap-y-1 text-[10px] tracking-[0.08em]" : "gap-x-2.5 gap-y-1 text-label-sm tracking-[0.1em]",
          )}
        >
          {data.map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 ? <span aria-hidden="true" className="h-3 w-px bg-ink/20" /> : null}
              <span className="whitespace-nowrap">{item}</span>
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}
