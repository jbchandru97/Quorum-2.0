import "server-only";

import {
  analyticsPrecedents,
  findTarget,
  readMarkdownFixture,
} from "./fixtures";
import { searchExternalEvidence } from "./context-dev";
import { EXTERNAL_QUERY } from "./demo-script";
import { PRIMARY_TARGET_KEY } from "./targets";

/* ───────────────────────────────────────────────────────────────
   The agent's source adapters, per /docs/06-AGENT_BEHAVIOR.md.

   Each kind routes to exactly one context source:
     rationale  → fixtures/context/product-rationale.md
     playbook   → fixtures/internal/design-review-playbook.md
     precedent  → fixtures/analytics/precedent.json
     delay      → the rationale doc's own "not documented" note
     external   → a LIVE Context.dev web search (never seeded)
     actions    → synthesis from the component map + thread outcome

   Guardrails (docs/06): never fabricate a source, never imply the
   seeded analytics are live, admit uncertainty plainly.
   ─────────────────────────────────────────────────────────────── */

import type {
  AgentActionPayload,
  AgentAnswer,
  AgentKind,
} from "./agent-kinds";

export type { AgentActionPayload, AgentAnswer, AgentKind, AgentSource } from "./agent-kinds";

/** First paragraph after the top-level heading, frontmatter stripped. */
function leadParagraph(markdown: string): string | null {
  const body = markdown.replace(/^---[\s\S]*?---\s*/, "");
  const lines = body.split("\n");
  const start = lines.findIndex((l) => l.startsWith("# "));
  if (start === -1) return null;
  const collected: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("#")) break;
    if (line.trim() === "") {
      if (collected.length > 0) break;
      continue;
    }
    collected.push(line.trim());
  }
  return collected.length > 0 ? collected.join(" ") : null;
}

const CANNOT = (what: string): AgentAnswer => ({
  content: `I couldn't find ${what} in the sources I have access to, so I don't have a grounded answer for this one.`,
  sources: [],
});

async function rationale(): Promise<AgentAnswer> {
  const doc = await readMarkdownFixture("productRationale");
  const lead = doc ? leadParagraph(doc) : null;
  if (!lead) return CANNOT("a documented product rationale");
  return {
    content: lead,
    sources: [
      { label: "Product rationale", provenance: "cited", detail: "product-rationale.md" },
    ],
  };
}

async function playbook(): Promise<AgentAnswer> {
  const doc = await readMarkdownFixture("designReviewPlaybook");
  if (!doc) return CANNOT("the internal design review playbook");
  return {
    content:
      "Assessed against the usability review process:\n" +
      "Discoverability — Pass. The nudge sits where the user is already evaluating spending, so it is found at the moment it is useful.\n" +
      "Clarity and transparency — Needs review. The playbook requires an AI affordance to say what it will look at, and this nudge does not explain what will be analyzed before the click.\n" +
      "Cognitive load, consistency, and user control — no evidence recorded in this thread yet, so per the playbook they stay unassessed rather than passed.",
    sources: [
      {
        label: "Design review playbook",
        provenance: "cited",
        detail: "internal",
      },
    ],
  };
}

function precedent(): AgentAnswer {
  const p = analyticsPrecedents[0];
  if (!p) return CANNOT("a precedent metric");
  return {
    content: `${p.summary}\n${p.caveat}`,
    sources: [
      {
        label: "Analytics precedent",
        provenance: "fetched",
        detail: `${p.comparison[0].value}% vs ${p.comparison[1].value}%`,
      },
    ],
  };
}

async function delay(): Promise<AgentAnswer> {
  const doc = await readMarkdownFixture("productRationale");
  const notesDelay = doc?.includes("delay") ?? false;
  return {
    content: notesDelay
      ? "I found the delay in the implementation, but the product rationale explicitly notes there is no written reason for it. I can't answer this from documentation — Rohan built v1 and may hold the rationale. You may want to tag him."
      : "I found the delay in the implementation, but no documented rationale for it anywhere I can read. You may want to tag the PM.",
    sources: notesDelay
      ? [{ label: "Product rationale", provenance: "cited", detail: "marked undocumented" }]
      : [],
  };
}

async function external(): Promise<AgentAnswer> {
  /* The one step that must be live. It never falls back to a canned
     answer — on failure the route 502s and the thread shows it. */
  const result = await searchExternalEvidence(EXTERNAL_QUERY);
  const top = result.sources
    .filter((s) => s.relevance !== "low")
    .slice(0, 3);
  if (top.length === 0) {
    return {
      content:
        "The external search returned no relevant references, so I don't have outside evidence for this one.",
      sources: [],
    };
  }
  const bullets = top
    .map((s) => `${s.title} — ${s.snippet.replace(/\s+/g, " ").slice(0, 140).trim()}`)
    .join("\n");
  return {
    content: `Public references on how finance products introduce AI assistants:\n${bullets}`,
    sources: top.map((s) => ({
      label: hostnameOf(s.url),
      provenance: "fetched" as const,
      url: s.url,
      detail: "Context.dev",
    })),
  };
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function actions(): AgentAnswer {
  const target = findTarget(PRIMARY_TARGET_KEY);
  const breadcrumb = target?.breadcrumb.join(" / ") ?? "Dashboard / SpendingSummary / AIInsightPrompt";
  const shared = target?.sharedWith.join(", ") ?? "Dashboard, Monthly Insights, Empty state";
  const list: AgentActionPayload[] = [
    {
      title: "Update dashboard AI nudge copy",
      summary:
        "Clarify that Aql AI will analyze recent spending before the user enters the assistant.",
      targetDescription: breadcrumb,
      scopeNotes: `Dashboard instance only. Do not touch the shared variants (${shared}).`,
      acceptanceNotes:
        "The nudge states what will be analyzed before the click, and ships in this week's customer preview.",
    },
    {
      title: "Refactor shared AI nudge component",
      summary:
        "Evaluate the shared component across all surfaces and apply a consistent transparency pattern later.",
      targetDescription: `Shared AIInsightPrompt base component (${shared})`,
      scopeNotes: "All shared surfaces; needs broader validation before rollout.",
      acceptanceNotes:
        "One consistent transparency pattern across every surface that uses the component.",
    },
  ];
  return {
    content:
      "Created 2 actions from this thread:\n1. Update dashboard AI nudge copy — scoped, this week.\n2. Refactor shared AI nudge component — follow-up.",
    sources: [{ label: "Thread discussion", provenance: "human" }],
    actions: list,
  };
}

export async function answerFor(kind: AgentKind): Promise<AgentAnswer> {
  switch (kind) {
    case "rationale":
      return rationale();
    case "playbook":
      return playbook();
    case "precedent":
      return precedent();
    case "delay":
      return delay();
    case "external":
      return external();
    case "actions":
      return actions();
  }
}

export function isAgentKind(value: unknown): value is AgentKind {
  return (
    typeof value === "string" &&
    ["rationale", "playbook", "precedent", "delay", "external", "actions"].includes(value)
  );
}
