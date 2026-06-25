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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-whisky-100/70 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] bg-parchment">
        <ProductImage image={product.image} className="h-full w-full" />
        {product.badges.length > 0 ? (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.badges.slice(0, 2).map((b) => (
              <Badge key={b} kind={b} />
            ))}
          </div>
        ) : null}
        <WishlistButton productId={product.id} className="absolute right-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-whisky-700">
          <span>{product.brand.name}</span>
          {region ? <span className="text-charcoal/30">·</span> : null}
          {region ? <span className="capitalize text-charcoal/45">{region}</span> : null}
        </div>

        <h3 className="font-display text-lg leading-snug text-charcoal transition-colors group-hover:text-whisky-700">
          {product.title}
        </h3>

        <div className="mt-auto flex items-end justify-between border-t border-whisky-100 pt-3">
          <div>
            <Price className="font-display text-lg text-charcoal" money={variant.price} />
            {product.whisky ? (
              <div className="text-xs text-charcoal/50">{formatAge(product.whisky.ageYears)}</div>
            ) : null}
          </div>
          {product.ratingCount > 0 ? <StarRating value={product.ratingAvg} /> : null}
        </div>
      </div>
    </Link>
  );
}
