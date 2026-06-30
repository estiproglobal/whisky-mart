"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShieldCheck, Lock } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { resolveCartLines } from "@/lib/catalog/repository";
import { formatVolume } from "@/lib/utils";
import { ProductImage, toneFor } from "@/components/product-image";
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
        <h1 className="font-display text-[2.25rem] tracking-tightest text-charcoal">Your basket</h1>
        {detailed.length > 0 ? (
          <span className="text-[11px] uppercase tracking-[0.16em] text-charcoal/45">
            {count} {count === 1 ? "bottle" : "bottles"}
          </span>
        ) : null}
      </div>

      {detailed.length === 0 ? (
        <div className="mt-8 rounded-lg border border-line bg-ivory p-14 text-center">
          <p className="font-display text-2xl text-charcoal">Your basket is empty</p>
          <p className="mt-2 text-sm text-charcoal/55">Add a bottle from the cabinet to begin.</p>
          <Link href="/shop" className={buttonClasses("primary", "md", "mt-6")}>
            Browse the catalogue
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
                  className="flex gap-4 rounded-lg border border-line bg-ivory p-4 sm:gap-5 sm:p-5"
                >
                  <Link
                    href={`/products/${line.product.slug}`}
                    className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-md border border-line bg-ink sm:w-24"
                  >
                    <ProductImage image={line.product.image} tone={tone} className="h-full w-full" />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-smoke">
                          <span>{line.product.brand.name}</span>
                          {region ? <span className="text-charcoal/25">·</span> : null}
                          {region ? <span className="capitalize">{region}</span> : null}
                        </div>
                        <Link
                          href={`/products/${line.product.slug}`}
                          className="font-display text-lg leading-tight text-charcoal transition-colors hover:text-whisky-800"
                        >
                          {line.product.title}
                        </Link>
                        <p className="mt-0.5 text-sm text-charcoal/50">
                          {formatVolume(line.variant.sizeMl) || "Accessory"}
                          {line.product.whisky ? ` · ${line.product.whisky.abv}% ABV` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(line.variantId)}
                        className="shrink-0 text-charcoal/35 transition-colors hover:text-burgundy"
                        aria-label={`Remove ${line.product.title}`}
                      >
                        <Trash2 className="h-[18px] w-[18px]" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="inline-flex items-center rounded-md border border-line">
                        <button
                          onClick={() => setQty(line.variantId, line.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-charcoal/70 hover:text-whisky-700"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                        <button
                          onClick={() => setQty(line.variantId, line.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-charcoal/70 hover:text-whisky-700"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <Price className="font-display text-lg text-charcoal" money={line.lineTotal} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit lg:sticky lg:top-40">
            <div className="rounded-lg border border-line bg-ivory p-6">
              <h2 className="font-display text-2xl text-charcoal">Summary</h2>
              <div className="mt-5 flex justify-between border-t border-line pt-4 text-sm">
                <span className="text-charcoal/60">Subtotal</span>
                <Price className="font-medium text-charcoal" money={{ amount: subtotal, currency }} />
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-charcoal/50">
                Delivery, taxes and any duty are calculated at checkout once we know where it&apos;s going.
              </p>
              <Link href="/checkout" className={buttonClasses("primary", "lg", "mt-6 w-full")}>
                <Lock className="h-4 w-4" /> Secure checkout
              </Link>
              <ul className="mt-5 space-y-2 border-t border-line pt-4 text-[12px] text-charcoal/55">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-whisky-700" /> Age-verified delivery (18+)
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 shrink-0 text-whisky-700" /> Encrypted, secure payment
                </li>
              </ul>
              <p className="mt-4 text-center text-[11px] text-charcoal/40">Please drink responsibly.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
