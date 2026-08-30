"use client";

import { SidePanel } from "@/components/quorum/primitives";
import { useReviewSession } from "./ReviewSession";
import { ThreadBody, useThreadMeta } from "./ThreadContent";

/* ───────────────────────────────────────────────────────────────
   ThreadPanel — the expanded frame.

   The popup is the default; this pinned right-edge panel is what
   the popup's expand control promotes into, for longer reading and
   writing. Its close returns the screen to the product.
   ─────────────────────────────────────────────────────────────── */

export function ThreadPanel() {
  const s = useReviewSession();
  const { title, subtitle, hasSubject } = useThreadMeta();

  const open = s.panelOpen && hasSubject && s.threadView === "panel";

  return (
    <SidePanel
      open={open}
      onClose={s.closePanel}
      rail={false}
      title={title}
      subtitle={subtitle}
      width={404}
    >
      <ThreadBody />
    </SidePanel>
  );
}
