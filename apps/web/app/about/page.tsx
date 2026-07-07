import type { Metadata } from "next";
import Link from "next/link";
import { getPhoto } from "@/lib/photo";
import { Photo } from "@/components/ui/photo";

export const metadata: Metadata = {
  title: "About",
  description: "A small shop with a simple rule: if we wouldn't pour it, we don't sell it.",
};

export default function AboutPage() {
  const photo = getPhoto("still");
  return (
    <article className="bg-parchment text-ink">
      <div className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-d1">About WhiskyMart</h1>
          <span aria-hidden="true" className="mt-4 block h-px w-12 bg-copper" />

          {photo ? (
            <Photo
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 42rem, 92vw"
              className="mt-8 aspect-[16/9] rounded border border-line-light"
            />
          ) : null}

          <div className="mt-8 space-y-5 text-body">
            <p>
              WhiskyMart is a small shop with one rule. If we wouldn&apos;t pour it, we don&apos;t
              sell it. The shelf is short on purpose, and every bottle on it is described honestly,
              including the ones that are an acquired taste.
            </p>
            <p>
              The Sommelier is the other half of the shop. Tell it what you like and it recommends
              from the shelf, with reasons. It will not invent a bottle, a price, or an opinion it
              cannot back.
            </p>
            <p>
              WhiskyMart.com has been registered since 2012. The storefront you are reading is
              currently a demonstration: payments and fulfilment are simulated while the full
              business is built out. The shop is chapter one, and the rest is written down.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-6">
            <Link
              href="/vision"
              className="font-sans text-label text-copper-deep underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
            >
              Read the plan for WhiskyMart
            </Link>
            <Link
              href="/shop"
              className="font-sans text-label text-copper-deep underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
            >
              Browse the shelf
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
