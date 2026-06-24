import Link from "next/link";
import { Heart, User } from "lucide-react";
import { SearchBox } from "./search-box";
import { CartIndicator } from "./cart/cart-indicator";

const NAV: Array<{ label: string; href: string }> = [
  { label: "Whisky", href: "/shop" },
  { label: "Islay", href: "/c/islay" },
  { label: "Speyside", href: "/c/speyside" },
  { label: "Best sellers", href: "/c/bestsellers" },
  { label: "Samples", href: "/c/samples" },
  { label: "Gifts", href: "/c/gifts" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-whisky-100 bg-cream/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="font-display text-2xl font-semibold text-whisky-700">
          WhiskyMart
        </Link>

        <SearchBox className="ml-2 hidden flex-1 md:block" />

        <nav aria-label="Account" className="ml-auto flex items-center gap-1">
          <Link
            href="/account/wishlist"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-whisky-50"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5 text-charcoal" />
          </Link>
          <Link
            href="/account"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-whisky-50"
            aria-label="Account"
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
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="container-page py-2 md:hidden">
        <SearchBox />
      </div>
    </header>
  );
}
