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
      { label: "The plan", href: "/vision" },
      { label: "Delivery", href: "/help" },
      { label: "Account", href: "/account" },
    ],
  },
];

export function SiteFooter() {
  const { t } = useT();
  return (
    <footer className="mt-24 border-t border-line-dark bg-ground text-cream">
      <div className="container-page grid grid-cols-2 gap-10 py-16 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Wordmark surface="dark" className="h-12" />
          <p className="mt-5 max-w-xs text-body-sm text-cream-muted">{t("footer.tagline")}</p>
        </div>
        {COLUMNS.map((col) => {
          const heading = col.titleKey ? t(col.titleKey) : col.title!;
          return (
            <nav key={heading} aria-label={heading}>
              <h2 className="font-sans text-label text-cream">{heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-label text-cream-muted transition-opacity hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
      </div>

      {/* Responsible drinking: kept clearly legible, not hidden */}
      <div className="border-t border-line-dark">
        <div className="container-page flex flex-col gap-2 py-6 font-sans text-label text-cream-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WhiskyMart.com · {t("footer.responsibly")}</p>
          <p className="text-cream/80">{t("footer.ageNotice")}</p>
        </div>
      </div>

      {/* Colophon */}
      <div className="border-t border-line-dark">
        <div className="container-page py-5">
          <p className="font-sans text-label-sm text-cream/45">{t("footer.colophon")}</p>
        </div>
      </div>
    </footer>
  );
}
