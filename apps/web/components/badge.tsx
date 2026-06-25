import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  new: "New",
  limited: "Limited",
  award: "Award winner",
  bestseller: "Best seller",
  exclusive: "Exclusive",
};

const STYLES: Record<string, string> = {
  new: "border-whisky-300/60 bg-cream/85 text-whisky-800 backdrop-blur",
  limited: "border-gold/45 bg-ink/85 text-gold-light backdrop-blur",
  award: "border-whisky-600/40 bg-cream/85 text-whisky-800 backdrop-blur",
  bestseller: "border-charcoal/15 bg-cream/85 text-charcoal/80 backdrop-blur",
  exclusive: "border-gold/50 bg-ink/90 text-gold-light backdrop-blur",
};

export function Badge({ kind, className }: { kind: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] border px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.16em]",
        STYLES[kind] ?? "border-whisky-300/60 bg-cream/85 text-whisky-800 backdrop-blur",
        className,
      )}
    >
      {LABELS[kind] ?? kind}
    </span>
  );
}
