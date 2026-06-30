import Link from "next/link";
import type { FlavourProfile } from "@whiskymart/types";
import { FlavourBars } from "@/components/flavour-bars";
import { describeFlavour } from "@/lib/catalog/flavour";

export interface CollectionCopy {
  bestFor: string;
  collectorInterest: string;
  giftSuitability: string;
}

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-ivory p-5">
      <p className="overline text-whisky-700">{label}</p>
      <div className="mt-2 text-sm leading-relaxed text-charcoal/70">{children}</div>
    </div>
  );
}

/**
 * Editorial band beneath a category hero: a short collection story, a
 * data-driven flavour signature, and a row of premium info cards. Rendered on
 * the warm page surface to transition gracefully into the catalogue below.
 */
export function CollectionStory({
  story,
  copy,
  signature,
  signatureCount,
  startHere,
}: {
  story: string[];
  copy: CollectionCopy;
  signature: FlavourProfile | null;
  signatureCount: number;
  startHere: { title: string; slug: string } | null;
}) {
  const hasSignature = signature !== null;

  return (
    <section className="border-b border-line bg-cream">
      <div className="container-page py-14 lg:py-16">
        <div
          className={
            hasSignature
              ? "grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-16"
              : "max-w-3xl"
          }
        >
          {/* Story */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <p className="overline text-whisky-700">The collection</p>
            </div>
            <div className="mt-5 space-y-4">
              {story.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "font-display text-[1.5rem] leading-snug text-charcoal/90"
                      : "text-[15px] leading-relaxed text-charcoal/70"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Flavour signature */}
          {hasSignature ? (
            <aside className="h-fit rounded-2xl border border-line bg-ivory p-6 shadow-card sm:p-7">
              <p className="overline text-whisky-700">Flavour signature</p>
              <p className="mt-2 font-display text-2xl capitalize leading-tight text-charcoal">
                {describeFlavour(signature, 3) || "Balanced & varied"}
              </p>
              <div className="mt-5">
                <FlavourBars flavour={signature} limit={6} />
              </div>
              <p className="mt-5 border-t border-line pt-3 text-[11px] leading-relaxed text-charcoal/40">
                Averaged across {signatureCount} {signatureCount === 1 ? "bottle" : "bottles"} in this collection.
              </p>
            </aside>
          ) : null}
        </div>

        {/* Premium info cards */}
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard label="Best for">{copy.bestFor}</InfoCard>

          {startHere ? (
            <Link
              href={`/products/${startHere.slug}`}
              className="group rounded-xl border border-line bg-ivory p-5 transition-colors hover:border-charcoal/30"
            >
              <p className="overline text-whisky-700">Start here</p>
              <p className="mt-2 font-display text-lg leading-snug text-charcoal transition-colors group-hover:text-whisky-800">
                {startHere.title}
              </p>
              <span className="mt-2 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-whisky-700">
                View bottle →
              </span>
            </Link>
          ) : (
            <InfoCard label="Signature profile">
              {signature ? describeFlavour(signature, 3) : "A spread of styles across the cabinet."}
            </InfoCard>
          )}

          <InfoCard label="Collector interest">{copy.collectorInterest}</InfoCard>
          <InfoCard label="Gift suitability">{copy.giftSuitability}</InfoCard>
        </dl>
      </div>
    </section>
  );
}
