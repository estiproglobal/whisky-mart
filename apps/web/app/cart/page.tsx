"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { resolveCartLines } from "@/lib/catalog/repository";
import { ProductImage } from "@/components/product-image";
import { buttonClasses } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

export default function CartPage() {
  const { lines, setQty, remove } = useCart();
  const detailed = resolveCartLines(lines);
  const subtotal = detailed.reduce((sum, l) => sum + l.lineTotal.amount, 0);
  const currency = detailed[0]?.lineTotal.currency ?? "GBP";

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl text-charcoal">Your basket</h1>

      {detailed.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-card">
          <p className="text-charcoal/70">Your basket is empty.</p>
          <Link href="/shop" className={buttonClasses("primary", "md", "mt-5")}>
            Browse whisky
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {detailed.map((line) => (
              <li
                key={line.variantId}
                className="flex gap-4 rounded-2xl bg-white p-4 shadow-card"
              >
                <ProductImage image={line.product.image} className="h-24 w-20 shrink-0 rounded-xl" />
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/products/${line.product.slug}`}
                    className="font-display text-lg text-charcoal hover:text-whisky-700"
                  >
                    {line.product.title}
                  </Link>
                  <span className="text-sm text-charcoal/50">
                    {line.variant.sizeMl ? `${line.variant.sizeMl}cl` : "Accessory"}
                  </span>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center rounded-lg border border-whisky-200">
                      <button
                        onClick={() => setQty(line.variantId, line.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-charcoal/70 hover:text-whisky-700"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm">{line.quantity}</span>
                      <button
                        onClick={() => setQty(line.variantId, line.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-charcoal/70 hover:text-whisky-700"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-medium text-charcoal">{formatMoney(line.lineTotal)}</span>
                  </div>
                </div>
                <button
                  onClick={() => remove(line.variantId)}
                  className="self-start text-charcoal/40 hover:text-whisky-700"
                  aria-label={`Remove ${line.product.title}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-card">
            <h2 className="font-display text-xl text-charcoal">Summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-charcoal/60">Subtotal</span>
              <span className="font-medium">{formatMoney({ amount: subtotal, currency })}</span>
            </div>
            <p className="mt-1 text-xs text-charcoal/50">
              Delivery, taxes and any duty calculated at checkout.
            </p>
            <Link href="/checkout" className={buttonClasses("primary", "lg", "mt-5 w-full")}>
              Secure checkout
            </Link>
            <p className="mt-2 text-center text-xs text-charcoal/40">
              Age-verified at checkout · please drink responsibly.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
