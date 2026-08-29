"use client";
import { useState, useEffect } from "react";

const chartPoints = [
  { x: 7.5,   y: 26 },
  { x: 102,   y: 10 },
  { x: 196.7, y: 20 },
  { x: 291.3, y: 13 },
  { x: 385.9, y: 23 },
  { x: 480.5, y: 5  },
];

const TICK_H = 36;

const timelines = [
  { label: "13-19",           x: 7.5   },
  { label: "APR 20-26",      x: 102   },
  { label: "APR 27 - MAY 3", x: 196.7 },
  { label: "MAY 4-10",       x: 291.3 },
  { label: "MAY 11-17",      x: 385.9 },
  { label: "TODAY",          x: 480.5 },
];

const SVG_W = 488;

function buildLinePath(points: { x: number; y: number }[]) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function buildAreaPath(points: { x: number; y: number }[], bottom: number) {
  const line = buildLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`;
}

function useCountUp(target: number, duration = 650) {
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

export default function BalanceWidgetCompact() {
  const balance = useCountUp(14480.24);
  const linePath = buildLinePath(chartPoints);
  const areaPath = buildAreaPath(chartPoints, TICK_H);

  return (
    <div style={{
      backgroundColor: "var(--bg-white-0)",
      border: "1px solid var(--stroke-soft-200)",
      borderRadius: 16,
      boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
      padding: 16,
      width: "100%",
      height: "100%",
      boxSizing: "border-box" as const,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes lineDrawBWC {
          to { stroke-dashoffset: 0; }
        }
        @keyframes areaFadeBWC {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Balance info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
        <span style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 14, fontWeight: 500, lineHeight: "20px",
          color: "var(--text-sub-600)",
        }}>
          Total Balance
        </span>
        <span style={{
          fontFamily: "var(--font-inter-display), 'Inter Display', Inter, sans-serif",
          fontSize: 24, fontWeight: 500, lineHeight: "32px",
          color: "var(--text-strong-950)",
        }}>
          AED {balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Chart section */}
      <div style={{
        flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden",
      }}>
        <svg
          style={{ flex: 1, width: "100%", display: "block", minHeight: 0 }}
          viewBox={`0 0 ${SVG_W} ${TICK_H}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="balanceGradCompact" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(51,92,255)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="rgba(51,92,255)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {timelines.map((t) => (
            <line
              key={t.label}
              x1={t.x} y1={0}
              x2={t.x} y2={TICK_H}
              stroke="var(--stroke-soft-200)"
              strokeWidth="1"
              opacity="0.8"
            />
          ))}

          <path d={areaPath} fill="url(#balanceGradCompact)"
            style={{ animation: "areaFadeBWC 0.65s ease-out 0.1s both" }}
          />

          <path
            d={linePath}
            fill="none"
            stroke="var(--state-information-base)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1,
              animation: "lineDrawBWC 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
            }}
          />
        </svg>

        {/* Date labels */}
        <div style={{ position: "relative", height: 12, flexShrink: 0 }}>
          {timelines.map((t) => (
            <span
              key={t.label}
              style={{
                position: "absolute",
                left: `${(t.x / SVG_W) * 100}%`,
                transform: "translateX(-50%)",
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 12, fontWeight: 500, lineHeight: "12px",
                color: "var(--text-soft-400)",
                textTransform: "uppercase",
                letterSpacing: "0.22px",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
