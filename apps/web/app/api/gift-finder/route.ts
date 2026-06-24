import { NextResponse, type NextRequest } from "next/server";
import { GiftFinderInput, giftFind } from "@/lib/advisor/gift";

/** POST /api/gift-finder — guided gift recommendations from structured inputs. */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = GiftFinderInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid gift finder input." }, { status: 400 });
  }
  const response = await giftFind(parsed.data);
  return NextResponse.json(response);
}
