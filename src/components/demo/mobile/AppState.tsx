"use client";

import { createContext, useContext, useReducer, useCallback, type Dispatch } from "react";

export type Tab = "home" | "cards" | "malai" | "activity" | "more";

/* How the Aql AI screen should behave the next time it is opened. */
export type Autostart = "none" | "may" | "june";

export type State = {
  tab: Tab;
  step: number;              // guide step, 1–7, monotonic
  widgetAdded: boolean;      // daily-expense card lives on Home
  widgetHighlight: boolean;  // one-shot glow when landing on Home
  juneNudge: boolean;        // habit pattern 1 — promo card + tab badge
  juneFlow: boolean;         // AI is telling the June story
  notifyResolved: boolean;   // habit pattern 2 answered
  roundUp: boolean;          // Round-Up card on Home
  autostart: Autostart;
  conversationKey: number;   // bump to force a fresh conversation
};

export const TOTAL_STEPS = 7;

const initial: State = {
  tab: "home",
  step: 1,
  widgetAdded: false,
  widgetHighlight: false,
  juneNudge: false,
  juneFlow: false,
  notifyResolved: false,
  roundUp: false,
  autostart: "none",
  conversationKey: 0,
};

export type Action =
  | { type: "setTab"; tab: Tab }
  | { type: "advance"; to: number }
  | { type: "openAI"; autostart: Autostart }
  | { type: "clearAutostart" }
  | { type: "addWidget" }
  | { type: "viewDashboard" }
  | { type: "clearHighlight" }
  | { type: "showJuneNudge" }
  | { type: "resolveNotify" }
  | { type: "showRoundUp" }
  | { type: "dismissRoundUp" }
  | { type: "reset" };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "setTab":
      return { ...s, tab: a.tab };

    case "advance":
      // monotonic — the guide never walks backwards
      return { ...s, step: Math.min(Math.max(s.step, a.to), TOTAL_STEPS) };

    case "openAI":
      return {
        ...s,
        tab: "malai",
        autostart: a.autostart,
        juneFlow: a.autostart === "june" ? true : s.juneFlow,
        juneNudge: a.autostart === "june" ? false : s.juneNudge,
        step: a.autostart === "june" ? Math.max(s.step, 6) : s.step,
        // a fresh scripted run always starts a new conversation
        conversationKey: a.autostart === "none" ? s.conversationKey : s.conversationKey + 1,
      };

    case "clearAutostart":
      return { ...s, autostart: "none" };

    case "addWidget":
      return { ...s, widgetAdded: true, step: Math.max(s.step, 4) };

    case "viewDashboard":
      return { ...s, tab: "home", widgetHighlight: true };

    case "clearHighlight":
      return { ...s, widgetHighlight: false };

    case "showJuneNudge":
      return { ...s, juneNudge: true, step: Math.max(s.step, 5) };

    case "resolveNotify":
      return { ...s, notifyResolved: true, step: Math.max(s.step, 7) };

    case "showRoundUp":
      return { ...s, roundUp: true };

    case "dismissRoundUp":
      return { ...s, roundUp: false };

    case "reset":
      return { ...initial, conversationKey: s.conversationKey + 1 };
  }
}

const Ctx = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppStateProvider>");
  return v;
}

/** Convenience: advance the guide without pulling in the whole context shape. */
export function useAdvance() {
  const { dispatch } = useApp();
  return useCallback((to: number) => dispatch({ type: "advance", to }), [dispatch]);
}
