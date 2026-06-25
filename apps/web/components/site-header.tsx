"use client";

import Link from "next/link";
import { User } from "lucide-react";
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
  return (
    <header className="sticky top-0 z-40">
      {/* Utility bar */}
      <div className="border-b border-gold/15 bg-parchment/90 backdrop-blur">
        <div className="container-page flex h-9 items-center justify-between text-xs text-charcoal/60">
          <p className="hidden tracking-wide sm:block">
            Age-verified delivery · Hand-curated since 2012
          </p>
          <div className="ml-auto flex items-center gap-1.5">
            <LocaleSwitcher />
            <CurrencySwitcher />
          </div>
        </div>
      </div>

      {/* Main row */}
      <div className="border-b border-gold/15 bg-cream/95 backdrop-blur">
        <div className="container-page flex h-16 items-center gap-4">
          <Link href="/" aria-label="WhiskyMart home" className="text-charcoal">
            <Wordmark />
          </Link>

          <InstantSearch className="relative ml-4 hidden max-w-xl flex-1 md:block" />

          <nav aria-label="Account" className="ml-auto flex items-center gap-0.5">
            <WishlistIndicator />
            <Link
              href="/account"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-charcoal hover:bg-parchment"
              aria-label={t("header.account")}
            >
              <User className="h-5 w-5" />
            </Link>
            <CartIndicator />
          </nav>
        </div>

        {/* Primary nav */}
        <div className="container-page flex h-12 items-center gap-7 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[13px] font-medium tracking-wide text-charcoal/75 transition-colors hover:text-whisky-700"
            >
              {t(item.key)}
            </Link>
          ))}
        </div>

        {/* Mobile search */}
        <div className="container-page pb-2.5 md:hidden">
          <InstantSearch className="relative" />
        </div>
      </div>
    </header>
  );
}
