/* ───────────────────────────────────────────────────────────────
   The Quorum symbol.

   A quorum is a threshold: enough of the group present for a
   decision to count. So the mark is a ring with a filled sector —
   the share that has weighed in — and the sector is the accent.

   Geometric, not a character, and legible at 16px. No wordmark; the
   prototype does not need one.
   ─────────────────────────────────────────────────────────────── */

export function QuorumMark({
  size = 20,
  /** Light: for placing on a dark surface — the ring inverts. */
  tone = "dark",
  title,
}: {
  size?: number;
  tone?: "dark" | "light";
  title?: string;
}) {
  const ink = tone === "light" ? "#FFFFFF" : "var(--q-ink, #16171A)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title && <title>{title}</title>}

      {/* the group */}
      <circle cx="10" cy="10" r="7.25" fill="none" stroke={ink} strokeWidth="1.6" />

      {/* the share that has weighed in: a sector from 12 o'clock,
          swept clockwise past half — enough to carry */}
      <path
        d="M10 10 L10 3.6 A6.4 6.4 0 1 1 4.47 13.2 Z"
        fill="var(--q-signal, #EA7639)"
      />
    </svg>
  );
}
