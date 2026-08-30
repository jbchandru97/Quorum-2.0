import { NextResponse } from "next/server";

import { answerFor, isAgentKind } from "@/lib/quorum/agent";
import { classifyQuestion } from "@/lib/quorum/agent-kinds";
import { ContextDevIntegrationError } from "@/lib/quorum/context-dev";

/* One endpoint for every agent answer. Free-form questions are
   routed by the shared classifier — anything that reads as a
   public-web question performs a real Context.dev search; internal
   sources come from the fixtures and are gated to the target they
   document. Failures return an error — never a fabricated answer. */

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const question = typeof b.question === "string" ? b.question.trim() : undefined;
  const targetKey = typeof b.targetKey === "string" ? b.targetKey : null;
  const t = (b.target ?? {}) as Record<string, unknown>;
  const target = {
    key: typeof t.key === "string" ? t.key : targetKey,
    label: typeof t.label === "string" ? t.label : undefined,
    selector: typeof t.selector === "string" ? t.selector : undefined,
    breadcrumb: Array.isArray(t.breadcrumb)
      ? t.breadcrumb.filter((x): x is string => typeof x === "string")
      : undefined,
  };

  const kind = isAgentKind(b.kind) ? b.kind : question ? classifyQuestion(question) : null;
  if (!kind) {
    return NextResponse.json(
      { error: "Provide an agent kind or a question" },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json({ kind, ...(await answerFor(kind, { question, target })) });
  } catch (error) {
    if (error instanceof ContextDevIntegrationError) {
      return NextResponse.json({ error: "External reference lookup failed" }, { status: 502 });
    }
    return NextResponse.json({ error: "Agent source unavailable" }, { status: 503 });
  }
}
