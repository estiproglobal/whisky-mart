import Link from "next/link";
import type { Product } from "@whiskymart/types";
import { ProductCard } from "./product-card";

export function ProductRail({
  title,
  products,
  viewAllHref,
}: {
  title: string;
  products: Product[];
  viewAllHref?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="container-page py-10">
      <div className="mb-6 flex items-end justify-between gap-5">
        <div>
          <h2 className="font-display text-d2 text-cream">{title}</h2>
          <span aria-hidden="true" className="pour-line" />
        </div>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="font-sans text-label text-copper underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
          >
            View all
          </Link>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
