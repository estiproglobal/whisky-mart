import { ShieldCheck, Sparkles, Stamp, Library } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, text: "Age-verified delivery" },
  { icon: Sparkles, text: "Hand-curated bottles" },
  { icon: Stamp, text: "Provenance-first" },
  { icon: Library, text: "Collector-ready" },
];

/**
 * TrustBar — a restrained micro-trust row. `tone="dark"` for use on the hero /
 * ink surfaces; default light for in-page use.
 */
export function TrustBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ul
      className={`flex flex-wrap items-center gap-x-8 gap-y-3 ${dark ? "text-cream/75" : "text-charcoal/70"}`}
    >
      {ITEMS.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-2.5 text-sm">
          <Icon className={`h-4 w-4 shrink-0 ${dark ? "text-gold-light" : "text-whisky-700"}`} />
          <span className="tracking-wide">{text}</span>
        </li>
      ))}
    </ul>
  );
}
