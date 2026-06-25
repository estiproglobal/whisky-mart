import { Monogram } from "@/components/brand/monogram";

/**
 * PageHero — a dark, immersive editorial header for listing/content pages
 * (PLP, category, guides, search, taste). Warm cask glow + faint monogram.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="texture-grain relative overflow-hidden bg-ink bg-cask-glow-soft text-cream">
      <div
        className="pointer-events-none absolute -right-16 -top-10 hidden opacity-[0.05] lg:block"
        aria-hidden="true"
      >
        <Monogram className="h-72 w-72 text-cream" />
      </div>
      <div className="container-page relative py-14 sm:py-16">
        {eyebrow ? (
          <div className="flex items-center gap-3">
            <span className="rule-gold" />
            <p className="overline text-gold-light">{eyebrow}</p>
          </div>
        ) : null}
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-tightest sm:text-5xl">
          {title}
        </h1>
        {intro ? <p className="mt-4 max-w-2xl text-cream/70">{intro}</p> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
