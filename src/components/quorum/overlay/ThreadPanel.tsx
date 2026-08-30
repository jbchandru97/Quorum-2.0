"use client";

import { useEffect, useRef } from "react";
import { IconClose } from "./icons";
import { useReviewSession } from "./ReviewSession";
import { ResolveButton, ThreadBody, useThreadMeta } from "./ThreadContent";

/* ───────────────────────────────────────────────────────────────
   ThreadPanel — the expanded frame.

   The popup is the default; this pinned right-edge column is what
   the popup's expand control promotes into. It doesn't slide in
   from off-screen: it grows out of the popup's own rectangle (a
   FLIP transform from the rect the session captured), so the
   expansion reads as the same surface changing shape.
   ─────────────────────────────────────────────────────────────── */

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

export function ThreadPanel() {
  const s = useReviewSession();
  const { title, hasSubject } = useThreadMeta();

  const open = s.panelOpen && hasSubject && s.threadView === "panel";

  const ref = useRef<HTMLDivElement | null>(null);
  const animated = useRef(false);
  const { expandFrom } = s;

  useEffect(() => {
    const el = ref.current;
    if (!open || !el) {
      animated.current = false;
      return;
    }
    if (animated.current) return;
    animated.current = true;

    if (expandFrom) {
      const to = el.getBoundingClientRect();
      el.animate(
        [
          {
            transform: `translate(${expandFrom.x - to.x}px, ${expandFrom.y - to.y}px) scale(${
              expandFrom.width / to.width
            }, ${expandFrom.height / to.height})`,
          },
          { transform: "none" },
        ],
        { duration: 440, easing: EASE },
      );
    } else {
      el.animate(
        [
          { opacity: 0, transform: "translateX(24px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 320, easing: EASE },
      );
    }
  }, [open, expandFrom]);

  if (!open) return null;

  return (
    <div ref={ref} className="q-thread-panel" role="dialog" aria-label={title}>
      <header className="q-thread-pop-head">
        <div className="q-thread-pop-t">{title}</div>
        <ResolveButton />
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
