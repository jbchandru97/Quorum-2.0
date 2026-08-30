"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ReviewOverlay } from "./ReviewOverlay";
import { ReviewSessionProvider } from "./ReviewSession";
import { WizardConductor } from "./WizardConductor";

/* ───────────────────────────────────────────────────────────────
   ReviewMount — puts the review chrome over the cloned host app.

   Gated behind `?review=1`, so /demo/playground keeps behaving
   exactly like the app it was cloned from. The case study at
   /demo/intro embeds the prototype in iframes, and those embeds
   must not pick up a floating bar.

   The flag is read from `window.location` in an effect rather than
   through `useSearchParams`, because that hook opts every page under
   this layout out of static rendering — a real cost paid by the whole
   demo for one switch that only matters on the client.
   ─────────────────────────────────────────────────────────────── */

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

  /* Marks review mode on <html> so review.css can quiet the host
     app's own tour chrome for the duration. */
  useEffect(() => {
    if (!on) return;
    document.documentElement.setAttribute("data-quorum-review", "1");
    return () => document.documentElement.removeAttribute("data-quorum-review");
  }, [on]);

  if (!on) return null;
  return (
    <ReviewSessionProvider>
      <ReviewOverlay />
      <WizardConductor />
    </ReviewSessionProvider>
  );
}
