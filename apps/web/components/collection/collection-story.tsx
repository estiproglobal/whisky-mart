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
    <div className="rounded border border-line-dark bg-surface p-5">
      <p className="font-sans text-label-sm text-copper">{label}</p>
      <div className="mt-2 text-body-sm text-cream-muted">{children}</div>
    </div>
  );
}

/**
 * Editorial band beneath a category hero: a short collection story, a
 * data-driven flavour signature, and a row of info cards.
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
    <section className="border-b border-line-dark">
      <div className="container-page py-14 lg:py-16">
        <div
          className={
            hasSignature
              ? "grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-16"
              : "max-w-3xl"
          }
        >
          {/* Story */}
          <div className="max-w-2xl space-y-4">
            {story.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "font-display text-[1.5rem] leading-snug text-cream"
                    : "text-body-sm text-cream-muted"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Flavour signature */}
          {hasSignature ? (
            <aside className="h-fit rounded border border-line-dark bg-surface p-6 sm:p-7">
              <p className="font-sans text-label-sm text-copper">Flavour signature</p>
              <p className="mt-2 font-display text-d3 capitalize text-cream">
                {describeFlavour(signature, 3) || "Balanced & varied"}
              </p>
              <div className="mt-5">
                <FlavourBars flavour={signature} limit={6} />
              </div>
              <p className="mt-5 border-t border-line-dark pt-3 font-sans text-label-sm text-cream/50">
                Averaged across {signatureCount} {signatureCount === 1 ? "bottle" : "bottles"} in this collection.
              </p>
            </aside>
          ) : null}
        </div>

        {/* Info cards */}
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard label="Best for">{copy.bestFor}</InfoCard>

          {startHere ? (
            <Link
              href={`/products/${startHere.slug}`}
              className="group rounded border border-line-dark bg-surface p-5 transition-opacity hover:opacity-85"
            >
              <p className="font-sans text-label-sm text-copper">Start here</p>
              <p className="mt-2 font-display text-d3 leading-snug text-cream group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                {startHere.title}
              </p>
              <span className="mt-2 inline-block font-sans text-label-sm text-copper">View bottle</span>
            </Link>
          ) : (
            <InfoCard label="Signature profile">
              {signature ? describeFlavour(signature, 3) : "A spread of styles across the shelf."}
            </InfoCard>
          )}

          <InfoCard label="Collector interest">{copy.collectorInterest}</InfoCard>
          <InfoCard label="Gift suitability">{copy.giftSuitability}</InfoCard>
        </dl>
      </div>
    </section>
  );
}
