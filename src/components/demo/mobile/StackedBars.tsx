"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WEEK_CATS, WEEK_DATA, WEEK_DAYS, WEEK_FULL_DAYS, money } from "./data";

/* ───────────────────────────────────────────────────────────────
   Desktop shows a tooltip on hover. Touch has no hover, so a tap
   PINS the tooltip to that day and it stays until you tap away —
   which is also more useful, since you can read it at leisure.
   ─────────────────────────────────────────────────────────────── */

const MAX = 400;
const TICKS = [0, 100, 200, 300, 400];

export default function StackedBars({
  height = 132,
  showAxis = true,
  onDayPinned,
}: {
  height?: number;
  showAxis?: boolean;
  onDayPinned?: (day: number | null) => void;
}) {
  const [pinned, setPinned] = useState<number | null>(null);

  const pick = (i: number) => {
    const next = pinned === i ? null : i;
    setPinned(next);
    onDayPinned?.(next);
  };

  const dayTotal = (i: number) => WEEK_DATA[i].reduce((s, v) => s + v, 0);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ display: "flex", gap: 8, width: "100%" }}>
        {/* y-axis */}
        {showAxis && (
          <div style={{
            width: 26, height, flexShrink: 0, position: "relative",
          }}>
            {TICKS.map(t => (
              <span key={t} style={{
                position: "absolute", right: 0, bottom: (t / MAX) * height - 5,
                fontSize: 9, lineHeight: "10px", color: "var(--text-soft-400,#A3A3A3)",
                fontVariantNumeric: "tabular-nums",
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* plot */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ position: "relative", height }}>
            {/* gridlines */}
            {TICKS.map(t => (
              <div key={t} style={{
                position: "absolute", left: 0, right: 0, bottom: (t / MAX) * height,
                height: 1, background: t === 0 ? "rgba(14,18,27,0.12)" : "rgba(14,18,27,0.05)",
              }} />
            ))}

            {/* bars */}
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "flex-end", justifyContent: "space-between", gap: 6,
            }}>
              {WEEK_DATA.map((day, i) => {
                const dim = pinned !== null && pinned !== i;
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    style={{
                      flex: 1, height: "100%", padding: 0, border: "none", background: "transparent",
                      display: "flex", flexDirection: "column", justifyContent: "flex-end",
                      cursor: "pointer", WebkitTapHighlightColor: "transparent", position: "relative",
                      minWidth: 0,
                    }}
                  >
                    {/* full-height hit target with a soft column highlight when pinned */}
                    {pinned === i && (
                      <motion.span
                        layoutId="barColumnHighlight"
                        style={{
                          position: "absolute", inset: "-4px -3px 0", borderRadius: 6,
                          background: "rgba(14,18,27,0.04)", zIndex: 0,
                        }}
                      />
                    )}
                    <div style={{
                      position: "relative", zIndex: 1, display: "flex", flexDirection: "column-reverse",
                      borderRadius: 4, overflow: "hidden",
                      opacity: dim ? 0.38 : 1, transition: "opacity 0.2s ease",
                    }}>
                      {day.map((v, ci) => v > 0 && (
                        <motion.div
                          key={ci}
                          initial={{ height: 0 }}
                          animate={{ height: (v / MAX) * height }}
                          transition={{ duration: 0.5, delay: 0.05 * i + 0.02 * ci, ease: [0.22, 1, 0.36, 1] }}
                          style={{ width: "100%", background: WEEK_CATS[ci].color }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* x labels */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginTop: 6 }}>
            {WEEK_DAYS.map((d, i) => (
              <span key={i} style={{
                flex: 1, textAlign: "center", fontSize: 10, lineHeight: "12px",
                fontWeight: pinned === i ? 600 : 400,
                color: pinned === i ? "var(--text-strong-950,#171717)" : "var(--text-soft-400,#A3A3A3)",
                transition: "color 0.18s ease",
              }}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", marginTop: 10, paddingLeft: showAxis ? 34 : 0 }}>
        {WEEK_CATS.map(c => (
          <span key={c.name} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: 2, background: c.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, lineHeight: "12px", color: "var(--text-sub-600,#5C5C5C)" }}>{c.name}</span>
          </span>
        ))}
      </div>

      {/* pinned tooltip */}
      <AnimatePresence>
        {pinned !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 480, damping: 32 }}
            style={{
              position: "absolute", top: -6, left: 0, right: 0, zIndex: 20,
              margin: "0 auto", width: "fit-content", maxWidth: "100%",
              background: "#171717", borderRadius: 10, padding: "8px 11px",
              boxShadow: "0 8px 24px rgba(14,18,27,0.28)", pointerEvents: "none",
            }}
          >
            <div style={{
              fontSize: 11, fontWeight: 600, color: "#fff", marginBottom: 5,
              display: "flex", justifyContent: "space-between", gap: 14,
            }}>
              <span>{WEEK_FULL_DAYS[pinned]}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>AED {money(dayTotal(pinned))}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {WEEK_DATA[pinned].map((v, ci) => v > 0 && (
                <div key={ci} style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: WEEK_CATS[ci].color }} />
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.72)" }}>{WEEK_CATS[ci].name}</span>
                  </span>
                  <span style={{ fontSize: 10, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                    {money(v)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
