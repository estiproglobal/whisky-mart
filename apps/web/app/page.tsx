import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Award } from "lucide-react";
import { catalog } from "@/lib/catalog/repository";
import { ProductRail } from "@/components/product-rail";
import { RecentlyViewedRail } from "@/components/recently-viewed";
import { buttonClasses } from "@/components/ui/button";

const SHORTCUTS: Array<{ label: string; href: string }> = [
  { label: "Beginner", href: "/c/beginners" },
  { label: "Under £50", href: "/c/under-50" },
  { label: "Peated", href: "/c/peated" },
  { label: "Best sellers", href: "/c/bestsellers" },
  { label: "Samples", href: "/c/samples" },
  { label: "Gifts", href: "/c/gifts" },
];

const TRUST: Array<{ icon: typeof Award; text: string }> = [
  { icon: ShieldCheck, text: "Authenticity guaranteed" },
  { icon: Truck, text: "Age-verified delivery" },
  { icon: Award, text: "Hand-picked by experts" },
  { icon: Sparkles, text: "AI Sommelier guidance" },
];

export default async function HomePage() {
  const all = await catalog.getAll();
  const newLimited = all.filter((p) => p.badges.includes("new") || p.badges.includes("limited"));
  const bestsellers = all.filter((p) => p.badges.includes("bestseller"));

  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal text-cream">
        <div className="container-page grid gap-8 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gold">Whisky, beautifully chosen</p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Find your next favourite whisky.
            </h1>
            <p className="mt-4 max-w-md text-cream/70">
              Thousands of bottles, expert tasting notes, low-risk samples, and an AI Sommelier that
              learns your palate. Whatever your relationship with whisky, we&apos;ll meet you there.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sommelier" className={buttonClasses("primary", "lg")}>
                <Sparkles className="h-4 w-4" /> Ask the Sommelier
              </Link>
              <Link
                href="/shop"
                className={buttonClasses("outline", "lg", "border-cream text-cream hover:bg-cream/10")}
              >
                Browse all whisky <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-whisky-600 to-whisky-800 p-8 shadow-card">
            <p className="font-display text-2xl">New here?</p>
            <p className="mt-2 text-cream/80">
              Start with a tasting flight — four 3cl samples to find what you love before committing
              to a bottle.
            </p>
            <Link
              href="/c/samples"
              className="mt-6 inline-flex items-center gap-1 font-medium text-gold hover:underline"
            >
              Explore samples & flights <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Intent shortcuts */}
      <section className="border-b border-whisky-100 bg-white">
        <div className="container-page flex flex-wrap gap-3 py-5">
          <span className="self-center text-sm font-medium text-charcoal/60">Shop by:</span>
          {SHORTCUTS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-full border border-whisky-200 px-4 py-1.5 text-sm font-medium text-charcoal/80 hover:border-whisky-500 hover:text-whisky-700"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </section>

      <ProductRail title="New & limited" products={newLimited} viewAllHref="/shop?sort=newest" />
      <ProductRail title="Best sellers" products={bestsellers} viewAllHref="/c/bestsellers" />
      <RecentlyViewedRail allProducts={all} />

      {/* Sommelier teaser */}
      <section className="container-page py-12">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-whisky-50 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl text-charcoal">Not sure where to start?</h2>
            <p className="mt-2 text-charcoal/70">
              Tell the WhiskyMart Sommelier what you like — a whisky you enjoyed, a budget, an
              occasion — and get confident, personalised recommendations grounded in our catalogue.
            </p>
          </div>
          <Link href="/sommelier" className={buttonClasses("primary", "lg")}>
            <Sparkles className="h-4 w-4" /> Ask the Sommelier
          </Link>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-whisky-100 bg-white">
        <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {TRUST.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon className="h-6 w-6 shrink-0 text-whisky-600" />
              <span className="text-sm font-medium text-charcoal/80">{text}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
