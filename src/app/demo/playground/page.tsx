"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "@/components/demo/dashboard/Sidebar";
import Topbar from "@/components/demo/dashboard/Topbar";
import BalanceWidget from "@/components/demo/dashboard/BalanceWidget";
import BalanceWidgetCompact from "@/components/demo/dashboard/BalanceWidgetCompact";
import { IncomeWidget, ExpenseWidget } from "@/components/demo/dashboard/IncomeExpenseWidgets";
import SpendingSummary from "@/components/demo/dashboard/SpendingSummary";
import DailyExpenseWidget from "@/components/demo/dashboard/DailyExpenseWidget";
import TransactionsTable from "@/components/demo/dashboard/TransactionsTable";
import WizardPanel from "@/components/demo/WizardPanel";
import { AqlMark } from "@/components/demo/AqlMark";

function IconSendMoney() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2.4595 7.98628C2.068 7.85578 2.06425 7.64503 2.467 7.51078L16.7822 2.73928C17.179 2.60728 17.4062 2.82928 17.2952 3.21778L13.2048 17.5323C13.0923 17.929 12.8635 17.9425 12.6955 17.566L10 11.5L14.5 5.50003L8.5 10L2.4595 7.98628Z" fill="white"/>
    </svg>
  );
}

function IconReceive() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.1328 5.08936L13.115 6.07145L9.88102 9.30539L16.2504 9.30546L16.2503 10.6943L9.88102 10.6943L13.115 13.9282L12.1329 14.9103L7.2224 9.99983L12.1328 5.08936ZM4.44476 14.8609V5.13867H5.83365V14.8609H4.44476Z" fill="currentColor"/>
    </svg>
  );
}

function IconDeposit() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.25 9.25V4.75H10.75V9.25H15.25V10.75H10.75V15.25H9.25V10.75H4.75V9.25H9.25Z" fill="currentColor"/>
    </svg>
  );
}

function IconBill() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16 17.5H4C3.80109 17.5 3.61032 17.421 3.46967 17.2803C3.32902 17.1397 3.25 16.9489 3.25 16.75V3.25C3.25 3.05109 3.32902 2.86032 3.46967 2.71967C3.61032 2.57902 3.80109 2.5 4 2.5H16C16.1989 2.5 16.3897 2.57902 16.5303 2.71967C16.671 2.86032 16.75 3.05109 16.75 3.25V16.75C16.75 16.9489 16.671 17.1397 16.5303 17.2803C16.3897 17.421 16.1989 17.5 16 17.5ZM15.25 16V4H4.75V16H15.25ZM7 7.75H13V9.25H7V7.75ZM7 10.75H13V12.25H7V10.75Z" fill="currentColor"/>
    </svg>
  );
}

function IconInvoice() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8.125 5L6.25 3.75L4.375 5V14.375C4.375 15.4106 5.21447 16.25 6.25 16.25H15C16.0356 16.25 16.875 15.4106 16.875 14.375V12.5H15.625V5L13.75 3.75L11.875 5L10 3.75L8.125 5ZM14.375 12.5H6.875V14.375C6.875 14.7202 6.59518 15 6.25 15C5.90482 15 5.625 14.7202 5.625 14.375V5.66898L6.25 5.25231L8.125 6.50231L10 5.25231L11.875 6.50231L13.75 5.25231L14.375 5.66898V12.5ZM15 15H8.01831C8.08741 14.8045 8.125 14.5941 8.125 14.375V13.75H15.625V14.375C15.625 14.7202 15.3452 15 15 15Z" fill="currentColor"/>
    </svg>
  );
}

const quickActions = [
  { label: "Send Money", icon: IconSendMoney, primary: true },
  { label: "Receive Money", icon: IconReceive, primary: false },
  { label: "Deposit", icon: IconDeposit, primary: false },
  { label: "Pay Bills", icon: IconBill, primary: false },
  { label: "Create Invoice", icon: IconInvoice, primary: false },
];

