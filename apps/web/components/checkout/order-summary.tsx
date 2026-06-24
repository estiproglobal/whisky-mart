import type { ReactNode } from "react";
import type { CartLineDetailed, OrderTotals } from "@whiskymart/types";
import { ProductImage } from "@/components/product-image";
import { Price } from "@/components/market/price";
import { SettlementNote } from "@/components/market/settlement-note";

function Row({ label, value, muted }: { label: string; value: ReactNode; muted?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${muted ? "text-charcoal/50" : "text-charcoal/70"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function OrderSummary({
  items,
  totals,
}: {
  items: CartLineDetailed[];
  totals: OrderTotals | null;
}) {
  return (
    <aside className="h-fit rounded-2xl bg-white p-6 shadow-card">
      <h2 className="font-display text-xl text-charcoal">Order summary</h2>

      <ul className="mt-4 space-y-3">
        {items.map((l) => (
          <li key={l.variantId} className="flex items-center gap-3">
            <ProductImage image={l.product.image} className="h-14 w-11 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-charcoal">{l.product.title}</p>
              <p className="text-xs text-charcoal/50">
                {l.variant.sizeMl ? `${l.variant.sizeMl}cl · ` : ""}Qty {l.quantity}
              </p>
            </div>
            <Price className="text-sm font-medium text-charcoal" money={l.lineTotal} />
          </li>
        ))}
      </ul>

      {totals ? (
        <div className="mt-5 space-y-2 border-t border-whisky-100 pt-4">
          <Row label="Subtotal" value={<Price money={totals.subtotal} />} />
          <Row
            label="Shipping"
            value={totals.shipping.amount === 0 ? "Free" : <Price money={totals.shipping} />}
          />
          {!totals.vatInclusive && totals.tax.amount > 0 ? (
            <Row label="Tax / VAT" value={<Price money={totals.tax} />} />
          ) : null}
          {totals.duty.amount > 0 ? <Row label="Import duty" value={<Price money={totals.duty} />} /> : null}
          <div className="flex justify-between border-t border-whisky-100 pt-3 font-display text-lg text-charcoal">
            <span>Total</span>
            <Price money={totals.grandTotal} />
          </div>
          {totals.vatInclusive && totals.tax.amount > 0 ? (
            <p className="text-xs text-charcoal/50">
              Includes <Price money={totals.tax} /> VAT
            </p>
          ) : null}
          <SettlementNote className="pt-1 text-xs text-charcoal/50" />
        </div>
      ) : (
        <p className="mt-5 border-t border-whisky-100 pt-4 text-sm text-charcoal/50">
          Enter a deliverable address to see shipping and totals.
        </p>
      )}
    </aside>
  );
}
