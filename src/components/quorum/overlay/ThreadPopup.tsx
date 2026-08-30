"use client";

import { useEffect, useRef, useState } from "react";
import type { Rect } from "@/components/quorum/primitives";
import { IconClose, IconExpand } from "./icons";
import { useReviewSession } from "./ReviewSession";
import { ResolveButton, ThreadBody, useThreadMeta } from "./ThreadContent";

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

export function ThreadPopup() {
  const s = useReviewSession();
  const { activeThread, selection, panelOpen, threadView } = s;
  const { title, hasSubject } = useThreadMeta();
  const popRef = useRef<HTMLDivElement | null>(null);

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

  /* The dialog docks to the count bubble, not the target's whole
     rectangle — the bubble sits at the anchor's top-right corner
     (same maths as ThreadMarkers). Right of the bubble when there
     is room, left of it otherwise; everything clamps on-screen. */
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxHeight = Math.min(520, vh - 2 * MARGIN - 60);
  const MARKER = 22;
  const markerLeft = Math.min(Math.max(anchor.x + anchor.width - 10, 8), vw - 30);
  const markerTop = Math.max(anchor.y - 10, 8);
  const fitsRight = markerLeft + MARKER + GAP + WIDTH <= vw - MARGIN;
  const left = fitsRight
    ? markerLeft + MARKER + GAP
    : Math.max(markerLeft - GAP - WIDTH, MARGIN);
  const top = Math.min(Math.max(markerTop - 4, MARGIN), Math.max(MARGIN, vh - maxHeight - MARGIN));

  return (
    <div
      ref={popRef}
      className="q-thread-pop"
      style={{ left, top, width: WIDTH, maxHeight }}
      role="dialog"
      aria-label={title}
      data-side={fitsRight ? "right" : "left"}
    >
      <header className="q-thread-pop-head">
        <div className="q-thread-pop-t">{title}</div>
        <ResolveButton />
        <button
          type="button"
          className="q-pop-icon"
          onClick={() => {
            const r = popRef.current?.getBoundingClientRect();
            s.expandThread(
              r ? { x: r.x, y: r.y, width: r.width, height: r.height } : undefined,
            );
          }}
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
          <IconClose />
        </button>
      </header>
      <ThreadBody />
    </div>
  );
}
