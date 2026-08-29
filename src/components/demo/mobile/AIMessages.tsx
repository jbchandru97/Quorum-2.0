"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SPENDING_SEGMENTS, TOTAL_SPEND, money, type Category } from "./data";
import { CARD_SHADOW, DISPLAY, DIVIDER, HAIRLINE, gradTint } from "./theme";
import { CatIcon, IconChevronRight, IconFollowUp, Tappable } from "./ui";
import StackedBars from "./StackedBars";
import { AnnotationDot } from "./HomeCards";
import { AqlMark } from "@/components/demo/AqlMark";

const SUB = "var(--text-sub-600, #5C5C5C)";
const SOFT = "var(--text-soft-400, #A3A3A3)";
const STRONG = "var(--text-strong-950, #171717)";
const BORDER = HAIRLINE;

export type CardRef = { label: string; value: string };

/* ─── user message ─── */
export function UserBubble({ text, cardRef }: { text: string; cardRef?: CardRef | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}
    >
      {cardRef && (
        <div style={{
          background: "var(--bg-weak-50,#FBFBFB)", border: BORDER, borderRadius: 10,
          padding: "7px 10px", maxWidth: "78%" }}>
          <p style={{ margin: 0, fontSize: 10, color: SOFT, lineHeight: "13px" }}>{cardRef.label}</p>
          <p style={{
            margin: "1px 0 0", fontSize: 12, fontWeight: 500, color: STRONG,
            fontVariantNumeric: "tabular-nums" }}>{cardRef.value}</p>
        </div>
      )}
      {text && (
        <div style={{
          background: "rgba(16,24,40,0.045)", borderRadius: 20, borderTopRightRadius: 7,
          padding: "11px 15px", maxWidth: "84%" }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: "20px", color: STRONG }}>{text}</p>
        </div>
      )}
    </motion.div>
  );
}

/* ─── loading ─── */
export function LoadingIndicator({ phase, june }: {
  phase: "fetching" | "building" | "followup"; june: boolean;
}) {
  const text =
    phase === "building" ? "Building your deep dive report…" :
    phase === "followup" ? "Breaking down your daily spending patterns…" :
    june ? "Reviewing your June transactions…" : "Reviewing your May transactions…";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <style>{`
      `}</style>
      <span style={{ display: "flex", flexShrink: 0 }}>
        <AqlMark size={18} animate="ratchet" />
      </span>
      <motion.span
        key={text}
        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 13, color: SOFT }}
      >{text}</motion.span>
    </div>
  );
}

/* ─── stat card — tap to reference (desktop reveals this on hover) ─── */
function StatCard({ label, value, badge, onFollowUp }: {
  label: string; value: string; badge: string; onFollowUp: () => void;
}) {
  return (
    <Tappable
      onTap={onFollowUp}
      scale={0.96}
      style={{
        flex: 1, minWidth: 0, background: "var(--bg-white-0,#fff)", border: BORDER,
        borderRadius: 18, padding: "12px 13px", display: "block", boxShadow: CARD_SHADOW }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: SUB, whiteSpace: "nowrap" }}>{label}</span>
        {/* permanent affordance — there is no hover to reveal it */}
        <span style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 20, height: 20, borderRadius: 6, background: "var(--bg-weak-50,#FBFBFB)",
          color: SUB, flexShrink: 0 }}>
          <IconFollowUp size={12} />
        </span>
      </span>
      <span style={{
        display: "block", fontFamily: DISPLAY, fontSize: 16, fontWeight: 500,
        color: STRONG, letterSpacing: "-0.5px",
        fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{value}</span>
      <span style={{
        display: "inline-block", marginTop: 5, fontSize: 10, fontWeight: 500,
        color: "#0B4627", background: "#E3F7EC", padding: "2px 5px", borderRadius: 4 }}>{badge}</span>
    </Tappable>
  );
}

