import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  new: "New",
  limited: "Limited",
  award: "Award winner",
  bestseller: "Best seller",
  exclusive: "Exclusive",
};

const STYLES: Record<string, string> = {
  new: "bg-cream/90 text-whisky-800 ring-1 ring-whisky-200 backdrop-blur",
  limited: "bg-ink/90 text-gold-light backdrop-blur",
  award: "bg-whisky-700 text-cream",
  bestseller: "bg-ink text-cream",
  exclusive: "bg-gold text-ink",
};

export function Badge({ kind, className }: { kind: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
        STYLES[kind] ?? "bg-cream/90 text-whisky-800 ring-1 ring-whisky-200",
        className,
      )}
    >
      {LABELS[kind] ?? kind}
    </span>
  );
}
