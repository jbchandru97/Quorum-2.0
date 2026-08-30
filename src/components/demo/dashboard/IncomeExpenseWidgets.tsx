"use client";
import { useState, useEffect } from "react";

function useCountUp(target: number, duration = 700) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function IconIncome() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M13.0582 8.01999L6.49494 14.5833L5.41669 13.505L11.9792 6.94173H6.19526V5.41663H14.5834V13.8047H13.0582V8.01999Z" fill="#5C5C5C"/>
    </svg>
  );
}

function IconExpense() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6.94177 11.9799L13.5051 5.41663L14.5833 6.49488L8.02002 13.0582H13.8048V14.5833H5.41666V6.19519H6.94177V11.9792V11.9799Z" fill="#5C5C5C"/>
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.99999 10.879L13.7125 7.1665L14.773 8.227L9.99999 13L5.22699 8.227L6.28749 7.1665L9.99999 10.879Z" fill="#5C5C5C"/>
    </svg>
  );
}

function Badge({ value, positive }: { value: string; positive: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 999,
        backgroundColor: positive ? "var(--state-success-lighter)" : "var(--state-error-lighter)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: positive ? "var(--state-success-dark)" : "var(--state-error-dark)",
        lineHeight: "16px",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
}

function MonthSelect() {
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 6,
        backgroundColor: "var(--bg-white-0)",
        border: "1px solid var(--stroke-soft-200)",
        borderRadius: 8,
        boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
        cursor: "pointer",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: 14,
        fontWeight: 400,
        color: "var(--text-strong-950)",
        whiteSpace: "nowrap",
      }}
    >
      Month
      <span style={{ color: "var(--icon-sub-600)", display: "flex" }}>
        <IconChevronDown />
      </span>
    </button>
  );
}

function IconButton({ icon: Icon }: { icon: React.ComponentType }) {
  return (
    <div
      style={{
        padding: 6,
        backgroundColor: "var(--bg-white-0)",
        boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
        borderRadius: 999,
        outline: "1px solid var(--stroke-soft-200)",
        outlineOffset: -1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon />
    </div>
  );
}

function IncomeWidget({ gap = 24 }: { gap?: number }) {
  const income = useCountUp(36240.28);
  return (
    <div
      /* Quorum: review anchor for the scripted demo — see
         fixtures/context/component-map.json. */
      data-quorum-target="income-card"
      style={{
        backgroundColor: "var(--bg-white-0)",
        border: "1px solid var(--stroke-soft-200)",
        borderRadius: 16,
        boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
        padding: 16,
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap,
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <IconButton icon={IconIncome} />
        <MonthSelect />
      </div>

      {/* Label + amount */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <p
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "20px",
            color: "var(--text-sub-600)",
            margin: 0,
          }}
        >
          Total Income
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <p
            style={{
              fontFamily: "var(--font-inter-display), 'Inter Display', Inter, sans-serif",
              fontSize: 24,
              fontWeight: 500,
              lineHeight: "32px",
              color: "var(--text-strong-950)",
              margin: 0,
            }}
          >
            AED {income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <Badge value="-2%" positive={false} />
        </div>
      </div>
    </div>
  );
}

function ExpenseWidget({ gap = 24 }: { gap?: number }) {
  const expense = useCountUp(6240.28);
  return (
    <div
      style={{
        backgroundColor: "var(--bg-white-0)",
        border: "1px solid var(--stroke-soft-200)",
        borderRadius: 16,
        boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
        padding: 16,
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap,
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <IconButton icon={IconExpense} />
        <MonthSelect />
      </div>

      {/* Label + amount */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <p
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "20px",
            color: "var(--text-sub-600)",
            margin: 0,
          }}
        >
          Total Expenses
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <p
            style={{
              fontFamily: "var(--font-inter-display), 'Inter Display', Inter, sans-serif",
              fontSize: 24,
              fontWeight: 500,
              lineHeight: "32px",
              color: "var(--text-strong-950)",
              margin: 0,
            }}
          >
            AED {expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <Badge value="-2%" positive={true} />
        </div>
      </div>
    </div>
  );
}

export { IncomeWidget, ExpenseWidget };

export default function IncomeExpenseWidgets() {
  return (
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <IncomeWidget />
      <ExpenseWidget />
    </div>
  );
}
