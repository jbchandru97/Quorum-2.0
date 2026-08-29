"use client";

/* ───────────────────────────────────────────────────────────────
   InspectHighlight — the ring that marks a target.

   Visual primitive only. It is handed a rectangle and draws on it.
   It does not hit-test, does not read the DOM, and does not know
   what a target means — deciding *what* is under the cursor is a
   separate concern that belongs with selection, not with drawing.

   The important detail is that this is one element that moves. Its
   left/top/width/height are transitioned, so as the caller feeds it
   new rectangles the ring glides between targets. Rendering a fresh
   ring per target would blink instead, and lose the sense that one
   instrument is being pointed at things.
   ─────────────────────────────────────────────────────────────── */

export type Rect = { x: number; y: number; width: number; height: number };

export type InspectVariant =
  /** Under the pointer right now. */
  | "hover"
  /** Committed — carries corner handles. */
  | "selected"
  /** A candidate or an in-progress drag; dashed, unfilled. */
  | "tentative"
  /** The region an agent is currently working on; breathes slowly. */
  | "scope";

export type InspectHighlightProps = {
  /** Viewport coordinates. Null hides the ring without unmounting it. */
  rect: Rect | null;
  label?: string;
  variant?: InspectVariant;
  /** Grown around the target so the ring never sits on its edge. */
  inset?: number;
};

const VARIANT_CLASS: Record<InspectVariant, string> = {
  hover: "",
  selected: "is-selected",
  tentative: "is-tentative",
  scope: "is-scope",
};

/* Below this much headroom the label would be clipped by the top of
   the viewport, so it flips under the ring instead. */
const LABEL_CLEARANCE = 22;

export function InspectHighlight({
  rect,
  label,
  variant = "hover",
  inset = 3,
}: InspectHighlightProps) {
  const on = rect !== null;

  /* Keep the last rect while fading out, so the ring dissolves in
     place rather than snapping to the top-left corner. */
  const r = rect ?? { x: 0, y: 0, width: 0, height: 0 };
  const labelBelow = on && r.y - inset < LABEL_CLEARANCE;

  return (
    <div
      className={[
        "q-inspect",
        on ? "is-on" : "",
        VARIANT_CLASS[variant],
        labelBelow ? "label-below" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        left: r.x - inset,
        top: r.y - inset,
        width: r.width + inset * 2,
        height: r.height + inset * 2,
      }}
      aria-hidden="true"
    >
      {label && <span className="q-inspect-label">{label}</span>}
      {variant === "selected" && <span className="q-inspect-c" />}
    </div>
  );
}
