"use client";

import { createPortal } from "react-dom";
import { useIsClient } from "./useIsClient";

/* ───────────────────────────────────────────────────────────────
   OverlayRoot — the layer Quorum lives on when it sits over a host
   product.

   Two things make an overlay feel like a thin layer rather than a
   second application:

   1. It portals to <body>, so no host stacking context, transform,
      or `overflow: hidden` can clip or re-order it.
   2. It is click-through by default. Children opt back into pointer
      events, so the product underneath stays fully usable and only
      Quorum's own chrome intercepts the mouse.
   ─────────────────────────────────────────────────────────────── */

export type OverlayRootProps = {
  children: React.ReactNode;
  /** Set false to unmount the whole layer without unmounting its owner. */
  active?: boolean;
  className?: string;
};

export function OverlayRoot({ children, active = true, className }: OverlayRootProps) {
  /* Portals need a DOM target, which does not exist during SSR. */
  const isClient = useIsClient();

  if (!isClient || !active) return null;

  return createPortal(
    <div
      className={["q-overlay", className].filter(Boolean).join(" ")}
      data-quorum-overlay=""
    >
      {children}
    </div>,
    document.body,
  );
}

/* Anything purely decorative — rings, marquees, floating labels —
   wraps in this so it can never swallow a click meant for the host. */
export function OverlayPassive({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={["q-overlay-passive", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
