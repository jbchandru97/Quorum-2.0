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
  content: string;
  sources: AgentSource[];
  actions?: AgentActionPayload[];
};

/* Only the steps relevant to each request, per /docs/06. */
export const AGENT_STEP_LABELS: Record<AgentKind, string[]> = {
  rationale: ["Checking product context", "Composing answer"],
  playbook: ["Checking design review guidance", "Composing answer"],
  precedent: ["Checking precedent metrics", "Composing answer"],
  delay: ["Checking product context", "Checking design review guidance", "Composing answer"],
  external: ["Checking product context", "Fetching external reference", "Composing answer"],
  actions: ["Reading thread discussion", "Synthesizing actions"],
};

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
  actions: "I couldn't synthesize actions just now. The thread is unchanged — try again.",
};
