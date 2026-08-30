"use client";

import { useRef, useState } from "react";
import { AvatarStack } from "@/components/quorum/primitives";
import { timeAgo } from "@/lib/quorum/relative-time";
import { useReviewSession } from "./ReviewSession";

/* ───────────────────────────────────────────────────────────────
   ReviewDock — the floating control dialog.

   Draggable by its grip: drop it near the left edge and it docks
   into the corner as a vertical stack; drop it anywhere else and it
   returns to the bottom centre. Threads and Actions open as an
   extension of the box itself — same width, zero gap — so the
   dialog grows rather than spawning a detached popover.
   ─────────────────────────────────────────────────────────────── */

type DockSide = "bottom" | "left";

function IconGrip() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="5.5" cy="4" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="4" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconMove() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 2l9 7-4 .8L11 14l-2 1-2-4.2L4 13z" />
    </svg>
  );
}

function IconDraw() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2.5" y="3.5" width="11" height="9" strokeDasharray="3 2.4" />
    </svg>
  );
}

function IconSelect() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3.5" y="3.5" width="9" height="9" />
      <path d="M2 2h3M11 2h3M2 14h3M11 14h3" strokeWidth="1" />
    </svg>
  );
}

function IconThread() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" />
    </svg>
  );
}

function IconAction() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.4l2.8 2.8L13 4" />
    </svg>
  );
}

export function ReviewDock() {
  const s = useReviewSession();

  const [dock, setDock] = useState<DockSide>("bottom");
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);
  const grabOffset = useRef({ dx: 0, dy: 0 });

  const onGripDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const box = dockRef.current?.getBoundingClientRect();
    if (!box) return;
    e.preventDefault();
    grabOffset.current = { dx: e.clientX - box.left, dy: e.clientY - box.top };
    setDragPos({ x: box.left, y: box.top });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onGripMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragPos) return;
    setDragPos({
      x: e.clientX - grabOffset.current.dx,
      y: e.clientY - grabOffset.current.dy,
    });
  };

  const onGripUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragPos) return;
    setDock(e.clientX < window.innerWidth * 0.25 ? "left" : "bottom");
    setDragPos(null);
  };

  const open = s.threads.filter((t) => t.status === "open");
  const resolved = s.threads.filter((t) => t.status === "resolved");

  const dragging = dragPos !== null;

  return (
    <div
      ref={dockRef}
      className={[
        "q-dock",
        dock === "left" ? "is-left" : "is-bottom",
        dragging ? "is-dragging" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        dragging
          ? {
              left: dragPos.x,
              top: dragPos.y,
              right: "auto",
              bottom: "auto",
              margin: 0,
              width: "fit-content",
              height: "fit-content",
            }
          : undefined
      }
    >
      {/* ── the extension: same width, zero gap ─────────────────── */}
      {s.surface === "threads" && (
        <div className="q-dock-ext" role="region" aria-label="Threads">
          <div className="q-ext-head">
            threads · {s.openCount} open · {s.resolvedCount} resolved
          </div>
          {s.threads.length === 0 ? (
            <p className="q-ext-empty">
              No threads yet. Draw a region or select an element to open one.
            </p>
          ) : (
            <>
              {open.map((t) => (
                <button
                  key={t._id}
                  type="button"
                  className={`q-ext-row${t._id === s.activeThread?._id ? " is-on" : ""}`}
                  onClick={() => s.openThread(t._id)}
                >
                  <span className="q-ext-row-t">{t.title}</span>
                  <span className="q-ext-row-k">{timeAgo(t.updatedAt)}</span>
                </button>
              ))}
              {resolved.map((t) => (
                <button
                  key={t._id}
                  type="button"
                  className="q-ext-row is-resolved"
                  onClick={() => s.openThread(t._id)}
                >
                  <span className="q-ext-row-t">{t.title}</span>
                  <span className="q-ext-row-k">resolved</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
      {s.surface === "actions" && (
        <div className="q-dock-ext" role="region" aria-label="Actions">
          <div className="q-ext-head">actions · {s.actions.length}</div>
          {s.actions.length === 0 ? (
            <p className="q-ext-empty">No actions yet. They are synthesised from a thread.</p>
          ) : (
            s.actions.map((a) => (
              <button
                key={a._id}
                type="button"
                className="q-ext-row"
                onClick={() => s.openThread(a.threadId)}
              >
                <span className="q-ext-row-t">{a.title}</span>
                <span className="q-ext-row-k">{a.status}</span>
              </button>
            ))
          )}
        </div>
      )}

      {/* ── the bar ─────────────────────────────────────────────── */}
      <div className="q-dock-bar" role="toolbar" aria-label="Quorum review">
        <div className="q-dock-group">
          <button
            type="button"
            className="q-dock-handle"
            title="Drag — drop at the bottom or the left corner"
            aria-label="Move the review controls"
            onPointerDown={onGripDown}
            onPointerMove={onGripMove}
            onPointerUp={onGripUp}
          >
            <IconGrip />
          </button>
        </div>

        <div className="q-dock-group" role="group" aria-label="Mode">
          <button
            type="button"
            className={`q-tb-btn${s.mode === "move" ? " is-on" : ""}`}
            aria-pressed={s.mode === "move"}
            onClick={() => s.setMode("move")}
            title="Move — use the product normally"
          >
            <IconMove />
            <span>Move</span>
          </button>
          <button
            type="button"
            className={`q-tb-btn${s.mode === "draw" ? " is-on" : ""}`}
            aria-pressed={s.mode === "draw"}
            onClick={() => s.setMode("draw")}
            title="Draw — sweep a box over an area, Esc to leave"
          >
            <IconDraw />
            <span>Draw</span>
          </button>
          <button
            type="button"
            className={`q-tb-btn${s.mode === "select" ? " is-on" : ""}`}
            aria-pressed={s.mode === "select"}
            onClick={() => s.setMode("select")}
            title="Select — inspect and pick an element, Esc to leave"
          >
            <IconSelect />
            <span>Select</span>
          </button>
        </div>

        <div className="q-dock-group" role="group" aria-label="Review">
          <button
            type="button"
            className={`q-tb-btn${s.surface === "threads" ? " is-on" : ""}`}
            aria-pressed={s.surface === "threads"}
            onClick={() => s.toggleSurface("threads")}
            title="Threads"
          >
            <IconThread />
            <span>Threads</span>
            <span className="q-tb-count">{s.openCount}</span>
          </button>
          <button
            type="button"
            className={`q-tb-btn${s.surface === "actions" ? " is-on" : ""}`}
            aria-pressed={s.surface === "actions"}
            onClick={() => s.toggleSurface("actions")}
            title="Actions"
          >
            <IconAction />
            <span>Actions</span>
            <span className="q-tb-count">{s.actions.length}</span>
          </button>
        </div>

        {s.participants.length > 0 && (
          <div className="q-dock-group q-dock-people" role="group" aria-label="Present">
            <AvatarStack people={s.participants} size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
