import { NextResponse, type NextRequest } from "next/server";
import { getAdvisor } from "@/lib/advisor";

/** POST /api/advisor — ask the Sommelier; returns a grounded recommendation. */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { message?: string };
  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Please ask a question." }, { status: 400 });
  }
  const advisor = getAdvisor();
  const response = await advisor.ask(message);
  return NextResponse.json(response);
}
