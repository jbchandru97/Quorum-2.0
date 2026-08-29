"use client";

import { useState } from "react";
import { Shimmer } from "./Shimmer";

/* ───────────────────────────────────────────────────────────────
   AgentSteps — multi-step progress instead of a spinner.

   A spinner says "wait". A step list says what is being consulted,
   in what order, and how far along it is — which is the difference
   between a product that looks busy and one that looks grounded.

   Presentation only. It renders whatever step array it is handed and
   has no opinion about what the steps do or where they come from.

   Two behaviours matter and both are here:
   · rows arrive staggered, so the sequence reads as a sequence
   · the group collapses to a count when it finishes, so a long
     answer is not left buried under its own scaffolding
   ─────────────────────────────────────────────────────────────── */

export type StepStatus = "pending" | "running" | "done" | "failed";

export type AgentStep = {
  id: string;
  label: string;
  status: StepStatus;
  /** Small leading mark: a source glyph, a connector logo. */
  icon?: React.ReactNode;
};

const STATUS_CLASS: Record<StepStatus, string> = {
  pending: "is-pending",
  running: "is-running",
  done: "is-done",
  failed: "is-failed",
};

function Tick() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 6.3l2.4 2.4L9.5 3.6" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg className="q-steps-chev" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M4 2.5L8 6l-4 3.5" />
    </svg>
  );
}

/* 80ms, the reference's list stagger. */
const STAGGER_MS = 80;

export function AgentSteps({
  steps,
  /** The line above the list: what the agent is doing overall. */
  title = "Working",
  doneTitle,
  collapsible = true,
  /** Collapse the moment every step settles. */
  autoCollapse = true,
}: {
  steps: AgentStep[];
  title?: string;
  doneTitle?: string;
  collapsible?: boolean;
  autoCollapse?: boolean;
}) {
  /* Each row animates in once, on mount — the keyframe does that on
     its own, so a row that later flips from running to done does not
     re-enter.

     A driver that reveals steps one at a time gets its stagger for
     free, from the timing of its own updates. A driver that hands
     over the whole plan at once would otherwise have every row land
     in the same frame, so only that opening batch is delayed by
     position. Captured once, on first render. */
  const [openingBatch] = useState(() => new Set(steps.map((s) => s.id)));
  const delayFor = (id: string, i: number) =>
    openingBatch.has(id) && i > 0 ? `${i * STAGGER_MS}ms` : undefined;

  const settled = steps.length > 0 && steps.every((s) => s.status === "done" || s.status === "failed");
  const doneCount = steps.filter((s) => s.status === "done" || s.status === "failed").length;

  /* An override is remembered against the state it was made in, so a
     group that starts running again reopens on its own and live
     progress is never hidden behind a stale collapse. */
  const [override, setOverride] = useState<{ closed: boolean; settled: boolean } | null>(null);
  const closed =
    override && override.settled === settled ? override.closed : autoCollapse && settled;

  const heading = settled && doneTitle ? doneTitle : title;
  const count = settled ? `${steps.length} step${steps.length === 1 ? "" : "s"}` : `${doneCount} of ${steps.length}`;

  return (
    <div
      className={[
        "q-steps",
        settled ? "is-done" : "",
        closed ? "is-closed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {collapsible ? (
        <button
          type="button"
          className="q-steps-head"
          aria-expanded={!closed}
          onClick={() => setOverride({ closed: !closed, settled })}
        >
          <Chevron />
          <span className="q-steps-main">
            {settled ? heading : <Shimmer>{heading}</Shimmer>}
          </span>
          <span className="q-steps-count">{count}</span>
        </button>
      ) : (
        <div className="q-steps-head">
          <span className="q-steps-main">
            {settled ? heading : <Shimmer>{heading}</Shimmer>}
          </span>
          <span className="q-steps-count">{count}</span>
        </div>
      )}

      <div className="q-steps-list" role="list">
        {steps.map((s, i) => (
          <div
            key={s.id}
            role="listitem"
            className={`q-step ${STATUS_CLASS[s.status]}`}
            style={{ animationDelay: delayFor(s.id, i) }}
          >
            <span className="q-step-mark">
              {s.status === "done" ? <Tick /> : s.icon}
            </span>
            <span>
              {s.status === "running" ? <Shimmer>{s.label}</Shimmer> : s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
