import type { ProductImage as ProductImageType } from "@whiskymart/types";
import { cn } from "@/lib/utils";

/**
 * Warm, museum-like placeholder: a lit parchment surface with a centred,
 * labelled bottle silhouette. Real photography slots in here later (next/image
 * + CDN) without changing callers. Tones are deliberately muted/cohesive.
 */
const SURFACES: Array<[string, string]> = [
  ["#F1E6D3", "#D8C2A0"],
  ["#ECDDC4", "#CBB089"],
  ["#F0E7D7", "#D3BE9C"],
  ["#E8D8BE", "#C7AC85"],
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
  const h = hash(image.seed);
  const [top, bottom] = SURFACES[h % SURFACES.length]!;
  const gid = `g-${Math.abs(h)}`;

  return (
    <div
      role="img"
      aria-label={image.alt}
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{
        background: `radial-gradient(60% 55% at 50% 42%, rgba(201,130,46,0.16), transparent 70%), linear-gradient(180deg, ${top}, ${bottom})`,
      }}
    >
      {/* Labelled bottle silhouette */}
      <svg viewBox="0 0 64 180" className="h-[82%] w-auto drop-shadow-sm" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3A2415" />
            <stop offset="1" stopColor="#6B431C" />
          </linearGradient>
        </defs>
        {/* cap */}
        <rect x="26" y="6" width="12" height="12" rx="2" fill="#241710" />
        {/* body + neck */}
        <path
          d="M27 17h10v15c0 7 11 11 11 28v82a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8V60c0-17 11-21 11-28V17z"
          fill={`url(#${gid})`}
        />
        {/* label */}
        <rect x="18" y="104" width="28" height="40" rx="2" fill="#F6EFE1" opacity="0.92" />
        <rect x="18" y="104" width="28" height="40" rx="2" fill="none" stroke="#B08A4A" strokeWidth="0.75" />
        <rect x="23" y="118" width="18" height="2" rx="1" fill="#B08A4A" opacity="0.7" />
        <rect x="25" y="124" width="14" height="1.5" rx="0.75" fill="#2A1A12" opacity="0.35" />
      </svg>

      {label ? (
        <span className="absolute bottom-3 left-3 right-3 truncate text-center text-xs font-medium uppercase tracking-wide text-charcoal/70">
          {label}
        </span>
      ) : null}
    </div>
  );
}
