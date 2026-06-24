"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import * as React from "react";

export function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <form role="search" onSubmit={onSubmit} className={className}>
      <label htmlFor="site-search" className="sr-only">
        Search whisky
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-whisky-200 bg-white px-3 focus-within:border-whisky-500">
        <Search className="h-4 w-4 text-charcoal/40" aria-hidden="true" />
        <input
          id="site-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search whisky, region, flavour…"
          className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-charcoal/40"
        />
      </div>
    </form>
  );
}
