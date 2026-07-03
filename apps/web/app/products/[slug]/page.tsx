import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog, getPrimaryVariant } from "@/lib/catalog/repository";
import { formatAge, formatVolume } from "@/lib/utils";
import { describeFlavour } from "@/lib/catalog/flavour";
import { Price } from "@/components/market/price";
import { ProductImage, toneFor, formatFor } from "@/components/product-image";
import { StarRating } from "@/components/star-rating";
import { FlavourBars } from "@/components/flavour-bars";
import { LabelPlate } from "@/components/ui/label-plate";
import { ProductCard } from "@/components/product-card";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { RecentlyViewedRail, RecentlyViewedTracker } from "@/components/recently-viewed";
import { ProductReviews } from "@/components/reviews/product-reviews";
import { content, readingMinutes } from "@/lib/content/repository";
import { JsonLd } from "@/components/json-ld";
import { productJsonLd } from "@/lib/seo/structured-data";

export async function generateStaticParams() {
  const products = await catalog.getAll();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await catalog.getBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.title,
    description: product.description,
    openGraph: { title: product.title, description: product.description },
  };
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A label/value row for the dossier-style cask & maturation panel. */
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line-dark py-3">
      <dt className="font-sans text-label-sm text-cream-muted">{label}</dt>
      <dd className="text-right font-sans text-body-sm font-medium text-cream">{value}</dd>
    </div>
  );
}

