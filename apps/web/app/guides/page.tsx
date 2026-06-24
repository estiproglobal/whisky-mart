import type { Metadata } from "next";
import { content, readingMinutes } from "@/lib/content/repository";
import { ArticleCard } from "@/components/content/article-card";

export const metadata: Metadata = {
  title: "Guides, reviews & whisky education",
  description:
    "Buying guides, tasting education and stories from the WhiskyMart team — learn more, choose with confidence.",
};

export default async function GuidesPage() {
  const articles = await content.list();
  return (
    <>
      <div className="border-b border-whisky-100 bg-white">
        <div className="container-page py-8">
          <h1 className="font-display text-3xl text-charcoal">Guides & Academy</h1>
          <p className="mt-2 max-w-2xl text-charcoal/60">
            Buying guides, tasting know-how and stories — everything you need to choose and enjoy whisky
            with confidence.
          </p>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} minutes={readingMinutes(article)} />
          ))}
        </div>
      </div>
    </>
  );
}
