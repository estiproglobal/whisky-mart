import Link from "next/link";
import { content, readingMinutes } from "@/lib/content/repository";
import { getFeaturedProduct, getShelf, getExchangeProduct } from "@/lib/home";
import { getPhoto } from "@/lib/photo";
import { formatVolume } from "@/lib/utils";
import { getPrimaryVariant } from "@/lib/catalog/repository";
import { ProductCard } from "@/components/product-card";
import { ProductImage, toneFor, formatFor } from "@/components/product-image";
import { ArticleCard } from "@/components/content/article-card";
import { LabelPlate } from "@/components/ui/label-plate";
import { Photo } from "@/components/ui/photo";
import { Price } from "@/components/market/price";
import { buttonClasses } from "@/components/ui/button";

export default async function HomePage() {
  const featured = await getFeaturedProduct();
  const shelf = await getShelf(6);
  const exchange = await getExchangeProduct();
  const articles = await content.featured(3);
  const hero = getPhoto("hero-dram");

  return (
    <>
      {/* Act one: the hero. Full-bleed photograph, dark scrim, one CTA and
          one text link. The photo settles on load; nothing else on the site
          moves. */}
      <section className="relative overflow-hidden bg-ground">
        {hero ? (
          <>
            <Photo
              src={hero.src}
              alt={hero.alt}
              fill
              priority
              sizes="100vw"
              className="hero-settle-image absolute inset-0"
            />
            {/* Scrim rising from the lower left so the headline reads over a
                bright photo. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(52deg, rgba(23,18,16,0.92) 18%, rgba(23,18,16,0.55) 48%, rgba(23,18,16,0.12) 78%)" }}
            />
          </>
        ) : (
          /* Lit stand-in until the photography lands (scripts/fetch-photos.mjs):
             an intentional cask-room panel, plus a gentle lower scrim so the
             headline keeps AA contrast without the near-black emptiness. */
          <>
            <span aria-hidden="true" className="atmosphere-fallback hero-settle-image absolute inset-0" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(15deg, rgba(20,15,10,0.72) 6%, rgba(20,15,10,0.28) 40%, transparent 66%)" }}
            />
          </>
        )}

        <div className="container-page relative flex min-h-[72vh] items-end pb-16 pt-24 sm:pb-20">
          <div className="hero-settle-text max-w-2xl">
            <h1 className="font-display text-d1 text-cream">Bottles we&apos;d buy ourselves.</h1>
            <p className="mt-5 max-w-lg text-body text-cream/85">
              A short shelf of single malts, chosen slowly and described honestly. If you&apos;re not
              sure where to start, the Sommelier has opinions.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link href="/shop" className={buttonClasses("primary", "lg")}>
                Browse the shelf
              </Link>
              <Link
                href="/sommelier"
                className="font-sans text-label text-cream underline decoration-copper decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
              >
                Ask the Sommelier
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Act two: the featured bottle, told as a story. */}
      {featured ? (
        <section className="border-t border-line-dark">
          <div className="container-page grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="relative aspect-[4/5] max-h-[540px] overflow-hidden rounded border border-line-dark">
              <ProductImage
                image={featured.image}
                tone={toneFor(featured.whisky, featured.flavour)}
                format={formatFor(featured)}
                className="h-full w-full"
              />
            </div>
            <div className="max-w-xl">
              <h2 className="font-display text-d2 text-cream">This month, {featured.title}</h2>
              <span aria-hidden="true" className="pour-line" />
              <p className="mt-6 text-body text-cream/85">
                Sixteen years in oak on Islay&apos;s south shore, a few hundred metres from the
                Atlantic. The smoke is thick but unhurried, and under it sits a sweetness of dried
                fig and old leather that most peated whisky never finds. This is the bottle we hand
                to people who claim they don&apos;t like peat. They tend to come back for it,
                usually within the month.
              </p>
              <LabelPlate product={featured} variant="featured" className="mt-8 max-w-sm" />
              <div className="mt-8 flex flex-wrap items-center gap-6 font-sans">
                <span className="text-body text-cream">
                  <Price money={getPrimaryVariant(featured).price} />
                  <span className="ml-2 text-label-sm text-cream-muted">
                    {formatVolume(getPrimaryVariant(featured).sizeMl)}
                  </span>
                </span>
                <Link href={`/products/${featured.slug}`} className={buttonClasses("primary", "md")}>
                  View the bottle
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Act three: the shelf. One rail, six bottles, nothing repeated. */}
      <section className="border-t border-line-dark">
        <div className="container-page py-16 sm:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="font-display text-d2 text-cream">On the shelf this month</h2>
              <span aria-hidden="true" className="pour-line" />
            </div>
            <Link
              href="/shop"
              className="font-sans text-label text-copper underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
            >
              Browse all whisky
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {shelf.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Act four: the Sommelier, with a real worked exchange. */}
      <section className="bg-parchment text-ink">
        <div className="container-page py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <h2 className="font-display text-d2">Ask the Sommelier</h2>
              <span aria-hidden="true" className="pour-line" />
              <p className="mt-6 text-body text-ink/80">
                Tell it a bottle you liked, a budget, or the person you&apos;re buying for. It
                answers from our own shelf, with reasons, and nothing it can&apos;t actually sell
                you.
              </p>
              <Link href="/sommelier" className={buttonClasses("ink", "md", "mt-8")}>
                Ask the Sommelier
              </Link>
            </div>

            <div aria-label="An example exchange with the Sommelier">
              <p className="ml-auto max-w-[85%] rounded border border-line-light bg-ink px-4 py-3 text-body-sm text-parchment sm:max-w-[70%]">
                Something smoky but not a punch in the face, under £60.
              </p>
              <div className="mt-4 max-w-[92%] rounded border border-line-light bg-parchment px-4 py-3">
                <p className="text-body-sm text-ink/85">
                  Then skip Islay for a night and go north. Talisker 10 has the smoke you&apos;re
                  after, rounded with black pepper and a salty edge rather than tar, and it sits
                  well inside your budget.
                </p>
                {exchange ? (
                  <Link
                    href={`/products/${exchange.slug}`}
                    className="group mt-4 flex items-center gap-4 rounded border border-line-light bg-parchment p-3"
                  >
                    <ProductImage
                      image={exchange.image}
                      tone={toneFor(exchange.whisky, exchange.flavour)}
                      format={formatFor(exchange)}
                      className="h-24 w-20 shrink-0 rounded"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-d3 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                        {exchange.title}
                      </span>
                      <span className="mt-1 block font-sans text-label-sm capitalize text-ink/60">
                        {exchange.whisky?.region} · {exchange.whisky?.abv}% ABV
                      </span>
                    </span>
                    <Price
                      className="shrink-0 font-sans text-body-sm font-medium text-ink"
                      money={getPrimaryVariant(exchange).price}
                    />
                  </Link>
                ) : null}
              </div>
              <p className="mt-6 text-body-sm text-ink/70">
                Buying for someone else?{" "}
                <Link
                  href="/gift-finder"
                  className="font-sans text-label text-copper-deep underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
                >
                  Try the Gift Finder
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Act five: the journal. */}
      <section className="border-t border-line-light bg-parchment text-ink">
        <div className="container-page py-16 sm:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="font-display text-d2">The journal</h2>
              <span aria-hidden="true" className="pour-line" />
              <p className="mt-4 max-w-xl text-body-sm text-ink/70">
                Guides written the way we talk in the shop.
              </p>
            </div>
            <Link
              href="/guides"
              className="font-sans text-label text-copper-deep underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
            >
              Read all guides
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} minutes={readingMinutes(article)} />
            ))}
          </div>
        </div>
      </section>

      {/* Act six: the road ahead. A quiet beat before the footer. */}
      <section className="bg-ground">
        <div className="container-page flex flex-col items-start gap-4 py-16 sm:flex-row sm:items-baseline sm:justify-between sm:py-20">
          <p className="font-display text-d3 text-cream">The shop is chapter one.</p>
          <Link
            href="/vision"
            className="font-sans text-label text-copper underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
          >
            Read the plan for WhiskyMart
          </Link>
        </div>
      </section>
    </>
  );
}
