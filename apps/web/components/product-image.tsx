import type { ProductImage as ProductImageType, WhiskyDetails, FlavourProfile, ProductType } from "@whiskymart/types";
import { cn } from "@/lib/utils";

/**
 * The product "niche": a generic bottle rendering per format staged in a dark
 * recess. Photography carries the site's mood; identity lives on the
 * `<LabelPlate>`, so the bottle here carries no brand marks and no fake label
 * text (a blank paper label only). Five formats: tall (Speyside/Highland
 * default), squat round-shoulder (Islay and the coastal malts), a slender
 * Japanese profile, glassware, and a tasting-flight trio. The stage backdrop
 * is a plain tonal recess today; the darkened atmosphere photograph drops in
 * behind the same contract (see DEFERRED.md §8).
 */
export type BottleFormat = "tall" | "squat" | "japanese" | "glass" | "flight";

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

/** Pick the bottle format from the product's type and region. */
export function formatFor(product: { type: ProductType; whisky?: WhiskyDetails | null }): BottleFormat {
  if (product.type === "sample") return "flight";
  if (product.type === "accessory") return "glass";
  const region = product.whisky?.region;
  if (region === "islay" || region === "islands" || region === "campbeltown") return "squat";
  if (region === "japan") return "japanese";
  return "tall";
}

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* Shared defs per render: glass body, liquid, blank paper label. */
function BottleDefs({ gid, tone }: { gid: string; tone: [string, string, string] }) {
  const [lqTop, lqBottom, lqCore] = tone;
  return (
    <defs>
      <linearGradient id={`${gid}-glass`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#33210F" />
        <stop offset="0.14" stopColor="#452B10" />
        <stop offset="0.55" stopColor="#221509" />
        <stop offset="1" stopColor="#140F08" />
      </linearGradient>
      <linearGradient id={`${gid}-liquid`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={lqTop} />
        <stop offset="0.55" stopColor={lqBottom} />
        <stop offset="1" stopColor={lqBottom} />
      </linearGradient>
      <radialGradient id={`${gid}-core`} cx="42%" cy="34%" r="58%">
        <stop offset="0" stopColor={lqCore} stopOpacity="0.8" />
        <stop offset="1" stopColor={lqCore} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${gid}-cap`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#241811" />
        <stop offset="0.4" stopColor="#4A3423" />
        <stop offset="1" stopColor="#1D1310" />
      </linearGradient>
    </defs>
  );
}

/** A blank paper label: a bordered parchment rectangle, no marks. */
function BlankLabel({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1" fill="#EFE6D3" opacity="0.92" />
      <rect x={x + 1.6} y={y + 1.6} width={w - 3.2} height={h - 3.2} rx="0.6" fill="none" stroke="#8F5527" strokeWidth="0.5" opacity="0.55" />
    </g>
  );
}

function TallBottle({ gid }: { gid: string }) {
  return (
    <>
      {/* cork + capsule */}
      <rect x="27.5" y="8" width="9" height="11" rx="1.2" fill={`url(#${gid}-cap)`} />
      <path d="M27 18h10l-0.8 14h-8.4z" fill={`url(#${gid}-cap)`} />
      {/* body: high shoulders, straight walls */}
      <path
        d="M28 19h8v14c0 6.5 9.5 9.5 9.5 22v79a6 6 0 0 1-6 6h-15a6 6 0 0 1-6-6V55c0-12.5 9.5-15.5 9.5-22V19z"
        fill={`url(#${gid}-glass)`}
        stroke="#5A3A1F"
        strokeOpacity="0.45"
        strokeWidth="0.7"
      />
      {/* liquid */}
      <path d="M18.5 88q13.5 3.6 27 0v40a5.6 5.6 0 0 1-5.6 5.6H24.1a5.6 5.6 0 0 1-5.6-5.6z" fill={`url(#${gid}-liquid)`} />
      <ellipse cx="28.5" cy="110" rx="12" ry="20" fill={`url(#${gid}-core)`} />
      {/* speculars */}
      <rect x="21.5" y="57" width="2" height="76" rx="1" fill="#F4E8CF" opacity="0.14" />
      <rect x="22.4" y="61" width="0.8" height="56" rx="0.4" fill="#FBF3E1" opacity="0.28" />
      <rect x="43" y="60" width="1.2" height="70" rx="0.6" fill="#E7C489" opacity="0.15" />
      <BlankLabel x={21} y={94} w={22} h={30} />
    </>
  );
}

function SquatBottle({ gid }: { gid: string }) {
  return (
    <>
      {/* cork + wide capsule */}
      <rect x="26.5" y="16" width="11" height="12" rx="1.4" fill={`url(#${gid}-cap)`} />
      <path d="M26 27h12l-1 12h-10z" fill={`url(#${gid}-cap)`} />
      {/* body: broad, rounded shoulders */}
      <path
        d="M27 28h10v10c0 7 12.5 9 12.5 26v70a6.5 6.5 0 0 1-6.5 6.5H21a6.5 6.5 0 0 1-6.5-6.5V64c0-17 12.5-19 12.5-26V28z"
        fill={`url(#${gid}-glass)`}
        stroke="#4E3A1E"
        strokeOpacity="0.45"
        strokeWidth="0.7"
      />
      {/* liquid */}
      <path d="M14.5 92q17.5 4.4 35 0v42a5.8 5.8 0 0 1-5.8 5.8H20.3a5.8 5.8 0 0 1-5.8-5.8z" fill={`url(#${gid}-liquid)`} />
      <ellipse cx="27" cy="115" rx="14.5" ry="20" fill={`url(#${gid}-core)`} />
      {/* speculars */}
      <rect x="18" y="66" width="2.2" height="70" rx="1.1" fill="#F4E8CF" opacity="0.13" />
      <rect x="19" y="70" width="0.9" height="52" rx="0.45" fill="#FBF3E1" opacity="0.26" />
      <rect x="45" y="68" width="1.3" height="66" rx="0.65" fill="#E7C489" opacity="0.15" />
      <BlankLabel x={18.5} y={98} w={27} h={28} />
    </>
  );
}

function JapaneseBottle({ gid }: { gid: string }) {
  return (
    <>
      {/* slim cap */}
      <rect x="28.5" y="6" width="7" height="10" rx="1" fill={`url(#${gid}-cap)`} />
      {/* body: slender, long sloped shoulders */}
      <path
        d="M29 16h6v16c0 10 7.5 14 7.5 30v72a5.5 5.5 0 0 1-5.5 5.5H27a5.5 5.5 0 0 1-5.5-5.5V62c0-16 7.5-20 7.5-30V16z"
        fill={`url(#${gid}-glass)`}
        stroke="#5A3A1F"
        strokeOpacity="0.4"
        strokeWidth="0.7"
      />
      {/* liquid */}
      <path d="M21.5 96q10.5 2.8 21 0v34a5 5 0 0 1-5 5h-11a5 5 0 0 1-5-5z" fill={`url(#${gid}-liquid)`} />
      <ellipse cx="29" cy="115" rx="9" ry="16" fill={`url(#${gid}-core)`} />
      {/* speculars */}
      <rect x="24" y="64" width="1.8" height="66" rx="0.9" fill="#F4E8CF" opacity="0.15" />
      <rect x="24.8" y="68" width="0.7" height="50" rx="0.35" fill="#FBF3E1" opacity="0.3" />
      <BlankLabel x={24} y={100} w={16} h={26} />
    </>
  );
}

function GlassRender({ gid }: { gid: string }) {
  return (
    <>
      {/* tulip bowl */}
      <path
        d="M20 78c0 16 4 26 9 30v18h-7a2 2 0 0 0 0 4h20a2 2 0 0 0 0-4h-7v-18c5-4 9-14 9-30 0-6-1.5-10-4-12H24c-2.5 2-4 6-4 12z"
        fill={`url(#${gid}-glass)`}
        opacity="0.5"
        stroke="#C9B48C"
        strokeOpacity="0.35"
        strokeWidth="0.8"
      />
      {/* dram */}
      <path d="M21.5 84q10.5 3 21 0c-0.5 10-3 17-6.5 20h-8c-3.5-3-6-10-6.5-20z" fill={`url(#${gid}-liquid)`} opacity="0.9" />
      <ellipse cx="30" cy="94" rx="8" ry="8" fill={`url(#${gid}-core)`} />
      {/* rim highlight */}
      <path d="M22 70q10 3 20 0" stroke="#F4E8CF" strokeWidth="0.8" opacity="0.35" fill="none" />
      <rect x="24" y="80" width="1.4" height="22" rx="0.7" fill="#FBF3E1" opacity="0.3" />
    </>
  );
}

function FlightRender({ gid }: { gid: string }) {
  const glass = (cx: number) => (
    <g transform={`translate(${cx},0)`}>
      <path
        d="M-8 96c0 9 2.5 15 5.5 17.5V123h-4a1.6 1.6 0 0 0 0 3.2h13a1.6 1.6 0 0 0 0-3.2h-4v-9.5C5.5 111 8 105 8 96c0-3.6-1-6-2.5-7.2h-11C-7 90-8 92.4-8 96z"
        fill={`url(#${gid}-glass)`}
        opacity="0.5"
        stroke="#C9B48C"
        strokeOpacity="0.35"
        strokeWidth="0.7"
      />
      <path d="M-7 99q7 2 14 0c-0.4 6-2 10.5-4.3 12.4h-5.4C-5 109.5-6.6 105-7 99z" fill={`url(#${gid}-liquid)`} opacity="0.9" />
    </g>
  );
  return (
    <>
      {/* plank the drams sit on */}
      <rect x="6" y="126" width="52" height="4" rx="1" fill="#3A2A1B" />
      <rect x="6" y="126" width="52" height="1" fill="#5E452B" opacity="0.7" />
      {glass(16)}
      {glass(32)}
      {glass(48)}
    </>
  );
}

const RENDERS: Record<BottleFormat, (props: { gid: string }) => React.ReactElement> = {
  tall: TallBottle,
  squat: SquatBottle,
  japanese: JapaneseBottle,
  glass: GlassRender,
  flight: FlightRender,
};

export function ProductImage({
  image,
  className,
  label,
  tone,
  format,
}: {
  image: ProductImageType;
  className?: string;
  label?: string;
  tone?: ToneKey;
  format?: BottleFormat;
}) {
  const h = hash(image.seed);
  const toneKey = tone ?? TONE_KEYS[h % TONE_KEYS.length]!;
  const fmt = format ?? "tall";
  const gid = `g-${h}`;
  const Render = RENDERS[fmt];

  return (
    <div
      role="img"
      aria-label={image.alt}
      className={cn("relative flex items-end justify-center overflow-hidden", className)}
      style={{
        // The niche recess: quiet tonal shadow, no theatrical glow. The
        // darkened warehouse photograph replaces this layer later.
        background:
          "radial-gradient(90% 70% at 50% 34%, #241A13 0%, #1A130E 58%, #120D09 100%)",
      }}
    >
      {/* Recess vignette. (A copper shelf hairline sat here originally; cut
          under the "remove one accessory" rule: the plate is the only
          decorated device.) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow:
            "inset 0 1px 0 0 rgba(237,228,214,0.05), inset 0 0 52px 8px rgba(0,0,0,0.32), inset 0 -56px 60px -40px rgba(0,0,0,0.55)",
        }}
      />

      <svg viewBox="0 0 64 160" className="relative z-10 h-[86%] w-auto" aria-hidden="true">
        <BottleDefs gid={gid} tone={TONES[toneKey]} />
        {/* contact shadow */}
        <ellipse cx="32" cy="146" rx="19" ry="3.4" fill="#000" opacity="0.5" />
        <g transform="translate(2,4)">
          <Render gid={gid} />
        </g>
      </svg>

      {label ? (
        <span className="absolute bottom-3 left-3 right-3 z-10 truncate text-center font-sans text-label-sm text-cream/70">
          {label}
        </span>
      ) : null}
    </div>
  );
}
