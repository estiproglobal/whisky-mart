import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * The unifying photographic treatment: slight desaturation plus a ~8% copper
 * overlay, so images from mixed sources read as one shoot. All atmosphere
 * photography renders through here (and therefore through next/image).
 * Pass `sizes` explicitly at every call site; set `priority` only on the
 * homepage hero.
 */
type PhotoProps = Omit<ImageProps, "className"> & {
  /** Classes for the wrapper (aspect, radius, borders). */
  className?: string;
  /** Classes for the img element itself. */
  imgClassName?: string;
};

export function Photo({ className, imgClassName, alt, ...img }: PhotoProps) {
  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <Image alt={alt} {...img} className={cn("h-full w-full object-cover [filter:saturate(0.85)]", imgClassName)} />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-copper/[0.08]" />
    </span>
  );
}
