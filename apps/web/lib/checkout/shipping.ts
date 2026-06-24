import type { ShippingMethod } from "@whiskymart/types";

const FREE_STANDARD_THRESHOLD = 10000; // £100.00 in minor units

/** Available shipping methods for a given basket subtotal (minor units). */
export function getShippingMethods(subtotal: number, currency = "GBP"): ShippingMethod[] {
  const standardPrice = subtotal >= FREE_STANDARD_THRESHOLD ? 0 : 495;
  return [
    {
      id: "standard",
      label: standardPrice === 0 ? "Standard delivery (free over £100)" : "Standard delivery",
      price: { amount: standardPrice, currency },
      etaDays: "3–5 working days",
    },
    {
      id: "express",
      label: "Express delivery",
      price: { amount: 995, currency },
      etaDays: "Next working day",
    },
  ];
}

export function findShippingMethod(subtotal: number, id: string, currency = "GBP"): ShippingMethod | null {
  return getShippingMethods(subtotal, currency).find((m) => m.id === id) ?? null;
}
