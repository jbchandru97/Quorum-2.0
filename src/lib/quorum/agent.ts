import "server-only";

import {
  analyticsPrecedents,
  findTarget,
  readMarkdownFixture,
} from "./fixtures";
import { searchExternalEvidence } from "./context-dev";
import { EXTERNAL_QUERY } from "./demo-script";
import { searchRepo, SOURCE_ROOTS, type RepoHit } from "./repo-search";
import { PRIMARY_TARGET_KEY } from "./targets";
import type { AgentTarget } from "./agent-kinds";

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

/* The fixture docs document exactly one target: the AI insight
   nudge. Serving their content for any other target would be a
   fabricated citation, so every fixture-backed source is gated on
   the thread's target and admits the gap otherwise (docs/06). */
const documentsTarget = (targetKey?: string | null) => targetKey === PRIMARY_TARGET_KEY;

/* ── the codebase, as evidence ──────────────────────────────────
   Real matches from the product under review. They ride under the
   answer as collapsed findings — evidence supports a verdict, it is
   never dressed up as one. */
const repoItems = (hits: RepoHit[]) =>
  hits.map((h) => `${h.file}:${h.line} — ${h.text}`);

const repoSources = (hits: RepoHit[]) =>
  hits.map((h) => ({
    label: h.file.split("/").pop() ?? h.file,
    provenance: "cited" as const,
    detail: `repo · L${h.line}`,
  }));

const asFindings = (hits: RepoHit[]) =>
  hits.length > 0
    ? { title: "What I found in the codebase", items: repoItems(hits) }
    : undefined;

/** Yes/no questions get a verdict, or an explicit "not sure". */
const isYesNoQuestion = (q?: string) =>
  Boolean(q && /^\s*(is|are|was|were|does|do|did|has|have|had|can|could|will|would|should)\b/i.test(q));

const isComponentQuestion = (q?: string) => Boolean(q && /\bcomponents?\b/i.test(q));

async function rationale(targetKey?: string | null, question?: string): Promise<AgentAnswer> {
  const hits = question ? await searchRepo(question) : [];

  if (!documentsTarget(targetKey)) {
    return {
      content:
        "I'm not sure — there is no written rationale on file for this target. @Rohan may hold the intent; you may want to tag him.",
      sources: repoSources(hits),
      findings: asFindings(hits),
    };
  }
  const doc = await readMarkdownFixture("productRationale");
  const lead = doc ? leadParagraph(doc) : null;
  if (!lead) return CANNOT("a documented product rationale");
  return {
    content: lead,
    sources: [
      { label: "Product rationale", provenance: "cited" as const, detail: "product-rationale.md" },
      ...repoSources(hits),
    ],
    findings: asFindings(hits),
  };
}

