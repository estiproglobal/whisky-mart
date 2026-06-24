import type { CartLineDetailed, OrderTotals } from "@whiskymart/types";
import { formatMoney } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
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
            <span className="text-sm font-medium text-charcoal">{formatMoney(l.lineTotal)}</span>
          </li>
        ))}
      </ul>

      {totals ? (
        <div className="mt-5 space-y-2 border-t border-whisky-100 pt-4">
          <Row label="Subtotal" value={formatMoney(totals.subtotal)} />
          <Row
            label="Shipping"
            value={totals.shipping.amount === 0 ? "Free" : formatMoney(totals.shipping)}
          />
          {!totals.vatInclusive && totals.tax.amount > 0 ? (
            <Row label="Tax / VAT" value={formatMoney(totals.tax)} />
          ) : null}
          {totals.duty.amount > 0 ? <Row label="Import duty" value={formatMoney(totals.duty)} /> : null}
          <div className="flex justify-between border-t border-whisky-100 pt-3 font-display text-lg text-charcoal">
            <span>Total</span>
            <span>{formatMoney(totals.grandTotal)}</span>
          </div>
          {totals.vatInclusive && totals.tax.amount > 0 ? (
            <p className="text-xs text-charcoal/50">Includes {formatMoney(totals.tax)} VAT</p>
          ) : null}
        </div>
      ) : (
        <p className="mt-5 border-t border-whisky-100 pt-4 text-sm text-charcoal/50">
          Enter a deliverable address to see shipping and totals.
        </p>
      )}
    </aside>
  );
}
