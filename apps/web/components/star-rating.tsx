import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  const rounded = Math.round(value);
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn("h-4 w-4", i < rounded ? "fill-gold text-gold" : "text-whisky-200")}
          />
        ))}
      </div>
      <span className="text-sm text-charcoal/70">
        <span className="sr-only">Rated </span>
        {value.toFixed(1)}
        {count !== undefined ? ` (${count})` : ""}
      </span>
    </div>
  );
}
