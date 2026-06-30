import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlusCircle, ShieldCheck, Truck, Undo2 } from "lucide-react";
import { catalog, getPrimaryVariant } from "@/lib/catalog/repository";
import { formatAge, formatVolume } from "@/lib/utils";
import { describeFlavour } from "@/lib/catalog/flavour";
import { Price } from "@/components/market/price";
import { ProductImage, toneFor } from "@/components/product-image";
import { StarRating } from "@/components/star-rating";
import { FlavourBars } from "@/components/flavour-bars";
import { Badge } from "@/components/badge";
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-ivory px-4 py-3">
      <dt className="text-[11px] uppercase tracking-wider text-smoke">{label}</dt>
      <dd className="mt-0.5 font-medium text-charcoal">{value}</dd>
    </div>
  );
}

/** A label/value row for the dossier-style cask & maturation panel. */
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/70 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-smoke">{label}</dt>
      <dd className="text-right text-sm font-medium text-charcoal">{value}</dd>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-12">
      <p className="overline text-whisky-700">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl text-charcoal">{title}</h2>
      {intro ? <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-charcoal/60">{intro}</p> : null}
      <div className="mt-5">{children}</div>
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

  // Dossier rows — built from whatever structured data the product carries.
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

  // Curated recommendation lead-in, derived only from this product's own data.
  const relatedIntro = product.flavour
    ? `If you like ${describeFlavour(product.flavour, 2)}${w ? ` ${regionLabel}` : ""} whisky, start here.`
    : "More from the cabinet you might enjoy.";

  return (
    <div className="container-page py-8">
      <JsonLd data={productJsonLd(product)} />
      <RecentlyViewedTracker productId={product.id} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-charcoal/50">
        <Link href="/" className="hover:text-whisky-700">Home</Link>
        <span className="px-2">/</span>
        <Link href="/shop" className="hover:text-whisky-700">Whisky</Link>
        {w ? (
          <>
            <span className="px-2">/</span>
            <Link href={`/c/${w.region}`} className="capitalize hover:text-whisky-700">{regionLabel}</Link>
          </>
        ) : null}
        <span className="px-2">/</span>
        <span className="text-charcoal/70">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Gallery */}
        <div>
          <div className="mx-auto w-full max-w-[460px]">
            <div className="relative">
              <ProductImage
                image={product.image}
                tone={toneFor(product.whisky, product.flavour)}
                label={product.brand.name}
                className="aspect-[4/5] w-full rounded-xl border border-line shadow-card"
              />
              {product.flavour ? (
                <span className="absolute left-4 top-4 rounded-[3px] border border-gold/30 bg-ink/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-light backdrop-blur">
                  {describeFlavour(product.flavour, 2)}
                </span>
              ) : null}
            </div>
            {volume || w ? (
              <p className="mt-4 text-center text-[11px] uppercase tracking-[0.18em] text-charcoal/45">
                {[volume, w ? `${w.abv}% ABV` : "", w ? formatAge(w.ageYears) : ""]
                  .filter(Boolean)
                  .join("  ·  ")}
              </p>
            ) : null}
          </div>
        </div>

        {/* Buy panel (sticky) */}
        <div className="lg:sticky lg:top-40 lg:self-start">
          <Link
            href={`/c/${w?.region ?? ""}`}
            className="overline text-whisky-700 hover:text-whisky-900"
          >
            {product.brand.name}
          </Link>
          <h1 className="mt-3 font-display text-4xl leading-tight text-charcoal">{product.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            {product.ratingCount > 0 ? (
              <span className="inline-flex items-center gap-2">
                <StarRating value={product.ratingAvg} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
                  House rating
                </span>
              </span>
            ) : null}
            {product.badges.map((b) => (
              <Badge key={b} kind={b} />
            ))}
          </div>

          <div className="mt-6 flex items-end gap-3">
            <Price className="font-display text-4xl text-charcoal" money={variant.price} />
            {variant.memberPrice ? (
              <span className="pb-1.5 text-sm text-whisky-700">
                Members <Price money={variant.memberPrice} />
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 text-sm text-charcoal/55">
            {volume ? `${volume} · ` : ""}
            {w ? `${w.abv}% ABV · ` : ""}
            {variant.inStock ? "In stock" : "Out of stock"}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton productId={product.id} variantId={variant.id} className="min-w-44" />
            <WishlistButton productId={product.id} variant="button" />
          </div>

          {sampleVariant ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-dashed border-gold/40 p-4">
              <span className="text-sm text-charcoal/60">
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

          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-whisky-700 hover:text-whisky-900"
          >
            <PlusCircle className="h-4 w-4" /> Add to my WhiskyVault
          </button>

          {/* Delivery & compliance */}
          <div className="mt-6 space-y-2 rounded-xl border border-line bg-parchment/40 p-4 text-sm text-charcoal/70">
            <p className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-whisky-700" />
              Age-verified delivery — an adult signature (18+) is required.
            </p>
            <p className="flex items-start gap-2">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-whisky-700" />
              Dispatched in 1–2 working days · tracked &amp; carefully packed.
            </p>
          </div>

          {/* Key facts — at-a-glance; full dossier sits below */}
          {w ? (
            <dl className="mt-6 grid grid-cols-3 gap-3">
              <Fact label="Region" value={regionLabel} />
              <Fact label="Age" value={formatAge(w.ageYears)} />
              <Fact label="ABV" value={`${w.abv}%`} />
            </dl>
          ) : null}
        </div>
      </div>

      <div className="mt-12">
        {/* Tasting profile */}
        {product.flavour || product.tastingNote ? (
          <Section
            eyebrow="On the palate"
            title="Tasting profile"
            intro={
              product.flavour
                ? `A ${describeFlavour(product.flavour, 3)} character — here's how the notes stack up.`
                : undefined
            }
          >
            {product.flavour ? (
              <div className="max-w-3xl rounded-2xl border border-line bg-ivory p-6 sm:p-8">
                <FlavourBars flavour={product.flavour} />
              </div>
            ) : null}
            {product.tastingNote ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {(["nose", "palate", "finish"] as const).map((key) => (
                  <div key={key} className="rounded-2xl border border-line bg-ivory p-6">
                    <p className="overline text-whisky-700">The {key}</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-charcoal/75">
                      {product.tastingNote![key]}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </Section>
        ) : null}

        {/* Cask & maturation — collector dossier */}
        {specRows.length > 0 ? (
          <Section eyebrow="Wood & time" title="Cask & maturation">
            <div className="max-w-3xl rounded-2xl border border-line bg-ivory p-6 sm:p-8">
              <dl className="grid gap-x-12 sm:grid-cols-2">
                {specRows.map((row) => (
                  <SpecRow key={row.label} label={row.label} value={row.value} />
                ))}
              </dl>
            </div>
          </Section>
        ) : null}

        {/* Distillery story */}
        <Section eyebrow="Provenance" title={product.distillery?.name ?? product.brand.name}>
          <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
            <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-charcoal/75">
              {product.story ? <p>{product.story}</p> : null}
              <p>{product.description}</p>
            </div>
            {product.distillery ? (
              <aside className="h-fit rounded-2xl border border-line bg-parchment/30 p-6">
                <p className="overline text-whisky-700">The distillery</p>
                <p className="mt-2 font-display text-2xl text-charcoal">{product.distillery.name}</p>
                <dl className="mt-4 space-y-2.5 text-sm">
                  {product.distillery.foundedYear ? (
                    <div className="flex justify-between gap-3">
                      <dt className="text-charcoal/50">Established</dt>
                      <dd className="font-medium text-charcoal">{product.distillery.foundedYear}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-3">
                    <dt className="text-charcoal/50">Region</dt>
                    <dd className="font-medium capitalize text-charcoal">{regionLabel || "—"}</dd>
                  </div>
                  {product.bottlerType !== "NA" ? (
                    <div className="flex justify-between gap-3">
                      <dt className="text-charcoal/50">Bottling</dt>
                      <dd className="font-medium text-charcoal">
                        {product.bottlerType === "IB" ? "Independent" : "Official"}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </aside>
            ) : null}
          </div>
        </Section>

        {/* Delivery, age verification & returns */}
        <Section eyebrow="Buying with confidence" title="Delivery, age verification & returns">
          <div className="grid max-w-4xl gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-ivory p-6">
              <Truck className="h-5 w-5 text-whisky-700" />
              <h3 className="mt-3 font-display text-lg text-charcoal">Tracked delivery</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal/65">
                Dispatched in 1–2 working days, carefully packed and fully tracked.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-ivory p-6">
              <ShieldCheck className="h-5 w-5 text-whisky-700" />
              <h3 className="mt-3 font-display text-lg text-charcoal">Age verified</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal/65">
                We verify age at checkout, and an adult signature (18+) is required on delivery.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-ivory p-6">
              <Undo2 className="h-5 w-5 text-whisky-700" />
              <h3 className="mt-3 font-display text-lg text-charcoal">Returns</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal/65">
                Unopened bottles can be returned within 14 days, in line with our policy.
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* Customer reviews */}
      <ProductReviews productId={product.id} />

      {/* Recommendations */}
      {related.length > 0 ? (
        <section className="mt-14">
          <p className="overline text-whisky-700">You may also like</p>
          <h2 className="mt-2 font-display text-[1.75rem] tracking-tightest text-charcoal">
            Similar bottles from the cabinet
          </h2>
          <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-charcoal/60">{relatedIntro}</p>
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
          <p className="overline text-whisky-700">From the journal</p>
          <h2 className="mt-2 font-display text-[1.75rem] tracking-tightest text-charcoal">Read before you buy</h2>
          <ul className="mt-6 space-y-3">
            {articles.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/guides/${a.slug}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-line bg-ivory p-5 transition-colors hover:border-charcoal/30"
                >
                  <span>
                    <span className="block font-display text-xl text-charcoal">{a.title}</span>
                    <span className="block text-sm text-charcoal/55">{a.excerpt}</span>
                  </span>
                  <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-whisky-700">
                    {readingMinutes(a)} min →
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
