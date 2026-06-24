import type {
  Address,
  CartLine,
  JurisdictionDecision,
  Order,
  OrderTotals,
  ShippingMethod,
} from "@whiskymart/types";
import type { CardInput } from "./payment";

/** POST /api/checkout/quote */
export interface QuoteRequest {
  country: string;
  lines: CartLine[];
  shippingMethodId?: string;
}
export interface QuoteResponse {
  decision: JurisdictionDecision;
  shippingMethods: ShippingMethod[];
  totals: OrderTotals | null; // null when the destination is not shippable
  currency: string;
}

/** POST /api/checkout/pay */
export interface PayRequest {
  email: string;
  address: Address;
  lines: CartLine[];
  shippingMethodId: string;
  ageConfirmed: boolean;
  card: CardInput;
}
export type PayResponse = { ok: true; order: Order } | { ok: false; error: string; field?: string };