/* ─── donut — tap a segment to select, tap a legend row to drill in ─── */
function SpendingDonut({ selected, onSelect }: {
  selected: Category | null; onSelect: (c: Category | null) => void;
}) {
  const size = 132, sw = 20, r = (size - sw) / 2, C = 2 * Math.PI * r;
  const total = SPENDING_SEGMENTS.reduce((s, x) => s + x.value, 0);

  const segs = useMemo(() => {
    const lens = SPENDING_SEGMENTS.map(s => (s.value / total) * C);
    return SPENDING_SEGMENTS.map((s, i) => ({
      ...s,
      len: lens[i],
      offset: lens.slice(0, i).reduce((a, b) => a + b, 0),
    }));
  }, [C, total]);

  const active = selected ? SPENDING_SEGMENTS.find(s => s.name === selected) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)", display: "block" }}>
          {segs.map(s => {
            const dim = selected !== null && selected !== s.name;
            return (
              <motion.circle
                key={s.name}
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke={s.color}
                strokeWidth={selected === s.name ? sw + 4 : sw}
                strokeDasharray={`${s.len} ${C}`}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: -s.offset, opacity: dim ? 0.28 : 1 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onSelect(selected === s.name ? null : s.name)}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", pointerEvents: "none", gap: 1 }}>
          <span style={{
            fontSize: 9, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", color: SOFT }}>{active ? active.name : "Spend"}</span>
          <motion.span
            key={active?.name ?? "total"}
            initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: DISPLAY, fontSize: 17, fontWeight: 500, color: STRONG, letterSpacing: "-0.5px",
              fontVariantNumeric: "tabular-nums" }}
          >AED {money(active ? active.value : TOTAL_SPEND)}</motion.span>
        </div>
      </div>
    </div>
  );
}

/* ─── the AI's monthly summary ─── */
export function AISummary({ june, selected, onSelect, onDeepDive, onFollowUp }: {
  june: boolean;
  selected: Category | null;
  onSelect: (c: Category | null) => void;
  onDeepDive: (c: Category) => void;
  onFollowUp: (label: string, value: string) => void;
}) {
  const month = june ? "June" : "May";
  const prev = june ? "May" : "April";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <p style={{ margin: 0, fontSize: 14, lineHeight: "21px", color: STRONG }}>
        You spent <b style={{ fontWeight: 600 }}>AED 6,240</b> in {month} — down 2% from {prev}, which is a
        good sign. Your biggest opportunity is food: it&apos;s your largest category and up 8% from last
        month. I&apos;ve opened the breakdown below so you can see exactly where it&apos;s going.
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        <StatCard label="Total Income" value="AED 36,240.28" badge="-2%"
          onFollowUp={() => onFollowUp("Total Income", "AED 36,240.28")} />
        <StatCard label="Total Expenses" value="AED 6,240.28" badge="-2%"
          onFollowUp={() => onFollowUp("Total Expenses", "AED 6,240.28")} />
      </div>

      <div style={{
        background: "#fff", border: BORDER, borderRadius: 22, padding: 16, boxShadow: CARD_SHADOW }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: STRONG, letterSpacing: "-0.015em" }}>Spending Summary</span>
          <Tappable
            scale={0.9}
            onTap={() => onFollowUp("Spending Summary", "AED 6,240.28")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 24, height: 24, borderRadius: 7, background: "var(--bg-weak-50,#FBFBFB)", color: SUB }}
          >
            <IconFollowUp size={13} />
          </Tappable>
        </div>

        <SpendingDonut selected={selected} onSelect={onSelect} />

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column" }}>
          {SPENDING_SEGMENTS.map((s, i) => (
            <Tappable
              key={s.name} scale={0.98} onTap={() => onDeepDive(s.name)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 9,
                padding: "9px 0", borderTop: i === 0 ? "none" : DIVIDER }}
            >
              <CatIcon type={s.name} size={13} />
              <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: STRONG }}>{s.name}</span>
              <span style={{
                fontSize: 12.5, fontWeight: 500, color: STRONG, fontVariantNumeric: "tabular-nums" }}>AED {money(s.value)}</span>
              <span style={{ display: "flex", color: SOFT, flexShrink: 0 }}><IconChevronRight size={15} /></span>
            </Tappable>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 2 }}>
        {["copy", "up", "down"].map(k => (
          <Tappable key={k} scale={0.85} style={{ padding: 5, color: SOFT, display: "flex" }}>
            {k === "copy" ? (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <rect x="5.2" y="5.2" width="8.3" height="8.3" rx="2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M10.8 5.2V4a1.5 1.5 0 0 0-1.5-1.5H4a1.5 1.5 0 0 0-1.5 1.5v5.3A1.5 1.5 0 0 0 4 10.8h1.2"
                  stroke="currentColor" strokeWidth="1.3" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
                style={{ transform: k === "down" ? "rotate(180deg)" : "none" }}>
                <path d="M4.6 13.5V7.2l3-4.7a1 1 0 0 1 1.8.5v3h2.9a1.4 1.4 0 0 1 1.4 1.7l-.9 4.3a1.4 1.4 0 0 1-1.4 1.1H4.6Zm0 0H2.2V7.2h2.4"
                  stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            )}
          </Tappable>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── the follow-up answer, with the two action chips ─── */
export function WeeklyMessage({ saved, onSave, onFollowUp }: {
  saved: boolean; onSave: () => void; onFollowUp: (label: string, value: string) => void;
}) {
  const [pinnedDay, setPinnedDay] = useState<number | null>(null);
  void pinnedDay;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <p style={{ margin: 0, fontSize: 14, lineHeight: "21px", color: STRONG }}>
        You have spent an average of <b style={{ fontWeight: 600 }}>AED 234.00</b> last week, with the
        weekly total adding up to <b style={{ fontWeight: 600 }}>AED 1,638.00</b>.
      </p>

      <div style={{
        background: "#fff", border: BORDER, borderRadius: 22, padding: 16, boxShadow: CARD_SHADOW }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: STRONG, letterSpacing: "-0.015em" }}>Daily Expenses</span>
          <span style={{ fontSize: 10, color: SOFT }}>Tap a bar for detail</span>
        </div>
        <StackedBars height={124} onDayPinned={setPinnedDay} />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Tappable
          scale={0.95}
          onTap={() => onFollowUp("Daily Expenses", "AED 1,638.00")}
          style={{
            display: "flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px",
            borderRadius: 999, border: BORDER, background: "var(--bg-white-0,#fff)" }}
        >
          <span style={{ display: "flex", color: SUB }}><IconFollowUp size={13} /></span>
          <span style={{ fontSize: 12, fontWeight: 500, color: STRONG, whiteSpace: "nowrap" }}>
            How can I reduce my food spend?
          </span>
        </Tappable>

        {!saved && (
          <Tappable
            scale={0.95} onTap={onSave}
            style={{
              display: "flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px",
              borderRadius: 999, border: "1px solid rgba(180,158,250,0.45)", background: gradTint(0.1) }}
          >
            <span style={{ display: "flex" }}><AqlMark size={13} /></span>
            <span style={{ fontSize: 12, fontWeight: 500, color: STRONG, whiteSpace: "nowrap" }}>
              Save this to my dashboard
            </span>
          </Tappable>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 10, color: SOFT }}>Why this appears here</span>
        <AnnotationDot text="Saving a chart straight from the conversation turns a one-off answer into something the user keeps. The dashboard becomes personalised by use, not by settings." />
      </div>
    </motion.div>
  );
}
