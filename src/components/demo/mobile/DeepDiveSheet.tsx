"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls, type PanInfo } from "framer-motion";
import {
  CATEGORY_BADGES, CATEGORY_INSIGHTS, CATEGORY_TRANSACTIONS,
  RANGES, SPENDING_SEGMENTS, getChartData, getRangeTotal, getXAxisLabels,
  money, type Category, type Range,
} from "./data";
import { CatIcon, IconClose, MerchantLogo, Tappable } from "./ui";
import { DISPLAY, DIVIDER, HAIRLINE, gradTint as themeTint } from "./theme";
import { SCREEN_H, SAFE_BOTTOM } from "./PhoneScreen";
import { AqlMark } from "@/components/demo/AqlMark";

/* Detents — the sheet rests at one of two heights, or leaves. */
const FULL_Y = 68;
const MID_Y = 322;
const CLOSED_Y = SCREEN_H + 20;

const SUB = "var(--text-sub-600, #5C5C5C)";
const SOFT = "var(--text-soft-400, #A3A3A3)";
const STRONG = "var(--text-strong-950, #171717)";
const BORDER = HAIRLINE;

/** June flow reuses May data one month forward. */
const shiftMonth = (d: string, june: boolean) =>
  june ? d.replace("May", "Jun").replace("Apr", "May") : d;

