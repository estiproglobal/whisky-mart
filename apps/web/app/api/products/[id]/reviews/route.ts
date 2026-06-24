import { NextResponse, type NextRequest } from "next/server";
import { ReviewInput } from "@whiskymart/types";
import { orders, reviews } from "@/lib/db";

/** GET /api/products/:id/reviews — reviews + aggregate summary for a product. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [list, summary] = await Promise.all([reviews.listByProduct(id), reviews.summary(id)]);
  return NextResponse.json({ reviews: list, summary });
}

/** POST /api/products/:id/reviews — submit a review (verified if the email bought it). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = ReviewInput.safeParse({ ...body, productId: id });
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all review fields." }, { status: 400 });
  }

  // Verified purchase: did this email order this product?
  let verified = false;
  if (parsed.data.email) {
    const history = await orders.listByEmail(parsed.data.email);
    verified = history.some((o) => o.items.some((i) => i.productId === id));
  }

  const review = await reviews.create(parsed.data, verified);
  return NextResponse.json({ review }, { status: 201 });
}
