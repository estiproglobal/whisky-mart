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
        eyebrow="Personalisation"
        title="Find your palate"
        intro="Tell us what you enjoy and we'll tailor recommendations to your taste — across the site and with the Sommelier."
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