/* ─── line chart with touch scrubbing (replaces desktop hover) ─── */
function LineChart({ data, color, june, range }: {
  data: number[]; color: string; june: boolean; range: Range;
}) {
  const W = 338, H = 104;
  const [idx, setIdx] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);

  const { line, area, pts } = useMemo(() => {
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) => [
      (i / Math.max(1, data.length - 1)) * W,
      H - (v / max) * (H - 12) - 6,
    ] as [number, number]);
    const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    return { line, area: `${line} L${W},${H} L0,${H} Z`, pts };
  }, [data]);

  const scrub = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    setIdx(Math.round(p * (data.length - 1)));
  };

  const labels = getXAxisLabels(range, june);

  return (
    <div style={{ position: "relative", userSelect: "none" }}>
      <svg
        ref={ref} width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
        style={{ display: "block", touchAction: "pan-y" }}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); scrub(e.clientX); }}
        onPointerMove={e => { if (e.buttons || e.pointerType === "touch") scrub(e.clientX); }}
        onPointerUp={() => setIdx(null)}
        onPointerLeave={() => setIdx(null)}
      >
        <defs>
          <linearGradient id="ddFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgba(14,18,27,0.05)" strokeWidth="1"
            vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area} fill="url(#ddFill)" />
        <motion.path
          key={line}
          d={line} fill="none" stroke={color} strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0.4 }} animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        {idx !== null && pts[idx] && (
          <>
            <line x1={pts[idx][0]} x2={pts[idx][0]} y1="0" y2={H} stroke={color} strokeWidth="1"
              strokeOpacity="0.4" vectorEffect="non-scaling-stroke" />
            <circle cx={pts[idx][0]} cy={pts[idx][1]} r="3.5" fill={color} stroke="#fff" strokeWidth="2"
              vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>

      {/* scrub readout */}
      <AnimatePresence>
        {idx !== null && data[idx] !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute", top: -4, left: 0, right: 0, display: "flex", justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span style={{
              background: "#171717", color: "#fff", fontSize: 11, fontWeight: 600,
              padding: "4px 9px", borderRadius: 7, fontVariantNumeric: "tabular-nums",
              boxShadow: "0 6px 18px rgba(14,18,27,0.26)",
            }}>
              AED {money(data[idx])}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {labels.map(l => (
          <span key={l} style={{ fontSize: 9.5, color: SOFT }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── skeleton while the report "builds" ─── */
function Skeleton() {
  return (
    <>
      <style>{`
        @keyframes ddPulse { 0%,100% { opacity: 0.55 } 50% { opacity: 1 } }
        .dd-sk { background: #F0F0F2; border-radius: 8px; animation: ddPulse 1.3s ease-in-out infinite; }
      `}</style>
      <div style={{ padding: "4px 16px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="dd-sk" style={{ height: 30, width: "55%" }} />
        <div className="dd-sk" style={{ height: 104, width: "100%", animationDelay: "0.1s" }} />
        <div className="dd-sk" style={{ height: 46, width: "100%", animationDelay: "0.18s" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 2 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div className="dd-sk" style={{ width: 34, height: 34, borderRadius: 999, animationDelay: `${0.2 + i * 0.06}s` }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                <div className="dd-sk" style={{ height: 11, width: "45%", animationDelay: `${0.22 + i * 0.06}s` }} />
                <div className="dd-sk" style={{ height: 9, width: "30%", animationDelay: `${0.26 + i * 0.06}s` }} />
              </div>
              <div className="dd-sk" style={{ height: 12, width: 54, animationDelay: `${0.24 + i * 0.06}s` }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

type SheetProps = {
  cat: Category;
  loading: boolean;
  june: boolean;
  onClose: () => void;
  onCatChange: (c: Category) => void;
};

/* Mounted only while presented, so detent and range reset on every open
   without an effect reaching in to reset them. */
function Sheet({ cat, loading, june, onClose, onCatChange }: SheetProps) {
  const [range, setRange] = useState<Range>("1M");
  const [detent, setDetent] = useState<"mid" | "full">("mid");
  const dragControls = useDragControls();
  const bodyRef = useRef<HTMLDivElement>(null);
  /* the grabber is both a drag handle and a tap target; a drag must not
     also register as the tap that toggles the detent */
  const didDrag = useRef(false);

  const seg = SPENDING_SEGMENTS.find(s => s.name === cat);
  const color = seg?.color ?? "#FA7319";
  const data = useMemo(() => getChartData(cat, range), [cat, range]);
  const total = getRangeTotal(cat, range);
  const txns = CATEGORY_TRANSACTIONS[cat] ?? [];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    didDrag.current = true;
    const v = info.velocity.y, off = info.offset.y;
    if (v > 700 || (detent === "mid" && off > 130)) { onClose(); return; }
    if (v < -400 || off < -90) { setDetent("full"); return; }
    if (off > 70) setDetent("mid");
  };

  return (
    <>
          {/* scrim — tap to dismiss */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: detent === "full" ? 0.4 : 0.22 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "#0E121B", zIndex: 70 }}
          />

          <motion.div
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: FULL_Y, bottom: CLOSED_Y }}
            dragElastic={{ top: 0.04, bottom: 0.2 }}
            onDragStart={() => { didDrag.current = true; }}
            onDragEnd={onDragEnd}
            initial={{ y: CLOSED_Y }}
            animate={{ y: detent === "full" ? FULL_Y : MID_Y }}
            exit={{ y: CLOSED_Y }}
            transition={{ type: "spring", stiffness: 320, damping: 36, mass: 0.9 }}
            style={{
              position: "absolute", left: 0, right: 0, top: 0, height: SCREEN_H,
              zIndex: 80, background: "var(--bg-white-0,#fff)",
              borderTopLeftRadius: 28, borderTopRightRadius: 28,
              boxShadow: "0 -16px 50px rgba(14,18,27,0.22)",
              display: "flex", flexDirection: "column",
            }}
          >
            {/* grabber — the only drag handle, so the body can scroll freely */}
            <div
              onPointerDown={e => { didDrag.current = false; dragControls.start(e); }}
              onClick={() => {
                if (didDrag.current) { didDrag.current = false; return; }
                setDetent(d => (d === "mid" ? "full" : "mid"));
              }}
              style={{
                padding: "9px 0 4px", display: "flex", justifyContent: "center",
                cursor: "grab", touchAction: "none", flexShrink: 0,
              }}
            >
              <span style={{ width: 38, height: 4.5, borderRadius: 3, background: "#DCDCDE" }} />
            </div>

            {/* header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "2px 12px 10px 16px", flexShrink: 0,
            }}>
              <span style={{ fontSize: 13, color: SUB }}>Deep dive on</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {cat && <CatIcon type={cat} size={13} />}
                <span style={{ fontSize: 13, fontWeight: 600, color: STRONG }}>{cat}</span>
              </span>
              <span style={{ flex: 1 }} />
              <Tappable scale={0.86} onTap={onClose} style={{ display: "flex", padding: 5, color: SUB }}>
                <IconClose size={19} />
              </Tappable>
            </div>

            {/* category chips — replaces the desktop dropdown: one tap, all options visible */}
            <div style={{
              display: "flex", gap: 7, overflowX: "auto", padding: "0 16px 12px",
              flexShrink: 0, scrollbarWidth: "none",
            }}>
              {SPENDING_SEGMENTS.map(s => {
                const on = s.name === cat;
                return (
                  <Tappable
                    key={s.name} scale={0.93} onTap={() => onCatChange(s.name)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                      height: 32, padding: on ? "0 12px 0 8px" : "0 11px 0 7px", borderRadius: 999,
                      background: on ? "var(--neutral-gray-900,#1C1C1C)" : "var(--bg-weak-50,#FBFBFB)",
                      border: on ? "1px solid transparent" : BORDER,
                    }}
                  >
                    <span style={{ display: "flex", filter: on ? "saturate(1.4)" : "none" }}>
                      <CatIcon type={s.name} size={12} />
                    </span>
                    <span style={{
                      fontSize: 12, fontWeight: 500, whiteSpace: "nowrap",
                      color: on ? "#fff" : SUB,
                    }}>{s.name}</span>
                  </Tappable>
                );
              })}
            </div>

            {/* body */}
            <div
              ref={bodyRef}
              style={{
                flex: 1, minHeight: 0, overflowY: loading ? "hidden" : "auto",
                overscrollBehavior: "contain", WebkitOverflowScrolling: "touch",
                paddingBottom: SAFE_BOTTOM + 16,
              }}
            >
              {loading ? <Skeleton /> : (
                <>
                  {/* range segmented control */}
                  <div style={{
                    display: "flex", gap: 2, margin: "0 16px 14px", padding: 3,
                    background: "var(--bg-weak-50,#FBFBFB)", borderRadius: 9,
                  }}>
                    {RANGES.map(r => (
                      <button
                        key={r} onClick={() => setRange(r)}
                        style={{
                          flex: 1, height: 26, border: "none", borderRadius: 7, cursor: "pointer",
                          position: "relative", background: "transparent",
                          WebkitTapHighlightColor: "transparent",
                        }}
                      >
                        {range === r && (
                          <motion.span
                            layoutId="ddRange"
                            transition={{ type: "spring", stiffness: 500, damping: 38 }}
                            style={{
                              position: "absolute", inset: 0, background: "#fff", borderRadius: 7,
                              boxShadow: "0 1px 3px rgba(10,13,20,0.10)",
                            }}
                          />
                        )}
                        <span style={{
                          position: "relative", fontSize: 11.5,
                          fontWeight: range === r ? 600 : 500,
                          color: range === r ? STRONG : SOFT,
                        }}>{r}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ padding: "0 16px" }}>
                    <p style={{ margin: "0 0 2px", fontSize: 12, color: SUB }}>Total Spend</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{
                        fontFamily: DISPLAY, fontSize: 27, fontWeight: 500, color: STRONG,
                        letterSpacing: "-0.9px", fontVariantNumeric: "tabular-nums",
                      }}>AED {money(total)}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 500, color: "#0B4627", background: "#E3F7EC",
                        padding: "3px 7px", borderRadius: 6,
                      }}>{cat && CATEGORY_BADGES[cat]}</span>
                    </div>

                    <LineChart data={data} color={color} june={june} range={range} />

                    {/* insight */}
                    <div style={{
                      display: "flex", gap: 9, alignItems: "flex-start", marginTop: 14,
                      padding: "10px 12px", borderRadius: 11, background: themeTint(0.09),
                      border: "1px solid rgba(180,158,250,0.28)",
                    }}>
                      <span style={{ display: "flex", flexShrink: 0, marginTop: 1 }}><AqlMark size={15} /></span>
                      <span style={{ fontSize: 12, lineHeight: "17px", color: SUB }}>
                        {cat && (june
                          ? CATEGORY_INSIGHTS[cat].replace("April", "May").replace("this month", "this month")
                          : CATEGORY_INSIGHTS[cat])}
                      </span>
                    </div>

                    <p style={{
                      margin: "18px 0 6px", fontSize: 10, fontWeight: 600, letterSpacing: "0.07em",
                      textTransform: "uppercase", color: SOFT,
                    }}>Recent Transactions</p>
                  </div>

                  <div>
                    {txns.map((t, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 11, padding: "9px 16px",
                        borderTop: i === 0 ? "none" : DIVIDER,
                      }}>
                        <MerchantLogo merchant={t.merchant} size={32} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            margin: 0, fontSize: 13, fontWeight: 500, color: STRONG,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{t.merchant}</p>
                          <p style={{ margin: "1px 0 0", fontSize: 11, color: SOFT }}>
                            {t.sub} · {shiftMonth(t.date, june)}
                          </p>
                        </div>
                        <span style={{
                          fontSize: 13, fontWeight: 500, color: STRONG, flexShrink: 0,
                          fontVariantNumeric: "tabular-nums",
                        }}>AED {money(t.amount)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
    </>
  );
}

export default function DeepDiveSheet(props: Omit<SheetProps, "cat"> & { cat: Category | null }) {
  const { cat, ...rest } = props;
  return (
    <AnimatePresence>
      {cat !== null && <Sheet key="deep-dive" cat={cat} {...rest} />}
    </AnimatePresence>
  );
}
