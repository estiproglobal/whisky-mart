import { Monogram } from "@/components/brand/monogram";

/**
 * Hero visual — a refined, non-branded whisky bottle rendered entirely in
 * CSS/SVG for the dark "Private Cask Room" hero. Warm amber glow, dark glass
 * with amber spirit, a brass cap, and the house WM seal on the label and faint
 * behind. No real distillery artwork or photography. Decorative (aria-hidden).
 */
export function HeroBottle() {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[22rem]" aria-hidden="true">
      {/* Warm amber whisky glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 36% at 52% 43%, rgba(201,122,43,0.38), rgba(201,122,43,0.07) 52%, transparent 72%)",
        }}
      />

      {/* Faint house seal — intentional, centred behind the bottle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Monogram decorative className="h-[58%] w-auto opacity-[0.06]" />
      </div>

      {/* Bottle */}
      <svg
        viewBox="0 0 240 520"
        className="relative mx-auto h-full w-auto drop-shadow-[0_26px_44px_rgba(0,0,0,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hb-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#241710" />
            <stop offset="0.45" stopColor="#160e08" />
            <stop offset="1" stopColor="#0d0805" />
          </linearGradient>
          <linearGradient id="hb-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d2913f" />
            <stop offset="0.5" stopColor="#b5762b" />
            <stop offset="1" stopColor="#7a4717" />
          </linearGradient>
          <linearGradient id="hb-cap" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#866a38" />
            <stop offset="0.5" stopColor="#c8a877" />
            <stop offset="1" stopColor="#866a38" />
          </linearGradient>
        </defs>

        {/* Reflection pool */}
        <ellipse cx="120" cy="500" rx="72" ry="9" fill="#c97a2b" opacity="0.16" />

        {/* Glass body */}
        <path
          d="M109 66 L109 150 C109 178 66 196 64 232 L64 470 Q64 488 82 488 L158 488 Q176 488 176 470 L176 232 C174 196 131 178 131 150 L131 66 Z"
          fill="url(#hb-glass)"
          stroke="#3a2616"
          strokeWidth="1"
        />

        {/* Spirit */}
        <path
          d="M68 300 Q120 314 172 300 L172 466 Q172 484 156 484 L84 484 Q68 484 68 466 Z"
          fill="url(#hb-liquid)"
          opacity="0.94"
        />
        <path d="M68 300 Q120 314 172 300" stroke="#e7c489" strokeWidth="1.4" opacity="0.5" fill="none" />

        {/* Cap + foil */}
        <rect x="105" y="22" width="30" height="16" rx="3" fill="url(#hb-cap)" />
        <path d="M104 38 L136 38 L131 70 L109 70 Z" fill="url(#hb-cap)" />
        <line x1="106.5" y1="50" x2="133.5" y2="50" stroke="#5c4622" strokeWidth="0.8" opacity="0.55" />
        <line x1="107.5" y1="60" x2="132.5" y2="60" stroke="#5c4622" strokeWidth="0.8" opacity="0.55" />

        {/* Label — the house mark, no real brand */}
        <rect x="80" y="332" width="80" height="120" rx="5" fill="#F2EDE2" opacity="0.96" />
        <rect x="80" y="332" width="80" height="120" rx="5" fill="none" stroke="#B08D57" strokeWidth="1" />
        <circle cx="120" cy="364" r="13" fill="none" stroke="#B08D57" strokeWidth="1" />
        <text
          x="120"
          y="369"
          textAnchor="middle"
          className="font-display"
          fontSize="13"
          fontWeight="600"
          fill="#866a38"
        >
          WM
        </text>
        <line x1="94" y1="390" x2="146" y2="390" stroke="#B08D57" strokeWidth="0.8" opacity="0.8" />
        <text
          x="120"
          y="409"
          textAnchor="middle"
          className="font-display"
          fontSize="8"
          fill="#21150c"
          opacity="0.7"
        >
          SINGLE CASK
        </text>
        <line x1="104" y1="421" x2="136" y2="421" stroke="#21150c" strokeWidth="0.7" opacity="0.3" />
        <text
          x="120"
          y="439"
          textAnchor="middle"
          className="font-display"
          fontSize="7"
          fill="#21150c"
          opacity="0.5"
        >
          EST 2024
        </text>

        {/* Glass highlights */}
        <rect x="73" y="232" width="6" height="236" rx="3" fill="#F2EDE2" opacity="0.1" />
        <rect x="113" y="74" width="3" height="70" rx="1.5" fill="#F2EDE2" opacity="0.12" />
      </svg>

      {/* Plinth light line */}
      <div
        className="absolute inset-x-[14%] bottom-[7%] h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,110,0.55), transparent)" }}
      />
    </div>
  );
}
