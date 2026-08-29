"use client";

import { useRef, useState } from "react";
import {
  AvatarStack,
  FloatingToolbar,
  OverlayRoot,
  Popover,
  PopoverEmpty,
  SidePanel,
  ToolbarButton,
  ToolbarGroup,
  type Person,
} from "@/components/quorum/primitives";
import { QuorumMark } from "../QuorumMark";

/* ───────────────────────────────────────────────────────────────
   ReviewOverlay — the review chrome, mounted over the host product.

   SHELL ONLY. It composes the primitives into the bar, the panel and
   the popovers the review needs, and holds the small pieces of state
   that are genuinely UI-local per /docs/03-ARCHITECTURE.md: the
   current mode, and whether a surface is open.

   Deliberately absent, and due tomorrow:
     · hit-testing the host DOM to find an element target
     · drag-to-draw region selection
     · creating a thread from either of those
     · threads, messages, presence, agent answers, actions

   Because it does not hit-test yet, the mode buttons change what the
   bar says is selected and nothing else. That is honest — the bar is
   real chrome around behaviour that has not been built.
   ─────────────────────────────────────────────────────────────── */

type Mode = "select" | "draw";

function IconSelect() {
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

export function ReviewOverlay({
  participants = [],
}: {
  participants?: Person[];
}) {
  const [mode, setMode] = useState<Mode>("select");
  const [panelOpen, setPanelOpen] = useState(false);

  const threadsRef = useRef<HTMLButtonElement | null>(null);
  const actionsRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<"threads" | "actions" | null>(null);

  /* One popover at a time — opening either closes the other. */
  const toggle = (which: "threads" | "actions") =>
    setOpen((cur) => (cur === which ? null : which));

  return (
    <OverlayRoot>
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
            icon={<IconSelect />}
            active={mode === "select"}
            onClick={() => setMode("select")}
            title="Select an element"
          >
            Select
          </ToolbarButton>
          <ToolbarButton
            icon={<IconDraw />}
            active={mode === "draw"}
            onClick={() => setMode("draw")}
            title="Draw over a region"
          >
            Draw
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup label="Review">
          <ToolbarButton
            ref={threadsRef}
            icon={<IconThread />}
            count="—"
            active={open === "threads"}
            onClick={() => toggle("threads")}
            title="Threads"
          >
            Threads
          </ToolbarButton>
          <ToolbarButton
            ref={actionsRef}
            icon={<IconAction />}
            count="—"
            active={open === "actions"}
            onClick={() => toggle("actions")}
            title="Actions"
          >
            Actions
          </ToolbarButton>
        </ToolbarGroup>

        {participants.length > 0 && (
          <ToolbarGroup label="Present">
            <span style={{ padding: "0 4px" }}>
              <AvatarStack people={participants} size={22} />
            </span>
          </ToolbarGroup>
        )}
      </FloatingToolbar>

      <Popover
        open={open === "threads"}
        anchorRef={threadsRef}
        onClose={() => setOpen(null)}
        heading="Threads"
        minWidth={260}
      >
        <PopoverEmpty>
          No threads yet. Selecting an element or drawing a region will open one.
        </PopoverEmpty>
      </Popover>

      <Popover
        open={open === "actions"}
        anchorRef={actionsRef}
        onClose={() => setOpen(null)}
        heading="Actions"
        minWidth={260}
      >
        <PopoverEmpty>
          No actions yet. They are synthesised from a thread.
        </PopoverEmpty>
      </Popover>

      <SidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onRailClick={() => setPanelOpen((v) => !v)}
        railLabel="thread"
        title="No thread selected"
        subtitle="the conversation surface"
      >
        <p
          style={{
            font: "400 12.5px/1.55 var(--q-body)",
            color: "var(--q-muted)",
            maxWidth: "44ch",
          }}
        >
          A thread opens here when a target is selected on the page: the target
          summary, the conversation between the agent and the team, and the
          controls to resolve it or turn it into actions.
        </p>
      </SidePanel>
    </OverlayRoot>
  );
}
