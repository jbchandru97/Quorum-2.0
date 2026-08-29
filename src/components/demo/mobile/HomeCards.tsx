"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import walletAnimation from "@/assets/demo/wallet-animation.json";
import { BALANCE, BALANCE_SPARK, RECENT_TRANSACTIONS, money } from "./data";
import {
  CARD_SHADOW, CARD_SHADOW_LIFTED, DISPLAY, DIVIDER, EASE_OUT, GLASS_BG, GLASS_BG_STRONG,
  GLASS_BORDER, HAIRLINE, HEADER_GRAD, HEADER_SHEEN, SHIMMER_EASE, SOFT, SPRING, SPRING_SOFT,
  STRONG, SUB, gradTint,
} from "./theme";
import {
  CatIcon, IconBell, IconBill, IconChevronRight, IconClose, IconDeposit, IconInfo,
  IconRequest, IconSend, MerchantLogo, Tappable,
} from "./ui";
import StackedBars from "./StackedBars";
import { SAFE_TOP, SCREEN_H, SCREEN_W } from "./PhoneScreen";
import { AqlMark } from "@/components/demo/AqlMark";

/* ─── card shell ─── */
export function Card({
  children, style, pad = 16, lifted,
}: { children: React.ReactNode; style?: React.CSSProperties; pad?: number; lifted?: boolean }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 22, border: HAIRLINE,
      boxShadow: lifted ? CARD_SHADOW_LIFTED : CARD_SHADOW,
      padding: pad, ...style }}>
      {children}
    </div>
  );
}

export function CardTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: STRONG, letterSpacing: "-0.015em" }}>{children}</span>
      {right}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3, height: 26, padding: "0 10px",
      borderRadius: 999, background: "rgba(16,24,40,0.04)",
      fontSize: 11.5, fontWeight: 500, color: SUB, letterSpacing: "-0.01em" }}>{children}</span>
  );
}

/* ─── design-rationale annotation (portalled: cards clip) ─── */
export function AnnotationDot({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number }>({ left: 0, top: 0 });
  const anchor = useRef<HTMLSpanElement>(null);
  const W = 252, GAP = 8, EDGE = 12, EST_H = 120;

  const toggle = () => {
    if (open) { setOpen(false); return; }
    const el = anchor.current;
    const root = el?.closest("[data-phone-screen]") as HTMLElement | null;
    if (!el || !root) return;
    const rr = root.getBoundingClientRect();
    const scale = rr.width / SCREEN_W || 1;
    const r = el.getBoundingClientRect();
    const cx = (r.left + r.width / 2 - rr.left) / scale;
    const top = (r.top - rr.top) / scale;
    const bottom = (r.bottom - rr.top) / scale;
    const left = Math.max(EDGE, Math.min(cx - W / 2, SCREEN_W - W - EDGE));
    const flip = bottom + GAP + EST_H > SCREEN_H - 20;
    setHost(root);
    setPos(flip ? { left, bottom: SCREEN_H - top + GAP } : { left, top: bottom + GAP });
    setOpen(true);
  };

  return (
    <>
      <span ref={anchor} style={{ position: "relative", display: "inline-flex" }}>
        <Tappable scale={0.85} onTap={toggle}
          style={{ display: "flex", padding: 4, margin: -4, color: open ? STRONG : SOFT }}>
          <IconInfo size={14} />
        </Tappable>
      </span>
      {host && createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                style={{ position: "absolute", inset: 0, zIndex: 190 }}
              />
              <motion.div
                initial={{ opacity: 0, y: pos.bottom != null ? 6 : -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={SPRING}
                style={{
                  position: "absolute", left: pos.left, top: pos.top, bottom: pos.bottom,
                  width: W, zIndex: 200, background: "#171717", borderRadius: 14,
                  padding: "11px 13px", boxShadow: "0 16px 40px rgba(14,18,27,0.4)",
                  fontSize: 11.5, lineHeight: "17px", color: "#fff", fontWeight: 500,
                  pointerEvents: "none" }}
              >
                {text}
              </motion.div>
            </>
          )}
        </AnimatePresence>, host)}
    </>
  );
}

/* ─── count-up ─── */
function useCountUp(target: number, ms = 1000) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

/* ═══════════════════════════════════════════════════════════════
   GRADIENT HEADER — the balance is not a card. It sits directly on
   the gradient, with the quick actions as glass circles beneath.
   (Revolut · Starling · Klarna)
   ═══════════════════════════════════════════════════════════════ */

