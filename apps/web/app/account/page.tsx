"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, LogOut, Package } from "lucide-react";
import type { Order } from "@whiskymart/types";
import { useAccount } from "@/components/account/account-provider";
import { Button, buttonClasses } from "@/components/ui/button";
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
      className="max-w-sm space-y-4 rounded-lg border border-line bg-ivory p-6"
    >
      <p className="text-sm text-charcoal/60">
        Sign in to see your orders and saved whisky. (Demo sign-in — no password yet.)
      </p>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-charcoal/80">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 w-full rounded-md border border-line bg-ivory px-3 text-sm outline-none focus:border-charcoal/40"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-charcoal/80">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-md border border-line bg-ivory px-3 text-sm outline-none focus:border-charcoal/40"
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

  if (orders === null) return <p className="text-sm text-charcoal/50">Loading orders…</p>;
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-ivory p-6 text-sm text-charcoal/60">
        No orders yet.{" "}
        <Link href="/shop" className="font-medium text-whisky-700 hover:underline">
          Start shopping →
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id} className="rounded-lg border border-line bg-ivory p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-display text-lg text-charcoal">{o.orderNumber}</span>
            <span className="rounded-[3px] border border-line bg-parchment px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/70">
              {o.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-charcoal/60">
            {new Date(o.placedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}
            {o.items.reduce((n, i) => n + i.quantity, 0)} item(s) · <Price money={o.totals.grandTotal} />
          </p>
          <p className="mt-2 truncate text-sm text-charcoal/70">
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
      <h1 className="font-display text-[2.25rem] tracking-tightest text-charcoal">My WhiskyMart</h1>

      {!customer ? (
        <div className="mt-8">
          <SignInForm />
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-lg border border-line bg-ivory p-6">
            <p className="font-display text-xl text-charcoal">{customer.name}</p>
            <p className="text-sm text-charcoal/50">{customer.email}</p>
            <div className="mt-4 space-y-2">
              <Link href="/account/wishlist" className="flex items-center gap-2 text-sm text-charcoal/70 hover:text-whisky-700">
                <Heart className="h-4 w-4" /> Wishlist
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-2 text-sm text-charcoal/70 hover:text-whisky-700"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </aside>

          <section>
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-charcoal">
              <Package className="h-5 w-5 text-whisky-600" /> Order history
            </h2>
            <OrderHistory email={customer.email} />
            <p className="mt-6 text-xs text-charcoal/40">
              Tip: orders placed with this email at checkout appear here.{" "}
              <Link href="/shop" className={buttonClasses("ghost", "sm", "ml-1 inline-flex")}>
                Browse whisky
              </Link>
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
