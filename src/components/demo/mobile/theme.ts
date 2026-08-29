/* ───────────────────────────────────────────────────────────────
   Premium styling tokens for the mobile app.

   Reference pattern (Revolut · Starling · Klarna): the balance is not
   a card — it sits directly on a saturated gradient header, quick
   actions follow as glass circles, and a white sheet rides up over
   the gradient carrying the widgets.

   Navigation (Calm · CLEAR · Play · Notion): a floating blurred pill
   inset from the edges, with a lozenge that slides between items.
   ─────────────────────────────────────────────────────────────── */

/* Brand ramp, reversed so the deep indigo sits under the status bar
   (white text stays legible) and the light end meets the white sheet. */
export const HEADER_GRAD =
  "linear-gradient(168deg, #130360 0%, #2A0F7A 16%, #4128A8 32%, #4E29DD 52%, #6A46E4 70%, #7454E8 84%, #8E6FEE 100%)";

/* A soft off-axis highlight keeps the header from looking like flat vinyl. */
export const HEADER_SHEEN =
  "radial-gradient(120% 70% at 78% 8%, rgba(219,162,211,0.34) 0%, rgba(219,162,211,0) 58%), " +
  "radial-gradient(90% 55% at 12% 0%, rgba(180,158,250,0.26) 0%, rgba(180,158,250,0) 60%)";

export const GRAD =
  "linear-gradient(135deg, #DBA2D3 21%, #C3A0EB 36%, #B49EFA 45%, #9479F1 58%, #7454E8 69%, #4E29DD 83%, #130360 97%)";

export const gradTint = (a: number) =>
  `linear-gradient(135deg, rgba(219,162,211,${a}) 21%, rgba(195,160,235,${a}) 36%, rgba(180,158,250,${a}) 45%, rgba(148,121,241,${a}) 58%, rgba(116,84,232,${a}) 69%, rgba(78,41,221,${a}) 83%, rgba(19,3,96,${a}) 97%)`;

/* ─── surfaces ─── */
export const SHEET_RADIUS = 28;

/* Cards sit on white, so separation comes from a hairline plus a soft
   two-stage shadow rather than a hard border. */
export const CARD_SHADOW =
  "0 1px 2px rgba(16,24,40,0.04), 0 10px 28px -12px rgba(16,24,40,0.14)";
export const CARD_SHADOW_LIFTED =
  "0 1px 2px rgba(16,24,40,0.05), 0 18px 42px -14px rgba(16,24,40,0.20)";
export const HAIRLINE = "1px solid rgba(16,24,40,0.06)";
export const DIVIDER = "1px solid rgba(16,24,40,0.05)";

export const NAV_SHADOW =
  "0 2px 6px rgba(16,24,40,0.06), 0 14px 40px -8px rgba(16,24,40,0.24)";

/* Glass, used for the quick actions sitting on the gradient. */
export const GLASS_BG = "rgba(255,255,255,0.17)";
export const GLASS_BG_STRONG = "rgba(255,255,255,0.26)";
export const GLASS_BORDER = "1px solid rgba(255,255,255,0.26)";

/* ─── type ─── */
export const DISPLAY = "var(--font-inter-display), Inter, sans-serif";
export const TEXT = "var(--font-inter), Inter, sans-serif";

export const STRONG = "var(--text-strong-950, #171717)";
export const SUB = "var(--text-sub-600, #5C5C5C)";
export const SOFT = "var(--text-soft-400, #A3A3A3)";

/* ─── motion ─── */
export const SPRING = { type: "spring", stiffness: 320, damping: 32, mass: 0.9 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 220, damping: 28 } as const;
export const SPRING_SNAP = { type: "spring", stiffness: 520, damping: 38 } as const;
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* The desktop prototype's shimmer easing — kept identical so the two
   builds feel like the same product. */
export const SHIMMER_EASE = [0.76, 0, 0.24, 1] as const;
