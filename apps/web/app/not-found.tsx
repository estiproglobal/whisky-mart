import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl text-whisky-300">404</p>
      <h1 className="mt-4 font-display text-2xl text-charcoal">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-charcoal/60">It may have moved, or the link may be incorrect.</p>
      <Link href="/" className={buttonClasses("primary", "md", "mt-6")}>
        Back to home
      </Link>
    </div>
  );
}
