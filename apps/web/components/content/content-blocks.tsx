import type { ContentBlock, Product } from "@whiskymart/types";
import { ProductCard } from "@/components/product-card";

/**
 * Renders structured article blocks, including shoppable product embeds.
 * `productsById` is resolved by the page (server) and passed in.
 */
export function ContentBlocks({
  blocks,
  productsById,
}: {
  blocks: ContentBlock[];
  productsById: Record<string, Product>;
}) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "heading":
            return (
              <h2 key={i} className="font-display text-[1.7rem] leading-tight tracking-tightest text-charcoal">
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="text-[1.0625rem] leading-[1.75] text-charcoal/80">
                {block.text}
              </p>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-gold pl-6 font-display text-[1.6rem] leading-snug text-charcoal/85">
                “{block.text}”
                {block.cite ? <footer className="mt-2 text-sm not-italic text-smoke">— {block.cite}</footer> : null}
              </blockquote>
            );
          case "products": {
            const items = block.productIds.map((id) => productsById[id]).filter((p): p is Product => Boolean(p));
            if (items.length === 0) return null;
            return (
              <div key={i} className="rounded-lg border border-line bg-ivory p-6">
                {block.note ? <p className="mb-4 text-sm text-charcoal/60">{block.note}</p> : null}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
