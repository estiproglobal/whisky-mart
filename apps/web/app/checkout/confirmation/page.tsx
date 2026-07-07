"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Order } from "@whiskymart/types";
import { useCart } from "@/components/cart/cart-provider";
import { formatVolume } from "@/lib/utils";
import { Price } from "@/components/market/price";
import { buttonClasses } from "@/components/ui/button";

export default function ConfirmationPage() {
  const { clear } = useCart();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem("wm_last_order");
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {
      /* ignore */
    }
    clear(); // empty the basket now the order is placed
    setLoaded(true);
  }, [clear]);

  if (!loaded) return null;

  if (!order) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-display text-d2 text-cream">No recent order</h1>
        <p className="mt-2 text-body-sm text-cream-muted">We couldn&apos;t find an order to show.</p>
        <Link href="/shop" className={buttonClasses("primary", "md", "mt-6")}>
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-copper" strokeWidth={1.5} aria-hidden="true" />
          <h1 className="mt-5 font-display text-d2 text-cream">Thank you, order confirmed</h1>
          <p className="mt-3 text-body-sm text-cream-muted">
            Order <span className="font-medium text-cream">{order.orderNumber}</span> · a confirmation has
            been sent to {order.email}.
          </p>
        </div>

        <div className="mt-8 rounded border border-line-dark bg-surface p-6">
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.variantId} className="flex justify-between font-sans text-body-sm">
                <span className="text-cream/85">
                  {item.title}
                  {formatVolume(item.sizeMl) ? ` · ${formatVolume(item.sizeMl)}` : ""} × {item.quantity}
                </span>
                <Price className="font-medium text-cream" money={item.lineTotal} />
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-line-dark pt-4 font-sans text-body-sm">
            <div className="flex justify-between text-cream-muted">
              <span>Subtotal</span>
              <Price money={order.totals.subtotal} />
            </div>
            <div className="flex justify-between text-cream-muted">
              <span>Shipping ({order.shippingMethod.label})</span>
              <span>{order.totals.shipping.amount === 0 ? "Free" : <Price money={order.totals.shipping} />}</span>
            </div>
            {!order.totals.vatInclusive && order.totals.tax.amount > 0 ? (
              <div className="flex justify-between text-cream-muted">
                <span>Tax / VAT</span>
                <Price money={order.totals.tax} />
              </div>
            ) : null}
            <div className="flex justify-between border-t border-line-dark pt-2 font-display text-d3 text-cream">
              <span>Total</span>
              <Price money={order.totals.grandTotal} />
            </div>
          </div>

          <div className="mt-5 border-t border-line-dark pt-4 font-sans text-body-sm text-cream-muted">
            <p className="font-medium text-cream">Delivering to</p>
            <p className="mt-1">
              {order.shippingAddress.fullName}, {order.shippingAddress.line1}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.postcode}
            </p>
            <p className="mt-1">{order.shippingMethod.etaDays}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/shop" className={buttonClasses("primary", "md")}>
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
