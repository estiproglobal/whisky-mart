"use client";

import * as React from "react";
import Link from "next/link";
import type { Product } from "@whiskymart/types";
import { useWishlist } from "./wishlist-provider";
import { ProductCard } from "@/components/product-card";
import { buttonClasses } from "@/components/ui/button";

/** Renders the shopper's saved products, resolved from the catalogue. */
export function WishlistList({ allProducts }: { allProducts: Product[] }) {
  const { ids } = useWishlist();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null; // wishlist lives in localStorage; avoid SSR mismatch

  const byId = new Map(allProducts.map((p) => [p.id, p]));
  const products = ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-ivory p-12 text-center">
        <p className="text-charcoal/70">Your wishlist is empty.</p>
        <p className="mt-1 text-sm text-charcoal/50">Tap the heart on any whisky to save it here.</p>
        <Link href="/shop" className={buttonClasses("primary", "md", "mt-5")}>
          Browse whisky
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
