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
    <article className="bg-parchment text-ink">
      <div className="container-page py-10">
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: article.title, path: `/guides/${article.slug}` },
        ])}
      />

      <nav aria-label="Breadcrumb" className="mb-6 font-sans text-label-sm text-ink/55">
        <Link href="/" className="transition-opacity hover:opacity-75">Home</Link>
        <span className="px-2">/</span>
        <Link href="/guides" className="transition-opacity hover:opacity-75">Guides</Link>
        <span className="px-2">/</span>
        <span className="text-ink/75">{article.title}</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <p className="font-sans text-label-sm text-copper-deep">
          {article.type === "guide" ? "Buying guide" : article.type === "education" ? "How to drink better" : "From the journal"}
        </p>
        <h1 className="mt-4 font-display text-d1 text-ink">{article.title}</h1>
        <p className="mt-4 font-sans text-label-sm text-ink/60">
          {article.author} ·{" "}
          {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}{" "}
          · {readingMinutes(article)} min read · {referenced.length} whiskies featured
        </p>

        <div className="mt-8">
          <ContentBlocks blocks={article.body} productsById={productsById} />
        </div>

        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-display text-d2 text-ink">Featured whiskies</h2>
            <span aria-hidden="true" className="pour-line" />
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-12">
          <Link href="/guides" className="font-sans text-label text-copper-deep underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75">
            All guides
          </Link>
        </div>
      </div>
      </div>
    </article>
  );
}
