"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Order } from "@whiskymart/types";
import { useCart } from "@/components/cart/cart-provider";
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
        <h1 className="font-display text-2xl text-charcoal">No recent order</h1>
        <p className="mt-2 text-charcoal/60">We couldn&apos;t find an order to show.</p>
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
          <CheckCircle2 className="mx-auto h-14 w-14 text-whisky-600" />
          <h1 className="mt-4 font-display text-3xl text-charcoal">Thank you — order confirmed</h1>
          <p className="mt-2 text-charcoal/70">
            Order <span className="font-medium text-charcoal">{order.orderNumber}</span> · a confirmation has
            been sent to {order.email}.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-card">
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.variantId} className="flex justify-between text-sm">
                <span className="text-charcoal/80">
                  {item.title}
                  {item.sizeMl ? ` · ${item.sizeMl}cl` : ""} × {item.quantity}
                </span>
                <Price className="font-medium text-charcoal" money={item.lineTotal} />
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-whisky-100 pt-4 text-sm">
            <div className="flex justify-between text-charcoal/70">
              <span>Subtotal</span>
              <Price money={order.totals.subtotal} />
            </div>
            <div className="flex justify-between text-charcoal/70">
              <span>Shipping ({order.shippingMethod.label})</span>
              <span>{order.totals.shipping.amount === 0 ? "Free" : <Price money={order.totals.shipping} />}</span>
            </div>
            {!order.totals.vatInclusive && order.totals.tax.amount > 0 ? (
              <div className="flex justify-between text-charcoal/70">
                <span>Tax / VAT</span>
                <Price money={order.totals.tax} />
              </div>
            ) : null}
            <div className="flex justify-between border-t border-whisky-100 pt-2 font-display text-lg text-charcoal">
              <span>Total</span>
              <Price money={order.totals.grandTotal} />
            </div>
          </div>

          <div className="mt-5 border-t border-whisky-100 pt-4 text-sm text-charcoal/70">
            <p className="font-medium text-charcoal">Delivering to</p>
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
