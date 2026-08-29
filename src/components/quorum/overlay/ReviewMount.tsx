"use client";

import { useSyncExternalStore } from "react";
import { ReviewOverlay } from "./ReviewOverlay";
import type { Person } from "@/components/quorum/primitives";

/* ───────────────────────────────────────────────────────────────
   ReviewMount — puts the review chrome over the cloned host app.

   Gated behind `?review=1` for now, so /demo/playground keeps
   behaving exactly like the app it was cloned from. The case study
   at /demo/intro embeds the prototype in iframes, and those embeds
   must not pick up a floating bar.

   The flag is read from `window.location` in an effect rather than
   through `useSearchParams`, because that hook opts every page under
   this layout out of static rendering — a real cost paid by the whole
   demo for one switch that only matters on the client.

   Tomorrow this gate comes off and the overlay becomes the default
   for the review surface.
   ─────────────────────────────────────────────────────────────── */

/* Seeded from /docs/08-DEMO_DATA.md. Presence is not wired yet; this
   is what the stack will show once it is. */
const PARTICIPANTS: Person[] = [
  { id: "u_maya", name: "Maya", role: "Designer", active: true },
  { id: "u_rohan", name: "Rohan", role: "PM", active: true },
  { id: "u_arun", name: "Arun", role: "Engineer", active: true },
];

/* The URL does not change under the overlay without a navigation
   that remounts it, so the store never has to notify. */
const subscribe = () => () => {};

function readFlag(): boolean {
  const params = new URLSearchParams(window.location.search);
  /* Never inside an embed: the case study frames the prototype, and
     the review chrome is not part of that story. */
  const framed = window !== window.parent;
  return params.get("review") === "1" && !framed;
}

export function ReviewMount() {
  const on = useSyncExternalStore(subscribe, readFlag, () => false);

  if (!on) return null;
  return <ReviewOverlay participants={PARTICIPANTS} />;
}
