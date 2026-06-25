import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Award, Gift } from "lucide-react";
import { catalog } from "@/lib/catalog/repository";
import { content, readingMinutes } from "@/lib/content/repository";
import { ProductRail } from "@/components/product-rail";
import { RecentlyViewedRail } from "@/components/recently-viewed";
import { RecommendedRail } from "@/components/personalization/recommended-rail";
import { ArticleCard } from "@/components/content/article-card";
import { buttonClasses } from "@/components/ui/button";

const SHORTCUTS: Array<{ label: string; href: string }> = [
  { label: "Beginner", href: "/c/beginners" },
  { label: "Under £50", href: "/c/under-50" },
  { label: "Peated", href: "/c/peated" },
  { label: "Best sellers", href: "/c/bestsellers" },
  { label: "Samples", href: "/c/samples" },
  { label: "Taste quiz", href: "/taste" },
  { label: "Gift Finder", href: "/gift-finder" },
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
  const topRated = [...all].sort((a, b) => b.ratingAvg - a.ratingAvg).slice(0, 4);
  const articles = await content.featured(3);

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

      <RecommendedRail fallback={topRated} />
      <ProductRail title="New & limited" products={newLimited} viewAllHref="/shop?sort=newest" />
      <ProductRail title="Best sellers" products={bestsellers} viewAllHref="/c/bestsellers" />
      <RecentlyViewedRail allProducts={all} />

      {/* AI tools */}
      <section className="container-page grid gap-6 py-12 sm:grid-cols-2">
        <div className="flex flex-col rounded-2xl bg-whisky-50 p-8">
          <Sparkles className="h-7 w-7 text-whisky-600" />
          <h2 className="mt-3 font-display text-2xl text-charcoal">Ask the Sommelier</h2>
          <p className="mt-2 flex-1 text-charcoal/70">
            Describe a whisky you enjoyed, a flavour or a budget — get confident recommendations grounded
            in our range.
          </p>
          <Link href="/sommelier" className={buttonClasses("primary", "md", "mt-5 self-start")}>
            Ask the Sommelier <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex flex-col rounded-2xl bg-charcoal p-8 text-cream">
          <Gift className="h-7 w-7 text-gold" />
          <h2 className="mt-3 font-display text-2xl">Gift Finder</h2>
          <p className="mt-2 flex-1 text-cream/70">
            Three quick questions — occasion, budget, taste — and we&apos;ll find the perfect whisky gift.
          </p>
          <Link
            href="/gift-finder"
            className={buttonClasses("outline", "md", "mt-5 self-start border-cream text-cream hover:bg-cream/10")}
          >
            Find a gift <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Guides & stories */}
      <section className="container-page py-10">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl text-charcoal sm:text-3xl">Guides &amp; stories</h2>
          <Link
            href="/guides"
            className="inline-flex items-center gap-1 text-sm font-medium text-whisky-700 hover:text-whisky-900"
          >
            All guides <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} minutes={readingMinutes(article)} />
          ))}
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
