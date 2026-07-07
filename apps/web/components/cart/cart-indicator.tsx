"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartIndicator() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded text-cream transition-opacity hover:opacity-75"
      aria-label={`Basket, ${count} item${count === 1 ? "" : "s"}`}
    >
      <ShoppingBag className="h-5 w-5" aria-hidden="true" strokeWidth={1.5} />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-copper px-1 font-sans text-xs font-semibold text-ink">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
