"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import type { ProductSearchResult } from "@whiskymart/types";
import { cn } from "@/lib/utils";

type FacetKey = "region" | "flavour" | "brand";

const GROUPS: Array<{ key: FacetKey; title: string }> = [
  { key: "region", title: "Region" },
  { key: "flavour", title: "Flavour" },
  { key: "brand", title: "Brand" },
];

export function FacetSidebar({ facets }: { facets: ProductSearchResult["facets"] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = (key: FacetKey): string[] => {
    const raw = searchParams.get(key);
    return raw ? raw.split(",").filter(Boolean) : [];
  };

  function toggle(key: FacetKey, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = selected(key);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    if (next.length) params.set(key, next.join(","));
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters = GROUPS.some((g) => selected(g.key).length > 0);

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    for (const g of GROUPS) params.delete(g.key);
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  return (
    <aside className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-label text-cream">Refine the shelf</h2>
        {hasFilters ? (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 font-sans text-label-sm text-copper transition-opacity hover:opacity-75"
          >
            <X className="h-3.5 w-3.5" /> Clear all
          </button>
        ) : null}
      </div>

      {GROUPS.map((group) => {
        const options = facets[group.key];
        if (options.length === 0) return null;
        const chosen = selected(group.key);
        return (
          <fieldset key={group.key} className="border-t border-line-dark pt-4">
            <legend className="mb-2.5 font-display text-d3 text-cream">{group.title}</legend>
            <ul className="space-y-1.5">
              {options.map((opt) => {
                const isChecked = chosen.includes(opt.value);
                return (
                  <li key={opt.value}>
                    <label className="flex cursor-pointer items-center gap-2.5 font-sans text-body-sm">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(group.key, opt.value)}
                        className="h-4 w-4 rounded border-line-dark bg-surface accent-[#C1763B]"
                      />
                      <span className={cn("flex-1", isChecked ? "text-cream" : "text-cream-muted")}>
                        {opt.label}
                      </span>
                      <span className="text-label-sm text-cream/45">{opt.count}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}
    </aside>
  );
}
