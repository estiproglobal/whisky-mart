import type { ReactNode } from "react";
import type { CartLineDetailed, OrderTotals } from "@whiskymart/types";
import { formatVolume } from "@/lib/utils";
import { ProductImage, toneFor, formatFor } from "@/components/product-image";
import { Price } from "@/components/market/price";
import { SettlementNote } from "@/components/market/settlement-note";

function Row({ label, value, muted }: { label: string; value: ReactNode; muted?: boolean }) {
  return (
    <div className={`flex justify-between font-sans text-body-sm ${muted ? "text-cream/50" : "text-cream-muted"}`}>
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
    <aside className="h-fit rounded border border-line-dark bg-surface p-6">
      <h2 className="font-display text-d3 text-cream">Order summary</h2>

      <ul className="mt-4 space-y-3">
        {items.map((l) => (
          <li key={l.variantId} className="flex items-center gap-3">
            <ProductImage
              image={l.product.image}
              tone={toneFor(l.product.whisky, l.product.flavour)}
              format={formatFor(l.product)}
              className="h-16 w-12 shrink-0 rounded border border-line-dark"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-body-sm font-medium text-cream">{l.product.title}</p>
              <p className="font-sans text-label-sm text-cream-muted">
                {formatVolume(l.variant.sizeMl) ? `${formatVolume(l.variant.sizeMl)} · ` : ""}Qty {l.quantity}
              </p>
            </div>
            <Price className="font-sans text-body-sm font-medium text-cream" money={l.lineTotal} />
          </li>
        ))}
      </ul>

      {totals ? (
        <div className="mt-5 space-y-2 border-t border-line-dark pt-4">
          <Row label="Subtotal" value={<Price money={totals.subtotal} />} />
          <Row
            label="Shipping"
            value={totals.shipping.amount === 0 ? "Free" : <Price money={totals.shipping} />}
          />
          {!totals.vatInclusive && totals.tax.amount > 0 ? (
            <Row label="Tax / VAT" value={<Price money={totals.tax} />} />
          ) : null}
          {totals.duty.amount > 0 ? <Row label="Import duty" value={<Price money={totals.duty} />} /> : null}
          <div className="flex justify-between border-t border-line-dark pt-3 font-display text-d3 text-cream">
            <span>Total</span>
            <Price money={totals.grandTotal} />
          </div>
          {totals.vatInclusive && totals.tax.amount > 0 ? (
            <p className="font-sans text-label-sm text-cream-muted">
              Includes <Price money={totals.tax} /> VAT
            </p>
          ) : null}
          <SettlementNote className="pt-1 font-sans text-label-sm text-cream-muted" />
        </div>
      ) : (
        <p className="mt-5 border-t border-line-dark pt-4 text-body-sm text-cream-muted">
          Enter a deliverable address to see shipping and totals.
        </p>
      )}
    </aside>
  );
}
