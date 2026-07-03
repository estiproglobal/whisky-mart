"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "./brand/wordmark";
import { InstantSearch } from "./search/instant-search";
import { CartIndicator } from "./cart/cart-indicator";
import { WishlistIndicator } from "./wishlist/wishlist-indicator";
import { CurrencySwitcher } from "./market/currency-switcher";
import { LocaleSwitcher } from "./i18n/locale-switcher";
import { useT } from "./i18n/locale-provider";

const NAV: Array<{ key: string; href: string }> = [
  { key: "nav.whisky", href: "/shop" },
  { key: "nav.islay", href: "/c/islay" },
  { key: "nav.speyside", href: "/c/speyside" },
  { key: "nav.bestSellers", href: "/c/bestsellers" },
  { key: "nav.samples", href: "/c/samples" },
  { key: "nav.guides", href: "/guides" },
  { key: "nav.giftFinder", href: "/gift-finder" },
];

export function SiteHeader() {
  const { t } = useT();
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line-dark bg-ground/95 backdrop-blur">
      {/* Main row */}
      <div className="container-page flex h-[4.25rem] items-center gap-4">
        <Link href="/" aria-label="WhiskyMart home" className="shrink-0">
          <Wordmark surface="dark" className="h-10 lg:h-[3.25rem]" />
        </Link>

        <InstantSearch className="relative ml-6 hidden max-w-xl flex-1 md:block" />

        <nav aria-label="Account" className="ml-auto flex items-center gap-0.5">
          <WishlistIndicator />
          <Link
            href="/account"
            className="inline-flex h-10 w-10 items-center justify-center rounded text-cream transition-opacity hover:opacity-75"
            aria-label={t("header.account")}
          >
            <User className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </Link>
          <CartIndicator />
        </nav>
      </div>

      {/* Primary nav + switchers */}
      <div className="container-page flex h-11 items-center justify-between gap-6">
        <nav aria-label="Primary" className="flex items-center gap-7 overflow-x-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap font-sans text-label transition-opacity",
                  active ? "text-copper" : "text-cream-muted hover:text-cream",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <LocaleSwitcher />
          <CurrencySwitcher />
        </div>
      </div>

      {/* Mobile search */}
      <div className="container-page pb-2.5 md:hidden">
        <InstantSearch className="relative" />
      </div>
    </header>
  );
}
