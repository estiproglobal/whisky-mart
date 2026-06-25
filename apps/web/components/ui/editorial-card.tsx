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
      <div className="flex items-center justify-between">
        <p className="overline text-whisky-700">{eyebrow}</p>
        {index ? <span className="font-display text-2xl text-gold/70">{index}</span> : null}
      </div>
      <h3 className="mt-4 font-display text-2xl text-charcoal">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/65">{body}</p>
      {href && cta ? (
        <span className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-whisky-700">
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      ) : null}
    </>
  );

  const className =
    "flex h-full flex-col rounded-2xl border border-gold/25 bg-ivory p-7 transition-colors hover:border-gold/50";

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}
