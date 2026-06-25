import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * EditorialCard — a quiet luxury card for the brand "Discover / Collect /
 * Belong" trio and similar editorial blocks. Restrained: parchment surface,
 * fine brass border, serif title.
 */
export function EditorialCard({
  index,
  eyebrow,
  title,
  body,
  href,
  cta,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  const inner = (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <p className="overline text-whisky-700">{eyebrow}</p>
        {index ? <span className="font-display text-3xl leading-none text-gold/45">{index}</span> : null}
      </div>
      <h3 className="mt-5 font-display text-[1.6rem] leading-tight text-charcoal">{title}</h3>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-charcoal/60">{body}</p>
      {href && cta ? (
        <span className="group/cta mt-6 inline-flex items-center gap-2 border-b border-whisky-700/30 pb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-whisky-800 transition-colors group-hover:border-whisky-700">
          {cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      ) : null}
    </>
  );

  const className =
    "group flex h-full flex-col rounded-lg border border-line bg-ivory p-7 transition-colors hover:border-charcoal/30";

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}
