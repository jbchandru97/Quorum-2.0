"use client";

import { OverlayRoot } from "@/components/quorum/primitives";
import { QuorumLogo } from "./icons";
import { useReviewSession } from "./ReviewSession";
import { ReviewDock } from "./ReviewDock";
import { SelectionLayer } from "./SelectionLayer";
import { ThreadMarkers } from "./ThreadMarkers";
import { ThreadPanel } from "./ThreadPanel";
import { ThreadPopup } from "./ThreadPopup";
import "./review.css";

/* ───────────────────────────────────────────────────────────────
   ReviewOverlay — the review chrome, live.

   Folded by default: a viewer opening a review link gets only a
   quiet launcher bubble. Opening it brings up the whole instrument
   — selection layer, markers, the dockable controls, and threads as
   anchored popups that can expand into the side panel.
   ─────────────────────────────────────────────────────────────── */

export function ReviewOverlay() {
  const s = useReviewSession();

  if (!s.expanded) {
    return (
      <OverlayRoot>
        <button
          type="button"
          className="q-launcher"
          onClick={s.expand}
          title="Open Quorum review"
          aria-label="Open Quorum review"
        >
          <QuorumLogo size={22} />
        </button>
      </OverlayRoot>
    );
  }

  return (
    <OverlayRoot>
      <SelectionLayer />
      <ThreadMarkers />
      <ReviewDock />
      <ThreadPopup />
      <ThreadPanel />
    </OverlayRoot>
  );
}
