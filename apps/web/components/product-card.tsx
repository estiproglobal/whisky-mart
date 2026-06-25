import Link from "next/link";
import type { Product } from "@whiskymart/types";
import { formatAge } from "@/lib/utils";
import { getPrimaryVariant } from "@/lib/catalog/repository";
import { ProductImage } from "./product-image";
import { StarRating } from "./star-rating";
import { Badge } from "./badge";
import { WishlistButton } from "./wishlist/wishlist-button";
import { Price } from "./market/price";

export function ProductCard({ product }: { product: Product }) {
  const variant = getPrimaryVariant(product);
  const region = product.whisky?.region;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-ivory transition-colors duration-300 hover:border-charcoal/30"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
        <ProductImage
          image={product.image}
          className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
        />
        {product.badges.length > 0 ? (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.badges.slice(0, 2).map((b) => (
              <Badge key={b} kind={b} />
            ))}
          </div>
        ) : null}
        <WishlistButton productId={product.id} className="absolute right-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-smoke">
          <span>{product.brand.name}</span>
          {region ? <span className="text-charcoal/25">·</span> : null}
          {region ? <span className="capitalize">{region}</span> : null}
        </div>

        <h3 className="font-display text-[1.35rem] leading-tight text-charcoal transition-colors group-hover:text-whisky-800">
          {product.title}
        </h3>

        <div className="mt-auto flex items-end justify-between border-t border-line pt-3.5">
          <div>
            <Price className="font-display text-xl text-charcoal" money={variant.price} />
            {product.whisky ? (
              <div className="mt-0.5 text-[11px] uppercase tracking-wide text-charcoal/45">
                {formatAge(product.whisky.ageYears)}
              </div>
            ) : null}
          </div>
          {product.ratingCount > 0 ? <StarRating value={product.ratingAvg} /> : null}
        </div>
      </div>
    </Link>
  );
}
