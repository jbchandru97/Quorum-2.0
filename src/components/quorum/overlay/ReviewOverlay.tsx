"use client";

import { useRef } from "react";
import {
  AvatarStack,
  FloatingToolbar,
  OverlayRoot,
  Popover,
  PopoverEmpty,
  PopoverRow,
  ToolbarButton,
  ToolbarGroup,
} from "@/components/quorum/primitives";
import { timeAgo } from "@/lib/quorum/relative-time";
import { QuorumMark } from "../QuorumMark";
import { useReviewSession } from "./ReviewSession";
import { SelectionLayer } from "./SelectionLayer";
import { ThreadMarkers } from "./ThreadMarkers";
import { ThreadPanel } from "./ThreadPanel";
import "./review.css";

/* ───────────────────────────────────────────────────────────────
   ReviewOverlay — the review chrome, live.

   Composes the real behaviour: hit-testing and drawing, markers,
   the thread panel, and a bottom bar whose counts and popovers are
   Convex subscriptions rather than placeholders.
   ─────────────────────────────────────────────────────────────── */

function IconFlow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 2l9 7-4 .8L11 14l-2 1-2-4.2L4 13z" />
    </svg>
  );
}

function IconInspect() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2.5" y="2.5" width="11" height="11" strokeDasharray="3 2.4" />
      <path d="M8 5.5v5M5.5 8h5" />
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

export function ReviewOverlay() {
  const s = useReviewSession();
  const threadsRef = useRef<HTMLButtonElement | null>(null);
  const actionsRef = useRef<HTMLButtonElement | null>(null);

  const open = s.threads.filter((t) => t.status === "open");
  const resolved = s.threads.filter((t) => t.status === "resolved");

  return (
    <OverlayRoot>
      <SelectionLayer />
      <ThreadMarkers />

      <FloatingToolbar>
        <ToolbarGroup label="Quorum">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0 6px 0 4px",
              font: "500 11.5px/1 var(--q-body)",
              color: "var(--q-ink)",
            }}
          >
            <QuorumMark size={15} />
            Review
          </span>
        </ToolbarGroup>

        <ToolbarGroup label="Mode">
          <ToolbarButton
            icon={<IconFlow />}
            active={s.mode === "flow"}
            onClick={() => s.setMode("flow")}
            title="Use the product normally"
          >
            Free flow
          </ToolbarButton>
          <ToolbarButton
            icon={<IconInspect />}
            active={s.mode === "inspect"}
            onClick={() => s.setMode("inspect")}
            title="Click an element, or drag a region — Esc to leave"
          >
            Inspect
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup label="Review">
          <ToolbarButton
            ref={threadsRef}
            icon={<IconThread />}
            count={s.openCount}
            active={s.surface === "threads"}
            onClick={() => s.toggleSurface("threads")}
            title="Threads"
          >
            Threads
          </ToolbarButton>
          <ToolbarButton
            ref={actionsRef}
            icon={<IconAction />}
            count={s.actions.length}
            active={s.surface === "actions"}
            onClick={() => s.toggleSurface("actions")}
            title="Actions"
          >
            Actions
          </ToolbarButton>
        </ToolbarGroup>

        {s.participants.length > 0 && (
          <ToolbarGroup label="Present">
            <span style={{ padding: "0 4px" }}>
              <AvatarStack people={s.participants} size={22} />
            </span>
          </ToolbarGroup>
        )}
      </FloatingToolbar>

      <Popover
        open={s.surface === "threads"}
        anchorRef={threadsRef}
        onClose={s.closeSurfaces}
        heading={`Threads · ${s.openCount} open · ${s.resolvedCount} resolved`}
        minWidth={300}
      >
        {s.threads.length === 0 ? (
          <PopoverEmpty>
            No threads yet. Selecting an element or drawing a region opens one.
          </PopoverEmpty>
        ) : (
          <>
            {open.map((t) => (
              <PopoverRow
                key={t._id}
                active={t._id === s.activeThread?._id}
                hint={timeAgo(t.updatedAt)}
                onClick={() => s.openThread(t._id)}
              >
                {t.title}
              </PopoverRow>
            ))}
            {resolved.map((t) => (
              <PopoverRow
                key={t._id}
                hint={`resolved · ${timeAgo(t.updatedAt)}`}
                onClick={() => s.openThread(t._id)}
              >
                {t.title}
              </PopoverRow>
            ))}
          </>
        )}
      </Popover>

      <Popover
        open={s.surface === "actions"}
        anchorRef={actionsRef}
        onClose={s.closeSurfaces}
        heading={`Actions · ${s.actions.length}`}
        minWidth={320}
      >
        {s.actions.length === 0 ? (
          <PopoverEmpty>No actions yet. They are synthesised from a thread.</PopoverEmpty>
        ) : (
          s.actions.map((a) => (
            <PopoverRow key={a._id} hint={a.status} onClick={() => s.openThread(a.threadId)}>
              {a.title}
            </PopoverRow>
          ))
        )}
      </Popover>

      <ThreadPanel />
    </OverlayRoot>
  );
}
