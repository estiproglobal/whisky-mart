import { Sparkles } from "lucide-react";
import type { Product } from "@whiskymart/types";
import { ProductCard } from "@/components/product-card";

export interface RecItem {
  product: Product;
  reason: string;
}

export function RecommendationGrid({ items }: { items: RecItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {items.map(({ product, reason }) => (
        <div key={product.id} className="flex flex-col gap-2">
          <ProductCard product={product} />
          <p className="flex gap-1.5 text-sm text-charcoal/70">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-whisky-600" />
            <span>{reason}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
