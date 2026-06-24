"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductSort } from "@whiskymart/types";

const OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "age", label: "Oldest first" },
  { value: "newest", label: "Newest" },
];

export function SortSelect({ value }: { value: ProductSort }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-charcoal/70">
      Sort
      <select
        value={value}
        onChange={onChange}
        className="h-9 rounded-lg border border-whisky-200 bg-white px-2 text-sm text-charcoal focus:border-whisky-500 focus:outline-none"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
