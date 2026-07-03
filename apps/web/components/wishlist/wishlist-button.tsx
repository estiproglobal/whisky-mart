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
          "inline-flex h-11 items-center justify-center gap-2 rounded border px-5 font-sans text-label transition-opacity",
          saved
            ? "border-copper/60 text-copper"
            : "border-cream/30 text-cream hover:border-cream/70",
          className,
        )}
      >
        <Heart className={cn("h-4 w-4", saved && "fill-copper text-copper")} aria-hidden="true" />
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
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-dark bg-ground/70 backdrop-blur transition-opacity hover:opacity-80",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", saved ? "fill-copper text-copper" : "text-cream/70")} aria-hidden="true" />
    </button>
  );
}
