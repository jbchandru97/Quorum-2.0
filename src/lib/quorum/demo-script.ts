/* ───────────────────────────────────────────────────────────────
   The scripted demo dialogue, from /docs/07-DEMO_STORY.md and
   /docs/08-DEMO_DATA.md. Human words only — every agent answer is
   composed server-side from the fixtures (or live from Context.dev),
   never from this file.
   ─────────────────────────────────────────────────────────────── */

export const DEMO_USERS = {
  designer: "u_maya",
  pm: "u_rohan",
  engineer: "u_arun",
  agent: "u_agent",
} as const;

export const SCRIPT = {
  /* Beat 1 — repo-grounded rationale */
  q1Rationale: "Why was this AI nudge introduced here, inside Spending Summary?",

  /* Beat 2 — internal design-process guidance */
  q2Playbook: "Can you validate this interaction against our usability review process?",

  /* Beat 3 — precedent analytics */
  q3Precedent: "How did a similar contextual AI prompt perform elsewhere in the product?",

  /* Beat 4 — the question the agent cannot answer */
  q4Delay: "Why does the nudge appear after a delay rather than immediately?",
  tagPm: "@Rohan do you remember the intent behind the delay?",

  /* Beat 4 — PM replies live (docs/08 verbatim) */
  pmDelayReply:
    "I wanted the dashboard to establish itself first. If the AI treatment appeared immediately, it competed with the spending number the user came to see.",

  /* Beat 5 — external reference via Context.dev */
  q5External: "How do comparable finance products introduce an AI assistant?",

  /* Beat 6 — implementation scope discussion */
  proposal:
    "Proposal: the nudge copy should say what Aql AI will analyze before the user clicks.",
  pmAsksEngineer: "@Arun how large is that copy change?",
  engineerScope:
    "This component is shared across the dashboard, Monthly Insights, and the empty state. Updating the base component would affect all three surfaces and require broader validation. A dashboard-only scoped change is quick; a full shared-component update should be handled separately.",
  pmTimeline: "We need to move fast and show this in the customer preview this week.",
  engineerPlan:
    "Then let's do the scoped dashboard-only change now, and take the shared-component cleanup as a follow-up.",
} as const;

/** The scripted Context.dev search, kept in one place so the wizard,
    the agent route, and the docs trail all reference the same query. */
export const EXTERNAL_QUERY =
  "how do finance apps introduce AI assistant entry points in product UX";
