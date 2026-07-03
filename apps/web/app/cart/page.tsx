"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShieldCheck, Lock } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { resolveCartLines } from "@/lib/catalog/repository";
import { formatVolume } from "@/lib/utils";
import { ProductImage, toneFor, formatFor } from "@/components/product-image";
import { buttonClasses } from "@/components/ui/button";
import { Price } from "@/components/market/price";

export default function CartPage() {
  const { lines, setQty, remove } = useCart();
  const detailed = resolveCartLines(lines);
  const subtotal = detailed.reduce((sum, l) => sum + l.lineTotal.amount, 0);
  const currency = detailed[0]?.lineTotal.currency ?? "GBP";
  const count = detailed.reduce((n, l) => n + l.quantity, 0);

  return (
    <div className="container-page py-10 sm:py-12">
      <div className="flex items-baseline gap-3">
        <h1 className="font-display text-d2 text-cream">Your basket</h1>
        {detailed.length > 0 ? (
          <span className="font-sans text-label text-cream-muted">
            {count} {count === 1 ? "bottle" : "bottles"}
          </span>
        ) : null}
      </div>

      {detailed.length === 0 ? (
        <div className="mt-8 rounded border border-line-dark bg-surface p-14 text-center">
          <p className="font-display text-d3 text-cream">Your basket is empty</p>
          <p className="mt-2 text-body-sm text-cream-muted">Nothing in here yet.</p>
          <Link href="/shop" className={buttonClasses("primary", "md", "mt-6")}>
            Browse the shelf
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <ul className="space-y-4">
            {detailed.map((line) => {
              const region = line.product.whisky?.region;
              const tone = toneFor(line.product.whisky, line.product.flavour);
              return (
                <li
                  key={line.variantId}
                  className="flex gap-4 rounded border border-line-dark bg-surface p-4 sm:gap-5 sm:p-5"
                >
                  <Link
                    href={`/products/${line.product.slug}`}
                    className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded border border-line-dark sm:w-24"
                  >
                    <ProductImage image={line.product.image} tone={tone} format={formatFor(line.product)} className="h-full w-full" />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 font-sans text-label-sm text-cream-muted">
                          <span>{line.product.brand.name}</span>
                          {region ? <span className="text-cream/30">·</span> : null}
                          {region ? <span className="capitalize">{region}</span> : null}
                        </div>
                        <Link
                          href={`/products/${line.product.slug}`}
                          className="font-display text-d3 leading-tight text-cream transition-opacity hover:opacity-80"
                        >
                          {line.product.title}
                        </Link>
                        <p className="mt-0.5 font-sans text-body-sm text-cream-muted">
                          {formatVolume(line.variant.sizeMl) || "Accessory"}
                          {line.product.whisky ? ` · ${line.product.whisky.abv}% ABV` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(line.variantId)}
                        className="shrink-0 text-cream/40 transition-opacity hover:opacity-75"
                        aria-label={`Remove ${line.product.title}`}
                      >
                        <Trash2 className="h-[18px] w-[18px]" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="inline-flex items-center rounded border border-line-dark">
                        <button
                          onClick={() => setQty(line.variantId, line.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-cream/70 transition-opacity hover:opacity-75"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-sans text-body-sm tabular-nums text-cream">{line.quantity}</span>
                        <button
                          onClick={() => setQty(line.variantId, line.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-cream/70 transition-opacity hover:opacity-75"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <Price className="font-sans text-body font-medium text-cream" money={line.lineTotal} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit lg:sticky lg:top-40">
            <div className="rounded border border-line-dark bg-surface p-6">
              <h2 className="font-display text-d3 text-cream">Summary</h2>
              <div className="mt-5 flex justify-between border-t border-line-dark pt-4 font-sans text-body-sm">
                <span className="text-cream-muted">Subtotal</span>
                <Price className="font-medium text-cream" money={{ amount: subtotal, currency }} />
              </div>
              <p className="mt-1.5 font-sans text-label-sm text-cream/55">
                Delivery, taxes and any duty are calculated at checkout once we know where it&apos;s going.
              </p>
              <Link href="/checkout" className={buttonClasses("primary", "lg", "mt-6 w-full")}>
                <Lock className="h-4 w-4" /> Secure checkout
              </Link>
              <ul className="mt-5 space-y-2 border-t border-line-dark pt-4 font-sans text-label-sm text-cream-muted">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-copper" aria-hidden="true" /> Age-verified delivery (18+)
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 shrink-0 text-copper" aria-hidden="true" /> Encrypted, secure payment
                </li>
              </ul>
              <p className="mt-4 text-center font-sans text-label-sm text-cream/50">Please drink responsibly.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
