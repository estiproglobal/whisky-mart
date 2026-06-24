import Link from "next/link";
import type { Article } from "@whiskymart/types";

const GRADIENTS: Array<[string, string]> = [
  ["#3F2611", "#9A5C20"],
  ["#5E3717", "#C9A24B"],
  ["#1A1714", "#7B481B"],
  ["#7B481B", "#D08F3E"],
];

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const TYPE_LABEL: Record<Article["type"], string> = {
  article: "Journal",
  guide: "Buying guide",
  education: "Academy",
};

export function ArticleCard({ article, minutes }: { article: Article; minutes: number }) {
  const [from, to] = GRADIENTS[hash(article.heroSeed) % GRADIENTS.length]!;
  return (
    <Link
      href={`/guides/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-lg"
    >
      <div
        className="flex aspect-[16/9] items-end p-4"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <span className="rounded-full bg-cream/90 px-2.5 py-0.5 text-xs font-semibold text-whisky-800">
          {TYPE_LABEL[article.type]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg leading-snug text-charcoal group-hover:text-whisky-700">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-charcoal/60">{article.excerpt}</p>
        <p className="mt-auto pt-2 text-xs text-charcoal/40">
          {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          {" · "}
          {minutes} min read
        </p>
      </div>
    </Link>
  );
}
