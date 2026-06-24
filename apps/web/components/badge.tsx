import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  new: "New",
  limited: "Limited",
  award: "Award winner",
  bestseller: "Best seller",
  exclusive: "Exclusive",
};

const STYLES: Record<string, string> = {
  new: "bg-whisky-100 text-whisky-800",
  limited: "bg-gold/20 text-whisky-900",
  award: "bg-whisky-600 text-cream",
  bestseller: "bg-charcoal text-cream",
  exclusive: "bg-gold text-charcoal",
};

export function Badge({ kind, className }: { kind: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STYLES[kind] ?? "bg-whisky-100 text-whisky-800",
        className,
      )}
    >
      {LABELS[kind] ?? kind}
    </span>
  );
}
