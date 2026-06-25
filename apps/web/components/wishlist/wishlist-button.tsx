"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "./wishlist-provider";

/**
 * Wishlist toggle. `variant="icon"` is the compact heart used on product cards;
 * `variant="button"` is the labelled button used on the PDP.
 */
export function WishlistButton({
  productId,
  variant = "icon",
  className,
}: {
  productId: string;
  variant?: "icon" | "button";
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const saved = has(productId);
  const label = saved ? "Remove from wishlist" : "Add to wishlist";

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={() => toggle(productId)}
        aria-pressed={saved}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-md border px-5 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors",
          saved
            ? "border-charcoal/30 bg-parchment text-charcoal"
            : "border-charcoal/25 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream",
          className,
        )}
      >
        <Heart className={cn("h-4 w-4", saved && "fill-whisky-700 text-whisky-700")} />
        {saved ? "Saved" : "Wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault(); // don't follow the card's link
        toggle(productId);
      }}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/10 bg-ivory/85 backdrop-blur transition-colors hover:bg-ivory",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", saved ? "fill-whisky-700 text-whisky-700" : "text-charcoal/55")} />
    </button>
  );
}
