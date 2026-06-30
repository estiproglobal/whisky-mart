import type { ProductImage as ProductImageType, WhiskyDetails, FlavourProfile } from "@whiskymart/types";
import { cn } from "@/lib/utils";

/**
 * A premium, staged product render: a single bottle lit in a dark display
 * niche: warm backlight halo + overhead spotlight, dark cabinet ground, rim-lit
 * glass, a tone-matched spirit, a brass cap, a soft contact shadow and a faded
 * reflection. A stand-in for real photography (drops in later behind the same
 * caller contract). Deterministic per seed; the spirit colour is driven by the
 * whisky's cask/flavour so products read distinctly.
 */
type ToneKey = "gold" | "amber" | "copper" | "mahogany";

// [liquidTop, liquidBottom, coreGlow]
const TONES: Record<ToneKey, [string, string, string]> = {
  gold: ["#E2AC54", "#A66E22", "#F4D08A"],
  amber: ["#D38B33", "#8A4F1C", "#EFBC6E"],
  copper: ["#C5762A", "#763B12", "#E7A95E"],
  mahogany: ["#AE5E26", "#582910", "#DB914E"],
};
const TONE_KEYS = Object.keys(TONES) as ToneKey[];

/** Pick a spirit tone from the whisky's cask + flavour (sherry → mahogany, …). */
export function toneFor(
  whisky?: WhiskyDetails | null,
  flavour?: FlavourProfile | null,
): ToneKey {
  if (whisky?.caskType?.some((c) => /sherry/i.test(c))) return "mahogany";
  if ((flavour?.rich ?? 0) >= 50) return "copper";
  if ((flavour?.fruity ?? 0) >= 60 || (flavour?.floral ?? 0) >= 50 || (whisky?.ageYears ?? 99) <= 10)
    return "gold";
  return "amber";
}

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function ProductImage({
  image,
  className,
  label,
  tone,
}: {
  image: ProductImageType;
  className?: string;
  label?: string;
  tone?: ToneKey;
}) {
  const h = hash(image.seed);
  const [lqTop, lqBottom, lqCore] = TONES[tone ?? TONE_KEYS[h % TONE_KEYS.length]!];
  const gid = `g-${Math.abs(h)}`;

  return (
    <div
      role="img"
      aria-label={image.alt}
      className={cn("relative flex items-end justify-center overflow-hidden", className)}
      style={{
        background:
          "radial-gradient(44% 38% at 50% 30%, rgba(245,234,210,0.13), transparent 62%)," +
          "radial-gradient(52% 46% at 50% 52%, rgba(201,122,43,0.22), transparent 70%)," +
          "radial-gradient(120% 60% at 50% 120%, rgba(190,122,43,0.1), transparent 60%)," +
          "linear-gradient(180deg, #1C130C 0%, #130D08 56%, #0A0705 100%)",
      }}
    >
      {/* Cabinet vignette */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow:
            "inset 0 1px 0 0 rgba(244,235,221,0.06), inset 0 0 60px 10px rgba(0,0,0,0.35), inset 0 -64px 70px -42px rgba(0,0,0,0.6)",
        }}
      />
      {/* Plinth line */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[16%] bottom-[11%] h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,110,0.34), transparent)" }}
      />

      {/* Bottle + reflection */}
      <svg viewBox="0 0 64 200" className="relative z-10 h-[88%] w-auto" aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}-glass`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2E1D10" />
            <stop offset="0.12" stopColor="#43290F" />
            <stop offset="0.55" stopColor="#21140B" />
            <stop offset="1" stopColor="#14100A" />
          </linearGradient>
          <linearGradient id={`${gid}-liquid`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={lqTop} />
            <stop offset="0.5" stopColor={lqBottom} />
            <stop offset="1" stopColor={lqBottom} />
          </linearGradient>
          <radialGradient id={`${gid}-core`} cx="42%" cy="34%" r="58%">
            <stop offset="0" stopColor={lqCore} stopOpacity="0.85" />
            <stop offset="1" stopColor={lqCore} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${gid}-cap`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6F5530" />
            <stop offset="0.36" stopColor="#DCC08A" />
            <stop offset="0.62" stopColor="#A9854E" />
            <stop offset="1" stopColor="#5F4827" />
          </linearGradient>
          <linearGradient id={`${gid}-refl`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={lqBottom} stopOpacity="0.32" />
            <stop offset="1" stopColor={lqBottom} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Reflection (mirrored body, faded) */}
        <g transform="translate(0,300) scale(1,-1)" opacity="0.45">
          <path
            d="M27 20h10v14c0 7 10 11 10 26v74a7 7 0 0 1-7 7H24a7 7 0 0 1-7-7V60c0-15 10-19 10-26V20z"
            fill={`url(#${gid}-refl)`}
          />
        </g>

        {/* Cap + foil */}
        <path d="M26 17h12l-1.6 13H27.6z" fill={`url(#${gid}-cap)`} />
        <rect x="26" y="6" width="12" height="12" rx="1.6" fill={`url(#${gid}-cap)`} />
        <rect x="28.5" y="8" width="2.6" height="7" rx="1.3" fill="#F4E8CF" opacity="0.3" />
        <line x1="27" y1="23" x2="37" y2="23" stroke="#4F3C1D" strokeWidth="0.5" opacity="0.5" />

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
          d="M17.4 92Q32 96 46.6 92v42a6.4 6.4 0 0 1-6.4 6.4H23.8a6.4 6.4 0 0 1-6.4-6.4z"
          fill={`url(#${gid}-liquid)`}
        />
        <ellipse cx="28" cy="112" rx="13" ry="22" fill={`url(#${gid}-core)`} />
        <path d="M17.4 92Q32 96 46.6 92" stroke={lqCore} strokeWidth="0.9" opacity="0.55" fill="none" />

        {/* Glass speculars + rim */}
        <rect x="20.5" y="60" width="2.4" height="78" rx="1.2" fill="#F4E8CF" opacity="0.16" />
        <rect x="21.6" y="64" width="0.9" height="56" rx="0.45" fill="#FBF3E1" opacity="0.3" />
        <rect x="44" y="64" width="1.4" height="72" rx="0.7" fill="#E7C489" opacity="0.18" />
        <rect x="30" y="40" width="1.4" height="18" rx="0.7" fill="#F4E8CF" opacity="0.14" />

        {/* Label (abstract: no brand text) */}
        <rect x="19" y="98" width="26" height="40" rx="1.5" fill="#F6EFE1" opacity="0.95" />
        <rect x="19" y="98" width="26" height="40" rx="1.5" fill="none" stroke="#A98A4E" strokeWidth="0.6" />
        <circle cx="32" cy="108" r="3.2" fill="none" stroke="#A98A4E" strokeWidth="0.7" />
        <circle cx="32" cy="108" r="1.1" fill="#A98A4E" opacity="0.7" />
        <rect x="23" y="118" width="18" height="1.6" rx="0.8" fill="#A98A4E" opacity="0.85" />
        <rect x="25" y="124" width="14" height="1.1" rx="0.55" fill="#21150C" opacity="0.32" />
        <rect x="27" y="129" width="10" height="1.1" rx="0.55" fill="#21150C" opacity="0.26" />
        <rect x="28" y="133.5" width="8" height="1" rx="0.5" fill="#A98A4E" opacity="0.5" />
      </svg>

      {label ? (
        <span className="absolute bottom-3 left-3 right-3 z-10 truncate text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/70">
          {label}
        </span>
      ) : null}
    </div>
  );
}
