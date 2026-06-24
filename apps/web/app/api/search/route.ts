import { NextResponse, type NextRequest } from "next/server";
import { catalog, getPrimaryVariant } from "@/lib/catalog/repository";

/**
 * GET /api/search?q=&limit=  — instant-search suggestions.
 *
 * Returns a slim payload for the header autocomplete. Backed by the seed
 * repository today; swaps to Algolia/Typesense behind the same contract later
 * (see docs/03 §Search, docs/07 §API).
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? 6) || 6, 12);

  if (q.length < 2) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const { items, total } = await catalog.search({ query: q }, "relevance");
  const slim = items.slice(0, limit).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    brand: p.brand.name,
    region: p.whisky?.region ?? null,
    price: getPrimaryVariant(p).price,
    imageSeed: p.image.seed,
    imageAlt: p.image.alt,
  }));

  return NextResponse.json({ items: slim, total });
}
