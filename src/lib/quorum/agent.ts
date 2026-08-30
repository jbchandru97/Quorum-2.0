import "server-only";

import {
  analyticsPrecedents,
  findTarget,
  readMarkdownFixture,
} from "./fixtures";
import { scrapePageMarkdown, searchExternalEvidence } from "./context-dev";
import { EXTERNAL_QUERY } from "./demo-script";
import { keywordsOf, searchRepo, SOURCE_ROOTS, type RepoHit } from "./repo-search";
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
  AssessmentItem,
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
        "I'm not sure — there is no written rationale on file for this target. @Rohan may hold the intent.",
      sources: repoSources(hits),
      findings: asFindings(hits),
      suggestion: question ? { name: "Rohan", question } : undefined,
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
  const assessment: AssessmentItem[] = [
    {
      criterion: "Discoverability",
      status: "pass",
      note: "The nudge sits where the user is already evaluating spending — found at the moment it is useful.",
    },
    {
      criterion: "Clarity & transparency",
      status: "needs_review",
      note: "The nudge does not say what Aql AI will analyze before the click. The playbook requires an AI affordance to state what it will look at.",
      action: "Update nudge copy to say what Aql AI will analyze",
    },
    {
      criterion: "Cognitive load · Consistency · User control",
      status: "unassessed",
      note: "No evidence recorded in this thread yet — per the playbook, unassessed is never a pass.",
    },
  ];
  return {
    content:
      "Assessed against the usability review process. Checks that don't pass should become action items:",
    sources: [
      {
        label: "Design review playbook",
        provenance: "cited",
        detail: "internal",
      },
    ],
    assessment,
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
      ? "The delay is real — the code sets it deliberately — but the product rationale explicitly notes there is no written reason for it. I can't answer the why from documentation. @Rohan built v1 and may hold the rationale."
      : "The delay is present in the implementation, but I found no documented rationale for it. @Rohan may know.",
    sources: [
      ...(notesDelay
        ? [{ label: "Product rationale", provenance: "cited" as const, detail: "marked undocumented" }]
        : []),
      ...repoSources(hits),
    ],
    findings: asFindings(hits),
    suggestion: { name: "Rohan", question: question ?? "Why does the nudge appear after a delay?" },
  };
}

/** The most question-relevant prose lines from a scraped page.
    Prose only: markup remnants and link-noise never make the cut. */
