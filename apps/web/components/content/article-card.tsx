import Link from "next/link";
import type { Article } from "@whiskymart/types";

// Muted, cohesive warm surfaces (no vivid gradients).
const SURFACES: Array<[string, string]> = [
  ["#2A1A12", "#3A2415"],
  ["#15110D", "#2A1A12"],
  ["#3A2415", "#6B431C"],
  ["#241710", "#4A1717"],
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
  const [from, to] = SURFACES[hash(article.heroSeed) % SURFACES.length]!;
  return (
    <Link
      href={`/guides/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/20 bg-ivory transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
    >
      <div
        className="relative flex aspect-[16/10] items-end p-5"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <span className="overline text-gold-light">{TYPE_LABEL[article.type]}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <h3 className="font-display text-xl leading-snug text-charcoal transition-colors group-hover:text-whisky-700">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-charcoal/60">{article.excerpt}</p>
        <p className="mt-auto pt-2 text-xs uppercase tracking-wider text-smoke">
          {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          {" · "}
          {minutes} min read
        </p>
      </div>
    </Link>
  );
}
