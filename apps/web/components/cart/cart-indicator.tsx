"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartIndicator() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-whisky-50"
      aria-label={`Basket, ${count} item${count === 1 ? "" : "s"}`}
    >
      <ShoppingBag className="h-5 w-5 text-charcoal" aria-hidden="true" />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-whisky-600 px-1 text-xs font-semibold text-cream">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
