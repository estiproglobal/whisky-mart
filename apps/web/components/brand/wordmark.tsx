import { cn } from "@/lib/utils";
import { Monogram } from "./monogram";

/**
 * The WhiskyMart horizontal lockup (seal + wordmark + "Private Casks. Curated."),
 * from the supplied brand package (`public/logos`).
 * - `surface="dark"`  → full-colour brass + ivory artwork (use on dark surfaces).
 * - `surface="light"` → charcoal monochrome (use on cream/light surfaces).
 * `compact` renders the seal only. Height is set by the caller via `className`.
 */
const LOCKUP = {
  dark: "/logos/whiskymart-lockup-horizontal.svg",
  light: "/logos/whiskymart-lockup-horizontal-charcoal.svg",
} as const;

export function Wordmark({
  className,
  surface = "light",
  compact = false,
  title = "WhiskyMart",
}: {
  className?: string;
  surface?: "light" | "dark";
  compact?: boolean;
  title?: string;
}) {
  if (compact) {
    return <Monogram className={className} title={title} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static brand SVG; next/image adds no value and blocks SVG by default
    <img
      src={LOCKUP[surface]}
      alt={title}
      draggable={false}
      className={cn("inline-block h-10 w-auto select-none", className)}
    />
  );
}
