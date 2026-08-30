/* ───────────────────────────────────────────────────────────────
   The agent contract, shared by both sides.

   Client-safe: the overlay needs the kinds and step labels to drive
   the thinking UI, the server composes answers against the same
   types. Keeping them in one module keeps the two in lockstep.
   ─────────────────────────────────────────────────────────────── */

export type AgentKind =
  | "rationale"
  | "playbook"
  | "precedent"
  | "delay"
  | "external"
  | "unknown"
  | "actions";

export type AgentSource = {
  label: string;
  provenance: "fetched" | "cited" | "inferred" | "human";
  url?: string;
  detail?: string;
};

export type AgentActionPayload = {
  title: string;
  summary: string;
  targetDescription: string;
  scopeNotes: string;
  acceptanceNotes: string;
};

export type AgentAnswer = {
  /** The direct answer: a verdict, never a dump of search output. */
  content: string;
  sources: AgentSource[];
  actions?: AgentActionPayload[];
  /** Supporting evidence, rendered collapsed under the answer. */
  findings?: { title: string; items: string[] };
};

/** What the reviewer actually has selected, sent with a question so
    the agent answers about the thing, not in the abstract. */
export type AgentTarget = {
  key?: string | null;
  label?: string;
  selector?: string;
  breadcrumb?: string[];
};

/* Only the steps relevant to each request, per /docs/06. */
export const AGENT_STEP_LABELS: Record<AgentKind, string[]> = {
  rationale: ["Searching the codebase", "Checking product context", "Composing answer"],
  playbook: ["Checking design review guidance", "Composing answer"],
  precedent: ["Checking precedent metrics", "Composing answer"],
  delay: ["Searching the codebase", "Checking product context", "Composing answer"],
  external: ["Checking product context", "Fetching external reference", "Composing answer"],
  unknown: ["Searching the codebase", "Checking design review guidance", "Composing answer"],
  actions: ["Reading thread discussion", "Synthesizing actions"],
};

/* ── question routing ─────────────────────────────────────────────
   Deterministic source routing per /docs/06: the same classifier
   runs on both sides — the client picks the thinking steps from it,
   the server composes the answer with it. Order matters: the most
   specific signals win.

   `external` is the only live source: anything that reads as a
   public-web question (competitors, other products, best practices,
   examples in the wild) triggers a real Context.dev search. */
export function classifyQuestion(question: string): Exclude<AgentKind, "actions"> {
  const q = question.toLowerCase();

  /* The undocumented-delay beat: timing questions about behaviour. */
  if (/\b(delay|debounce|why (does|do|is|it) .*(wait|later)|immediately|after a (pause|moment)|timing)\b/.test(q))
    return "delay";

  /* Seeded analytics precedent: performance and metrics. */
  if (/\b(perform(ed|ance|s)?|engagement|metrics?|analytics?|conversion|click[- ]?through|adoption|usage|how did .+\b(do|land|convert))\b/.test(q))
    return "precedent";

  /* Internal process: validation against the team's own playbook. */
  if (/\b(usability|review process|playbook|heuristics?|guidelines?|criteria|validate|assess(ment)?|checklist|our process)\b/.test(q))
    return "playbook";

  /* Public web — the live Context.dev path. */
  if (/\b(competitors?|comparable|benchmark|best practices?|in the (market|wild|industry)|other (finance |banking |fintech )?(products|apps|companies|teams|tools)|how do (other|comparable|similar|most|leading)|examples? (of|from)|publicly|search the web|look up|reference)\b/.test(q))
    return "external";

  /* Documented intent. */
  if (/\b(why|rationale|reason|intent|purpose|placed|introduced|who decided|decision|meant)\b/.test(q))
    return "rationale";

  return "unknown";
}

/* Honest failure copy. The external step never falls back to a
   canned answer — a fabricated external source is the one guardrail
   with no exceptions (fixtures/README.md). */
export const AGENT_FAIL_TEXT: Record<AgentKind, string> = {
  rationale: "I couldn't consult the product rationale just now, so I don't have a grounded answer.",
  playbook: "I couldn't consult the design review playbook just now, so I don't have a grounded answer.",
  precedent: "I couldn't consult the precedent metrics just now, so I don't have a grounded answer.",
  delay: "I couldn't consult the product context just now, so I don't have a grounded answer.",
  external:
    "The external reference lookup failed, so I don't have outside evidence for this one. The thread stays usable — try again, or continue without it.",
  unknown:
    "I couldn't consult my sources just now, so I don't have a grounded answer.",
  actions: "I couldn't synthesize actions just now. The thread is unchanged — try again.",
};
