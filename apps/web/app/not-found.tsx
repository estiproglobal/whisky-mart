import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl text-copper">404</p>
      <h1 className="mt-4 font-display text-d2 text-cream">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-body-sm text-cream-muted">It may have moved, or the link may be wrong.</p>
      <Link href="/" className={buttonClasses("primary", "md", "mt-6")}>
        Back to home
      </Link>
    </div>
  );
}
