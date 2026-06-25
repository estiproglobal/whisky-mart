import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-page py-10">
      <h1 className="mb-8 font-display text-[2.25rem] tracking-tightest text-charcoal">Checkout</h1>
      <CheckoutFlow />
    </div>
  );
}
