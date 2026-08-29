"use client";

import Link from "next/link";
import { useState } from "react";
import { AvatarStack, type Person } from "@/components/quorum/primitives";

/* ───────────────────────────────────────────────────────────────
   Threads — the two-column shell.

   Shell and placeholder states only. The reviews, threads, messages
   and actions all arrive from Convex tomorrow; today this page
   establishes the layout they land in and shows, honestly, that
   nothing is stored yet.

   The one thing that is real is the review row, because the preview
   it points at genuinely exists inside this project. Its counts read
   as em dashes rather than zeros: nothing has been counted yet,
   which is not the same as having counted nothing.
   ─────────────────────────────────────────────────────────────── */

/* Seeded participants from /docs/08-DEMO_DATA.md — used here only to
   show the avatar stack in situ. */
const PARTICIPANTS: Person[] = [
  { id: "u_maya", name: "Maya", role: "Designer", active: true },
  { id: "u_rohan", name: "Rohan", role: "PM", active: true },
  { id: "u_arun", name: "Arun", role: "Engineer", active: false },
];

const FILTERS = ["Open", "Resolved", "Actions"] as const;

export default function ThreadsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Open");

  return (
    <>
      <header className="q-ws-head">
        <h1 className="q-ws-h1">Threads</h1>
        <span className="q-ws-head-note">foundation · no data layer yet</span>
      </header>

      <div className="q-ws-cols">
        {/* ── left: reviews ─────────────────────────────────── */}
        <section className="q-ws-col" aria-label="Reviews">
          <div className="q-ws-col-head">
            <span className="q-ws-col-t">Reviews</span>
            <div className="q-ws-filters" role="group" aria-label="Filter threads">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={filter === f ? "is-on" : ""}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="q-ws-col-body">
            <div className="q-ws-row is-on" aria-current="true">
              <span className="q-ws-row-t">Malbank / Aql AI</span>
              <span className="q-ws-row-url">/demo/playground</span>
              <div className="q-ws-row-meta">
                <span className="q-ws-open">— open</span>
                <span className="q-ws-sep">·</span>
                <span>— resolved</span>
                <span className="q-ws-sep">·</span>
                <span>— actions</span>
                <span style={{ marginLeft: "auto" }}>
                  <AvatarStack people={PARTICIPANTS} size={20} showPresence={false} />
                </span>
              </div>
            </div>

            <div className="q-ws-empty">
              <p className="q-ws-empty-s">
                One preview is seeded. Reviews appear here as threads are opened
                against them.
              </p>
            </div>
          </div>
        </section>

        {/* ── right: selected review ────────────────────────── */}
        <section className="q-ws-col" aria-label="Review detail">
          <div className="q-ws-col-head">
            <span className="q-ws-col-t">Review</span>
          </div>

          <div className="q-ws-col-body">
            <div className="q-ws-detail">
              <div className="q-ws-detail-head">
                <div>
                  <h2 className="q-ws-detail-t">Malbank / Aql AI</h2>
                  <Link className="q-ws-detail-url" href="/demo/playground">
                    /demo/playground
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"
                         fill="none" stroke="currentColor" strokeWidth="1.2"
                         strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 1.5h5v5M8.5 1.5L3 7M6 8.5H1.5V4" />
                    </svg>
                  </Link>
                </div>
                <div className="q-ws-detail-side">
                  <AvatarStack people={PARTICIPANTS} size={26} />
                </div>
              </div>

              <div className="q-ws-stats">
                <div className="q-ws-stat"><b>—</b><span>Open</span></div>
                <div className="q-ws-stat"><b>—</b><span>Resolved</span></div>
                <div className="q-ws-stat"><b>—</b><span>Actions</span></div>
              </div>

              <div className="q-ws-section">
                <h3 className="q-ws-section-h">Conversations</h3>
                <div className="q-ws-ghost">
                  <span className="q-ws-ghost-label">Reserved</span>
                  <p className="q-ws-empty-s">
                    Expandable thread conversations land here — each one anchored to
                    the element or region it was opened on, with the agent and human
                    replies in a single sequence.
                  </p>
                </div>
              </div>

              <div className="q-ws-section">
                <h3 className="q-ws-section-h">Actions</h3>
                <div className="q-ws-ghost">
                  <span className="q-ws-ghost-label">Reserved</span>
                  <p className="q-ws-empty-s">
                    Action items synthesised from those threads, each carrying its
                    target, scope and acceptance guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
