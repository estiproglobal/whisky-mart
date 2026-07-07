import type { Metadata } from "next";
import Link from "next/link";
import { getPhoto } from "@/lib/photo";
import { Photo } from "@/components/ui/photo";

export const metadata: Metadata = {
  title: "The plan",
  description:
    "The five-chapter plan for WhiskyMart, written for anyone who wants to read it. Chapter one is live.",
};

/**
 * The buyer-visualization page (Increment 12B, Part 5): the five-phase
 * blueprint (docs/00, docs/01) rendered for a reader, not a repo. Future
 * chapters are framed honestly as roadmap; only chapter one is live.
 */
interface Chapter {
  kicker: string;
  title: string;
  status: "Live now" | "Planned";
  photoId: string;
  body: string[];
  moment: string;
}

const CHAPTERS: Chapter[] = [
  {
    kicker: "Chapter one",
    title: "The shop",
    status: "Live now",
    photoId: "shelf",
    body: [
      "The storefront around this page is chapter one, and it works today. A catalogue of fifty-odd real bottlings with honest descriptions, a checkout that handles age verification and jurisdiction rules, guides written like a person wrote them, and a Sommelier that recommends only what is actually on the shelf. Everything a specialist whisky shop needs is here in working order, with simulated payments standing in for live ones. The point of chapter one is not scale. It is proof: of the design, the voice and the machinery underneath both.",
    ],
    moment:
      "A first-time buyer asks the Sommelier for something smoky but gentle under £60, and leaves with a Talisker 10 they will actually finish.",
  },
  {
    kicker: "Chapter two",
    title: "Discovery",
    status: "Planned",
    photoId: "still",
    body: [
      "Chapter two turns the catalogue into a reference work. Every bottling gets a structured record: distillery, cask, phenol level, bottling history, and how it tastes on the same flavour axes the palate model already uses. Search stops being a text box and becomes a question you can ask sideways. Show me sherried malts under £80 that are not Speyside. What does Clynelish taste like next to Oban? The shop already stores its data in this shape, which is why this chapter compounds on the first instead of replacing it.",
    ],
    moment:
      "A drinker who loved an unfamiliar dram in a bar last night finds it here by flavour, not by spelling.",
  },
  {
    kicker: "Chapter three",
    title: "Community",
    status: "Planned",
    photoId: "tasting-table",
    body: [
      "Chapter three gives the regulars somewhere to stand. Membership brings a taste profile that follows you, member pricing on the shelf, bottle-share clubs and structured tasting notes that feed back into the discovery layer. Whisky is already social. Every serious drinker keeps a mental list of who to pour what for; the platform's job is to hold that list. Community is also the honest engine of retention, because people return to the places where their palate is known.",
    ],
    moment:
      "A tasting club splits a cask-strength Glenfarclas six ways, and everyone's notes land on the bottle's page.",
  },
  {
    kicker: "Chapter four",
    title: "The collectors' market",
    status: "Planned",
    photoId: "casks",
    body: [
      "Chapter four opens the second-hand shelf. Collectible whisky has a counterfeiting problem and a trust problem, which is exactly why a marketplace with verified provenance, held escrow and clean settlement can charge a commission for existing. Sellers list; the platform authenticates the bottle, holds the funds and ships under the same age-verified rules as the shop. The catalogue's collector tier, from Springbank to allocated Yamazaki, is already priced and described with this market in mind.",
    ],
    moment:
      "A collector lists a 1989 Springbank. Provenance verified, escrow held, 8% commission on £1,400.",
  },
  {
    kicker: "Chapter five",
    title: "The AI platform",
    status: "Planned",
    photoId: "pour",
    body: [
      "The last chapter is less a feature than a nervous system. The Sommelier grows from a grounded recommender into a palate model that learns from what you buy, taste and rate, then works the whole platform on your behalf: the shop, the reference layer, the community's notes and the collectors' market. It stays on a leash. It recommends only real bottles at real prices, and it never talks anyone into drinking more. Those guardrails are not aspiration; they ship in chapter one.",
    ],
    moment:
      "Your Sommelier flags that a bottle you loved is being discontinued, and that the market has two, both verified.",
  },
];

export default function VisionPage() {
  return (
    <article className="bg-parchment text-ink">
      <div className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-d1">The plan for WhiskyMart</h1>
          <span aria-hidden="true" className="mt-4 block h-px w-12 bg-copper" />
          <p className="mt-6 text-body text-ink/85">
            WhiskyMart is being built in chapters, and the shop you have just been in is the first.
            This page is the rest of the plan, written for anyone who wants to read it, in the
            order it will happen.
          </p>

          {CHAPTERS.map((chapter) => {
            const photo = getPhoto(chapter.photoId);
            return (
              <section key={chapter.kicker} className="mt-14 border-t border-line-light pt-12">
                {photo ? (
                  <Photo
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 42rem, 92vw"
                    className="mb-8 aspect-[16/9] rounded border border-line-light"
                  />
                ) : null}
                <p className="font-sans text-label-sm text-copper-deep">
                  {chapter.kicker} · {chapter.status}
                </p>
                <h2 className="mt-2 font-display text-d2">{chapter.title}</h2>
                {chapter.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="mt-5 text-body text-ink/85">
                    {paragraph}
                  </p>
                ))}
                <p className="mt-6 border-l-2 border-copper pl-5 text-body-sm text-ink/75">
                  {chapter.moment}
                </p>
              </section>
            );
          })}

          <section className="mt-14 border-t border-line-light pt-12">
            <h2 className="font-display text-d2">The foundation</h2>
            <p className="mt-5 text-body text-ink/85">
              A short factual note on what this is built on. The storefront is a composable build:
              payments, data, content, search and the AI advisor each sit behind an interface with
              a documented one-binding production swap, specified in the repository. Alcohol
              compliance for the UK, EU and US has been researched and encoded as a jurisdiction
              engine rather than left as a legal footnote. Chapters two to five are roadmap, not
              product. Chapter one you can use right now.
            </p>
            <p className="mt-8">
              <Link
                href="/shop"
                className="font-sans text-label text-copper-deep underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
              >
                Browse the shop: chapter one is live
              </Link>
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
