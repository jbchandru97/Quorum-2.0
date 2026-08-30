/* ───────────────────────────────────────────────────────────────
   The scripted demo dialogue. Human words only — every agent answer
   is composed server-side from the fixtures, the codebase, or live
   Context.dev; never from this file.

   The story: one deep thread on the AI nudge (rationale → the PM's
   lived context → the usability review with an inline action → the
   Amplitude precedent), then breadth — the new Aql AI tab goes to
   the live web, and the Total Income card carries the engineering
   scope conversation to resolution and a Devin-ready action.
   ─────────────────────────────────────────────────────────────── */

export const DEMO_USERS = {
  designer: "u_maya",
  pm: "u_rohan",
  engineer: "u_arun",
  agent: "u_agent",
} as const;

export const SCRIPT = {
  /* ── Thread 1 · AI insight nudge ─────────────────────────────── */
  q1Rationale: "Why was this AI nudge introduced here, inside Spending Summary?",

  /* Straight to the person who holds the lived context. */
  qDelayToPm: "@Rohan why does the nudge appear after a delay rather than immediately?",
  pmDelayReply:
    "I wanted the dashboard to establish itself first. If the AI treatment appeared immediately, it competed with the spending number the user came to see.",

  qPlaybook: "Let's make sure this passes our usability review process.",
  qPrecedent: "Have we used a similar pattern somewhere else — and did we see success with it?",

  /* ── Thread 2 · the new Aql AI tab ───────────────────────────── */
  qTabExternal:
    "We're introducing the AI conversation as a separate tab — how are other products doing this?",

  /* ── Thread 3 · Total Income card ────────────────────────────── */
  qIncomeToEngineer:
    "@Arun I see a dropdown was added to this card. Is this change made at the component level, or only here?",
  engineerLocalOnly:
    "It's added only locally for now — updating the shared card component takes more time. I'd prefer to keep it local for this release. @Rohan can we make that call?",
  pmDeadline:
    "We need to ship this to users faster — we're on a tight deadline. @Arun let's go with the local change for now.",
  engineerBacklog:
    "Works. I'll pick the component-level refactor up as a backlog item; the change stays local for now.",
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
    if (/(make that call|keep it local|prefer to keep|shared .*component takes|takes more time)/.test(p))
      candidates.push(SCRIPT.pmDeadline);
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
    if (/(tight deadline|ship (this|it) to users|go with the local)/.test(p))
      candidates.push(SCRIPT.engineerBacklog);
    if (/(dropdown|only here|component level|instance)/.test(p))
      candidates.push(SCRIPT.engineerLocalOnly);
    if (/(creat|extract|make|pull|turn|convert).{0,24}component/.test(p))
      candidates.push(
        "We can extract it — right now it's inline markup, so pulling it into its own component is a small, contained change. I'd scope it to this surface first and generalise later if a second surface needs it.",
      );
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
