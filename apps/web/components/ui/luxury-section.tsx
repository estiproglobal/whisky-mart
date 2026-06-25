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
    <section className={`container-page py-12 sm:py-16 ${className ?? ""}`}>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          {eyebrow ? <p className="overline text-whisky-700">{eyebrow}</p> : null}
          <h2 className="mt-2 font-display text-3xl leading-tight text-charcoal sm:text-4xl">{title}</h2>
          {intro ? <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{intro}</p> : null}
        </div>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-whisky-700 hover:text-whisky-900"
          >
            {viewAllLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
