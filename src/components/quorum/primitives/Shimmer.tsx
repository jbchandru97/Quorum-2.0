"use client";

/* ───────────────────────────────────────────────────────────────
   Shimmer and Skeleton — the loading treatments.

   Shimmer sweeps a light through the words themselves. It beats a
   spinner because the text you are waiting on is the thing that
   animates: you read the step while it runs, and the moment it stops
   shimmering is the moment it is done.

   Skeleton is the block form, for a shape whose content has not
   arrived at all.
   ─────────────────────────────────────────────────────────────── */

export function Shimmer({
  children,
  /** Off freezes the sweep and restores solid ink, for a finished row. */
  active = true,
  as: Tag = "span",
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  as?: "span" | "div" | "p";
  className?: string;
}) {
  /* The highlight's half-width. Scaled to the text so one pass reads
     as a single light crossing the phrase, rather than a wide wash on
     a short label or a narrow glint on a long one. */
  const spread =
    typeof children === "string" ? Math.max(24, Math.round(children.length * 2)) : 60;

  return (
    <Tag
      className={[active ? "q-shimmer" : "", className].filter(Boolean).join(" ")}
      style={active ? ({ "--q-spread": `${spread}px` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

export function Skeleton({
  width,
  height = 12,
  className,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  return (
    <span
      className={["q-skeleton", className].filter(Boolean).join(" ")}
      style={{ display: "block", width: width ?? "100%", height }}
      aria-hidden="true"
    />
  );
}

/* A few lines of not-yet-arrived prose. The last line is short, the
   way a real paragraph ends. */
export function SkeletonLines({
  lines = 3,
  gap = 8,
}: {
  lines?: number;
  gap?: number;
}) {
  return (
    <span style={{ display: "flex", flexDirection: "column", gap }} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? "62%" : "100%"} height={11} />
      ))}
    </span>
  );
}
