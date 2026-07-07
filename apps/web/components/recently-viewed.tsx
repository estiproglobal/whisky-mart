"use client";

import * as React from "react";
import type { Product } from "@whiskymart/types";
import { ProductCard } from "./product-card";

const STORAGE_KEY = "wm_recently_viewed";
const MAX = 8;

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Records a product view (most-recent-first, de-duplicated, capped). */
export function RecentlyViewedTracker({ productId }: { productId: string }) {
  React.useEffect(() => {
    try {
      const next = [productId, ...read().filter((id) => id !== productId)].slice(0, MAX);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, [productId]);
  return null;
}

/** Renders recently-viewed products (resolved from the catalogue passed in). */
export function RecentlyViewedRail({
  allProducts,
  excludeId,
  title = "Recently viewed",
}: {
  allProducts: Product[];
  excludeId?: string;
  title?: string;
}) {
  const [ids, setIds] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    setIds(read());
  }, []);

  if (ids === null) return null; // avoid hydration mismatch until mounted

  const byId = new Map(allProducts.map((p) => [p.id, p]));
  const products = ids
    .filter((id) => id !== excludeId)
    .map((id) => byId.get(id))
    .filter((p): p is Product => Boolean(p));

  if (products.length === 0) return null;

  return (
    <section className="container-page py-10">
      <div className="mb-6"><h2 className="font-display text-d2 text-cream">{title}</h2><span aria-hidden="true" className="pour-line" /></div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
