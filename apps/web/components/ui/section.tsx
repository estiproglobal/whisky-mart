import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * A quiet content section: a Libre Caslon heading over a thin copper pour
 * line, an optional intro, an optional text link. No eyebrow labels, no
 * icons; the label plate is the only decorated device on the site.
 * `tone="parchment"` for the inverse (paper) sections.
 */
export function Section({
  title,
  intro,
  linkHref,
  linkLabel,
  tone = "dark",
  className,
  children,
}: {
  title: string;
  intro?: string;
  linkHref?: string;
  linkLabel?: string;
  tone?: "dark" | "parchment";
  className?: string;
  children: React.ReactNode;
}) {
  const parchment = tone === "parchment";
  return (
    <section className={cn("container-page py-14 sm:py-20", className)}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl">
          <h2 className={cn("font-display text-d2", parchment ? "text-ink" : "text-cream")}>{title}</h2>
          <span aria-hidden="true" className="pour-line" />
          {intro ? (
            <p className={cn("mt-4 max-w-xl text-body-sm", parchment ? "text-ink/70" : "text-cream-muted")}>{intro}</p>
          ) : null}
        </div>
        {linkHref && linkLabel ? (
          <Link
            href={linkHref}
            className={cn(
              "font-sans text-label underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75",
              parchment ? "text-copper-deep" : "text-copper",
            )}
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
