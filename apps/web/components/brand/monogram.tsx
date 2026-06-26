import { cn } from "@/lib/utils";

/**
 * WhiskyMart seal — the supplied brass monogram (`public/logos`). Sized by the
 * caller via `className` (height/width). `decorative` hides it from assistive
 * tech when nearby text already names the brand (e.g. the hero watermark).
 */
export function Monogram({
  className,
  title = "WhiskyMart",
  decorative = false,
}: {
  className?: string;
  title?: string;
  decorative?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static brand SVG; next/image adds no value and blocks SVG by default
    <img
      src="/logos/whiskymart-monogram.svg"
      alt={decorative ? "" : title}
      aria-hidden={decorative || undefined}
      draggable={false}
      className={cn("inline-block h-9 w-9 select-none", className)}
    />
  );
}
