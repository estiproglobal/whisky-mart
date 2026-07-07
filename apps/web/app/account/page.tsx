"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, LogOut } from "lucide-react";
import type { Order } from "@whiskymart/types";
import { useAccount } from "@/components/account/account-provider";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/market/price";

function SignInForm() {
  const { signIn } = useAccount();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const valid = name.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) signIn({ name: name.trim(), email: email.trim() });
      }}
      className="max-w-sm space-y-4 rounded border border-line-dark bg-surface p-6"
    >
      <p className="text-body-sm text-cream-muted">
        Sign in to see your orders and saved whisky. This is a demonstration sign-in; there is no
        password.
      </p>
      <label className="block">
        <span className="mb-1 block font-sans text-label text-cream/85">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 w-full rounded border border-line-dark bg-ground px-3 font-sans text-body-sm text-cream outline-none focus:border-cream/40"
        />
      </label>
      <label className="block">
        <span className="mb-1 block font-sans text-label text-cream/85">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded border border-line-dark bg-ground px-3 font-sans text-body-sm text-cream outline-none focus:border-cream/40"
        />
      </label>
      <Button type="submit" disabled={!valid} className="w-full">
        Sign in
      </Button>
    </form>
  );
}

function OrderHistory({ email }: { email: string }) {
  const [orders, setOrders] = React.useState<Order[] | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/api/orders?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d: { orders: Order[] }) => {
        if (!cancelled) setOrders(d.orders);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      });
    return () => {
      cancelled = true;
    };
  }, [email]);

  if (orders === null) return <p className="text-body-sm text-cream-muted">Loading orders…</p>;
  if (orders.length === 0) {
    return (
      <div className="rounded border border-line-dark bg-surface p-6 text-body-sm text-cream-muted">
        No orders yet.{" "}
        <Link href="/shop" className="text-copper underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75">
          Browse the shelf
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id} className="rounded border border-line-dark bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-display text-d3 text-cream">{o.orderNumber}</span>
            <span className="rounded border border-line-dark px-2 py-0.5 font-sans text-label-sm text-cream-muted">
              {o.status}
            </span>
          </div>
          <p className="mt-1 font-sans text-body-sm text-cream-muted">
            {new Date(o.placedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}
            {o.items.reduce((n, i) => n + i.quantity, 0)} item(s) · <Price money={o.totals.grandTotal} />
          </p>
          <p className="mt-2 truncate text-body-sm text-cream/80">
            {o.items.map((i) => `${i.title} ×${i.quantity}`).join(", ")}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function AccountPage() {
  const { customer, ready, signOut } = useAccount();
  if (!ready) return null;

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-d2 text-cream">My WhiskyMart</h1>

      {!customer ? (
        <div className="mt-8">
          <SignInForm />
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded border border-line-dark bg-surface p-6">
            <p className="font-display text-d3 text-cream">{customer.name}</p>
            <p className="font-sans text-body-sm text-cream-muted">{customer.email}</p>
            <div className="mt-4 space-y-2">
              <Link href="/account/wishlist" className="flex items-center gap-2 font-sans text-body-sm text-cream-muted transition-opacity hover:opacity-75">
                <Heart className="h-4 w-4" aria-hidden="true" /> Wishlist
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-2 font-sans text-body-sm text-cream-muted transition-opacity hover:opacity-75"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
              </button>
            </div>
          </aside>

          <section>
            <h2 className="mb-4 font-display text-d3 text-cream">Order history</h2>
            <OrderHistory email={customer.email} />
            <p className="mt-6 font-sans text-label-sm text-cream/55">
              Orders placed with this email at checkout appear here.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
