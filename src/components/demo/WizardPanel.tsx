"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "mal-wizard-step";
const CROSSFLOW_KEY = "mal-wizard-crossflow";
const TOTAL_STEPS = 7;

// Resets whenever the JS module is re-evaluated (new tab, hard refresh).
// Stays true across client-side router.push() navigations within the same tab.
let tabInitialized = false;

type StepAction = { label: string; handler: () => void };

type StepDef = {
  number: number;
  title: string;       // action-oriented: what to do right now
  collapsedSubLabel?: string; // shown below title in collapsed state
  body: string[];
  note?: string;
  sectionBefore?: string;
};

const STEPS: StepDef[] = [
  {
    number: 1,
    title: "Ask Aql about your spending this month",
    body: [
      "You're on the dashboard — take a moment to explore the widgets and layout before starting.",
      "When ready, start the conversation in one of three ways:",
      '1. Click "See where you can spend less this month" under the spending summary.',
      "2. Go to the Aql AI tab and click the first conversation starter card.",
      '3. Go to the Aql AI tab and type: "How was my spending last month?"',
    ],
  },
  {
    number: 2,
    title: "Follow up on the Total Expenses card",
    body: [
      "You now have the AI summary and a deep dive report on the right. You can hover over any card or chart element to ask a follow-up.",
      "For this flow, hover over the Total Expenses card in the conversation to reveal the follow-up arrow — click it to reference that card. The right-side panel is also interactive: hover over any spending category to explore.",
      "Once the card is referenced, press Tab to fill in the suggested question, then send.",
    ],
  },
  {
    number: 3,
    title: "Save the expense widget to your dashboard",
    body: [
      "After the AI responds to your follow-up, two action chips appear below the message.",
      'Click "Save this to my dashboard" to add the daily expense chart to your dashboard.',
    ],
  },
  {
    number: 4,
    title: "Head back to the dashboard",
    body: [
      "Navigate back to the dashboard. The newly added chart will be highlighted when you land.",
    ],
  },
  {
    number: 5,
    sectionBefore: "Habit-forming patterns",
    collapsedSubLabel: "Habit-forming Pattern 1",
    title: "Click the Aql AI card in the left nav",
    body: [
      "This pattern is for a user who has reviewed their spending once before, but hasn't done so consistently.",
      "At the end of the following month, Aql surfaces a card in the left navigation prompting them to review again. Click the Aql AI card that appears there.",
    ],
    note: "There are two habit-forming patterns — they are mutually exclusive. A user sees either Type 1 or Type 2, never both.",
  },
  {
    number: 6,
    collapsedSubLabel: "Habit-forming Pattern 2",
    title: 'Click "Set it up" to automate reports',
    body: [
      "This pattern is for users who review their spending consistently — 3 or more times. Instead of a nav card, they see a notification offering to automate their monthly report.",
      'Click "Set it up" in the notification banner.',
    ],
    note: "This is the alternative habit-forming pattern. A user who triggers Type 1 will not see this, and vice versa.",
  },
  {
    number: 7,
    title: "Go to the dashboard to see Round-Up",
    body: [
      "After a user has viewed their monthly report and neither habit-forming pattern applies — or both have already been dismissed — Aql introduces Round-Up: a contextual savings suggestion based on their actual spending.",
      "This is a separate flow and does not interfere with the habit-forming patterns. It appears only after they are resolved.",
    ],
  },
];

