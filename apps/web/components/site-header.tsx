"use client";

import Link from "next/link";
import { User } from "lucide-react";
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
  return (
    <header className="sticky top-0 z-40 border-b border-whisky-100 bg-cream/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="font-display text-2xl font-semibold text-whisky-700">
          WhiskyMart
        </Link>

        <InstantSearch className="relative ml-2 hidden flex-1 md:block" />

        <nav aria-label="Account" className="ml-auto flex items-center gap-1">
          <LocaleSwitcher />
          <CurrencySwitcher />
          <WishlistIndicator />
          <Link
            href="/account"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-whisky-50"
            aria-label={t("header.account")}
          >
            <User className="h-5 w-5 text-charcoal" />
          </Link>
          <CartIndicator />
        </nav>
      </div>

      <div className="border-t border-whisky-100">
        <div className="container-page flex h-11 items-center gap-6 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-charcoal/80 hover:text-whisky-700"
            >
              {t(item.key)}
            </Link>
          ))}
        </div>
      </div>

      <div className="container-page py-2 md:hidden">
        <InstantSearch className="relative" />
      </div>
    </header>
  );
}
