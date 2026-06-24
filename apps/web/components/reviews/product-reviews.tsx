"use client";

import * as React from "react";
import { Star } from "lucide-react";
import type { Review, ReviewSummary } from "@whiskymart/types";
import { useAccount } from "@/components/account/account-provider";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          onClick={() => onChange(n)}
        >
          <Star className={cn("h-6 w-6", n <= value ? "fill-gold text-gold" : "text-whisky-200")} />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { customer } = useAccount();
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [summary, setSummary] = React.useState<ReviewSummary>({ average: 0, count: 0 });
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [name, setName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then((r) => r.json())
      .then((d: { reviews: Review[]; summary: ReviewSummary }) => {
        setReviews(d.reviews);
        setSummary(d.summary);
      })
      .catch(() => {
        /* ignore */
      });
  }, [productId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const author = customer?.name ?? name;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ author, rating, title, body, email: customer?.email }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setError(d.error ?? "Could not submit your review.");
      } else {
        setTitle("");
        setBody("");
        setName("");
        setRating(5);
        setOpen(false);
        load();
      }
    } catch {
      setError("Could not submit your review.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = author.trim() && title.trim() && body.trim();

  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-charcoal">Customer reviews</h2>
        <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? "Cancel" : "Write a review"}
        </Button>
      </div>

      {summary.count > 0 ? (
        <div className="mt-3 flex items-center gap-3">
          <StarRating value={summary.average} />
          <span className="text-sm text-charcoal/60">
            {summary.average.toFixed(1)} out of 5 · {summary.count} review{summary.count === 1 ? "" : "s"}
          </span>
        </div>
      ) : (
        <p className="mt-3 text-sm text-charcoal/60">No customer reviews yet — be the first.</p>
      )}

      {open ? (
        <form onSubmit={submit} className="mt-5 space-y-4 rounded-2xl bg-white p-6 shadow-card">
          <StarInput value={rating} onChange={setRating} />
          {!customer ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-11 w-full rounded-xl border border-whisky-200 px-3 text-sm outline-none focus:border-whisky-500"
            />
          ) : (
            <p className="text-sm text-charcoal/60">Posting as {customer.name}</p>
          )}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Headline"
            className="h-11 w-full rounded-xl border border-whisky-200 px-3 text-sm outline-none focus:border-whisky-500"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What did you think? Nose, palate, finish…"
            rows={4}
            className="w-full rounded-xl border border-whisky-200 px-3 py-2 text-sm outline-none focus:border-whisky-500"
          />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button type="submit" disabled={!canSubmit || submitting}>
            {submitting ? "Submitting…" : "Submit review"}
          </Button>
        </form>
      ) : null}

      <ul className="mt-6 space-y-4">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-2xl bg-white p-5 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <StarRating value={r.rating} />
              {r.verifiedPurchase ? (
                <span className="rounded-full bg-whisky-100 px-2.5 py-0.5 text-xs font-semibold text-whisky-800">
                  Verified purchase
                </span>
              ) : null}
            </div>
            <h3 className="mt-2 font-display text-lg text-charcoal">{r.title}</h3>
            <p className="mt-1 text-sm text-charcoal/70">{r.body}</p>
            <p className="mt-2 text-xs text-charcoal/40">
              {r.author} ·{" "}
              {new Date(r.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
