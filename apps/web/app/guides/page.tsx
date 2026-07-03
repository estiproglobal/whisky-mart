import type { Metadata } from "next";
import { content, readingMinutes } from "@/lib/content/repository";
import { ArticleCard } from "@/components/content/article-card";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "The journal: guides & whisky education",
  description: "Buying guides and tasting know-how, written the way we talk in the shop.",
};

export default async function GuidesPage() {
  const articles = await content.list();
  return (
    <>
      <PageHero
        title="The journal"
        photoId="cork"
        intro="Guides written the way we talk in the shop. Read one before you spend real money."
      />

      <div className="border-t border-line-light bg-parchment">
        <div className="container-page py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} minutes={readingMinutes(article)} />
          ))}
        </div>
        </div>
      </div>
    </>
  );
}
