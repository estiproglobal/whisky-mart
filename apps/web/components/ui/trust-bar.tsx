import { ShieldCheck, Sparkles, Stamp, Library } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, text: "Age-verified delivery" },
  { icon: Sparkles, text: "Hand-curated bottles" },
  { icon: Stamp, text: "Provenance-first" },
  { icon: Library, text: "Collector-ready" },
];

/**
 * TrustBar — a restrained micro-trust row. `tone="dark"` for use on the hero /
 * ink surfaces; default light for in-page use. `max` caps how many signals show
 * (the hero shows three; the footer shows all).
 */
export function TrustBar({ tone = "light", max }: { tone?: "light" | "dark"; max?: number }) {
  const dark = tone === "dark";
  const items = max ? ITEMS.slice(0, max) : ITEMS;
  return (
    <ul
      className={`flex flex-wrap items-center gap-x-9 gap-y-3 ${dark ? "text-cream/70" : "text-charcoal/65"}`}
    >
      {items.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.14em]">
          <Icon className={`h-3.5 w-3.5 shrink-0 ${dark ? "text-gold-light" : "text-whisky-700"}`} />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
