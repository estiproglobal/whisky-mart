import type { ProductImage as ProductImageType } from "@whiskymart/types";
import { cn } from "@/lib/utils";

/**
 * A museum-like placeholder: a single bottle lit in a dim display niche — warm
 * spotlight, dark cabinet ground, soft reflection. Real photography slots in
 * here later (next/image + CDN) without changing callers. Deterministic per
 * seed so each product keeps a stable, cohesive look.
 */
const SPOTLIGHTS: string[] = [
  "rgba(206,156,86,0.30)",
  "rgba(196,140,74,0.27)",
  "rgba(214,170,100,0.25)",
  "rgba(190,126,58,0.32)",
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
  const glow = SPOTLIGHTS[h % SPOTLIGHTS.length]!;
  const gid = `g-${Math.abs(h)}`;

  return (
    <div
      role="img"
      aria-label={image.alt}
      className={cn("relative flex items-end justify-center overflow-hidden", className)}
      style={{
        background: `radial-gradient(54% 44% at 50% 36%, ${glow}, transparent 68%), radial-gradient(120% 70% at 50% 116%, rgba(190,122,43,0.10), transparent 60%), linear-gradient(180deg, #1A120C 0%, #120C08 56%, #0B0705 100%)`,
      }}
    >
      {/* Inner vignette + cabinet light edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 1px 0 0 rgba(244,235,221,0.06), inset 0 -60px 80px -40px rgba(0,0,0,0.55)" }}
      />
      {/* Plinth line */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[14%] bottom-[12%] h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,110,0.30), transparent)" }}
      />

      {/* Bottle + reflection */}
      <svg viewBox="0 0 64 200" className="relative z-10 h-[88%] w-auto" aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}-glass`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2A1A10" />
            <stop offset="0.5" stopColor="#3E2614" />
            <stop offset="1" stopColor="#22150C" />
          </linearGradient>
          <linearGradient id={`${gid}-liquid`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B5762B" />
            <stop offset="1" stopColor="#7A4717" />
          </linearGradient>
          <linearGradient id={`${gid}-refl`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3E2614" stopOpacity="0.34" />
            <stop offset="1" stopColor="#3E2614" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Reflection (mirrored body, faded) */}
        <g transform="translate(0,300) scale(1,-1)" opacity="0.5">
          <path
            d="M27 20h10v14c0 7 10 11 10 26v74a7 7 0 0 1-7 7H24a7 7 0 0 1-7-7V60c0-15 10-19 10-26V20z"
            fill={`url(#${gid}-refl)`}
          />
        </g>

        {/* Cap */}
        <rect x="26" y="6" width="12" height="13" rx="1.5" fill="#1C120B" />
        <rect x="26" y="6" width="12" height="4" rx="1.5" fill="#A98A4E" opacity="0.55" />
        {/* Body + neck */}
        <path
          d="M27 20h10v14c0 7 10 11 10 26v74a7 7 0 0 1-7 7H24a7 7 0 0 1-7-7V60c0-15 10-19 10-26V20z"
          fill={`url(#${gid}-glass)`}
          stroke="#5A3A1F"
          strokeOpacity="0.5"
          strokeWidth="0.75"
        />
        {/* Liquid */}
        <path
          d="M17.6 92h28.8v42a6.4 6.4 0 0 1-6.4 6.4H24a6.4 6.4 0 0 1-6.4-6.4V92z"
          fill={`url(#${gid}-liquid)`}
          opacity="0.9"
        />
        {/* Specular highlight */}
        <rect x="22" y="40" width="2.4" height="96" rx="1.2" fill="#F4E8CF" opacity="0.14" />
        {/* Label */}
        <rect x="19" y="98" width="26" height="40" rx="1.5" fill="#F6EFE1" opacity="0.95" />
        <rect x="19" y="98" width="26" height="40" rx="1.5" fill="none" stroke="#A98A4E" strokeWidth="0.6" />
        <circle cx="32" cy="108" r="3" fill="none" stroke="#A98A4E" strokeWidth="0.7" />
        <rect x="24" y="120" width="16" height="1.6" rx="0.8" fill="#A98A4E" opacity="0.8" />
        <rect x="26" y="126" width="12" height="1.2" rx="0.6" fill="#21150C" opacity="0.35" />
        <rect x="27" y="131" width="10" height="1.2" rx="0.6" fill="#21150C" opacity="0.28" />
      </svg>

      {label ? (
        <span className="absolute bottom-3 left-3 right-3 z-10 truncate text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/70">
          {label}
        </span>
      ) : null}
    </div>
  );
}
