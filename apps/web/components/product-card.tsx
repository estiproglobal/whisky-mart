import Link from "next/link";
import type { Product } from "@whiskymart/types";
import { formatAge, formatMoney } from "@/lib/utils";
import { getPrimaryVariant } from "@/lib/catalog/repository";
import { ProductImage } from "./product-image";
import { StarRating } from "./star-rating";
import { Badge } from "./badge";

export function ProductCard({ product }: { product: Product }) {
  const variant = getPrimaryVariant(product);
  const region = product.whisky?.region;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/5]">
        <ProductImage image={product.image} className="h-full w-full" />
        {product.badges.length > 0 ? (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.badges.slice(0, 2).map((b) => (
              <Badge key={b} kind={b} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-whisky-700">
          <span>{product.brand.name}</span>
          {region ? <span className="text-charcoal/40">·</span> : null}
          {region ? <span className="capitalize text-charcoal/50">{region}</span> : null}
        </div>

        <h3 className="font-display text-lg leading-snug text-charcoal group-hover:text-whisky-700">
          {product.title}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="font-semibold text-charcoal">{formatMoney(variant.price)}</div>
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