/* ─── Spending Summary with shimmer + "Deep dive" CTA wrapper ─── */
function SpendingSummaryWrapper({ midVisible }: { midVisible: boolean }) {
  const router = useRouter();
  return (
    <motion.div
      // Animate the CSS variable --x that drives the shimmer sweep
      initial={{ "--x": "-100%" } as Record<string, string>}
      animate={{ "--x": "100%" } as Record<string, string>}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0.5,
        type: "tween",
        duration: 5,
        ease: [0.76, 0, 0.24, 1] }}
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        paddingTop: midVisible ? 4 : 0,
        paddingBottom: midVisible ? 4 : 0,
        paddingLeft: midVisible ? 4 : 0,
        paddingRight: midVisible ? 4 : 0,
        background: midVisible
          ? "linear-gradient(135deg, rgba(219,162,211,0.10) 21%, rgba(195,160,235,0.10) 36%, rgba(180,158,250,0.10) 45%, rgba(148,121,241,0.10) 58%, rgba(116,84,232,0.10) 69%, rgba(78,41,221,0.10) 83%, rgba(19,3,96,0.10) 97%)"
          : "transparent",
        borderRadius: 16,
        outline: midVisible ? "1px solid #DBA2D3" : "1px solid transparent",
        outlineOffset: -1,
        transition: "padding 0.5s ease-out, background 0.5s ease-out",
      } as React.CSSProperties}
    >
      {/* Shimmer scoped to the inner white card only */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", overflow: "hidden", borderRadius: 12 }}>
        {midVisible && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 12,
              pointerEvents: "none",
              zIndex: 2,
              background: "linear-gradient(75deg, transparent calc(var(--x) + 0%), rgba(219,162,211,0.08) calc(var(--x) + 15%), rgba(180,158,250,0.10) calc(var(--x) + 35%), rgba(148,121,241,0.08) calc(var(--x) + 55%), transparent calc(var(--x) + 70%))",
            } as React.CSSProperties}
          />
        )}
        <SpendingSummary />
      </div>

      {/* Deep dive CTA row */}
      <div style={{
        overflow: "hidden",
        maxHeight: midVisible ? 44 : 0,
        opacity: midVisible ? 1 : 0,
        flexShrink: 0,
        transition: "max-height 0.5s ease-out 0.15s, opacity 0.5s ease-out 0.15s" }}>
        <button
          onClick={() => { sessionStorage.setItem("mal-ai-firsttime", "true"); router.push("/demo/playground/assistant"); }}
          style={{
            width: "100%", paddingLeft: 8, paddingRight: 8, paddingTop: 8, paddingBottom: 8,
            display: "flex", alignItems: "center", gap: 4,
            background: "transparent", border: "none", cursor: "pointer" }}
        >
          <style>{`
          `}</style>
          <div style={{ flexShrink: 0, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>
              <AqlMark size={19} animate="pendulum" delay="0.5s" />
            </div>
          </div>
          <span style={{
            flex: 1, color: "var(--text-sub-600,#5C5C5C)", fontSize: 14,
            fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 500,
            lineHeight: "20px", textAlign: "left" }}>
            See where you can spend less this month
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="var(--icon-sub-600,#5C5C5C)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

/* ─── BEFORE: 2-column layout ─────────────────────────────────────────────
   Left col:  BalanceWidget (fills remaining) + Income/Expense (natural size)
   Right col: SpendingSummary drives the row height
   ─────────────────────────────────────────────────────────────────────── */
function LayoutBefore({ midVisible }: { midVisible: boolean }) {
  return (
    <>
      <div style={{ display: "flex", gap: 16, marginBottom: 40, alignItems: "stretch" }}>
        {/* Left column — grid: balance expands to fill, income/expense auto-sized */}
        <div style={{
          flex: 1,
          minWidth: 0,
          display: "grid",
          gridTemplateRows: "1fr auto",
          gap: 16 }}>
          <BalanceWidget />
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}><IncomeWidget /></div>
            <div style={{ flex: 1, minWidth: 0 }}><ExpenseWidget /></div>
          </div>
        </div>
        {/* Right column — SpendingSummary, animates into CTA wrapper */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <SpendingSummaryWrapper midVisible={midVisible} />
        </div>
      </div>
      <TransactionsTable />
    </>
  );
}

/* ─── AFTER: 2-row layout ──────────────────────────────────────────────────
   Row 1: Balance(50%) | Income(25%) | Expense(25%)  — h=160
   Row 2: SpendingSummary(50%) | DailyExpenseWidget(50%) — h=320
   ─────────────────────────────────────────────────────────────────────── */
function LayoutAfter({ highlightWidget, onHighlightDone }: { highlightWidget: boolean; onHighlightDone: () => void }) {
  return (
    <>
      {/* Row 1 */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, height: 160 }}>
        <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
          <BalanceWidgetCompact />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", gap: 16, height: "100%" }}>
          <div style={{ flex: 1, minWidth: 0, height: "100%" }}><IncomeWidget gap={35} /></div>
          <div style={{ flex: 1, minWidth: 0, height: "100%" }}><ExpenseWidget gap={35} /></div>
        </div>
      </div>

      {/* Row 2 */}
      <div style={{ display: "flex", gap: 16, marginBottom: 40, height: 372 }}>
        <div style={{ flex: 1, minWidth: 0, height: "100%" }}><SpendingSummary /></div>
        <div style={{ position: "relative", flex: 1, minWidth: 0, height: "100%" }}>
          {highlightWidget && (
            <div
              className="mal-widget-glow"
              onAnimationEnd={onHighlightDone}
            />
          )}
          <DailyExpenseWidget />
        </div>
      </div>

      <TransactionsTable />
    </>
  );
}

export default function DashboardPage() {
  const [widgetAdded, setWidgetAdded] = useState(false);
  const [midVisible, setMidVisible] = useState(false);
  const [highlightWidget, setHighlightWidget] = useState(false);
  const midTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const added = sessionStorage.getItem("dashboardWidgetAdded") === "true";
    setWidgetAdded(added);
    const highlight = sessionStorage.getItem("dashboardWidgetHighlight") === "true";
    if (highlight) {
      sessionStorage.removeItem("dashboardWidgetHighlight");
      setHighlightWidget(true);
    }
    if (!added) {
      midTimerRef.current = setTimeout(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setMidVisible(true)));
      }, 200);
    }
    return () => { if (midTimerRef.current) clearTimeout(midTimerRef.current); };
  }, []);

  // Wizard: auto-advance from step 4 → 5 when user lands on dashboard with widget added
  useEffect(() => {
    if (!widgetAdded) return;
    const wizardStep = parseInt(sessionStorage.getItem("mal-wizard-step") || "1", 10);
    if (wizardStep !== 4) return;
    const t = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("mal-wizard-advance", { detail: { to: 5 } }));
    }, 1800);
    return () => clearTimeout(t);
  }, [widgetAdded]);

  return (
    <div style={{ display: "flex", height: "100vh", minWidth: 1280, backgroundColor: "var(--bg-weak-25, #FAFAFA)" }}>
      <Sidebar />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, backgroundColor: "var(--bg-weak-25, #FAFAFA)" }}>
        {/* Topbar — stays in the gray zone, never scrolls away */}
        <div style={{ flexShrink: 0, paddingLeft: 32, paddingRight: 32, paddingTop: 14, paddingBottom: 14 }}>
          <Topbar title="My Dashboard" variant="dashboard" />
        </div>

        {/* White content box — rounded top-left corner, left+top border only */}
        <div style={{
          flex: 1,
          position: "relative",
          overflowY: "auto",
          background: "var(--bg-white-0, white)",
          borderTopLeftRadius: 20,
          borderLeft: "1px solid var(--stroke-soft-200, #F4F4F4)",
          borderTop: "1px solid var(--stroke-soft-200, #F4F4F4)",
          paddingLeft: 32,
          paddingRight: 32,
          paddingTop: 24,
          paddingBottom: 48,
          display: "flex",
          flexDirection: "column" }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{
              fontFamily: "var(--font-inter-display), Inter, sans-serif",
              fontSize: 20, fontWeight: 500, color: "var(--text-strong-950)",
              margin: "0 0 16px", lineHeight: "28px", letterSpacing: "-0.3px" }}>
              Welcome, Mathew
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "nowrap", overflowX: "auto" }}>
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "0 16px", height: 40,
                    backgroundColor: action.primary ? "var(--neutral-gray-900)" : "var(--bg-white-0)",
                    color: action.primary ? "var(--text-white-0)" : "var(--text-strong-950)",
                    border: action.primary ? "none" : "1px solid var(--stroke-soft-200)",
                    borderRadius: "var(--radius-10)", cursor: "pointer",
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontWeight: 500, fontSize: 14, letterSpacing: "-0.084px",
                    boxShadow: action.primary ? "none" : "var(--shadow-xs)",
                    whiteSpace: "nowrap" }}
                >
                  <span style={{ display: "flex", opacity: 0.85 }}><action.icon /></span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {widgetAdded ? <LayoutAfter highlightWidget={highlightWidget} onHighlightDone={() => setHighlightWidget(false)} /> : <LayoutBefore midVisible={midVisible} />}
        </div>
      </main>


      <WizardPanel />
    </div>
  );
}
