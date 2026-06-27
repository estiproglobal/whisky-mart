import Link from "next/link";
import { ArrowRight, Sparkles, Gift } from "lucide-react";
import { catalog, getPrimaryVariant } from "@/lib/catalog/repository";
import { content, readingMinutes } from "@/lib/content/repository";
import { ProductCard } from "@/components/product-card";
import { RecommendedRail } from "@/components/personalization/recommended-rail";
import { ArticleCard } from "@/components/content/article-card";
import { LuxurySection } from "@/components/ui/luxury-section";
import { EditorialCard } from "@/components/ui/editorial-card";
import { TrustBar } from "@/components/ui/trust-bar";
import { HeroBottle } from "@/components/hero-bottle";
import { buttonClasses } from "@/components/ui/button";

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">{children}</div>;
}

export default async function HomePage() {
  const all = await catalog.getAll();
  const newLimited = all.filter((p) => p.badges.includes("new") || p.badges.includes("limited"));
  const bestsellers = all.filter((p) => p.badges.includes("bestseller"));
  const topRated = [...all].sort((a, b) => b.ratingAvg - a.ratingAvg).slice(0, 4);
  const under50 = all
    .filter((p) => p.type !== "accessory" && getPrimaryVariant(p).price.amount <= 5000)
    .slice(0, 4);
  const flights = all.filter((p) => p.type === "sample");
  const articles = await content.featured(3);

  return (
    <>
      {/* Hero */}
      <section className="texture-grain edge-sheen relative overflow-hidden bg-ink bg-cask-glow text-cream">
        <div className="container-page relative grid items-center gap-8 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:py-20 xl:py-24">
          {/* Editorial text block */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <p className="overline text-gold-light">The private cask room</p>
            </div>
            <h1 className="mt-6 text-balance font-display tracking-tightest text-[2.6rem] leading-[1.04] sm:text-[3.4rem] sm:leading-[1.0] lg:text-[3.9rem] lg:leading-[0.98]">
              <span className="block">The world&apos;s whisky</span>
              <span className="block">cabinet, curated for you.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cream/65 sm:text-base">
              Discover, buy, learn, collect and invest — a hand-curated catalogue of single malts,
              rare bottlings and tasting flights, with a private Sommelier to guide every choice.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/sommelier" className={buttonClasses("accent", "lg")}>
                <Sparkles className="h-4 w-4" /> Consult the Sommelier
              </Link>
              <Link
                href="/shop"
                className={buttonClasses("outline", "lg", "border-cream/25 text-cream hover:border-cream hover:bg-cream/10 hover:text-cream")}
              >
                Browse the catalogue <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-9 border-t border-cream/12 pt-6">
              <TrustBar tone="dark" max={3} />
            </div>
          </div>

          {/* Premium bottle visual */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <HeroBottle />
          </div>
        </div>
      </section>

      {/* House credo — a quiet editorial pause */}
      <section className="border-b border-line bg-cream">
        <div className="container-page py-16 text-center sm:py-20">
          <div className="flex justify-center">
            <span className="rule-gold" />
          </div>
          <p className="mx-auto mt-7 max-w-3xl font-display text-[1.6rem] leading-[1.4] text-charcoal/85 sm:text-[2rem]">
            We keep a small, deliberate cellar — every bottle chosen for its character, its
            provenance, and the moment it was made for.
          </p>
          <p className="overline mt-7 text-whisky-700">The WhiskyMart house</p>
        </div>
      </section>

      {/* The Cabinet — best sellers */}
      <LuxurySection
        eyebrow="The Cabinet"
        title="What our members are pouring"
        viewAllHref="/c/bestsellers"
      >
        <Grid>
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Grid>
      </LuxurySection>

      {/* New & limited */}
      <div className="bg-parchment/50">
        <LuxurySection
          eyebrow="Fresh from the shelf"
          title="New &amp; limited releases"
          viewAllHref="/shop?sort=newest"
        >
          <Grid>
            {newLimited.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Grid>
        </LuxurySection>
      </div>

      {/* Editorial brand band */}
      <section className="texture-grain edge-sheen relative overflow-hidden bg-oak bg-cask-glow-soft text-cream">
        <div className="container-page relative py-20 sm:py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <p className="overline text-gold-light">More than a shop</p>
            </div>
            <h2 className="mt-5 font-display text-[2.5rem] leading-[1.04] tracking-tightest sm:text-[3.25rem]">
              Buy the bottle. Learn the story. Build the cellar.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <EditorialCard
              index="01"
              eyebrow="Discover"
              title="Guided by taste"
              body="Tell us a bottle you loved or a flavour you crave — the Sommelier narrows the shelf to whiskies matched to your palate."
              href="/sommelier"
              cta="Meet the Sommelier"
            />
            <EditorialCard
              index="02"
              eyebrow="Collect"
              title="Provenance & rare releases"
              body="Limited bottlings, age statements and cask detail — chosen for character and kept honest, ready for the collector marketplace to come."
              href="/c/bestsellers"
              cta="Browse the cabinet"
            />
            <EditorialCard
              index="03"
              eyebrow="Belong"
              title="Tasting notes & guides"
              body="Expert guides, structured tasting notes and a taste profile that follows you — the beginnings of a membership-led whisky club."
              href="/guides"
              cta="Read the guides"
            />
          </div>
        </div>
      </section>

      {/* Premium service cards — Sommelier & Gift Finder */}
      <section className="container-page py-14 sm:py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="texture-grain edge-sheen relative flex flex-col overflow-hidden rounded-lg border border-gold/25 bg-ink bg-cask-glow-soft p-9 text-cream sm:p-11">
            <Sparkles className="h-6 w-6 text-gold-light" strokeWidth={1.5} />
            <p className="overline mt-6 text-gold-light">Private concierge</p>
            <h3 className="mt-4 font-display text-[2rem] leading-tight">Ask the Sommelier</h3>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-cream/65">
              Find a bottle for a dinner, a gift, or your next cabinet slot. Describe the moment — we&apos;ll
              recommend, with reasons.
            </p>
            <Link href="/sommelier" className={buttonClasses("accent", "md", "mt-8 self-start")}>
              Begin a consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-col rounded-lg border border-line bg-ivory p-9 sm:p-11">
            <Gift className="h-6 w-6 text-whisky-700" strokeWidth={1.5} />
            <p className="overline mt-6 text-whisky-700">The art of gifting</p>
            <h3 className="mt-4 font-display text-[2rem] leading-tight text-charcoal">Gift Finder</h3>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-charcoal/60">
              Occasion, budget, taste. We&apos;ll narrow the shelf to a handful of bottles they&apos;ll
              remember — beautifully presented.
            </p>
            <Link href="/gift-finder" className={buttonClasses("outline", "md", "mt-8 self-start")}>
              Find a gift <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recommended for your palate */}
      <RecommendedRail fallback={topRated} />

      {/* Under £50 + Tasting flights */}
      <div className="bg-parchment/50">
        <LuxurySection
          eyebrow="Expertly chosen"
          title="Under £50, beautifully judged"
          intro="Exceptional drams that prove restraint and value can share a glass."
          viewAllHref="/c/under-50"
        >
          <Grid>
            {under50.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Grid>
        </LuxurySection>
      </div>

      {flights.length > 0 ? (
        <LuxurySection
          eyebrow="Try before the bottle"
          title="Tasting flights"
          intro="Low-risk 3cl samples — discover what you love before committing to a full bottle."
          viewAllHref="/c/samples"
        >
          <Grid>
            {flights.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Grid>
        </LuxurySection>
      ) : null}

      {/* Guides & stories */}
      <div className="bg-parchment/50">
        <LuxurySection eyebrow="The journal" title="Guides &amp; stories" viewAllHref="/guides">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} minutes={readingMinutes(article)} />
            ))}
          </div>
        </LuxurySection>
      </div>
    </>
  );
}
