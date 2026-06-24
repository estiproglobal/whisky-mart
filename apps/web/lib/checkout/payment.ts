/**
 * Payment abstraction. The storefront talks to `PaymentProvider`, never to a
 * concrete processor — so the mock used today swaps for Stripe later (when
 * `STRIPE_SECRET_KEY` is configured) without touching callers (see docs/03 §2.7).
 */

export interface CardInput {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

export interface PaymentRequest {
  amount: number; // minor units
  currency: string;
  card: CardInput;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  ok: boolean;
  intentId: string;
  status: "succeeded" | "failed";
  error?: string;
}

export interface PaymentProvider {
  readonly name: string;
  pay(req: PaymentRequest): Promise<PaymentResult>;
}

/** True when the supplied card passes basic format validation. */
export function validateCard(card: CardInput): string | null {
  const digits = card.number.replace(/\s+/g, "");
  if (!/^\d{15,16}$/.test(digits)) return "Enter a valid card number.";
  if (card.cvc.length < 3 || card.cvc.length > 4 || !/^\d+$/.test(card.cvc)) return "Enter a valid CVC.";
  if (card.expMonth < 1 || card.expMonth > 12) return "Enter a valid expiry month.";
  const now = new Date();
  const exp = new Date(card.expYear, card.expMonth, 0, 23, 59, 59);
  if (exp < now) return "This card has expired.";
  return null;
}

/**
 * Mock provider for development. Succeeds for valid cards, except a magic
 * "decline" number ending 0002 (so the failure path is testable).
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async pay(req: PaymentRequest): Promise<PaymentResult> {
    const intentId = `pi_mock_${Math.random().toString(36).slice(2, 12)}`;
    const formatError = validateCard(req.card);
    if (formatError) {
      return { ok: false, intentId, status: "failed", error: formatError };
    }
    const digits = req.card.number.replace(/\s+/g, "");
    if (digits.endsWith("0002")) {
      return { ok: false, intentId, status: "failed", error: "Your card was declined (test)." };
    }
    return { ok: true, intentId, status: "succeeded" };
  }
}

/** Returns the active payment provider. Mock today; Stripe when configured. */
export function getPaymentProvider(): PaymentProvider {
  // if (process.env.STRIPE_SECRET_KEY) return new StripePaymentProvider();  // Increment 3b
  return new MockPaymentProvider();
}
