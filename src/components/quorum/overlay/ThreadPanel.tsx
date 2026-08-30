"use client";

import { SidePanel } from "@/components/quorum/primitives";
import { useReviewSession } from "./ReviewSession";
import { ResolveButton, ThreadBody, useThreadMeta } from "./ThreadContent";

/* ───────────────────────────────────────────────────────────────
   ThreadPanel — the expanded frame.

   The popup is the default; this pinned right-edge panel is what
   the popup's expand control promotes into, for longer reading and
   writing. Its close returns the screen to the product.
   ─────────────────────────────────────────────────────────────── */

export function ThreadPanel() {
  const s = useReviewSession();
  const { title, hasSubject } = useThreadMeta();

  const open = s.panelOpen && hasSubject && s.threadView === "panel";

  return (
    <SidePanel
      open={open}
      onClose={s.closePanel}
      rail={false}
      title={
        <span className="q-panel-title-row">
          {title}
          <ResolveButton />
        </span>
      }
      width={404}
    >
      <ThreadBody />
    </SidePanel>
  );
}