function Section({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line-dark py-12">
      <h2 className="font-display text-d2 text-cream">{title}</h2>
      <span aria-hidden="true" className="pour-line" />
      {intro ? <p className="mt-4 max-w-2xl text-body-sm text-cream-muted">{intro}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await catalog.getBySlug(slug);
  if (!product) notFound();

  const variant = getPrimaryVariant(product);
  const sampleVariant = product.variants.find((v) => v.sizeMl > 0 && v.sizeMl <= 30);
  const related = await catalog.getRelated(slug);
  const allProducts = await catalog.getAll();
  const articles = await content.byProduct(product.id);
  const w = product.whisky;
  const regionLabel = w ? titleCase(w.region) : "";
  const volume = formatVolume(variant.sizeMl);

  // Dossier rows: built from whatever structured data the product carries.
  const specRows: Array<{ label: string; value: string }> = w
    ? [
        { label: "Region", value: regionLabel },
        { label: "Age", value: formatAge(w.ageYears) },
        { label: "ABV", value: `${w.abv}%` },
        ...(w.caskType.length ? [{ label: "Cask", value: w.caskType.join(", ") }] : []),
        { label: "Peat", value: w.peatPpm ? `${w.peatPpm} ppm phenols` : "Unpeated" },
        ...(w.chillFiltered !== undefined
          ? [{ label: "Chill-filtered", value: w.chillFiltered ? "Yes" : "No" }]
          : []),
        ...(w.naturalColour !== undefined
          ? [{ label: "Natural colour", value: w.naturalColour ? "Yes" : "No" }]
          : []),
        ...(product.bottlerType !== "NA"
          ? [{ label: "Bottling", value: product.bottlerType === "IB" ? "Independent" : "Official" }]
          : []),
        ...(w.limitedEdition ? [{ label: "Limited edition", value: "Yes" }] : []),
        ...(w.outturn ? [{ label: "Outturn", value: `${w.outturn.toLocaleString()} bottles` }] : []),
      ]
    : [];

  // Recommendation lead-in, derived only from this product's own data.
  const relatedIntro = product.flavour
    ? `If you like ${describeFlavour(product.flavour, 2)}${w ? ` ${regionLabel}` : ""} whisky, start here.`
    : "More from the shelf you might enjoy.";

  return (
    <div className="container-page py-8">
      <JsonLd data={productJsonLd(product)} />
      <RecentlyViewedTracker productId={product.id} />
      <nav aria-label="Breadcrumb" className="mb-6 font-sans text-label-sm text-cream-muted">
        <Link href="/" className="transition-opacity hover:opacity-75">Home</Link>
        <span className="px-2">/</span>
        <Link href="/shop" className="transition-opacity hover:opacity-75">Whisky</Link>
        {w ? (
          <>
            <span className="px-2">/</span>
            <Link href={`/c/${w.region}`} className="capitalize transition-opacity hover:opacity-75">{regionLabel}</Link>
          </>
        ) : null}
        <span className="px-2">/</span>
        <span className="text-cream/80">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Gallery */}
        <div>
          <div className="mx-auto w-full max-w-[460px]">
            <ProductImage
              image={product.image}
              tone={toneFor(product.whisky, product.flavour)}
              format={formatFor(product)}
              className="aspect-[4/5] w-full rounded border border-line-dark"
            />
            {volume || w ? (
              <p className="mt-4 text-center font-sans text-label-sm text-cream-muted">
                {[volume, w ? `${w.abv}% ABV` : "", w ? formatAge(w.ageYears) : ""]
                  .filter(Boolean)
                  .join("  ·  ")}
              </p>
            ) : null}
          </div>
        </div>

        {/* Buy panel (sticky) */}
        <div className="lg:sticky lg:top-36 lg:self-start">
          <h1 className="font-display text-d2 text-cream">{product.title}</h1>

          <LabelPlate product={product} variant="pdp" className="mt-5" />

          {product.ratingCount > 0 ? (
            <p className="mt-4 inline-flex items-center gap-2">
              <StarRating value={product.ratingAvg} />
              <span className="font-sans text-label-sm text-cream-muted">House rating</span>
            </p>
          ) : null}

          <div className="mt-5 flex items-end gap-3">
            <Price className="font-display text-d2 text-cream" money={variant.price} />
            {variant.memberPrice ? (
              <span className="pb-1.5 font-sans text-body-sm text-copper">
                Members <Price money={variant.memberPrice} />
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 font-sans text-body-sm text-cream-muted">
            {volume ? `${volume} · ` : ""}
            {variant.inStock ? "In stock" : "Out of stock"}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton productId={product.id} variantId={variant.id} className="min-w-44" />
            <WishlistButton productId={product.id} variant="button" />
          </div>

          {sampleVariant ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded border border-dashed border-copper/40 p-4">
              <span className="text-body-sm text-cream-muted">
                Not sure yet? Try a {formatVolume(sampleVariant.sizeMl)} sample for{" "}
                <Price money={sampleVariant.price} />
              </span>
              <AddToCartButton
                productId={product.id}
                variantId={sampleVariant.id}
                label="Add sample"
                className="shrink-0"
              />
            </div>
          ) : null}

          {/* Delivery & compliance */}
          <div className="mt-6 space-y-2 rounded border border-line-dark bg-surface p-4 text-body-sm text-cream-muted">
            <p>Age-verified delivery: an adult signature (18+) is required.</p>
            <p>Dispatched in 1–2 working days, tracked and carefully packed.</p>
            <p>Unopened bottles can be returned within 14 days.</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        {/* Tasting profile */}
        {product.flavour || product.tastingNote ? (
          <Section
            title="Tasting profile"
            intro={
              product.flavour
                ? `A ${describeFlavour(product.flavour, 3)} character. Here is how the notes stack up.`
                : undefined
            }
          >
            {product.flavour ? (
              <div className="max-w-3xl rounded border border-line-dark bg-surface p-6 sm:p-8">
                <FlavourBars flavour={product.flavour} />
              </div>
            ) : null}
            {product.tastingNote ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {(["nose", "palate", "finish"] as const).map((key) => (
                  <div key={key} className="rounded border border-line-dark bg-surface p-6">
                    <h3 className="font-display text-d3 text-cream">The {key}</h3>
                    <p className="mt-3 text-body-sm text-cream-muted">
                      {product.tastingNote![key]}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </Section>
        ) : null}

        {/* Cask & maturation: collector dossier */}
        {specRows.length > 0 ? (
          <Section title="Cask & maturation">
            <div className="max-w-3xl rounded border border-line-dark bg-surface p-6 sm:p-8">
              <dl className="grid gap-x-12 sm:grid-cols-2">
                {specRows.map((row) => (
                  <SpecRow key={row.label} label={row.label} value={row.value} />
                ))}
              </dl>
            </div>
          </Section>
        ) : null}

        {/* Distillery story */}
        <Section title={product.distillery?.name ?? product.brand.name}>
          <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
            <div className="max-w-2xl space-y-4 text-body text-cream/85">
              {product.story ? <p>{product.story}</p> : null}
              <p>{product.description}</p>
            </div>
            {product.distillery ? (
              <aside className="h-fit rounded border border-line-dark bg-surface p-6">
                <p className="font-display text-d3 text-cream">{product.distillery.name}</p>
                <dl className="mt-4 space-y-2.5 font-sans text-body-sm">
                  {product.distillery.foundedYear ? (
                    <div className="flex justify-between gap-3">
                      <dt className="text-cream-muted">Established</dt>
                      <dd className="font-medium text-cream">{product.distillery.foundedYear}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-3">
                    <dt className="text-cream-muted">Region</dt>
                    <dd className="font-medium capitalize text-cream">{regionLabel || "N/A"}</dd>
                  </div>
                  {product.bottlerType !== "NA" ? (
                    <div className="flex justify-between gap-3">
                      <dt className="text-cream-muted">Bottling</dt>
                      <dd className="font-medium text-cream">
                        {product.bottlerType === "IB" ? "Independent" : "Official"}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </aside>
            ) : null}
          </div>
        </Section>
      </div>

      {/* Customer reviews */}
      <ProductReviews productId={product.id} />

      {/* Recommendations */}
      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-d2 text-cream">Similar bottles from the shelf</h2>
          <span aria-hidden="true" className="pour-line" />
          <p className="mt-4 max-w-2xl text-body-sm text-cream-muted">{relatedIntro}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Featured guides */}
      {articles.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-d2 text-cream">Read before you buy</h2>
          <span aria-hidden="true" className="pour-line" />
          <ul className="mt-6 space-y-3">
            {articles.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/guides/${a.slug}`}
                  className="flex items-center justify-between gap-4 rounded border border-line-dark bg-surface p-5 transition-opacity hover:opacity-85"
                >
                  <span>
                    <span className="block font-display text-d3 text-cream">{a.title}</span>
                    <span className="mt-1 block text-body-sm text-cream-muted">{a.excerpt}</span>
                  </span>
                  <span className="shrink-0 font-sans text-label-sm text-copper">
                    {readingMinutes(a)} min read
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <RecentlyViewedRail allProducts={allProducts} excludeId={product.id} />
    </div>
  );
}
