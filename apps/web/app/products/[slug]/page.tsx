import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { catalog, getPrimaryVariant } from "@/lib/catalog/repository";
import { formatAge, formatMoney } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";
import { StarRating } from "@/components/star-rating";
import { FlavourBars } from "@/components/flavour-bars";
import { Badge } from "@/components/badge";
import { ProductCard } from "@/components/product-card";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { RecentlyViewedRail, RecentlyViewedTracker } from "@/components/recently-viewed";

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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-whisky-50 px-4 py-3">
      <dt className="text-xs uppercase tracking-wide text-charcoal/50">{label}</dt>
      <dd className="mt-0.5 font-medium text-charcoal">{value}</dd>
    </div>
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
  const w = product.whisky;

  return (
    <div className="container-page py-8">
      <RecentlyViewedTracker productId={product.id} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-charcoal/50">
        <Link href="/" className="hover:text-whisky-700">Home</Link>
        <span className="px-2">/</span>
        <Link href="/shop" className="hover:text-whisky-700">Whisky</Link>
        <span className="px-2">/</span>
        <span className="text-charcoal/70">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <ProductImage
            image={product.image}
            label={product.brand.name}
            className="aspect-[4/5] w-full rounded-2xl"
          />
        </div>

        {/* Buy box */}
        <div>
          <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-whisky-700">
            <Link href={`/c/${w?.region ?? ""}`} className="hover:underline">
              {product.brand.name}
            </Link>
          </div>
          <h1 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">{product.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {product.ratingCount > 0 ? <StarRating value={product.ratingAvg} count={product.ratingCount} /> : null}
            {product.badges.map((b) => (
              <Badge key={b} kind={b} />
            ))}
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-3xl text-charcoal">{formatMoney(variant.price)}</span>
            {variant.memberPrice ? (
              <span className="pb-1 text-sm text-whisky-700">
                Members {formatMoney(variant.memberPrice)}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-charcoal/50">{variant.sizeMl ? `${variant.sizeMl}cl bottle · ` : ""}
            {variant.inStock ? "In stock" : "Out of stock"}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton
              productId={product.id}
              variantId={variant.id}
              className="min-w-44"
            />
            <WishlistButton productId={product.id} variant="button" />
          </div>

          {sampleVariant ? (
            <div className="mt-4 rounded-xl border border-dashed border-whisky-300 p-4">
              <p className="text-sm font-medium text-charcoal">Not sure yet?</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-sm text-charcoal/60">
                  Try a 3cl sample for {formatMoney(sampleVariant.price)}
                </span>
                <AddToCartButton
                  productId={product.id}
                  variantId={sampleVariant.id}
                  label="Add sample"
                  className="shrink-0"
                />
              </div>
            </div>
          ) : null}

          <p className="mt-6 text-charcoal/80">{product.description}</p>

          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-whisky-700 hover:text-whisky-900"
          >
            <PlusCircle className="h-4 w-4" /> Add to my WhiskyVault
          </button>

          {/* Key facts */}
          {w ? (
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Fact label="Region" value={w.region.charAt(0).toUpperCase() + w.region.slice(1)} />
              <Fact label="Age" value={formatAge(w.ageYears)} />
              <Fact label="ABV" value={`${w.abv}%`} />
              {w.caskType.length ? <Fact label="Cask" value={w.caskType.join(", ")} /> : null}
              {w.peatPpm ? <Fact label="Peat" value={`${w.peatPpm} ppm`} /> : null}
              <Fact label="Bottler" value={product.bottlerType === "IB" ? "Independent" : "Official"} />
            </dl>
          ) : null}
        </div>
      </div>

      {/* Flavour profile */}
      {product.flavour ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl text-charcoal">Flavour profile</h2>
          <div className="mt-5 max-w-3xl rounded-2xl bg-white p-6 shadow-card">
            <FlavourBars flavour={product.flavour} />
          </div>
        </section>
      ) : null}

      {/* Tasting notes */}
      {product.tastingNote ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl text-charcoal">Tasting notes</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {(["nose", "palate", "finish"] as const).map((key) => (
              <div key={key} className="rounded-2xl bg-white p-6 shadow-card">
                <h3 className="font-display text-lg capitalize text-whisky-700">{key}</h3>
                <p className="mt-2 text-sm text-charcoal/70">{product.tastingNote![key]}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Related */}
      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl text-charcoal">If you like this…</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      <RecentlyViewedRail allProducts={allProducts} excludeId={product.id} />
    </div>
  );
}
