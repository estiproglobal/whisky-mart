import Link from "next/link";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Shop",
    links: [
      { label: "All whisky", href: "/shop" },
      { label: "Best sellers", href: "/c/bestsellers" },
      { label: "Samples & flights", href: "/c/samples" },
      { label: "Gifts", href: "/c/gifts" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Islay", href: "/c/islay" },
      { label: "Speyside", href: "/c/speyside" },
      { label: "Highland", href: "/c/highland" },
      { label: "Japan", href: "/c/japan" },
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
  return (
    <footer className="mt-16 border-t border-whisky-100 bg-white">
      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-display text-2xl font-semibold text-whisky-700">WhiskyMart</p>
          <p className="mt-2 max-w-xs text-sm text-charcoal/60">
            The world&apos;s most trusted place to discover, buy, collect and invest in whisky.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold text-charcoal">{col.title}</h2>
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
        ))}
      </div>
      <div className="border-t border-whisky-100">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-charcoal/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WhiskyMart.com. Please drink responsibly.</p>
          <p>You must be 18 or over to purchase alcohol.</p>
        </div>
      </div>
    </footer>
  );
}
