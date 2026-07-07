"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "./wishlist-provider";

export function WishlistIndicator() {
  const { count } = useWishlist();
  return (
    <Link
      href="/account/wishlist"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded text-cream transition-opacity hover:opacity-75"
      aria-label={`Wishlist, ${count} item${count === 1 ? "" : "s"}`}
    >
      <Heart className="h-5 w-5" aria-hidden="true" strokeWidth={1.5} />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-copper px-1 font-sans text-xs font-semibold text-ink">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
