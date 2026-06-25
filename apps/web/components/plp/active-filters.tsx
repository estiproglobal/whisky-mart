"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

const KEYS = ["region", "flavour", "brand"] as const;

const titleCase = (s: string) =>
  s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const chips: Array<{ key: string; value: string; label: string }> = [];
  for (const key of KEYS) {
    const raw = searchParams.get(key);
    if (raw) {
      for (const value of raw.split(",").filter(Boolean)) {
        chips.push({ key, value, label: titleCase(value) });
      }
    }
  }
  const q = searchParams.get("q");
  if (q) chips.push({ key: "q", value: q, label: `“${q}”` });

  if (chips.length === 0) return null;

  function remove(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "q") {
      params.delete("q");
    } else {
      const next = (params.get(key) ?? "").split(",").filter((v) => v && v !== value);
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);
    }
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={`${chip.key}:${chip.value}`}
          onClick={() => remove(chip.key, chip.value)}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-ivory px-3 py-1 text-[12px] font-medium text-charcoal/80 transition-colors hover:border-charcoal/30 hover:text-charcoal"
        >
          {chip.label}
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
    </div>
  );
}
