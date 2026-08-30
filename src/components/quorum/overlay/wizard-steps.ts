import { DEMO_USERS, SCRIPT } from "@/lib/quorum/demo-script";
import type { ReviewSessionValue } from "./ReviewSession";

/* ───────────────────────────────────────────────────────────────
   The demo conductor's step registry, from /docs/09-DEMO_WIZARD.md.

   Every step drives the same session verbs the visible UI binds to,
   so advancing triggers real behaviour — messages animate in, the
   agent thinks, Convex writes happen — never a screen swap.

   The agent is summoned by the product's own routing now: an
   untagged question from the reviewer answers itself, a tagged
   teammate owns the reply. Each question step therefore carries its
   answer, and the wizard only supplies the human side.

   Step 6 performs the REAL Context.dev request. If it fails the
   agent posts an honest failure message and the demo can move on.
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
    id: "calm",
    label: "open Quorum",
    run: async ({ session }) => {
      /* The review link starts as a quiet launcher bubble; the demo
         begins by opening the instrument. */
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
    label: "select · ask rationale",
    run: async ({ session }) => {
      /* Pick up the instrument first, so the audience sees the mode
         change before the ring lands on the target. */
      session.setMode("select");
      await sleep(500);
      if (!session.selectPrimaryTarget()) return;
      await sleep(700);
      /* Untagged question → the agent answers from the rationale. */
      await session.typeAndSendAsDesigner(SCRIPT.q1Rationale);
    },
    back: ({ session }) => session.closePanel(),
  },
  {
    id: "playbook",
    label: "validate · playbook",
    run: async ({ session }) => {
      await session.typeAndSendAsDesigner(SCRIPT.q2Playbook);
    },
  },
  {
    id: "precedent",
    label: "evidence · precedent",
    run: async ({ session }) => {
      await session.typeAndSendAsDesigner(SCRIPT.q3Precedent);
    },
  },
  {
    id: "unknown",
    label: "agent admits · PM replies",
    run: async ({ session }) => {
      await session.typeAndSendAsDesigner(SCRIPT.q4Delay);
      await sleep(600);
      /* Tagging Rohan hands the thread to a human — the simulated
         teammate replies through the same Convex path, in realtime. */
      await session.typeAndSendAsDesigner(SCRIPT.tagPm);
      await sleep(2200);
    },
  },
  {
    id: "external",
    label: "Context.dev · live",
    run: async ({ session }) => {
      await session.typeAndSendAsDesigner(SCRIPT.q5External);
    },
  },
  {
    id: "scope",
    label: "scope discussion",
    run: async ({ session }) => {
      /* The proposal tags Rohan; the simulated PM asks Arun, whose
         tagged reply chains the scope answer — one send plays the
         whole handoff. The wizard adds only the closing exchange. */
      await session.typeAndSendAsDesigner(SCRIPT.proposal);
      await sleep(4400);
      await session.sendAs(DEMO_USERS.pm, SCRIPT.pmTimeline);
      await sleep(900);
      await session.sendAs(DEMO_USERS.engineer, SCRIPT.engineerPlan);
    },
  },
  {
    id: "actions",
    label: "resolve · synthesize",
    run: async ({ session }) => {
      /* Resolving the scripted thread runs the agent synthesis:
         summary + the two suggested actions, still removable. */
      await session.resolveActiveThread();
    },
  },
  {
    id: "actions-list",
    label: "show actions",
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
