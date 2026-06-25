/**
 * WhiskyMart monogram — a gold seal with a serif "WM".
 * Pure SVG + currentColor for the letters (so it adapts to light/dark surfaces);
 * the ring is gold. Swap this file to drop in a commissioned mark later.
 */
export function Monogram({
  className,
  title = "WhiskyMart",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="31" stroke="#C2A14E" strokeWidth="1" strokeOpacity="0.55" />
      <circle cx="32" cy="32" r="26.5" stroke="#C2A14E" strokeWidth="1.5" />
      <text
        x="32"
        y="41.5"
        textAnchor="middle"
        fontFamily='"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif'
        fontSize="25"
        fontWeight="600"
        letterSpacing="0.5"
        fill="currentColor"
      >
        WM
      </text>
    </svg>
  );
}
