import Link from "next/link";
import type { Product } from "@whiskymart/types";
import { formatVolume } from "@/lib/utils";
import { getPrimaryVariant } from "@/lib/catalog/repository";
import { ProductImage, toneFor, formatFor } from "./product-image";
import { LabelPlate } from "./ui/label-plate";
import { WishlistButton } from "./wishlist/wishlist-button";
import { Price } from "./market/price";

/**
 * A product card in "The Archive": the niche render on top, the label plate
 * carrying identity below, a plain Archivo price row. No badges, no star
 * rows, no hover lift; feedback is opacity only.
 */
export function ProductCard({ product }: { product: Product }) {
  const variant = getPrimaryVariant(product);
  const tone = toneFor(product.whisky, product.flavour);
  const volume = formatVolume(variant.sizeMl);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded border border-line-dark bg-surface"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductImage
          image={product.image}
          tone={tone}
          format={formatFor(product)}
          className="h-full w-full transition-opacity duration-300 group-hover:opacity-85"
        />
        <WishlistButton productId={product.id} className="absolute right-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <LabelPlate product={product} variant="card" />
        <div className="mt-auto flex items-baseline justify-between px-1 pb-1 font-sans">
          <Price className="text-body-sm font-medium text-cream" money={variant.price} />
          {volume ? <span className="text-label-sm text-cream-muted">{volume}</span> : null}
        </div>
      </div>
    </Link>
  );
}
