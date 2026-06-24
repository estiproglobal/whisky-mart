import type { ProductImage as ProductImageType } from "@whiskymart/types";
import { cn } from "@/lib/utils";

/**
 * Deterministic gradient placeholder. Real product photography slots in here
 * in a later increment (next/image + CDN) without changing callers.
 */
const GRADIENTS: Array<[string, string]> = [
  ["#7B481B", "#D08F3E"],
  ["#3F2611", "#9A5C20"],
  ["#5E3717", "#C9A24B"],
  ["#9A5C20", "#EBC79A"],
  ["#1A1714", "#7B481B"],
  ["#B8732B", "#F6E4CC"],
];

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function ProductImage({
  image,
  className,
  label,
}: {
  image: ProductImageType;
  className?: string;
  label?: string;
}) {
  const [from, to] = GRADIENTS[hash(image.seed) % GRADIENTS.length]!;
  return (
    <div
      role="img"
      aria-label={image.alt}
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
    >
      {/* Simple bottle silhouette */}
      <svg viewBox="0 0 60 160" className="h-3/4 w-auto opacity-30" aria-hidden="true">
        <path
          d="M24 6h12v22c0 6 10 10 10 26v94a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V54c0-16 10-20 10-26V6z"
          fill="#FBF7F0"
        />
      </svg>
      {label ? (
        <span className="absolute bottom-2 left-2 right-2 truncate text-center text-xs font-medium text-cream/90 drop-shadow">
          {label}
        </span>
      ) : null}
    </div>
  );
}
