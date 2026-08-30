"use client";

import { OverlayRoot } from "@/components/quorum/primitives";
import { ReviewDock } from "./ReviewDock";
import { SelectionLayer } from "./SelectionLayer";
import { ThreadMarkers } from "./ThreadMarkers";
import { ThreadPanel } from "./ThreadPanel";
import "./review.css";

/* ───────────────────────────────────────────────────────────────
   ReviewOverlay — the review chrome, live.

   Composes the real behaviour: the three-mode selection layer,
   markers, the thread panel, and the dockable control dialog whose
   counts and lists are Convex subscriptions.
   ─────────────────────────────────────────────────────────────── */

export function ReviewOverlay() {
  return (
    <OverlayRoot>
      <SelectionLayer />
      <ThreadMarkers />
      <ReviewDock />
      <ThreadPanel />
    </OverlayRoot>
  );
}
