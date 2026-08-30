import { DEMO_USERS, SCRIPT } from "@/lib/quorum/demo-script";
import type { ReviewSessionValue } from "./ReviewSession";

/* ───────────────────────────────────────────────────────────────
   The demo conductor's step registry.

   The story runs deep, then wide. One thread on the AI nudge takes
   the full journey — documented rationale, the PM's lived context,
   the usability review with an inline action, the Amplitude
   precedent. Then breadth: the new Aql AI tab goes to the live web
   through Context.dev, and the Total Income card carries the
   engineering scope conversation to resolution, a synthesized
   backlog action, and the Devin hand-off.

   Every step drives the same session verbs the visible UI binds to
   — messages animate in, the agent thinks, Convex writes happen.
   ─────────────────────────────────────────────────────────────── */

export type WizardCtx = {
  session: ReviewSessionValue;
  push: (path: string) => void;
};

export type WizardStep = {
  id: string;
  label: string;
  run: (ctx: WizardCtx) => Promise<void>;
  /** Optional cheap UI-only undo; data steps cannot un-write. */
  back?: (ctx: WizardCtx) => void;
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: "open",
    label: "open Quorum",
    run: async ({ session }) => {
      session.expand();
      session.setMode("move");
      session.closeSurfaces();
      /* The other two participants come online — written through
         the same Convex presence path a second window would use. */
      await session.heartbeatAs(DEMO_USERS.pm);
      await session.heartbeatAs(DEMO_USERS.engineer);
    },
  },
  {
    id: "rationale",
    label: "nudge · why is this here?",
    run: async ({ session }) => {
      session.setMode("select");
      await sleep(500);
      if (!session.selectTargetByKey("ai-insight-prompt")) return;
      await sleep(700);
      /* Untagged question → the agent answers from the rationale. */
      await session.typeAndSendAsDesigner(SCRIPT.q1Rationale);
    },
    back: ({ session }) => session.closePanel(),
  },
  {
    id: "delay",
    label: "agent admits · Ask Rohan",
    run: async ({ session }) => {
      /* Asked to the agent first: it finds the delay in the code
         but no written rationale, and suggests the PM. The Ask bar
         under its answer does the tagging — one tap, no retyping —
         and the PM replies through the same Convex path. */
      await session.typeAndSendAsDesigner(SCRIPT.qDelay);
      await sleep(1100);
      await session.askSuggestedHuman();
      await sleep(2400);
    },
  },
  {
    id: "playbook",
    label: "usability review · cards",
    run: async ({ session }) => {
      await session.typeAndSendAsDesigner(SCRIPT.qPlaybook);
    },
  },
  {
    id: "inline-action",
    label: "failing check → action",
    run: async ({ session }) => {
      /* The needs-review card becomes an action item, inline. */
      await session.captureFailingCheck();
    },
  },
  {
    id: "precedent",
    label: "Amplitude · precedent",
    run: async ({ session }) => {
      await session.typeAndSendAsDesigner(SCRIPT.qPrecedent);
    },
  },
  {
    id: "tab-external",
    label: "Aql tab · Context.dev live",
    run: async ({ session }) => {
      session.closePanel();
      await sleep(400);
      session.setMode("select");
      await sleep(500);
      if (!session.selectTargetByKey("ai-assistant-tab")) return;
      await sleep(700);
      /* Identifies comparable products, scrapes them — all live. */
      await session.typeAndSendAsDesigner(SCRIPT.qTabExternal);
    },
  },
  {
    id: "income-scope",
    label: "income card · eng scope",
    run: async ({ session }) => {
      session.closePanel();
      await sleep(400);
      session.setMode("select");
      await sleep(500);
      if (!session.selectTargetByKey("income-card")) return;
      await sleep(700);
      /* One tagged question plays the whole handoff: engineer →
         PM (deadline) → engineer (backlog), simulated teammates
         chaining through the same Convex path. */
      await session.typeAndSendAsDesigner(SCRIPT.qIncomeToEngineer);
      await sleep(6800);
    },
  },
  {
    id: "resolve",
    label: "resolve · summary + action",
    run: async ({ session }) => {
      /* Marked resolved first (system line records by whom), then
         the agent generates the summary and the backlog action. */
      await session.resolveActiveThread();
    },
  },
  {
    id: "devin",
    label: "actions tray · Devin",
    run: async ({ session }) => {
      session.openSurface("actions");
    },
    back: ({ session }) => session.closeSurfaces(),
  },
  {
    id: "workspace",
    label: "open workspace",
    run: async ({ push }) => {
      push("/quorum/threads");
    },
  },
];
