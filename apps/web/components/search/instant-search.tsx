"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import * as React from "react";
import { ProductImage } from "@/components/product-image";
import { Price } from "@/components/market/price";

interface Suggestion {
  id: string;
  title: string;
  slug: string;
  brand: string;
  region: string | null;
  price: { amount: number; currency: string };
  imageSeed: string;
  imageAlt: string;
}

export function InstantSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [items, setItems] = React.useState<Suggestion[]>([]);
  const [total, setTotal] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Debounced fetch against the search API.
  React.useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as { items: Suggestion[]; total: number };
        setItems(data.items);
        setTotal(data.total);
        setActive(-1);
      } catch {
        /* aborted or failed — leave previous results */
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [value]);

  // Close on outside click.
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function goToSearch() {
    const q = value.trim();
    setOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/shop");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = items[active];
      if (chosen) {
        setOpen(false);
        router.push(`/products/${chosen.slug}`);
      } else {
        goToSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown = open && value.trim().length >= 2;

  return (
    <div ref={rootRef} className={className}>
      <form role="search" onSubmit={(e) => { e.preventDefault(); goToSearch(); }} className="relative">
        <label htmlFor="instant-search" className="sr-only">
          Search whisky
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-whisky-200 bg-white px-3 focus-within:border-whisky-500">
          <Search className="h-4 w-4 text-charcoal/40" aria-hidden="true" />
          <input
            id="instant-search"
            type="search"
            autoComplete="off"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search whisky, region, flavour…"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="instant-search-results"
            aria-autocomplete="list"
            className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-charcoal/40"
          />
          {loading ? <Loader2 className="h-4 w-4 animate-spin text-charcoal/30" aria-hidden="true" /> : null}
        </div>

        {showDropdown ? (
          <div
            id="instant-search-results"
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-whisky-100 bg-white shadow-card"
          >
            {items.length === 0 && !loading ? (
              <p className="px-4 py-6 text-center text-sm text-charcoal/50">
                No matches for “{value.trim()}”.
              </p>
            ) : (
              <ul className="max-h-96 overflow-auto py-1">
                {items.map((item, i) => (
                  <li key={item.id} role="option" aria-selected={i === active}>
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-3 px-3 py-2 ${i === active ? "bg-whisky-50" : ""}`}
                    >
                      <ProductImage
                        image={{ seed: item.imageSeed, alt: item.imageAlt }}
                        className="h-12 w-10 shrink-0 rounded-md"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-charcoal">
                          {item.title}
                        </span>
                        <span className="block truncate text-xs text-charcoal/50">
                          {item.brand}
                          {item.region ? ` · ${item.region}` : ""}
                        </span>
                      </span>
                      <Price className="shrink-0 text-sm font-medium text-charcoal" money={item.price} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {total > 0 ? (
              <button
                type="button"
                onClick={goToSearch}
                className="block w-full border-t border-whisky-100 bg-whisky-50/50 px-4 py-2.5 text-center text-sm font-medium text-whisky-700 hover:bg-whisky-50"
              >
                View all {total} result{total === 1 ? "" : "s"}
              </button>
            ) : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}