function ChevronIcon({ up }: { up: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transform: up ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
    >
      <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 5L4 7.5L8 2.5" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WizardPanel() {
  const [step, setStep] = useState<number>(1);
  const [collapsed, setCollapsed] = useState(true);
  const [crossflowTriggered, setCrossflowTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isInternalNav = sessionStorage.getItem("mal-internal-nav") === "1";
    if (isInternalNav) {
      sessionStorage.removeItem("mal-internal-nav");
    } else if (!tabInitialized) {
      // Fresh load (new tab or hard refresh) — reset all prototype state
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(CROSSFLOW_KEY);
      sessionStorage.removeItem("dashboardWidgetAdded");
      sessionStorage.removeItem("dashboardWidgetHighlight");
    }
    tabInitialized = true;

    const saved = parseInt(sessionStorage.getItem(STORAGE_KEY) || "1", 10);
    const resolved = isNaN(saved) ? 1 : Math.min(Math.max(saved, 1), TOTAL_STEPS);
    setStep(resolved);
    setCrossflowTriggered(sessionStorage.getItem(CROSSFLOW_KEY) === "true");
    setMounted(true);
  }, []);

  const handleAdvance = useCallback((e: Event) => {
    const to = (e as CustomEvent<{ to: number }>).detail?.to;
    if (typeof to === "number" && to > 0 && to <= TOTAL_STEPS) {
      setStep(prev => {
        const next = Math.max(prev, to);
        sessionStorage.setItem(STORAGE_KEY, String(next));
        return next;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mal-wizard-advance", handleAdvance);
    return () => window.removeEventListener("mal-wizard-advance", handleAdvance);
  }, [handleAdvance]);

  const handleGoDashboard = () => {
    sessionStorage.setItem(CROSSFLOW_KEY, "true");
    sessionStorage.setItem("dashboard-crossflow", "true");
    sessionStorage.setItem("mal-ai-skip-card", "true");
    sessionStorage.setItem("mal-internal-nav", "1");
    // Force sidebar expanded so the CrossFlow card is visible on arrival
    sessionStorage.setItem("sidebar-collapsed", "false");
    setCrossflowTriggered(true);
    window.location.href = "/";
  };

  const handleReset = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(CROSSFLOW_KEY);
    sessionStorage.removeItem("dashboardWidgetAdded");
    sessionStorage.removeItem("dashboardWidgetHighlight");
    sessionStorage.removeItem("roundup-tooltip-shown");
    // Ensure nav is expanded after reset
    sessionStorage.setItem("sidebar-collapsed", "false");
    window.dispatchEvent(new CustomEvent("mal-dashboard-reset"));
    window.location.href = "/";
  };

  const current = STEPS.find(s => s.number === step) ?? STEPS[0];

  const action: StepAction | undefined =
    current.number === 7 && crossflowTriggered
      ? { label: "Reset Prototype", handler: handleReset }
      : current.number === 7
      ? { label: "Go to Dashboard →", handler: handleGoDashboard }
      : undefined;

  const isReset = current.number === 7 && crossflowTriggered;

  // A primary action is visible in the collapsed state
  const collapsedPrimaryAction: StepAction | undefined =
    current.number === 7 && crossflowTriggered
      ? { label: "Reset Prototype", handler: handleReset }
      : current.number === 7
      ? { label: "Go to Dashboard →", handler: handleGoDashboard }
      : undefined;

  const headerOpenBottom = !collapsed || !!collapsedPrimaryAction;

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes wizardIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wizard-panel { animation: wizardIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      <div
        className="wizard-panel"
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 308, zIndex: 9999,
          fontFamily: "var(--font-inter), Inter, sans-serif",
        }}
      >
        {/* Header — click to expand/collapse */}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            width: "100%", display: "flex", alignItems: current.collapsedSubLabel && collapsed ? "flex-start" : "center", gap: 8,
            padding: "10px 12px",
            background: "#0A0A0A", border: "none", cursor: "pointer",
            borderRadius: headerOpenBottom ? "12px 12px 0 0" : 12,
            borderBottom: headerOpenBottom ? "1px solid rgba(255,255,255,0.08)" : "none",
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
            background: "#4ADE80", boxShadow: "0 0 6px #4ADE8066",
            marginTop: current.collapsedSubLabel && collapsed ? 4 : 0,
          }} />

          <span style={{ flex: 1, textAlign: "left", minWidth: 0, overflow: "hidden" }}>
            {collapsed ? (
              <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <span style={{
                  fontSize: 12, fontWeight: 500, lineHeight: "16px", color: "#ccc",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {current.title}
                </span>
                {current.collapsedSubLabel && (
                  <span style={{ fontSize: 10, fontWeight: 500, color: "#555", lineHeight: "13px" }}>
                    {current.collapsedSubLabel}
                  </span>
                )}
              </span>
            ) : (
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#666" }}>Prototype Guide</span>
            )}
          </span>

          <span style={{ fontSize: 10, fontWeight: 500, color: "#555", whiteSpace: "nowrap", flexShrink: 0 }}>
            {step}/{TOTAL_STEPS}
          </span>

          <span style={{ color: "#555", display: "flex", flexShrink: 0 }}>
            <ChevronIcon up={!collapsed} />
          </span>
        </button>

        {/* Collapsed primary action — only shown on step 7 */}
        {collapsed && collapsedPrimaryAction && (
          <div style={{ background: "#0A0A0A", borderRadius: "0 0 12px 12px", padding: "8px 12px 12px" }}>
            <button
              onClick={collapsedPrimaryAction.handler}
              style={{
                width: "100%", padding: "7px 12px",
                background: "#fff", border: "none",
                borderRadius: 8, cursor: "pointer",
                fontSize: 12, fontWeight: 600, color: "#0A0A0A",
                letterSpacing: "-0.01em",
              }}
            >
              {collapsedPrimaryAction.label}
            </button>
          </div>
        )}

        {/* Expanded body */}
        {!collapsed && (
          <div style={{ background: "#0A0A0A", borderRadius: "0 0 12px 12px", padding: "0 14px 14px" }}>

            {current.sectionBefore && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 14, paddingBottom: 10 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", whiteSpace: "nowrap" }}>
                  {current.sectionBefore}
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              </div>
            )}

            {/* Progress dots */}
            <div style={{
              display: "flex", gap: 4, alignItems: "center",
              paddingTop: current.sectionBefore ? 0 : 14, paddingBottom: 12,
            }}>
              {STEPS.map(s => {
                const done = s.number < step;
                const active = s.number === step;
                return (
                  <span key={s.number} style={{
                    width: active ? 16 : 6, height: 6, flexShrink: 0,
                    borderRadius: 999,
                    background: done ? "#4ADE80" : active ? "#fff" : "rgba(255,255,255,0.14)",
                    transition: "width 0.2s ease, background 0.2s ease",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {done && <CheckIcon />}
                  </span>
                );
              })}
            </div>

            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, lineHeight: "18px", color: "#fff" }}>
              {current.title}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {current.body.map((para, i) => (
                <p key={i} style={{ margin: 0, fontSize: 12, fontWeight: 400, lineHeight: "18px", color: "#777" }}>
                  {para}
                </p>
              ))}
            </div>

            {current.note && (
              <p style={{ margin: "10px 0 0", fontSize: 11, lineHeight: "16px", color: "#4a4a4a", fontStyle: "italic" }}>
                {current.note}
              </p>
            )}

            {/* Primary action (step 7) */}
            {action && (
              <button
                onClick={action.handler}
                style={{
                  marginTop: 12, width: "100%", padding: "8px 12px",
                  background: "#fff", border: "none",
                  borderRadius: 8, cursor: "pointer",
                  fontSize: 12, fontWeight: 600, color: "#0A0A0A",
                  letterSpacing: "-0.01em",
                }}
              >
                {action.label}
              </button>
            )}

            {/* Secondary: Reset — always in expanded, not a primary on step 7 final */}
            {!isReset && (
              <button
                onClick={handleReset}
                style={{
                  marginTop: action ? 6 : 12, width: "100%", padding: "8px 12px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, cursor: "pointer",
                  fontSize: 12, fontWeight: 500, color: "#555",
                  letterSpacing: "-0.01em",
                }}
              >
                Reset Prototype
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
