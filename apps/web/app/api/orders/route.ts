import { NextResponse, type NextRequest } from "next/server";
import { orders } from "@/lib/db";

/**
 * GET /api/orders?email= — a customer's order history.
 *
 * NOTE: email-based lookup is a dev stand-in. Real auth/authorization (the
 * signed-in user can only see their own orders) lands with the auth swap.
 */
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim();
  if (!email) return NextResponse.json({ orders: [] });
  const list = await orders.listByEmail(email);
  return NextResponse.json({ orders: list });
}
