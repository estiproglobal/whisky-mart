"use client";

import * as React from "react";
import Link from "next/link";
import type { Product } from "@whiskymart/types";
import { usePalate } from "./palate-provider";
import { ProductCard } from "@/components/product-card";

/**
 * "Recommended for you". Renders the server-provided fallback (e.g. best
 * sellers) initially (so it's SSG-friendly with no hydration mismatch) then
 * swaps to palate-based picks (via /api/recommendations) once a profile exists.
 */
export function RecommendedRail({ fallback }: { fallback: Product[] }) {
  const { palate } = usePalate();
  const [items, setItems] = React.useState<Product[]>(fallback);
  const [personalised, setPersonalised] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    if (!palate || palate.flavours.length === 0) {
      setItems(fallback);
      setPersonalised(false);
      return;
    }
    fetch("/api/recommendations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ flavours: palate.flavours }),
    })
      .then((r) => r.json())
      .then((d: { recommendations: Array<{ product: Product }> }) => {
        if (cancelled) return;
        const recs = d.recommendations.map((x) => x.product);
        if (recs.length) {
          setItems(recs);
          setPersonalised(true);
        }
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, [palate, fallback]);

  if (items.length === 0) return null;

  return (
    <section className="container-page py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-d2 text-cream">
            {personalised ? "Recommended for your palate" : "Popular right now"}
          </h2>
          <span aria-hidden="true" className="pour-line" />
        </div>
        <Link
          href="/taste"
          className="font-sans text-label text-copper underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
        >
          {personalised ? "Refine your palate" : "Take the taste quiz"}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