const ACTIONS = [
  { label: "Send",    Icon: IconSend },
  { label: "Request", Icon: IconRequest },
  { label: "Top up",  Icon: IconDeposit },
  { label: "Bills",   Icon: IconBill },
];

/* tall enough that the sheet's overlap never eats the action labels */
export const HEADER_H = 376;

function Sparkline() {
  const d = BALANCE_SPARK, W = 370, H = 40;
  const min = Math.min(...d), max = Math.max(...d);
  const pts = d.map((v, i) => [
    (i / (d.length - 1)) * W,
    H - ((v - min) / (max - min || 1)) * (H - 6) - 3,
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
      style={{ display: "block", opacity: 0.5 }}>
      <motion.path
        d={line} fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.15 }}
      />
    </svg>
  );
}

export function GradientHeader() {
  return (
    <div style={{
      position: "relative", height: HEADER_H, flexShrink: 0,
      background: HEADER_GRAD, overflow: "hidden" }}>
      {/* soft off-axis sheen so the gradient reads as light, not vinyl */}
      <div style={{ position: "absolute", inset: 0, background: HEADER_SHEEN, pointerEvents: "none" }} />

      <div style={{ position: "relative", paddingTop: SAFE_TOP + 6, paddingLeft: 20, paddingRight: 20 }}>
        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
          <img src="/avatar.png" alt="" style={{
            width: 34, height: 34, borderRadius: 999, flexShrink: 0,
            border: "1.5px solid rgba(255,255,255,0.45)" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.01em" }}>
              Hello, Mathew
            </p>
          </div>
          <Tappable scale={0.88} style={{
            width: 36, height: 36, borderRadius: 999, display: "flex",
            alignItems: "center", justifyContent: "center", position: "relative",
            background: GLASS_BG, border: GLASS_BORDER }}>
            <IconBell size={19} color="#fff" />
            <span style={{
              position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: 999,
              background: "#FF6B7A", boxShadow: "0 0 0 1.5px rgba(255,255,255,0.35)" }} />
          </Tappable>
        </div>

        {/* balance — on the gradient, not in a card */}
        <p style={{
          margin: "0 0 6px", fontSize: 12, fontWeight: 500, letterSpacing: "0.06em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.62)" }}>
          Total Balance
        </p>
        <p style={{
          margin: "0 0 10px", fontFamily: DISPLAY, fontSize: 40, lineHeight: "46px",
          fontWeight: 500, color: "#fff", letterSpacing: "-1.4px", fontVariantNumeric: "tabular-nums" }}>
          {BALANCE}
        </p>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5, height: 26, padding: "0 10px",
          borderRadius: 999, background: GLASS_BG, border: GLASS_BORDER, marginBottom: 4 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 9.5V2.5M6 2.5 3 5.5M6 2.5l3 3" stroke="#8FF0BC" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "#8FF0BC" }}>+4.2%</span>
          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.62)" }}>vs last month</span>
        </span>
      </div>

      {/* sparkline bleeds behind the actions for depth */}
      <div style={{ position: "absolute", left: 0, right: 0, top: SAFE_TOP + 150, pointerEvents: "none" }}>
        <Sparkline />
      </div>

      {/* quick actions — glass circles */}
      <div style={{
        position: "relative", display: "flex", gap: 8,
        padding: "0 16px", marginTop: 22 }}>
        {ACTIONS.map(({ label, Icon }, i) => (
          <Tappable key={label} scale={0.93} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_SOFT, delay: 0.06 * i + 0.1 }}
              style={{
                width: 52, height: 52, borderRadius: 999, display: "flex",
                alignItems: "center", justifyContent: "center",
                background: i === 0 ? GLASS_BG_STRONG : GLASS_BG,
                border: GLASS_BORDER,
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28)" }}
            >
              <Icon size={21} color="#fff" />
            </motion.span>
            <span style={{
              fontSize: 11.5, fontWeight: 500, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em" }}>{label}</span>
          </Tappable>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SPENDING WIDGET + the attract treatment.
   Restored to the desktop behaviour exactly: a gradient-tinted
   container wraps the white card, and the Aql CTA lives in the
   gradient area BELOW the card — not inside it. The shimmer is the
   same --x sweep the desktop uses, not a CSS keyframe.
   ═══════════════════════════════════════════════════════════════ */

const GAUGE_CATS = [
  { label: "Shopping",  amount: 900, color: "#335CFF" },
  { label: "Utilities", amount: 600, color: "#47C2FF" },
  { label: "Others",    amount: 200, color: "#D1D5DB" },
];
const SPEND = 1800, LIMIT = 2000;

function Gauge() {
  const r = 78, sw = 14, w = 2 * r + sw, h = r + sw / 2 + 4;
  const cx = w / 2, cy = h - 4;
  const L = Math.PI * r;
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const filled = (SPEND / LIMIT) * L;
  const catSum = GAUGE_CATS.reduce((s, c) => s + c.amount, 0);
  const lens = GAUGE_CATS.map(c => (c.amount / catSum) * filled);
  const segs = GAUGE_CATS.map((c, i) => ({
    ...c, len: lens[i], offset: lens.slice(0, i).reduce((a, b) => a + b, 0),
  }));
  const shown = useCountUp(SPEND);

  return (
    <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", maxWidth: "100%" }}>
        <path d={d} fill="none" stroke="#F2F2F4" strokeWidth={sw} strokeLinecap="round" />
        {segs.map(s => (
          <motion.path key={s.label} d={d} fill="none" stroke={s.color} strokeWidth={sw} strokeLinecap="butt"
            strokeDasharray={`${s.len} ${L * 2}`}
            initial={{ strokeDashoffset: -L }} animate={{ strokeDashoffset: -s.offset }}
            transition={{ duration: 1, ease: EASE_OUT }} />
        ))}
      </svg>
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 4,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: SOFT }}>
          Spend
        </span>
        <span style={{
          fontFamily: DISPLAY, fontSize: 26, fontWeight: 500, color: STRONG,
          letterSpacing: "-0.8px", fontVariantNumeric: "tabular-nums" }}>AED {money(shown)}</span>
      </div>
    </div>
  );
}

function SpendingCardBody() {
  return (
    <>
      <CardTitle right={<Chip>Last Week ▾</Chip>}>Spending Summary</CardTitle>
      <Gauge />
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {GAUGE_CATS.map(c => (
          <div key={c.label} style={{
            flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <CatIcon type={c.label} size={15} />
            <span style={{ fontSize: 11, color: SUB }}>{c.label}</span>
            <span style={{
              fontSize: 13, fontWeight: 600, color: STRONG, whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>AED {c.amount}.00</span>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 14, padding: "10px 12px", borderRadius: 12,
        background: "rgba(250,115,25,0.06)", border: "1px solid rgba(250,115,25,0.16)",
        display: "flex", alignItems: "center", gap: 9 }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path d="M8.49 2.62 13.92 12.14a.57.57 0 0 1-.49.86H2.57a.57.57 0 0 1-.49-.86L7.51 2.62a.57.57 0 0 1 .98 0ZM7.43 10.12v1.15h1.14v-1.15H7.43Zm0-4.04v2.88h1.14V6.08H7.43Z" fill="#FA7319" />
        </svg>
        <span style={{ fontSize: 11.5, lineHeight: "16px", color: SUB }}>
          Your weekly spending limit is <span style={{ fontWeight: 600, color: STRONG }}>AED 2000.</span>
        </span>
      </div>
    </>
  );
}

export function SpendingWidget({ attract, onOpenAI }: { attract: boolean; onOpenAI: () => void }) {
  return (
    <motion.div
      /* the --x sweep, identical to the desktop prototype */
      initial={{ "--x": "-100%" } as Record<string, string>}
      animate={{ "--x": "100%" } as Record<string, string>}
      transition={{
        repeat: Infinity, repeatType: "loop", repeatDelay: 0.5,
        type: "tween", duration: 5, ease: SHIMMER_EASE }}
      style={{
        borderRadius: 26,
        padding: attract ? 5 : 0,
        background: attract ? gradTint(0.1) : "transparent",
        outline: attract ? "1px solid #DBA2D3" : "1px solid transparent",
        outlineOffset: -1,
        transition: "padding 0.5s ease-out, background 0.5s ease-out, outline-color 0.5s ease-out",
      } as React.CSSProperties}
    >
      {/* white card — shimmer is scoped to it, exactly as on desktop */}
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 22 }}>
        {attract && (
          <span aria-hidden style={{
            position: "absolute", inset: 0, borderRadius: 22, pointerEvents: "none", zIndex: 2,
            background: "linear-gradient(75deg, transparent calc(var(--x) + 0%), rgba(219,162,211,0.10) calc(var(--x) + 15%), rgba(180,158,250,0.13) calc(var(--x) + 35%), rgba(148,121,241,0.10) calc(var(--x) + 55%), transparent calc(var(--x) + 70%))",
          } as React.CSSProperties} />
        )}
        <Card pad={16} style={{ borderRadius: 22 }}>
          <SpendingCardBody />
        </Card>
      </div>

      {/* CTA lives in the gradient area, below the white card */}
      <div style={{
        overflow: "hidden",
        maxHeight: attract ? 46 : 0,
        opacity: attract ? 1 : 0,
        transition: "max-height 0.5s ease-out 0.15s, opacity 0.5s ease-out 0.15s" }}>
        <Tappable onTap={onOpenAI} scale={0.98} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "12px 10px 10px" }}>
          <style>{`
          `}</style>
          <span style={{ display: "flex", flexShrink: 0 }}>
            <AqlMark size={19} animate="pendulum" delay="0.5s" />
          </span>
          <span style={{
            flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 500, color: SUB,
            letterSpacing: "-0.01em", textAlign: "left" }}>
            See where you can spend less this month
          </span>
          <span style={{ display: "flex", color: SUB, flexShrink: 0 }}><IconChevronRight size={18} /></span>
        </Tappable>
      </div>
    </motion.div>
  );
}

/* ─── income / expense ─── */
export function IncomeExpenseRow() {
  const items = [
    { label: "Income",   value: "36,240.28", badge: "-2%", up: true },
    { label: "Expenses", value: "6,240.28",  badge: "-2%", up: false },
  ];
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {items.map(it => (
        <Card key={it.label} pad={14} style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 999, display: "flex",
              alignItems: "center", justifyContent: "center",
              background: it.up ? "rgba(31,193,107,0.10)" : "rgba(16,24,40,0.05)",
              color: it.up ? "#1FC16B" : SUB }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d={it.up ? "M4 10L10 4M10 4H5.5M10 4V8.5" : "M10 4L4 10M4 10H8.5M4 10V5.5"}
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span style={{
              fontSize: 10.5, fontWeight: 600, color: "#0B4627", background: "rgba(31,193,107,0.12)",
              padding: "3px 7px", borderRadius: 999 }}>{it.badge}</span>
          </div>
          <p style={{ margin: "0 0 3px", fontSize: 11.5, color: SUB }}>{it.label}</p>
          <p style={{
            margin: 0, fontFamily: DISPLAY, fontSize: 17, fontWeight: 500, color: STRONG,
            letterSpacing: "-0.5px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 11.5, color: SOFT, marginRight: 3, fontFamily: "inherit" }}>AED</span>
            {it.value}
          </p>
        </Card>
      ))}
    </div>
  );
}

/* ─── saved widget ─── */
export function DailyExpenseCard({ glow, onGlowDone }: { glow: boolean; onGlowDone: () => void }) {
  useEffect(() => {
    if (!glow) return;
    const t = setTimeout(onGlowDone, 1500);
    return () => clearTimeout(t);
  }, [glow, onGlowDone]);

  return (
    <div style={{ position: "relative" }}>
      <AnimatePresence>
        {glow && (
          <motion.div
            initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{
              position: "absolute", inset: -4, borderRadius: 26, zIndex: 5, pointerEvents: "none",
              background: gradTint(0.2),
              boxShadow: "0 0 0 2px rgba(180,158,250,0.55), 0 12px 40px rgba(78,41,221,0.22)" }}
          />
        )}
      </AnimatePresence>
      <Card pad={16}>
        <CardTitle right={<Chip>Last Week ▾</Chip>}>Daily Expenses</CardTitle>
        <StackedBars height={126} />
      </Card>
    </div>
  );
}

/* ─── habit pattern 1 ─── */
export function JuneNudgeCard({ onTap }: { onTap: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98, height: 0, marginBottom: 0 }}
      transition={SPRING}
    >
      <motion.div
        initial={{ "--x": "-100%" } as Record<string, string>}
        animate={{ "--x": "100%" } as Record<string, string>}
        transition={{ repeat: Infinity, repeatType: "loop", repeatDelay: 0.5, type: "tween", duration: 5, ease: SHIMMER_EASE }}
        style={{
          borderRadius: 22, padding: 5, background: gradTint(0.1),
          outline: "1px solid #DBA2D3", outlineOffset: -1,
        } as React.CSSProperties}
      >
        <Tappable onTap={onTap} scale={0.98} style={{ width: "100%", display: "block" }}>
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 18 }}>
            <span aria-hidden style={{
              position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none", zIndex: 2,
              background: "linear-gradient(75deg, transparent calc(var(--x) + 0%), rgba(219,162,211,0.12) calc(var(--x) + 15%), rgba(180,158,250,0.16) calc(var(--x) + 35%), rgba(148,121,241,0.12) calc(var(--x) + 55%), transparent calc(var(--x) + 70%))",
            } as React.CSSProperties} />
            <div style={{
              background: "#fff", borderRadius: 18, padding: "14px 14px",
              display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{
                width: 40, height: 40, borderRadius: 13, flexShrink: 0, background: gradTint(0.14),
                border: "1px solid rgba(180,158,250,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AqlMark size={21} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "block" }}>
                <span style={{
                  display: "block", fontSize: 13.5, fontWeight: 600, color: STRONG,
                  letterSpacing: "-0.015em", marginBottom: 2 }}>Deep dive on your June spending</span>
                <span style={{ display: "block", fontSize: 11.5, lineHeight: "16px", color: SUB }}>
                  It&apos;s been a month since your last review
                </span>
              </span>
              <span style={{ display: "flex", color: SOFT, flexShrink: 0 }}><IconChevronRight size={18} /></span>
            </div>
          </div>
        </Tappable>
      </motion.div>
    </motion.div>
  );
}

/* ─── Round-Up ─── */
export function RoundUpCard({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97, height: 0, marginBottom: 0 }}
      transition={SPRING_SOFT}
    >
      <Card pad={0} lifted style={{ overflow: "hidden", position: "relative" }}>
        <div style={{ height: 3, background: HEADER_GRAD }} />

        {/* controls float, so the headline gets the full card width */}
        <div style={{
          position: "absolute", top: 11, right: 10, zIndex: 3,
          display: "flex", alignItems: "center", gap: 4 }}>
          <AnnotationDot text="When a user reviews their AI-generated spend summary, we surface relevant product suggestions. Here we show potential round-up savings based on their actual spend — introducing a savings feature at a moment when their spending habits are top of mind." />
          <Tappable scale={0.85} onTap={onClose} style={{ display: "flex", padding: 4, color: SOFT }}>
            <IconClose size={18} />
          </Tappable>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 14px 0" }}>
          <div style={{ width: 64, height: 64, marginTop: -6, marginLeft: -6, flexShrink: 0 }}>
            <Lottie animationData={walletAnimation} loop style={{ width: 64, height: 64 }} />
          </div>
          <p style={{
            flex: 1, margin: 0, paddingRight: 54, fontFamily: DISPLAY, fontSize: 16,
            fontWeight: 500, color: STRONG, letterSpacing: "-0.4px", lineHeight: "21px" }}>
            Save AED 240 — one dirham at a time
          </p>
        </div>
        <div style={{ padding: "10px 16px 16px" }}>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, lineHeight: "18px", color: SUB }}>
            Based on your May spending, you could have set aside AED 240 just by rounding up your spare
            change on every purchase. Small amounts, consistent habit.
          </p>
          <Tappable scale={0.96} style={{
            display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 16px",
            borderRadius: 999, background: "#171717" }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#fff" }}>See how it works</span>
            <span style={{ display: "flex", color: "#fff" }}><IconChevronRight size={15} /></span>
          </Tappable>
        </div>
      </Card>
    </motion.div>
  );
}

/* ─── transactions ─── */
export function TransactionList() {
  return (
    <Card pad={0}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "15px 16px 12px" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: STRONG, letterSpacing: "-0.015em" }}>
          Recent Transactions
        </span>
        <Tappable scale={0.94} style={{ fontSize: 12.5, fontWeight: 500, color: SUB }}>See all</Tappable>
      </div>
      {RECENT_TRANSACTIONS.map((t, i) => (
        <Tappable key={i} scale={0.99} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "11px 16px", borderTop: i === 0 ? DIVIDER : DIVIDER }}>
          <MerchantLogo merchant={t.merchant} size={36} />
          <span style={{ flex: 1, minWidth: 0, display: "block" }}>
            <span style={{
              display: "block", fontSize: 13.5, fontWeight: 500, color: STRONG, letterSpacing: "-0.01em",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.merchant}</span>
            <span style={{ display: "block", fontSize: 11.5, color: SOFT, marginTop: 2 }}>
              {t.sub} · {t.date}
            </span>
          </span>
          <span style={{
            fontSize: 13.5, fontWeight: 600, flexShrink: 0, fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em", color: t.positive ? "#1FC16B" : STRONG }}>
            {t.positive ? "+" : "−"}{money(t.amount)}
          </span>
        </Tappable>
      ))}
    </Card>
  );
}

export { StackedBars };
