import { NextResponse } from "next/server";

import {
  ContextDevIntegrationError,
  searchExternalEvidence,
} from "@/lib/quorum/context-dev";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("query" in body) || typeof body.query !== "string") {
    return NextResponse.json({ error: "A string query is required" }, { status: 400 });
  }

  try {
    return NextResponse.json(await searchExternalEvidence(body.query));
  } catch (error) {
    if (error instanceof ContextDevIntegrationError) {
      const status = error.status === 400 ? 400 : 503;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json({ error: "External evidence is unavailable" }, { status: 503 });
  }
}
