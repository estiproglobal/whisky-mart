import type { Metadata } from "next";
import { catalog } from "@/lib/catalog/repository";
import { PalateQuiz } from "@/components/personalization/palate-quiz";
import { RecommendedRail } from "@/components/personalization/recommended-rail";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Find your palate",
  description: "Answer a few quick questions and we'll recommend whisky matched to your taste.",
};

export default async function TastePage() {
  const all = await catalog.getAll();
  const fallback = all.filter((p) => p.badges.includes("bestseller")).slice(0, 4);

  return (
    <>
      <PageHero
        title="Find your palate"
        photoId="glass-pair"
        intro="Six quick questions. The answers shape what the shop and the Sommelier suggest to you."
      />

      <div className="container-page py-14 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <PalateQuiz />
        </div>
      </div>

      <RecommendedRail fallback={fallback} />
    </>
  );
}
