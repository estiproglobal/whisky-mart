"use client";

import Link from "next/link";
import { Wordmark } from "./brand/wordmark";
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
    <footer className="mt-16 border-t border-whisky-100 bg-white">
      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Wordmark className="text-charcoal" />
          <p className="mt-3 max-w-xs text-sm text-charcoal/60">{t("footer.tagline")}</p>
        </div>
        {COLUMNS.map((col) => {
          const heading = col.titleKey ? t(col.titleKey) : col.title!;
          return (
            <nav key={heading} aria-label={heading}>
              <h2 className="text-sm font-semibold text-charcoal">{heading}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-charcoal/60 hover:text-whisky-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
      </div>
      <div className="border-t border-whisky-100">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-charcoal/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WhiskyMart.com. {t("footer.responsibly")}</p>
          <p>{t("footer.ageNotice")}</p>
        </div>
      </div>
    </footer>
  );
}
