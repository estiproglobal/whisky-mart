import type { Metadata } from "next";
import { catalog } from "@/lib/catalog/repository";
import { PalateQuiz } from "@/components/personalization/palate-quiz";
import { RecommendedRail } from "@/components/personalization/recommended-rail";

export const metadata: Metadata = {
  title: "Find your palate",
  description: "Answer a few quick questions and we'll recommend whisky matched to your taste.",
};

export default async function TastePage() {
  const all = await catalog.getAll();
  const fallback = all.filter((p) => p.badges.includes("bestseller")).slice(0, 4);

  return (
    <>
      <div className="border-b border-whisky-100 bg-white">
        <div className="container-page py-8">
          <h1 className="font-display text-3xl text-charcoal">Find your palate</h1>
          <p className="mt-2 max-w-2xl text-charcoal/60">
            Tell us what you enjoy and we&apos;ll tailor recommendations to your taste — across the site and
            with the Sommelier.
          </p>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="mx-auto max-w-2xl">
          <PalateQuiz />
        </div>
      </div>

      <RecommendedRail fallback={fallback} />
    </>
  );
}
