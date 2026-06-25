import { NextResponse, type NextRequest } from "next/server";
import { FLAVOUR_AXES, type FlavourAxis } from "@whiskymart/types";
import { getAdvisor } from "@/lib/advisor";

/** POST /api/advisor — ask the Sommelier; returns a grounded recommendation. */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { message?: string; palate?: unknown };
  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Please ask a question." }, { status: 400 });
  }

  const palate = Array.isArray(body.palate)
    ? (body.palate.filter((f): f is FlavourAxis => FLAVOUR_AXES.includes(f as FlavourAxis)) as FlavourAxis[])
    : undefined;

  const advisor = getAdvisor();
  const response = await advisor.ask(message, { palate });
  return NextResponse.json(response);
}
