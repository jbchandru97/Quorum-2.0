import componentMapJson from "../../../fixtures/context/component-map.json";

/* ───────────────────────────────────────────────────────────────
   Client-safe access to the curated target map.

   fixtures.ts is server-only (it reads markdown from disk), but the
   overlay needs the component map in the browser to label a hovered
   target. JSON imports bundle cleanly on both sides, so the map gets
   its own module.
   ─────────────────────────────────────────────────────────────── */

export type ReviewTarget = {
  key: string;
  label: string;
  breadcrumb: string[];
  surface: string;
  sharedWith: string[];
  sharedComponentNote: string;
};

export const REVIEW_TARGETS = componentMapJson.targets as ReviewTarget[];

/** The scripted demo's one known element target. */
export const PRIMARY_TARGET_KEY = "ai-insight-prompt";

export function targetByKey(key: string): ReviewTarget | undefined {
  return REVIEW_TARGETS.find((t) => t.key === key);
}

/** The DOM attribute the overlay hit-tests for. */
export const TARGET_ATTR = "data-quorum-target";

export function selectorFor(key: string): string {
  return `[${TARGET_ATTR}="${key}"]`;
}
