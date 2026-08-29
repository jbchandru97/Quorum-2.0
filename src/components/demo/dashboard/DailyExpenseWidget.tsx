"use client";

const WEEK_DATA: number[][] = [
  [94, 41,   0,   0, 18],
  [62, 38,   0, 188, 14],
  [88, 44,   0,   0, 32],
  [34, 39, 270,   0, 15],
  [76, 37,   0, 228, 10],
  [52, 41,   0,   0, 28],
  [22, 29,   0, 128, 10],
];

const WEEK_CATS = [
  { name: "Food",      color: "#FA7319" },
  { name: "Transport", color: "#1FC16B" },
  { name: "Utilities", color: "#47C2FF" },
  { name: "Shopping",  color: "#335CFF" },
  { name: "Others",    color: "#D1D5DB" },
];

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

// Day label area: gap (12) + label lineHeight (16) = 28px
// Used by both y-axis paddingBottom and bar column bottom spacing
const DAY_LABEL_AREA = 28;

function IconChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.99999 10.879L13.7125 7.1665L14.773 8.227L9.99999 13L5.22699 8.227L6.28749 7.1665L9.99999 10.879Z" fill="#5C5C5C" />
    </svg>
  );
}

export default function DailyExpenseWidget() {
  const dayTotals = WEEK_DATA.map(day => day.reduce((s, v) => s + v, 0));
  const maxDay = Math.max(...dayTotals);
  const step = maxDay <= 200 ? 50 : maxDay <= 500 ? 100 : maxDay <= 1000 ? 200 : maxDay <= 2000 ? 500 : 1000;
  const yMax = Math.ceil(maxDay / step) * step;
  const numTicks = yMax / step;
  const yLabels = Array.from({ length: numTicks + 1 }, (_, i) => (numTicks - i) * step)
    .map(v => v >= 1000 ? `${v / 1000}k` : String(v));

  return (
    <div style={{
      width: "100%",
      height: "100%",
      padding: 16,
      background: "var(--bg-white-0, white)",
      boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
      overflow: "hidden",
      borderRadius: 16,
      outline: "1px var(--stroke-soft-200, #F4F4F4) solid",
      outlineOffset: -1,
      display: "flex",
      flexDirection: "column",
      gap: 24,
      boxSizing: "border-box" as const,
    }}>

      <style>{`
        @keyframes barGrowDE {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        alignSelf: "stretch",
        display: "inline-flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 24,
        flexShrink: 0,
      }}>
        <div style={{ flex: "1 1 0", paddingTop: 4, paddingBottom: 4 }}>
          <span style={{
            color: "var(--text-strong-950, #171717)",
            fontSize: 14,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 500,
            lineHeight: "20px",
          }}>
            Daily Expenses by Category
          </span>
        </div>
        <button style={{
          paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 6,
          background: "var(--bg-white-0, white)",
          boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
          borderRadius: 8,
          outline: "1px var(--stroke-soft-200, #F4F4F4) solid",
          outlineOffset: -1,
          display: "flex",
          alignItems: "center",
          gap: 2,
          border: "none",
          cursor: "pointer",
          color: "var(--text-strong-950, #171717)",
          fontSize: 14,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontWeight: 400,
          flexShrink: 0,
        }}>
          Last Week
          <IconChevronDown />
        </button>
      </div>

      {/* Chart row — fills all remaining space */}
      <div style={{
        alignSelf: "stretch",
        flex: "1 1 0",
        minHeight: 0,
        display: "inline-flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 24,
      }}>

        {/* Y-axis — paddingBottom aligns "0" with bar bases */}
        <div style={{
          width: 24,
          alignSelf: "stretch",
          paddingBottom: DAY_LABEL_AREA,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}>
          {yLabels.map((l, i) => (
            <span key={i} style={{
              color: "var(--text-sub-600, #5C5C5C)",
              fontSize: 12,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 400,
              lineHeight: "16px",
            }}>{l}</span>
          ))}
        </div>

        {/* Bar columns */}
        <div style={{
          flex: "1 1 0",
          alignSelf: "stretch",
          paddingRight: 8,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 24,
        }}>
          {WEEK_DAYS.map((day, d) => (
            <div key={d} style={{
              flex: "1 1 0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 12,
            }}>
              {/* Bar stack — proportional flex fills height, no fixed CHART_H needed */}
              <div style={{
                alignSelf: "stretch",
                flex: "1 1 0",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}>
                {/* Empty space at top — proportional to unused budget */}
                <div style={{
                  alignSelf: "stretch",
                  flex: yMax - dayTotals[d],
                  minHeight: 0,
                  background: "var(--bg-weak-50, #FCFCFC)",
                }} />
                {/* Animated wrapper — scales the whole stack up from the bottom */}
                <div style={{
                  flex: dayTotals[d],
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  transformOrigin: "bottom",
                  animation: `barGrowDE 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${d * 0.045}s both`,
                }}>
                  {[...WEEK_CATS].reverse().map((cat, ci) => {
                    const catIdx = WEEK_CATS.length - 1 - ci;
                    const val = WEEK_DATA[d][catIdx];
                    if (val <= 0) return null;
                    return (
                      <div key={cat.name} style={{
                        alignSelf: "stretch",
                        flex: val,
                        minHeight: 0,
                        background: cat.color,
                        flexShrink: 0,
                      }} />
                    );
                  })}
                </div>
              </div>
              {/* Day label */}
              <span style={{
                alignSelf: "stretch",
                textAlign: "center",
                color: "var(--text-sub-600, #5C5C5C)",
                fontSize: 12,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontWeight: 400,
                lineHeight: "16px",
                flexShrink: 0,
              }}>{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        flexShrink: 0,
      }}>
        {WEEK_CATS.map(cat => (
          <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: cat.color,
              flexShrink: 0,
            }} />
            <span style={{
              color: "var(--text-sub-600, #5C5C5C)",
              fontSize: 12,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 400,
              lineHeight: "16px",
            }}>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
