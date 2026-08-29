"use client";

import { useSyncExternalStore } from "react";

/* ───────────────────────────────────────────────────────────────
   useIsClient — false while server-rendering and through hydration,
   true afterwards.

   Portals need a DOM node that does not exist on the server, so a
   portalling component has to wait. The usual `useState(false)` plus
   an effect works, but it schedules a render whose only purpose is to
   flip a flag. `useSyncExternalStore` expresses the same thing as
   what it actually is — a value that differs between the server and
   client snapshots — and costs nothing at runtime.

   The store never changes, so `subscribe` returns a no-op teardown
   and is never called back.
   ─────────────────────────────────────────────────────────────── */

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, onClient, onServer);
}
