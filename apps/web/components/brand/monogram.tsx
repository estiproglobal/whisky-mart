/**
 * WhiskyMart seal — a brass monogram: a double ring broken at the top for a
 * small cask, an interlocked serif W·M at the centre, and EST · key · year at
 * the foot. Drawn monochrome via `currentColor`, so callers tint it (a gold
 * seal in the lockup, or a faint cream watermark on dark sections). Letterforms
 * use the brand serif (`font-display`) with a Georgia fallback.
 */
export function Monogram({
  className,
  title = "WhiskyMart",
  est = "2024",
  decorative = false,
}: {
  className?: string;
  title?: string;
  est?: string;
  decorative?: boolean;
}) {
  const a11y = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": title } as const);

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...a11y}
    >
      {/* Rings — a fine outer hairline and a heavier inner ring, broken at the
          top to seat the cask. */}
      <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
      <path d="M60.16 9.25 A42 42 0 1 1 39.84 9.25" stroke="currentColor" strokeWidth="1.6" />

      {/* Cask, seated in the break at the top of the ring */}
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M44 3.4 C42.2 7 42.2 11.4 44 15 L56 15 C57.8 11.4 57.8 7 56 3.4 Z" />
        <ellipse cx="50" cy="3.4" rx="6" ry="1.5" />
        <line x1="42.9" y1="6.6" x2="57.1" y2="6.6" />
        <line x1="42.6" y1="11.4" x2="57.4" y2="11.4" />
        <line x1="47" y1="3.6" x2="47" y2="14.8" />
        <line x1="50" y1="3.4" x2="50" y2="15" />
        <line x1="53" y1="3.6" x2="53" y2="14.8" />
      </g>

      {/* Interlocked W · M */}
      <g className="font-display" fill="currentColor" fontWeight={600} textAnchor="middle">
        <text x="50" y="55" fontSize="41">W</text>
        <text x="50" y="68" fontSize="41">M</text>
      </g>

      {/* Foot — EST · key · year */}
      <g className="font-display" fill="currentColor" textAnchor="middle">
        <text x="31" y="84" fontSize="6.5" letterSpacing="0.6">EST</text>
        <text x="69" y="84" fontSize="6.5" letterSpacing="0.6">{est}</text>
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <circle cx="50" cy="79" r="2.1" />
        <line x1="50" y1="81.1" x2="50" y2="89" />
        <line x1="50" y1="85.6" x2="52.3" y2="85.6" />
        <line x1="50" y1="88.2" x2="52.3" y2="88.2" />
      </g>

      {/* Side dots */}
      <circle cx="24.5" cy="50" r="0.9" fill="currentColor" />
      <circle cx="75.5" cy="50" r="0.9" fill="currentColor" />
    </svg>
  );
}
