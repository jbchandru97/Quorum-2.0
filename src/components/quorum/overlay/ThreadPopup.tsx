"use client";

import { useEffect, useState } from "react";
import type { Rect } from "@/components/quorum/primitives";
import { useReviewSession } from "./ReviewSession";
import { ThreadBody, useThreadMeta } from "./ThreadContent";

/* ───────────────────────────────────────────────────────────────
   ThreadPopup — the conversation, docked to its bubble.

   The default frame: a dialog beside the marker (or the fresh
   selection), on whichever side has room, with a maximum height and
   its own scroll — so the product stays visible while the thread is
   read. The header's expand control promotes it to the side panel
   for longer sessions.
   ─────────────────────────────────────────────────────────────── */

const WIDTH = 336;
const GAP = 14;
const MARGIN = 12;

function IconExpand() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M7 1.5h3.5V5M5 11.5H1.5V8M10.5 1.5L7 5M1.5 10.5L5 7" />
    </svg>
  );
}

export function ThreadPopup() {
  const s = useReviewSession();
  const { activeThread, selection, panelOpen, threadView } = s;
  const { title, subtitle, hasSubject } = useThreadMeta();

  const open = panelOpen && hasSubject && threadView === "popup";

  /* Track the anchor: the selection, or the open thread's target. */
  const [anchor, setAnchor] = useState<Rect | null>(null);
  useEffect(() => {
    if (!open) return;
    const compute = (): Rect | null => {
      if (selection) {
        if (selection.kind === "region") return selection.rect;
        const el = document.querySelector(selection.selector);
        if (el) {
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        }
        return selection.rect;
      }
      const a = activeThread?.anchorData;
      if (!a) return null;
      if (a.type === "element") {
        const el = document.querySelector(a.selector);
        if (el) {
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        }
        return a.rect ?? null;
      }
      return { x: a.x, y: a.y, width: a.width, height: a.height };
    };
    const update = () => setAnchor(compute());
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const iv = setInterval(update, 500);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      clearInterval(iv);
    };
  }, [open, selection, activeThread]);

  if (!open || !anchor) return null;

  /* Side with room wins; right is preferred. Everything clamps to
     the viewport so the dialog never leaves the screen. */
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxHeight = Math.min(520, vh - 2 * MARGIN - 60);
  const fitsRight = anchor.x + anchor.width + GAP + WIDTH <= vw - MARGIN;
  const left = fitsRight
    ? Math.min(anchor.x + anchor.width + GAP, vw - WIDTH - MARGIN)
    : Math.max(anchor.x - GAP - WIDTH, MARGIN);
  const top = Math.min(Math.max(anchor.y - 6, MARGIN), Math.max(MARGIN, vh - maxHeight - MARGIN));

  return (
    <div
      className="q-thread-pop"
      style={{ left, top, width: WIDTH, maxHeight }}
      role="dialog"
      aria-label={title}
      data-side={fitsRight ? "right" : "left"}
    >
      <header className="q-thread-pop-head">
        <div className="q-thread-pop-t">
          {title}
          {subtitle && <span>{subtitle}</span>}
        </div>
        <button
          type="button"
          className="q-pop-icon"
          onClick={s.expandThread}
          title="Expand into the side panel"
          aria-label="Expand thread"
        >
          <IconExpand />
        </button>
        <button
          type="button"
          className="q-pop-icon"
          onClick={s.closePanel}
          title="Close"
          aria-label="Close thread"
        >
          ×
        </button>
      </header>
      <ThreadBody />
    </div>
  );
}
