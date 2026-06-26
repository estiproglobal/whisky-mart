import { cn } from "@/lib/utils";
import { Monogram } from "./monogram";

/**
 * The WhiskyMart lockup: a brass seal + the serif wordmark. The seal is always
 * gold; the wordmark inherits its colour from the caller (charcoal on light,
 * cream on dark). `compact` shows the seal only; `tagline` adds the
 * "Private Casks. Curated." strapline (use on dark surfaces for legibility).
 */
export function Wordmark({
  className,
  compact = false,
  tagline = false,
}: {
  className?: string;
  compact?: boolean;
  tagline?: boolean;
}) {
  if (compact) {
    return <Monogram className={cn("h-9 w-9 shrink-0 text-gold", className)} />;
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Monogram className="h-9 w-9 shrink-0 text-gold" decorative />
      <span className="inline-flex flex-col">
        <span className="font-display text-[1.6rem] font-semibold leading-none tracking-tightest">
          WhiskyMart
        </span>
        {tagline ? (
          <span className="mt-2 flex items-center justify-center gap-2" aria-hidden="true">
            <span className="h-px w-4 bg-gold/60" />
            <span className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.28em] text-gold">
              Private Casks. Curated.
            </span>
            <span className="h-px w-4 bg-gold/60" />
          </span>
        ) : null}
      </span>
    </span>
  );
}
