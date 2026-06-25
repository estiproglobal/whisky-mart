import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * LuxurySection — a commerce/editorial section with an editorial heading
 * (overline + serif title + brass rule) and an optional "view all" link.
 */
export function LuxurySection({
  eyebrow,
  title,
  intro,
  viewAllHref,
  viewAllLabel = "View all",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`container-page py-14 sm:py-20 ${className ?? ""}`}>
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl">
          {eyebrow ? (
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <p className="overline text-whisky-700">{eyebrow}</p>
            </div>
          ) : null}
          <h2 className="mt-4 font-display text-[2rem] leading-[1.06] tracking-tightest text-charcoal sm:text-[2.6rem]">
            {title}
          </h2>
          {intro ? <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-charcoal/60">{intro}</p> : null}
        </div>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-2 whitespace-nowrap border-b border-charcoal/20 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal transition-colors hover:border-charcoal"
          >
            {viewAllLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