async function playbook(targetKey?: string | null): Promise<AgentAnswer> {
  const doc = await readMarkdownFixture("designReviewPlaybook");
  if (!doc) return CANNOT("the internal design review playbook");
  if (!documentsTarget(targetKey)) {
    return {
      content:
        "The usability review process assesses five criteria: discoverability, clarity and transparency, cognitive load, consistency with existing patterns, and user control. No assessment has been recorded for this target yet — per the playbook, unassessed criteria are never counted as passes.",
      sources: [
        { label: "Design review playbook", provenance: "cited", detail: "internal" },
      ],
    };
  }
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

function precedent(targetKey?: string | null): AgentAnswer {
  if (!documentsTarget(targetKey)) {
    return {
      content:
        "The seeded analytics cover a precedent for the contextual AI prompt pattern only — there are no metrics recorded for this target. I won't infer numbers that don't exist.",
      sources: [],
    };
  }
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

async function delay(targetKey?: string | null, question?: string): Promise<AgentAnswer> {
  if (!documentsTarget(targetKey)) return rationale(targetKey, question);
  /* Find the actual mechanism in the code before saying anything. */
  const hits = await searchRepo(`${question ?? ""} setTimeout delay timer visible`, 3, SOURCE_ROOTS);
  const doc = await readMarkdownFixture("productRationale");
  const notesDelay = doc?.includes("delay") ?? false;
  return {
    content: notesDelay
      ? "The delay is real — the code sets it deliberately — but the product rationale explicitly notes there is no written reason for it. I can't answer the why from documentation. @Rohan built v1 and may hold the rationale; you may want to tag him."
      : "The delay is present in the implementation, but I found no documented rationale for it. You may want to tag the PM.",
    sources: [
      ...(notesDelay
        ? [{ label: "Product rationale", provenance: "cited" as const, detail: "marked undocumented" }]
        : []),
      ...repoSources(hits),
    ],
    findings: asFindings(hits),
  };
}

async function external(question?: string): Promise<AgentAnswer> {
  /* The live source. The reviewer's own question is the search —
     it never falls back to a canned answer; on failure the route
     errors and the thread shows it honestly. */
  const query = question?.trim().slice(0, 500) || EXTERNAL_QUERY;
  const result = await searchExternalEvidence(query);
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
    content: `Public references for “${query}”:\n${bullets}`,
    sources: top.map((s) => ({
      label: hostnameOf(s.url),
      provenance: "fetched" as const,
      url: s.url,
      detail: "Context.dev",
    })),
  };
}

async function unknown(question?: string, target?: AgentTarget): Promise<AgentAnswer> {
  /* A component question about the mapped target has a real answer. */
  if (isComponentQuestion(question) && target?.key) {
    const mapped = findTarget(target.key);
    if (mapped) {
      return {
        content: `Yes — this is the ${mapped.label} component: ${mapped.breadcrumb.join(" / ")}. ${mapped.sharedComponentNote}`,
        sources: [
          { label: "component-map.json", provenance: "cited", detail: "target map" },
        ],
      };
    }
  }

  /* Otherwise: search the product's own source and be honest about
     what the matches do and do not establish. */
  const hits = question ? await searchRepo(question, 3, SOURCE_ROOTS) : [];
  const what = target?.label ? `this ${target.label}` : "this";

  if (isComponentQuestion(question)) {
    return {
      content: `I'm not sure — I couldn't match ${what} to a named component in the codebase, so I can't say it is one, and I can't rule it out either. @Arun would know for certain; you may want to tag him.`,
      sources: repoSources(hits),
      findings: asFindings(hits),
    };
  }

  if (hits.length === 0) {
    return {
      content:
        "I don't know — nothing in the codebase or the docs matches this, and it doesn't read as a public-web question. @Rohan or @Arun may have the context; you may want to tag them.",
      sources: [],
    };
  }

  return {
    content: isYesNoQuestion(question)
      ? "I'm not sure — the code I found is related but doesn't settle it either way. @Arun may know for certain; you may want to tag him."
      : "I couldn't find a definitive answer. The closest matches in the codebase are below — @Rohan or @Arun may be able to confirm.",
    sources: repoSources(hits),
    findings: asFindings(hits),
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

export async function answerFor(
  kind: AgentKind,
  opts: { question?: string; targetKey?: string | null; target?: AgentTarget } = {},
): Promise<AgentAnswer> {
  const targetKey = opts.target?.key ?? opts.targetKey;
  switch (kind) {
    case "rationale":
      return rationale(targetKey, opts.question);
    case "playbook":
      return playbook(targetKey);
    case "precedent":
      return precedent(targetKey);
    case "delay":
      return delay(targetKey, opts.question);
    case "external":
      return external(opts.question);
    case "unknown":
      return unknown(opts.question, { ...opts.target, key: targetKey });
    case "actions":
      return actions();
  }
}

export function isAgentKind(value: unknown): value is AgentKind {
  return (
    typeof value === "string" &&
    ["rationale", "playbook", "precedent", "delay", "external", "unknown", "actions"].includes(
      value,
    )
  );
}
