"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TOTAL_STEPS, useApp } from "./AppState";

type Step = {
  n: number;
  title: string;
  sub?: string;
  section?: string;
  body: string[];
  note?: string;
};

const STEPS: Step[] = [
  {
    n: 1,
    title: "Ask Aql about your spending this month",
    body: [
      "You're on Home — scroll the feed and get a feel for the app before starting.",
      "When ready, start the conversation in one of three ways:",
      "1. Tap “See where you can spend less this month” inside the Spending Summary card.",
      "2. Open the Aql AI tab and tap the first conversation starter.",
      "3. Open the Aql AI tab and type the question yourself.",
    ],
  },
  {
    n: 2,
    title: "Follow up on the Total Expenses card",
    body: [
      "The summary is in the thread and the deep dive has opened as a sheet from the bottom. Tap or drag the grab handle to take it full-screen, drag it down to send it back, and tap ✕ to dismiss.",
      "Touch has no hover, so the follow-up arrow is always visible: tap the Total Expenses card to attach it to your next message. Tap any category chip in the sheet to switch, and scrub the chart with your finger to read values.",
      "Then tap the suggestion pill above the keyboard to fill the question, and send.",
    ],
    note: "On desktop this needed hover plus the Tab key. Both are replaced by direct taps.",
  },
  {
    n: 3,
    title: "Save the expense widget to your Home",
    body: [
      "Aql answers with a daily breakdown and two action chips underneath.",
      "Tap “Save this to my dashboard” to add the chart to your Home feed. Tap any bar to pin its detail.",
    ],
  },
  {
    n: 4,
    title: "Head back to Home",
    body: [
      "Tap “View” in the confirmation above the composer, or use the Home tab.",
      "The new chart animates into the feed, glows briefly, and scrolls itself into view.",
    ],
  },
  {
    n: 5,
    section: "Habit-forming patterns",
    sub: "Habit-forming Pattern 1",
    title: "Tap the Aql AI card at the top of Home",
    body: [
      "This pattern is for a user who has reviewed their spending once before, but hasn't done so consistently.",
      "A month later Aql resurfaces the review. A tab bar item can't expand into a promo card, so on mobile the nudge takes the top of the Home feed and the Aql AI tab picks up a badge dot.",
    ],
    note: "The two habit-forming patterns are mutually exclusive — a user sees Type 1 or Type 2, never both.",
  },
  {
    n: 6,
    sub: "Habit-forming Pattern 2",
    title: "Tap “Set it up” to automate reports",
    body: [
      "This pattern is for users who review their spending consistently — 3 or more times. Instead of a nudge card they get an opt-in above the composer.",
      "Read the June report, then put it away — swipe the sheet down or tap ✕. The opt-in appears once the review is done, not during it.",
      "Tap “Set it up”. Tap the ⓘ beside it to read why this moment was chosen.",
    ],
    note: "This is the alternative pattern. A user who triggers Type 1 will not see this, and vice versa.",
  },
  {
    n: 7,
    title: "Go to Home to see Round-Up",
    body: [
      "Once a user has viewed their monthly report and both habit-forming patterns are resolved, Aql introduces Round-Up: a contextual savings suggestion built from their actual spend.",
      "On desktop this lived at the bottom of the sidebar. With no sidebar on mobile it springs into the Home feed instead.",
    ],
  },
];

function Chevron({ up }: { up: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transform: up ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MobileWizard() {
  const { state, dispatch } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const step = STEPS.find(s => s.n === state.step) ?? STEPS[0];
  const atEnd = state.step === 7;
  const showGoHome = atEnd && state.tab !== "home";

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, width: 316, zIndex: 500,
      fontFamily: "var(--font-inter), Inter, sans-serif",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
        style={{
          background: "#0A0A0A", borderRadius: 14, overflow: "hidden",
          boxShadow: "0 20px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            width: "100%", display: "flex", alignItems: collapsed && step.sub ? "flex-start" : "center",
            gap: 9, padding: "11px 13px", background: "transparent", border: "none", cursor: "pointer",
            borderBottom: collapsed ? "none" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: "#4ADE80",
            boxShadow: "0 0 6px #4ADE8066", marginTop: collapsed && step.sub ? 4 : 0,
          }} />
          <span style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
            {collapsed ? (
              <>
                <span style={{
                  display: "block", fontSize: 12, fontWeight: 500, color: "#ccc", lineHeight: "16px",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{step.title}</span>
                {step.sub && (
                  <span style={{ display: "block", fontSize: 10, color: "#555", lineHeight: "13px" }}>
                    {step.sub}
                  </span>
                )}
              </>
            ) : (
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.07em",
                textTransform: "uppercase", color: "#666",
              }}>Prototype Guide · Mobile</span>
            )}
          </span>
          <span style={{ fontSize: 10, fontWeight: 500, color: "#555", flexShrink: 0 }}>
            {state.step}/{TOTAL_STEPS}
          </span>
          <span style={{ color: "#555", display: "flex", flexShrink: 0 }}><Chevron up={!collapsed} /></span>
        </button>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ padding: "0 15px 15px" }}>
                {step.section && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 0 9px" }}>
                    <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                      textTransform: "uppercase", color: "#555", whiteSpace: "nowrap",
                    }}>{step.section}</span>
                    <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                  </div>
                )}

                <div style={{
                  display: "flex", gap: 4, alignItems: "center",
                  paddingTop: step.section ? 0 : 13, paddingBottom: 12,
                }}>
                  {STEPS.map(s => {
                    const done = s.n < state.step, active = s.n === state.step;
                    return (
                      <span key={s.n} style={{
                        width: active ? 16 : 6, height: 6, borderRadius: 999, flexShrink: 0,
                        background: done ? "#4ADE80" : active ? "#fff" : "rgba(255,255,255,0.14)",
                        transition: "width 0.2s ease, background 0.2s ease",
                      }} />
                    );
                  })}
                </div>

                <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, lineHeight: "18px", color: "#fff" }}>
                  {step.title}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {step.body.map((p, i) => (
                    <p key={i} style={{ margin: 0, fontSize: 12, lineHeight: "18px", color: "#7a7a7a" }}>{p}</p>
                  ))}
                </div>

                {step.note && (
                  <p style={{
                    margin: "10px 0 0", fontSize: 11, lineHeight: "16px",
                    color: "#4a4a4a", fontStyle: "italic",
                  }}>{step.note}</p>
                )}

                {showGoHome && (
                  <button
                    onClick={() => dispatch({ type: "setTab", tab: "home" })}
                    style={{
                      marginTop: 12, width: "100%", padding: "8px 12px", background: "#fff",
                      border: "none", borderRadius: 8, cursor: "pointer",
                      fontSize: 12, fontWeight: 600, color: "#0A0A0A",
                    }}
                  >
                    Go to Home →
                  </button>
                )}

                <button
                  onClick={() => dispatch({ type: "reset" })}
                  style={{
                    marginTop: showGoHome ? 6 : 12, width: "100%", padding: "8px 12px",
                    background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#555",
                  }}
                >
                  Reset Prototype
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
