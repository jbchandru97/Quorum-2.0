"use client";

/* ───────────────────────────────────────────────────────────────
   Overlay icons — one 16px grid, stroke 1.4, round caps.

   Sized and weighted identically so chrome controls read as one
   family; the CSS (`.q-pop-icon svg` etc.) sets the rendered size.
   ─────────────────────────────────────────────────────────────── */

export function IconClose() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
    </svg>
  );
}

export function IconExpand() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5L9.25 6.75M2.5 13.5L6.75 9.25" />
    </svg>
  );
}

/** Rounded stroke resolve mark: a circled check. */
export function IconResolve() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.1" />
      <path d="M5.4 8.3l1.9 1.9 3.4-3.9" />
    </svg>
  );
}
