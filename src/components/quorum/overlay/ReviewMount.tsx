"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ReviewOverlay } from "./ReviewOverlay";
import { ReviewSessionProvider } from "./ReviewSession";
import { WizardConductor } from "./WizardConductor";

/* ───────────────────────────────────────────────────────────────
   ReviewMount — puts the review chrome over the cloned host app.

   On by default over /demo/playground (?review=0 turns it off),
   opt-in via ?review=1 on other /demo surfaces. The case study at
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
  /* Never inside an embed: the case study frames the prototype, and
     the review chrome is not part of that story. */
  if (window !== window.parent) return false;
  const review = new URLSearchParams(window.location.search).get("review");
  if (review === "0") return false;
  if (review === "1") return true;
  /* The playground is the reviewable product: Quorum is on by
     default there (as the folded launcher). Other /demo surfaces
     stay opt-in. */
  return window.location.pathname.startsWith("/demo/playground");
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
