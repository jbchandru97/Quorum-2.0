import { NextResponse } from "next/server";

import { answerFor, isAgentKind } from "@/lib/quorum/agent";
import { ContextDevIntegrationError } from "@/lib/quorum/context-dev";

/* One endpoint for every scripted agent answer. The `external` kind
   performs a real Context.dev call; everything else reads the local
   fixtures. Failures return an error — never a fabricated answer. */

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const kind = body && typeof body === "object" && "kind" in body ? body.kind : undefined;
  if (!isAgentKind(kind)) {
    return NextResponse.json({ error: "Unknown agent kind" }, { status: 400 });
  }

  try {
    return NextResponse.json(await answerFor(kind));
  } catch (error) {
    if (error instanceof ContextDevIntegrationError) {
      return NextResponse.json({ error: "External reference lookup failed" }, { status: 502 });
    }
    return NextResponse.json({ error: "Agent source unavailable" }, { status: 503 });
  }
}
