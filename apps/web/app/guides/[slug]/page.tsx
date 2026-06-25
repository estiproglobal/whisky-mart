import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Product } from "@whiskymart/types";
import { content, readingMinutes, referencedProductIds } from "@/lib/content/repository";
import { catalog } from "@/lib/catalog/repository";
import { ContentBlocks } from "@/components/content/content-blocks";
import { ProductCard } from "@/components/product-card";
import { JsonLd } from "@/components/json-ld";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";

export async function generateStaticParams() {
  const articles = await content.list();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await content.getBySlug(slug);
  if (!article) return { title: "Not found" };
  return {
    title: article.seo?.metaTitle ?? article.title,
    description: article.seo?.metaDescription ?? article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: "article" },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await content.getBySlug(slug);
  if (!article) notFound();

  const all = await catalog.getAll();
  const productsById: Record<string, Product> = Object.fromEntries(all.map((p) => [p.id, p]));
  const related = article.relatedProductIds
    .map((id) => productsById[id])
    .filter((p): p is Product => Boolean(p));

  // Touch referencedProductIds so embedded-only products are validated too.
  const referenced = referencedProductIds(article);

  return (
    <article className="container-page py-10">
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: article.title, path: `/guides/${article.slug}` },
        ])}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-charcoal/50">
        <Link href="/" className="hover:text-whisky-700">Home</Link>
        <span className="px-2">/</span>
        <Link href="/guides" className="hover:text-whisky-700">Guides</Link>
        <span className="px-2">/</span>
        <span className="text-charcoal/70">{article.title}</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="rule-gold" />
          <p className="overline text-whisky-700">
            {article.type === "guide" ? "Buying guide" : article.type === "education" ? "Academy" : "Journal"}
          </p>
        </div>
        <h1 className="mt-5 font-display text-[2.75rem] leading-[1.04] tracking-tightest text-charcoal">{article.title}</h1>
        <p className="mt-4 text-sm text-charcoal/55">
          {article.author} ·{" "}
          {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}{" "}
          · {readingMinutes(article)} min read · {referenced.length} whiskies featured
        </p>

        <div className="mt-8">
          <ContentBlocks blocks={article.body} productsById={productsById} />
        </div>

        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-display text-[1.75rem] tracking-tightest text-charcoal">Featured whiskies</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-12">
          <Link href="/guides" className="text-sm font-medium text-whisky-700 hover:text-whisky-900">
            ← All guides
          </Link>
        </div>
      </div>
    </article>
  );
}
