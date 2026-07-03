"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Loader2, Lock } from "lucide-react";
import type { QuoteResponse, PayRequest, PayResponse } from "@/lib/checkout/contracts";
import { SHIPPABLE_COUNTRIES } from "@/lib/checkout/jurisdiction";
import { resolveCartLines } from "@/lib/catalog/repository";
import { useCart } from "@/components/cart/cart-provider";
import { Button, buttonClasses } from "@/components/ui/button";
import { Price } from "@/components/market/price";
import { OrderSummary } from "./order-summary";

type Step = "delivery" | "age" | "shipping" | "payment" | "review";
const STEPS: Array<{ id: Step; label: string }> = [
  { id: "delivery", label: "Delivery" },
  { id: "age", label: "Age check" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-sans text-label text-cream/85">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-11 w-full rounded border border-line-dark bg-surface px-3 font-sans text-body-sm text-cream outline-none placeholder:text-cream/35 focus:border-cream/40"
      />
    </label>
  );
}

export function CheckoutFlow() {
  const router = useRouter();
  const { lines, clear } = useCart();

  const [step, setStep] = React.useState<Step>("delivery");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: "GB",
  });
  const [ageConfirmed, setAgeConfirmed] = React.useState(false);
  const [shippingMethodId, setShippingMethodId] = React.useState("standard");
  const [card, setCard] = React.useState({ number: "", expMonth: "", expYear: "", cvc: "" });

  const [quote, setQuote] = React.useState<QuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = React.useState(false);
  const [placing, setPlacing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const detailed = resolveCartLines(lines);
  const linesKey = JSON.stringify(lines);

  // Fetch a server quote whenever destination, shipping, or basket changes.
  React.useEffect(() => {
    if (lines.length === 0) return;
    let cancelled = false;
    setQuoteLoading(true);
    fetch("/api/checkout/quote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ country: address.country, lines, shippingMethodId }),
    })
      .then((r) => r.json())
      .then((data: QuoteResponse) => {
        if (!cancelled) setQuote(data);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't calculate a quote. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [address.country, shippingMethodId, linesKey, lines]);

  if (lines.length === 0 && !placing) {
    return (
      <div className="rounded border border-line-dark bg-surface p-10 text-center">
        <p className="text-body-sm text-cream-muted">Your basket is empty.</p>
        <Link href="/shop" className={buttonClasses("primary", "md", "mt-5")}>
          Browse the shelf
        </Link>
      </div>
    );
  }

  const decision = quote?.decision;
  const blocked = decision ? !decision.allowed : false;
  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const addressComplete =
    address.fullName && address.line1 && address.city && address.postcode && address.country;
  const cardComplete =
    card.number.replace(/\s/g, "").length >= 15 && card.cvc.length >= 3 && card.expMonth && card.expYear;

  function go(next: Step) {
    setError(null);
    setStep(next);
  }

  async function placeOrder() {
    setPlacing(true);
    setError(null);
    try {
      const payload: PayRequest = {
        email,
        address,
        lines,
        shippingMethodId,
        ageConfirmed,
        card: {
          number: card.number,
          expMonth: Number(card.expMonth),
          expYear: Number(card.expYear),
          cvc: card.cvc,
        },
      };
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: PayResponse = await res.json();
      if (data.ok) {
        sessionStorage.setItem("wm_last_order", JSON.stringify(data.order));
        router.push("/checkout/confirmation");
        // cart is cleared by the confirmation page on mount
      } else {
        setError(data.error);
        setPlacing(false);
        if (data.field === "country" || data.field === "address") go("delivery");
        else if (data.field === "age") go("age");
        else if (data.field === "shipping") go("shipping");
      }
    } catch {
      setError("Something went wrong placing your order. Please try again.");
      setPlacing(false);
    }
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        {/* Progress */}
        <ol className="mb-9 flex flex-wrap items-center gap-x-3 gap-y-2">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full font-sans text-[11px] font-semibold ${
                    i < stepIndex
                      ? "bg-cream/20 text-cream"
                      : i === stepIndex
                        ? "bg-copper text-ink"
                        : "border border-line-dark text-cream/45"
                  }`}
                >
                  {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span
                  className={`font-sans text-label-sm ${
                    i === stepIndex ? "font-medium text-cream" : "text-cream/50"
                  }`}
                >
                  {s.label}
                </span>
              </span>
              {i < STEPS.length - 1 ? <span aria-hidden="true" className="hidden h-px w-6 bg-cream/15 sm:block" /> : null}
            </li>
          ))}
        </ol>

        {error ? (
          <div className="mb-5 flex items-start gap-2 rounded border border-copper/60 bg-surface p-4 text-body-sm text-cream">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* DELIVERY */}
        {step === "delivery" ? (
          <section className="space-y-4">
            <h2 className="font-display text-d3 text-cream">Delivery details</h2>
            <Field label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
            <Field label="Full name" value={address.fullName} onChange={(v) => setAddress({ ...address, fullName: v })} autoComplete="name" />
            <Field label="Address line 1" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} autoComplete="address-line1" />
            <Field label="Address line 2 (optional)" value={address.line2} onChange={(v) => setAddress({ ...address, line2: v })} autoComplete="address-line2" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} autoComplete="address-level2" />
              <Field label="Postcode" value={address.postcode} onChange={(v) => setAddress({ ...address, postcode: v })} autoComplete="postal-code" />
            </div>
            <label className="block">
              <span className="mb-1 block font-sans text-label text-cream/85">Country</span>
              <select
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="h-11 w-full rounded border border-line-dark bg-surface px-3 font-sans text-body-sm text-cream outline-none focus:border-cream/40 [&>option]:text-ink"
              >
                {SHIPPABLE_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                    {c.allowed ? "" : " (not available)"}
                  </option>
                ))}
              </select>
            </label>

            {blocked && decision ? (
              <div className="rounded border border-copper/60 bg-surface p-4 text-body-sm">
                <p className="flex items-center gap-2 font-medium text-cream">
                  <AlertTriangle className="h-4 w-4" /> We can&apos;t ship to {decision.countryLabel} yet
                </p>
                <p className="mt-1 text-cream-muted">{decision.reason}</p>
                {decision.alternative ? <p className="mt-1 text-cream-muted">{decision.alternative}</p> : null}
              </div>
            ) : null}

            <Button
              onClick={() => go("age")}
              disabled={!emailValid || !addressComplete || blocked || quoteLoading}
            >
              Continue to age check
            </Button>
          </section>
        ) : null}

        {/* AGE */}
        {step === "age" ? (
          <section className="space-y-4">
            <h2 className="font-display text-d3 text-cream">Age verification</h2>
            <p className="text-body-sm text-cream-muted">
              It&apos;s illegal to sell alcohol to anyone under {decision?.ageMin ?? 18}. By continuing you
              confirm you and the recipient are of legal drinking age.
            </p>
            {decision?.carrierNote ? (
              <p className="rounded border border-line-dark bg-surface p-3 text-body-sm text-cream-muted">{decision.carrierNote}</p>
            ) : null}
            <label className="flex items-start gap-3 text-body-sm text-cream/85">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-line-dark bg-surface accent-[#C1763B]"
              />
              <span>I confirm I am {decision?.ageMin ?? 18} or over and so is the recipient.</span>
            </label>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => go("delivery")}>Back</Button>
              <Button onClick={() => go("shipping")} disabled={!ageConfirmed}>Continue to shipping</Button>
            </div>
          </section>
        ) : null}

        {/* SHIPPING */}
        {step === "shipping" ? (
          <section className="space-y-4">
            <h2 className="font-display text-d3 text-cream">Delivery method</h2>
            <div className="space-y-3">
              {(quote?.shippingMethods ?? []).map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center justify-between rounded border p-4 transition-opacity ${
                    shippingMethodId === m.id ? "border-copper bg-surface" : "border-line-dark hover:opacity-80"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethodId === m.id}
                      onChange={() => setShippingMethodId(m.id)}
                      className="h-4 w-4 accent-[#C1763B]"
                    />
                    <span>
                      <span className="block font-sans text-body-sm font-medium text-cream">{m.label}</span>
                      <span className="block font-sans text-label-sm text-cream-muted">{m.etaDays}</span>
                    </span>
                  </span>
                  <span className="font-sans text-body-sm font-medium text-cream">
                    {m.price.amount === 0 ? "Free" : <Price money={m.price} />}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => go("age")}>Back</Button>
              <Button onClick={() => go("payment")} disabled={quoteLoading}>Continue to payment</Button>
            </div>
          </section>
        ) : null}

        {/* PAYMENT */}
        {step === "payment" ? (
          <section className="space-y-4">
            <h2 className="font-display text-d3 text-cream">Payment</h2>
            <p className="flex items-center gap-2 text-body-sm text-cream-muted">
              <Lock className="h-4 w-4" aria-hidden="true" /> Simulated payment; no real charge is made. Use any
              16-digit number and a future expiry. A number ending{" "}
              <code className="rounded border border-line-dark px-1 font-sans">0002</code> simulates a decline.
            </p>
            <Field label="Card number" value={card.number} onChange={(v) => setCard({ ...card, number: v })} placeholder="4242 4242 4242 4242" autoComplete="cc-number" />
            <div className="grid grid-cols-3 gap-4">
              <Field label="Exp. month" value={card.expMonth} onChange={(v) => setCard({ ...card, expMonth: v })} placeholder="12" autoComplete="cc-exp-month" />
              <Field label="Exp. year" value={card.expYear} onChange={(v) => setCard({ ...card, expYear: v })} placeholder="2030" autoComplete="cc-exp-year" />
              <Field label="CVC" value={card.cvc} onChange={(v) => setCard({ ...card, cvc: v })} placeholder="123" autoComplete="cc-csc" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => go("shipping")}>Back</Button>
              <Button onClick={() => go("review")} disabled={!cardComplete}>Review order</Button>
            </div>
          </section>
        ) : null}

        {/* REVIEW */}
        {step === "review" ? (
          <section className="space-y-5">
            <h2 className="font-display text-d3 text-cream">Review &amp; place order</h2>
            <div className="rounded border border-line-dark bg-surface p-4 text-body-sm">
              <p className="font-sans font-medium text-cream">Delivering to</p>
              <p className="mt-1 text-cream-muted">
                {address.fullName}, {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.postcode},{" "}
                {decision?.countryLabel}
              </p>
              <p className="mt-1 text-cream-muted">{email}</p>
            </div>
            <p className="flex items-center gap-2 text-body-sm text-cream-muted">
              <Lock className="h-4 w-4" aria-hidden="true" /> By placing this order you agree to our terms. Please drink responsibly.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => go("payment")} disabled={placing}>Back</Button>
              <Button onClick={placeOrder} disabled={placing} className="min-w-44">
                {placing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
                  </>
                ) : (
                  <>
                    Place order {quote?.totals ? <>· <Price money={quote.totals.grandTotal} /></> : null}
                  </>
                )}
              </Button>
            </div>
          </section>
        ) : null}
      </div>

      <OrderSummary items={detailed} totals={quote?.totals ?? null} />
    </div>
  );
}
