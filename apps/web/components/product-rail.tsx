import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      <div className="mb-5 flex items-end justify-between">
        <h2 className="font-display text-2xl text-charcoal sm:text-3xl">{title}</h2>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-whisky-700 hover:text-whisky-900"
          >
            View all <ArrowRight className="h-4 w-4" />
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