function bestLines(markdown: string, question: string, max = 2): string[] {
  /* Prefix-stemmed keywords, so "finance" meets "financial" and
     "assistant" meets "assistants". */
  const words = keywordsOf(question).map((w) => (w.length > 6 ? w.slice(0, 6) : w));
  const scored = markdown
    .split("\n")
    .map((raw) => {
      if (/[<>{}]|content=|og:|oembed|\bhttps?:\/\/\S+\s+https?:/i.test(raw)) return null;
      const line = raw
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") /* strip md links   */
        .replace(/https?:\/\/\S+/g, "")
        .replace(/[#*_`>|]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (line.length < 50 || line.length > 300) return null;
      /* Natural prose, not tag soup or nav debris. */
      const letters = (line.match(/[a-zA-Z\s]/g) ?? []).length / line.length;
      if (letters < 0.82 || line.split(" ").length < 8) return null;
      let score = 0;
      const lower = line.toLowerCase();
      for (const w of words) if (lower.includes(w)) score++;
      return score >= 2 ? { line, score } : null;
    })
    .filter((x): x is { line: string; score: number } => x !== null)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, max).map((s) => s.line.slice(0, 220));
}

/* Pages that scrape into meta-tag soup rather than prose. */
const SOCIAL_DOMAINS = [
  "facebook.com",
  "x.com",
  "twitter.com",
  "youtube.com",
  "instagram.com",
  "linkedin.com",
  "reddit.com",
  "pinterest.com",
  "tiktok.com",
];

/** Phase 0 — determine what to look up. The question becomes a
    search lookup: its content words, aimed at article-like pages. */
function deriveLookup(question: string): string {
  const words = keywordsOf(question);
  if (words.length < 3) return question;
  return `${words.join(" ")} examples`.slice(0, 500);
}

/* The live pipeline — two real Context.dev hops, never a canned
   answer. Phase 1 determines what to look up (the comparable
   products/pages for this question); phase 2 scrapes the top pages
   and reads them for the lines that actually address it. */
async function external(question?: string): Promise<AgentAnswer> {
  const query = question?.trim().slice(0, 500) || EXTERNAL_QUERY;
  const lookup = deriveLookup(query);

  /* Phase 1 — identify what to look at. */
  const found = await searchExternalEvidence(lookup, { excludeDomains: SOCIAL_DOMAINS });
  const candidates = found.sources.filter((s) => s.relevance !== "low").slice(0, 4);
  if (candidates.length === 0) {
    return {
      content:
        "The external search returned no relevant references, so I don't have outside evidence for this one.",
      sources: [],
    };
  }
  const identified = [...new Set(candidates.map((c) => hostnameOf(c.url)))];

  /* Phase 2 — scrape and read the top pages. */
  const trail: string[] = [
    `Lookup derived from the question: “${lookup}”`,
    `Identified via web search: ${identified.join(", ")}`,
  ];
  const readings: { url: string; host: string; line: string }[] = [];
  for (const c of candidates.slice(0, 2)) {
    try {
      const markdown = await scrapePageMarkdown(c.url);
      trail.push(`Scraped ${c.url} (${markdown.length.toLocaleString()} chars)`);
      const lines = bestLines(markdown, query);
      if (lines[0]) readings.push({ url: c.url, host: hostnameOf(c.url), line: lines[0] });
      if (lines[1]) trail.push(`${hostnameOf(c.url)}: “${lines[1]}”`);
    } catch {
      trail.push(`Could not scrape ${c.url} — skipped`);
    }
  }

  /* Compose from what was actually read; fall back to search
     snippets (still real) only if every scrape came back empty. */
  const bullets =
    readings.length > 0
      ? readings.map((r) => `${r.host} — “${r.line}”`).join("\n")
      : candidates
          .slice(0, 3)
          .map((s) => `${s.title} — ${s.snippet.replace(/\s+/g, " ").slice(0, 140).trim()}`)
          .join("\n");

  return {
    content: `Looked at comparable products (${identified.slice(0, 3).join(", ")}) and read the top pages:\n${bullets}`,
    sources: (readings.length > 0 ? readings : candidates.slice(0, 3)).map((r) => ({
      label: "host" in r ? r.host : hostnameOf(r.url),
      provenance: "fetched" as const,
      url: r.url,
      detail: readings.length > 0 ? "scraped · Context.dev" : "Context.dev",
    })),
    findings: { title: "Lookup trail", items: trail },
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
      content: `I'm not sure — I couldn't match ${what} to a named component in the codebase, so I can't say it is one, and I can't rule it out either. @Arun would know for certain.`,
      sources: repoSources(hits),
      findings: asFindings(hits),
      suggestion: question ? { name: "Arun", question } : undefined,
    };
  }

  if (hits.length === 0) {
    return {
      content:
        "I don't know — nothing in the codebase or the docs matches this, and it doesn't read as a public-web question. @Rohan may have the context.",
      sources: [],
      suggestion: question ? { name: "Rohan", question } : undefined,
    };
  }

  return {
    content: isYesNoQuestion(question)
      ? "I'm not sure — the code I found is related but doesn't settle it either way. @Arun may know for certain."
      : "I couldn't find a definitive answer. The closest matches in the codebase are below — @Arun may be able to confirm.",
    sources: repoSources(hits),
    findings: asFindings(hits),
    suggestion: question ? { name: "Arun", question } : undefined,
  };
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function actions(targetKey?: string | null): AgentAnswer {
  /* Resolving the income-card thread: the engineering decision. */
  if (targetKey === "income-card") {
    const t = findTarget("income-card");
    return {
      content:
        "Summary: the month dropdown on Total Income ships as a local change to meet the deadline. The component-level refactor is captured as a backlog action item.",
      sources: [{ label: "Thread discussion", provenance: "human" }],
      actions: [
        {
          title: "Refactor Total Income dropdown into the shared card component",
          summary:
            "Promote the locally-added month dropdown on the Total Income card into the shared stat-card component once the customer deadline passes.",
          targetDescription: t?.breadcrumb.join(" / ") ?? "Dashboard / IncomeWidget",
          scopeNotes: "Backlog — after the current release. The local change stays in place until then.",
          acceptanceNotes: "Dropdown behaviour identical across every surface that renders the card.",
        },
      ],
    };
  }

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
      return actions(targetKey);
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
