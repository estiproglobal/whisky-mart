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
              <h2 key={i} className="font-display text-[1.7rem] leading-tight text-ink">
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="text-body text-ink/85">
                {block.text}
              </p>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-copper pl-6 font-display text-[1.6rem] leading-snug text-ink/90">
                “{block.text}”
                {block.cite ? <footer className="mt-2 font-sans text-label-sm not-italic text-ink/60">{block.cite}</footer> : null}
              </blockquote>
            );
          case "products": {
            const items = block.productIds.map((id) => productsById[id]).filter((p): p is Product => Boolean(p));
            if (items.length === 0) return null;
            return (
              <div key={i} className="rounded border border-line-light p-6">
                {block.note ? <p className="mb-4 text-body-sm text-ink/70">{block.note}</p> : null}
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
