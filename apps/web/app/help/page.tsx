import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery & help",
  description: "Delivery times, age verification and returns, in plain terms.",
};

const ITEMS: Array<{ title: string; body: string }> = [
  {
    title: "Delivery",
    body: "Orders are dispatched in 1–2 working days, tracked and packed so the bottle arrives the way it left. Delivery costs are shown at checkout before you pay.",
  },
  {
    title: "Age verification",
    body: "You must be 18 or over to buy alcohol. We check age at checkout, and the carrier requires an adult signature (18+) on delivery. No signature, no handover.",
  },
  {
    title: "Returns",
    body: "Unopened bottles can be returned within 14 days of delivery. If something arrives damaged, tell us and we will put it right.",
  },
  {
    title: "A note on this storefront",
    body: "WhiskyMart is currently a demonstration storefront. Payments and fulfilment are simulated, so no order placed here will be charged or shipped.",
  },
];

export default function HelpPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-d1 text-cream">Delivery &amp; help</h1>
        <span aria-hidden="true" className="pour-line" />
        <dl className="mt-10 space-y-8">
          {ITEMS.map((item) => (
            <div key={item.title}>
              <dt className="font-display text-d3 text-cream">{item.title}</dt>
              <dd className="mt-2 max-w-xl text-body-sm text-cream-muted">{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
