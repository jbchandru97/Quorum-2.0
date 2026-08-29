/* ───────────────────────────────────────────────────────────────
   Provenance — where an answer came from.

   Deliberately NOT a `"use client"` module. A plain object exported
   from a client module reaches a server component as a client
   reference, not as data: `Object.entries` on it comes back empty,
   silently, and a legend renders as nothing at all. Keeping the data
   here lets both sides import the real thing.

   The marks are distinguished by shape as well as colour, so they
   survive greyscale, colour blindness, and a projector that eats
   saturation. See `primitives.css` → `.q-prov`.
   ─────────────────────────────────────────────────────────────── */

export type Provenance = "fetched" | "cited" | "inferred" | "human";

/** Shape-first descriptions, used for titles, tooltips and legends. */
export const PROVENANCE_LEGEND: Record<Provenance, string> = {
  fetched: "Fetched data",
  cited: "Cited source",
  inferred: "Model inference",
  human: "Said by a teammate",
};

/** Stable order for anywhere the full set is listed. */
export const PROVENANCE_ORDER: Provenance[] = [
  "fetched",
  "cited",
  "inferred",
  "human",
];
