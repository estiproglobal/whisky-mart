import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The plan",
  description: "The shop is chapter one. The five-chapter plan for WhiskyMart, for anyone who wants to read it.",
};

/**
 * Placeholder for the Part 5 buyer-visualization page. Session 2 of
 * Increment 12B replaces this with the full five-chapter editorial
 * (see CLAUDE_CODE_PROMPT_Increment12B.md Part 5 and
 * docs/12b-design-plan.md §6). Kept honest and short until then so the
 * footer and homepage links never dead-end.
 */
export default function VisionPage() {
  return (
    <article className="bg-parchment text-ink">
      <div className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-d1">The plan for WhiskyMart</h1>
          <span aria-hidden="true" className="mt-4 block h-px w-12 bg-copper" />
          <div className="mt-8 space-y-5 text-body">
            <p>
              WhiskyMart is being built in chapters, and the shop you are standing in is the first.
              Four more are planned: a discovery platform, a members&apos; community, a collectors&apos;
              market with verified provenance, and the AI layer that ties them together.
            </p>
            <p>
              The full plan is being written up for this page, chapter by chapter, in plain English.
              Until it lands, the shop speaks for itself.
            </p>
          </div>
          <div className="mt-10">
            <Link
              href="/shop"
              className="font-sans text-label text-copper-deep underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
            >
              Browse the shop: chapter one is live
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
