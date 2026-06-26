import { Monogram } from "@/components/brand/monogram";

/**
 * Hero visual — a refined, non-branded whisky bottle staged like a collector's
 * cabinet object, rendered entirely in CSS/SVG. Warm amber glow + overhead
 * spotlight, dark glass with lit amber spirit, a brass cap, a house WM "Single
 * Cask" label, a lit shelf with a soft contact shadow and a masked reflection,
 * and a faint house seal behind. No real distillery artwork. Decorative.
 */
export function HeroBottle() {
  return (
    <div className="relative mx-auto w-full max-w-[21.5rem]" aria-hidden="true">
      {/* Faint house seal, centred behind the staging */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Monogram decorative className="h-[48%] w-auto opacity-[0.05]" />
      </div>

      <svg viewBox="0 0 360 540" className="relative h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="hb-glow" cx="50%" cy="40%" r="56%">
            <stop offset="0" stopColor="#c97a2b" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#c97a2b" stopOpacity="0.1" />
            <stop offset="78%" stopColor="#c97a2b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hb-spot" cx="50%" cy="2%" r="62%">
            <stop offset="0" stopColor="#f4e8cf" stopOpacity="0.16" />
            <stop offset="55%" stopColor="#f4e8cf" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hb-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c1d12" />
            <stop offset="0.12" stopColor="#3a2616" />
            <stop offset="0.5" stopColor="#1a1009" />
            <stop offset="1" stopColor="#0d0805" />
          </linearGradient>
          <linearGradient id="hb-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e3a64f" />
            <stop offset="0.45" stopColor="#c2802f" />
            <stop offset="1" stopColor="#79451a" />
          </linearGradient>
          <radialGradient id="hb-liquid-core" cx="42%" cy="32%" r="58%">
            <stop offset="0" stopColor="#f3c577" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f3c577" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hb-key" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f4e8cf" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#f4e8cf" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hb-cap" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6f5530" />
            <stop offset="0.34" stopColor="#dcc08a" />
            <stop offset="0.6" stopColor="#a9854e" />
            <stop offset="1" stopColor="#5f4827" />
          </linearGradient>
          <linearGradient id="hb-shelf" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c9a86a" stopOpacity="0" />
            <stop offset="0.5" stopColor="#c9a86a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#c9a86a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hb-refl-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.42" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="hb-refl-mask">
            <rect x="96" y="416" width="168" height="120" fill="url(#hb-refl-grad)" />
          </mask>
          <filter id="hb-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <filter id="hb-shadow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="8.5" />
          </filter>

          {/* Bottle, defined once and reused for the reflection */}
          <g id="wm-bottle">
            <path
              d="M169 98 L169 156 C169 184 124 196 122 232 L122 400 Q122 416 138 416 L222 416 Q238 416 238 400 L238 232 C236 196 191 184 191 156 L191 98 Z"
              fill="url(#hb-glass)"
              stroke="#42291692"
              strokeWidth="1"
            />
            {/* spirit */}
            <path
              d="M126 292 Q180 304 234 292 L234 398 Q234 412 220 412 L140 412 Q126 412 126 398 Z"
              fill="url(#hb-liquid)"
            />
            <ellipse cx="164" cy="338" rx="48" ry="64" fill="url(#hb-liquid-core)" />
            <path d="M126 292 Q180 304 234 292" stroke="#f0cd8e" strokeWidth="1.4" opacity="0.55" />
            {/* glass sheen + speculars */}
            <ellipse cx="150" cy="250" rx="26" ry="84" fill="url(#hb-key)" />
            <rect x="133" y="208" width="5" height="186" rx="2.5" fill="#f4e8cf" opacity="0.16" />
            <rect x="135" y="214" width="1.6" height="150" rx="0.8" fill="#fbf3e1" opacity="0.32" />
            <rect x="231" y="222" width="3" height="176" rx="1.5" fill="#e7c489" opacity="0.2" />
            <rect x="173" y="104" width="2.4" height="50" rx="1.2" fill="#f4e8cf" opacity="0.16" />
            {/* cap + foil */}
            <path d="M163 56 L197 56 L191 98 L169 98 Z" fill="url(#hb-cap)" />
            <rect x="165" y="42" width="30" height="15" rx="3" fill="url(#hb-cap)" />
            <rect x="170" y="45" width="6" height="9" rx="2" fill="#f4e8cf" opacity="0.3" />
            <line x1="166.5" y1="70" x2="193.5" y2="70" stroke="#4f3c1d" strokeWidth="0.8" opacity="0.5" />
            <line x1="167.5" y1="84" x2="192.5" y2="84" stroke="#4f3c1d" strokeWidth="0.8" opacity="0.5" />
            {/* label */}
            <rect x="140" y="300" width="80" height="104" rx="5" fill="#F2EDE2" opacity="0.95" />
            <rect x="140" y="300" width="80" height="104" rx="5" fill="none" stroke="#B08D57" strokeWidth="1" />
            <circle cx="180" cy="328" r="12" fill="none" stroke="#B08D57" strokeWidth="1" />
            <text x="180" y="333" textAnchor="middle" className="font-display" fontSize="12" fontWeight="600" fill="#866a38">WM</text>
            <line x1="154" y1="350" x2="206" y2="350" stroke="#B08D57" strokeWidth="0.8" opacity="0.8" />
            <text x="180" y="369" textAnchor="middle" className="font-display" fontSize="7.5" fill="#21150c" opacity="0.7">SINGLE CASK</text>
            <line x1="162" y1="381" x2="198" y2="381" stroke="#21150c" strokeWidth="0.7" opacity="0.3" />
            <text x="180" y="397" textAnchor="middle" className="font-display" fontSize="6.5" fill="#21150c" opacity="0.5">EST 2024</text>
          </g>
        </defs>

        {/* Ambient glow + overhead spotlight */}
        <rect x="0" y="0" width="360" height="540" fill="url(#hb-glow)" />
        <rect x="0" y="0" width="360" height="540" fill="url(#hb-spot)" />

        {/* Reflection on the shelf */}
        <use href="#wm-bottle" transform="matrix(1 0 0 -1 0 832)" opacity="0.2" mask="url(#hb-refl-mask)" filter="url(#hb-soft)" />

        {/* Shelf edge — a thin lit line */}
        <rect x="50" y="415" width="260" height="2" fill="url(#hb-shelf)" />
        <rect x="50" y="417" width="260" height="20" fill="url(#hb-shelf)" opacity="0.25" />

        {/* Contact shadow under the bottle */}
        <ellipse cx="180" cy="416" rx="70" ry="9" fill="#000000" opacity="0.55" filter="url(#hb-shadow)" />

        {/* Bottle */}
        <use href="#wm-bottle" />
      </svg>
    </div>
  );
}
