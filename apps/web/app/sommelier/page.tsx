import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "WhiskyMart Sommelier",
  description: "Your AI whisky advisor — personalised recommendations grounded in our catalogue.",
};

const EXAMPLES = [
  "I like Lagavulin but want something sweeter under £80",
  "A peated whisky for a beginner",
  "A gift for someone who loves Speyside",
  "What pairs with dark chocolate?",
];

export default function SommelierPage() {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-whisky-100 px-4 py-1.5 text-sm font-medium text-whisky-800">
          <Sparkles className="h-4 w-4" /> WhiskyMart Sommelier
        </span>
        <h1 className="mt-5 font-display text-4xl text-charcoal">Tell me what you love.</h1>
        <p className="mt-3 text-charcoal/70">
          The Sommelier is a grounded AI advisor that knows our catalogue and your palate. The
          conversational experience ships in Increment 5 — here&apos;s what you&apos;ll be able to ask:
        </p>

        <ul className="mt-8 space-y-3 text-left">
          {EXAMPLES.map((ex) => (
            <li
              key={ex}
              className="rounded-xl border border-whisky-200 bg-white px-5 py-3 text-charcoal/80"
            >
              “{ex}”
            </li>
          ))}
        </ul>

        <Link href="/shop" className={buttonClasses("primary", "lg", "mt-8")}>
          Browse the range for now
        </Link>
      </div>
    </div>
  );
}
