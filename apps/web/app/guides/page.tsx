import type { Metadata } from "next";
import { content, readingMinutes } from "@/lib/content/repository";
import { ArticleCard } from "@/components/content/article-card";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Guides, reviews & whisky education",
  description:
    "Buying guides, tasting education and stories from the WhiskyMart team — learn more, choose with confidence.",
};

export default async function GuidesPage() {
  const articles = await content.list();
  return (
    <>
      <PageHero
        eyebrow="The journal"
        title="Guides & Academy"
        intro="Buying guides, tasting know-how and stories — everything you need to choose and enjoy whisky with confidence."
      />

      <div className="container-page py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} minutes={readingMinutes(article)} />
          ))}
        </div>
      </div>
    </>
  );
}
