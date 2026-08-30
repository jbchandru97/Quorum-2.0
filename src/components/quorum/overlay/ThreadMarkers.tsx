"use client";

import { useEffect, useState } from "react";
import type { Rect } from "@/components/quorum/primitives";
import { useReviewSession } from "./ReviewSession";

/* ───────────────────────────────────────────────────────────────
   ThreadMarkers — every selection leaves a visible bubble.

   Element anchors re-resolve their selector on scroll and resize so
   the bubble rides with the target; region anchors keep the viewport
   rectangle they were drawn in. Open markers show; the marker for
   the open thread reads stronger; resolved ones surface through the
   thread list instead of cluttering the canvas.
   ─────────────────────────────────────────────────────────────── */

export function ThreadMarkers() {
  const { threads, activeThread, openThread } = useReviewSession();
  const [rects, setRects] = useState<Record<string, Rect | null>>({});

  useEffect(() => {
    const update = () => {
      const next: Record<string, Rect | null> = {};
      for (const t of threads) {
        const a = t.anchorData;
        if (a.type === "element") {
          const el = document.querySelector(a.selector);
          if (el) {
            const r = el.getBoundingClientRect();
            next[t._id] = { x: r.x, y: r.y, width: r.width, height: r.height };
          } else {
            next[t._id] = a.rect ?? null;
          }
        } else {
          next[t._id] = { x: a.x, y: a.y, width: a.width, height: a.height };
        }
      }
      setRects(next);
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const iv = setInterval(update, 600);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      clearInterval(iv);
    };
  }, [threads]);

  /* Stable numbering: creation order, independent of list order. */
  const ordered = [...threads].sort((a, b) => a.createdAt - b.createdAt);

  return (
    <>
      {ordered.map((t, i) => {
        if (t.status === "resolved" && t._id !== activeThread?._id) return null;
        const r = rects[t._id];
        if (!r) return null;
        const left = Math.min(Math.max(r.x + r.width - 10, 8), window.innerWidth - 30);
        const top = Math.max(r.y - 10, 8);
        return (
          <button
            key={t._id}
            type="button"
            className={`q-marker${t._id === activeThread?._id ? " is-on" : ""}`}
            style={{ left, top }}
            title={t.title}
            onClick={() => openThread(t._id)}
          >
            {i + 1}
          </button>
        );
      })}
    </>
  );
}
