import Link from "next/link";
import type { Article } from "@whiskymart/types";
import { getPhoto } from "@/lib/photo";
import { Photo } from "@/components/ui/photo";

/** Which atmosphere slot covers which article (by heroSeed). */
const COVER_SLOTS: Record<string, string> = {
  "guide-under-50": "shelf",
  "edu-taste": "tasting-table",
  "edu-islay": "islay-coast",
  "blog-japan": "pour",
};

/* Tonal fallbacks while the photography binaries are absent: quiet, near-dark
   surfaces (no vivid gradients). */
const FALLBACKS: Array<[string, string]> = [
  ["#241A13", "#1A130E"],
  ["#1F1712", "#15100C"],
  ["#281D14", "#1B140F"],
];

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const KICKER: Record<Article["type"], string> = {
  article: "From the journal",
  guide: "Buying guide",
  education: "How to drink better",
};

/**
 * A magazine-style cover card for the journal: cover photo (or tonal ground),
 * kicker, title, reading time. Sits on parchment surfaces.
 */
export function ArticleCard({ article, minutes }: { article: Article; minutes: number }) {
  const cover = getPhoto(COVER_SLOTS[article.heroSeed] ?? "casks");
  const [from, to] = FALLBACKS[hash(article.heroSeed) % FALLBACKS.length]!;

  return (
    <Link href={`/guides/${article.slug}`} className="group flex h-full flex-col overflow-hidden rounded border border-line-light bg-parchment text-ink">
      {cover ? (
        <Photo
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="aspect-[16/10] transition-opacity duration-300 group-hover:opacity-90"
        />
      ) : (
        <span
          aria-hidden="true"
          className="block aspect-[16/10] transition-opacity duration-300 group-hover:opacity-90"
          style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
        />
      )}
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <p className="font-sans text-label-sm text-copper-deep">{KICKER[article.type]}</p>
        <h3 className="font-display text-d3 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-body-sm text-ink/70">{article.excerpt}</p>
        <p className="mt-auto pt-2 font-sans text-label-sm text-ink/55">{minutes} min read</p>
      </div>
    </Link>
  );
}
