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

  /* Beat 6 — implementation scope discussion. The proposal tags the
     PM: a tagged human owns the reply, so the agent stays silent. */
  proposal:
    "@Rohan proposal: the nudge copy should say what Aql AI will analyze before the user clicks.",
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

/* ── simulated teammates ─────────────────────────────────────────
   Tagging a human gets a reply "from" them: the scripted lines for
   the scripted beats, persona-plausible ones for everything else.
   These are role-played demo participants (docs/09 allows the
   simulated second participant), never the agent — so they may
   speak with lived-context confidence the agent must not fake. */

export function simulatedReplyFor(
  externalId: string,
  prompt: string,
  target?: { key?: string | null; label?: string },
  /** What this person already said in the thread — never repeated. */
  prior: string[] = [],
): string {
  const p = prompt.toLowerCase();
  const label = target?.label && target.label !== "region" ? target.label : "this";

  /* Candidates in priority order; the first line not already said
     wins, so a second question never gets a copy-pasted reply. */
  const candidates: string[] = [];

  if (externalId === DEMO_USERS.pm) {
    if (/(delay|immediat|wait|timing)/.test(p)) candidates.push(SCRIPT.pmDelayReply);
    if (/(copy|analy[sz]|propos|transparen)/.test(p)) candidates.push(SCRIPT.pmAsksEngineer);
    if (/(why|intent|reason|rationale|purpose|decide)/.test(p))
      candidates.push(
        `Nothing written down on that one — from what I remember of v1, ${label} landed this way because it read best in the first dashboard review. I can dig out my notes if we need the detail.`,
      );
    candidates.push(
      "Good question — I don't have that documented. Give me a moment and I'll confirm here.",
      "No strong opinion beyond what I said earlier — I'd ship the scoped version and revisit.",
      "I'll take that one away and come back with a proper answer.",
    );
  } else if (externalId === DEMO_USERS.engineer) {
    if (/(creat|extract|make|pull|turn|convert).{0,24}component/.test(p))
      candidates.push(
        "We can extract it — right now it's inline markup, so pulling it into its own component is a small, contained change. I'd scope it to this surface first and generalise later if a second surface needs it.",
      );
    if (/(how large|how big|scope|effort|copy change)/.test(p))
      candidates.push(SCRIPT.engineerScope);
    if (/component/.test(p))
      candidates.push(
        target?.key === "ai-insight-prompt"
          ? "Checked — yes, that's the shared AIInsightPrompt base component. The dashboard, Monthly Insights, and the empty state all render it, so treat changes as shared-surface changes."
          : "Checked the code — that block is inline page markup, not an extracted component, so a local change stays contained.",
      );
    if (/(implement|code|built|render|where|file)/.test(p))
      candidates.push(
        `It lives in the dashboard page tree — nothing about ${label} is shared elsewhere, so changes stay local to that surface.`,
      );
    candidates.push(
      "Let me look at the implementation and confirm here — nothing about it reads as risky at first glance.",
      "Nothing new from the code side since my last look — happy to pair on it if we want to move.",
      "I'd need to prototype that to say anything useful — noted.",
    );
  } else {
    candidates.push("Taking a look now.");
  }

  return candidates.find((c) => !prior.includes(c)) ?? "Nothing more from me on this one.";
}
