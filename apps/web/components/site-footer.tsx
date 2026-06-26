"use client";

import Link from "next/link";
import { Wordmark } from "./brand/wordmark";
import { TrustBar } from "./ui/trust-bar";
import { useT } from "./i18n/locale-provider";

const COLUMNS: Array<{ titleKey?: string; title?: string; links: Array<{ label: string; href: string }> }> = [
  {
    titleKey: "footer.shop",
    links: [
      { label: "All whisky", href: "/shop" },
      { label: "Best sellers", href: "/c/bestsellers" },
      { label: "Samples & flights", href: "/c/samples" },
      { label: "Gift Finder", href: "/gift-finder" },
    ],
  },
  {
    titleKey: "footer.explore",
    links: [
      { label: "Islay", href: "/c/islay" },
      { label: "Speyside", href: "/c/speyside" },
      { label: "Highland", href: "/c/highland" },
      { label: "Guides", href: "/guides" },
    ],
  },
  {
    title: "WhiskyMart",
    links: [
      { label: "About", href: "/about" },
      { label: "Help & delivery", href: "/help" },
      { label: "Account", href: "/account" },
      { label: "Sell with us", href: "/sell" },
    ],
  },
];

export function SiteFooter() {
  const { t } = useT();
  return (
    <footer className="texture-grain edge-sheen relative mt-24 overflow-hidden bg-ink text-cream/80">
      <div className="container-page relative grid grid-cols-2 gap-10 py-20 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Wordmark surface="dark" className="h-12" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/50">{t("footer.tagline")}</p>
        </div>
        {COLUMNS.map((col) => {
          const heading = col.titleKey ? t(col.titleKey) : col.title!;
          return (
            <nav key={heading} aria-label={heading}>
              <h2 className="overline text-gold-light">{heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-cream/65 transition-colors hover:text-cream">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
      </div>

      {/* Responsible drinking — kept clearly legible, not hidden */}
      <div className="border-t border-cream/10">
        <div className="container-page relative py-7">
          <TrustBar tone="dark" />
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-page relative flex flex-col gap-2 py-6 text-sm text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WhiskyMart.com · {t("footer.responsibly")}</p>
          <p className="font-medium text-cream/70">{t("footer.ageNotice")}</p>
        </div>
      </div>
    </footer>
  );
}
