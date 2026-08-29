"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "./useIsClient";

/* ───────────────────────────────────────────────────────────────
   Popover and Tooltip — anchored surfaces.

   Both portal to <body> and position themselves in fixed viewport
   coordinates, so they escape any clipped or transformed ancestor
   and never need a z-index war with the host app.

   Placement is measured, not guessed: the surface is rendered, its
   real size read, and only then positioned — which is what lets it
   flip to the other side of its anchor when it would otherwise run
   off the screen.
   ─────────────────────────────────────────────────────────────── */

export type Placement = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

const GAP = 8;
const MARGIN = 8; /* keep this far off every viewport edge */

type Pos = { left: number; top: number };

function place(
  anchor: DOMRect,
  self: { width: number; height: number },
  placement: Placement,
  align: Align,
): Pos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  /* Flip to the opposite side when the preferred one has no room. */
  let p = placement;
  if (p === "top" && anchor.top - self.height - GAP < MARGIN) p = "bottom";
  else if (p === "bottom" && anchor.bottom + self.height + GAP > vh - MARGIN) p = "top";
  else if (p === "left" && anchor.left - self.width - GAP < MARGIN) p = "right";
  else if (p === "right" && anchor.right + self.width + GAP > vw - MARGIN) p = "left";

  const vertical = p === "top" || p === "bottom";

  const cross = (start: number, size: number, selfSize: number) => {
    if (align === "start") return start;
    if (align === "end") return start + size - selfSize;
    return start + size / 2 - selfSize / 2;
  };

  let left: number;
  let top: number;

  if (vertical) {
    left = cross(anchor.left, anchor.width, self.width);
    top = p === "top" ? anchor.top - self.height - GAP : anchor.bottom + GAP;
  } else {
    left = p === "left" ? anchor.left - self.width - GAP : anchor.right + GAP;
    top = cross(anchor.top, anchor.height, self.height);
  }

  /* Clamp along the cross axis so a wide surface never leaves the
     viewport, even when its anchor sits at the very edge. */
  left = Math.min(Math.max(left, MARGIN), Math.max(MARGIN, vw - self.width - MARGIN));
  top = Math.min(Math.max(top, MARGIN), Math.max(MARGIN, vh - self.height - MARGIN));

  return { left, top };
}

function useAnchoredPosition(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  selfRef: React.RefObject<HTMLElement | null>,
  placement: Placement,
  align: Align,
) {
  const [pos, setPos] = useState<Pos | null>(null);

  const measure = useCallback(() => {
    const anchor = anchorRef.current;
    const self = selfRef.current;
    if (!anchor || !self) return;
    setPos(place(anchor.getBoundingClientRect(), self.getBoundingClientRect(), placement, align));
  }, [anchorRef, selfRef, placement, align]);

  /* Measure before paint, so the surface never shows at 0,0 first.
     A closed surface keeps its last position rather than clearing it:
     it is parked off-screen and hidden either way, and re-measuring
     on open happens before the browser paints, so there is nothing to
     flash. */
  useLayoutEffect(() => {
    if (!open) return;
    measure();
  }, [open, measure]);

  useEffect(() => {
    if (!open) return;
    /* `true` catches scrolls in any ancestor, not just the window. */
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure]);

  return pos;
}

/* ── Popover ──────────────────────────────────────────────────── */

export type PopoverProps = {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose?: () => void;
  placement?: Placement;
  align?: Align;
  /** Small uppercase mono line above the rows. */
  heading?: string;
  minWidth?: number;
  children: React.ReactNode;
};

export function Popover({
  open,
  anchorRef,
  onClose,
  placement = "top",
  align = "center",
  heading,
  minWidth,
  children,
}: PopoverProps) {
  const selfRef = useRef<HTMLDivElement | null>(null);
  const isClient = useIsClient();

  const pos = useAnchoredPosition(open, anchorRef, selfRef, placement, align);

  /* Escape and outside-click both close. The anchor is excluded so a
     toggle button does not close and reopen on the same click. */
  useEffect(() => {
    if (!open || !onClose) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (selfRef.current?.contains(t)) return;
      if (anchorRef.current?.contains(t)) return;
      onClose();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, onClose, anchorRef]);

  if (!isClient) return null;

  return createPortal(
    <div
      ref={selfRef}
      className={`q-popover${open && pos ? " is-on" : ""}`}
      style={{ left: pos?.left ?? -9999, top: pos?.top ?? -9999, minWidth }}
      role="dialog"
      aria-hidden={!open}
    >
      {heading && <div className="q-popover-head">{heading}</div>}
      <div className="q-popover-body">{children}</div>
    </div>,
    document.body,
  );
}

export function PopoverRow({
  children,
  hint,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  /** Right-hand mono detail: a count, a shortcut, a timestamp. */
  hint?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  const cls = `q-popover-row${active ? " is-on" : ""}`;
  const inner = (
    <>
      <span>{children}</span>
      {hint !== undefined && <span className="q-popover-k">{hint}</span>}
    </>
  );

  /* A row that does nothing should not be a button. */
  return onClick ? (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export function PopoverEmpty({ children }: { children: React.ReactNode }) {
  return <p className="q-popover-empty">{children}</p>;
}

/* ── Tooltip ──────────────────────────────────────────────────── */

export function Tooltip({
  open,
  anchorRef,
  placement = "top",
  align = "center",
  children,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  placement?: Placement;
  align?: Align;
  children: React.ReactNode;
}) {
  const selfRef = useRef<HTMLDivElement | null>(null);
  const isClient = useIsClient();

  const pos = useAnchoredPosition(open, anchorRef, selfRef, placement, align);

  if (!isClient) return null;

  return createPortal(
    <div
      ref={selfRef}
      className={`q-tooltip${open && pos ? " is-on" : ""}`}
      style={{ left: pos?.left ?? -9999, top: pos?.top ?? -9999 }}
      role="tooltip"
    >
      {children}
    </div>,
    document.body,
  );
}
