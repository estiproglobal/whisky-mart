import { cn } from "@/lib/utils";
import { Monogram } from "./monogram";

/**
 * The WhiskyMart lockup: monogram seal + serif wordmark. Colour is inherited
 * (so it works on cream or ink). `compact` shows the monogram only.
 */
export function Wordmark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Monogram className="h-8 w-8 shrink-0 text-current" />
      {!compact ? (
        <span className="font-display text-2xl font-semibold tracking-tightest leading-none">
          Whisky<span className="text-whisky-600">Mart</span>
        </span>
      ) : null}
    </span>
  );
}
