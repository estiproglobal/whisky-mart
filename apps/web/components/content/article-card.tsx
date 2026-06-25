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
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-ivory transition-colors duration-300 hover:border-charcoal/30"
    >
      <div
        className="relative flex aspect-[16/10] items-end overflow-hidden p-5"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cask-glow-soft opacity-60"
        />
        <span className="relative overline text-gold-light">{TYPE_LABEL[article.type]}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <h3 className="font-display text-[1.4rem] leading-tight text-charcoal transition-colors group-hover:text-whisky-800">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-charcoal/55">{article.excerpt}</p>
        <p className="mt-auto pt-2 text-[10.5px] uppercase tracking-[0.14em] text-smoke">
          {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          {" · "}
          {minutes} min read
        </p>
      </div>
    </Link>
  );
}
