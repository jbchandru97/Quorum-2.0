"use client";

import { motion } from "framer-motion";

/* ───────────────────────────────────────────────────────────────
   iPhone 17 Pro display — 402 × 874pt (1206 × 2622 @3x).
   Renders the SCREEN only; a device frame can be layered around it
   later without touching anything in here.
   ─────────────────────────────────────────────────────────────── */

export const SCREEN_W = 402;
export const SCREEN_H = 874;
export const SAFE_TOP = 62;      // Dynamic Island inset
export const SAFE_BOTTOM = 34;   // home indicator inset
export const SCREEN_RADIUS = 55; // display corner radius

/* Floating nav pill — inset from the edges, Notion/Calm style. */
export const NAV_H = 58;
export const NAV_INSET = 14;
export const NAV_GAP = 10;       // pill → home indicator
/* What content must clear at the bottom of a scroll view. */
export const NAV_CLEARANCE = NAV_H + NAV_GAP + SAFE_BOTTOM;

const ISLAND_W = 125;
const ISLAND_H = 37;
const ISLAND_TOP = 11;

function SignalIcon({ c }: { c: string }) {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={i * 4.6} y={8.5 - i * 2.6} width="3" height={3.5 + i * 2.6} rx="1" fill={c} />
      ))}
    </svg>
  );
}

function WifiIcon({ c }: { c: string }) {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
      <path d="M8.5 10.6 6.9 8.8a2.4 2.4 0 0 1 3.2 0L8.5 10.6Z" fill={c} />
      <path d="M4.6 6.6a5.7 5.7 0 0 1 7.8 0" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M2 3.9a9.4 9.4 0 0 1 13 0" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function BatteryIcon({ c }: { c: string }) {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
      <rect x="0.6" y="0.6" width="22" height="11.8" rx="3.4" stroke={c} strokeOpacity="0.4" strokeWidth="1.1" />
      <rect x="2.2" y="2.2" width="16.5" height="8.6" rx="2.2" fill={c} />
      <path d="M24.4 4.4v4.2c1-.4 1.6-1.1 1.6-2.1s-.6-1.7-1.6-2.1Z" fill={c} fillOpacity="0.45" />
    </svg>
  );
}

export function StatusBar({ light = false }: { light?: boolean }) {
  const c = light ? "#FFFFFF" : "#171717";
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: ISLAND_TOP + ISLAND_H,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 30px 0 34px", zIndex: 120, pointerEvents: "none",
      fontFamily: "var(--font-inter), Inter, sans-serif",
    }}>
      <motion.span
        animate={{ color: c }}
        transition={{ duration: 0.25 }}
        style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.2px", fontVariantNumeric: "tabular-nums" }}
      >
        9:41
      </motion.span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <SignalIcon c={c} /><WifiIcon c={c} /><BatteryIcon c={c} />
      </span>
    </div>
  );
}

export function DynamicIsland() {
  return (
    <div style={{
      position: "absolute", top: ISLAND_TOP, left: "50%", transform: "translateX(-50%)",
      width: ISLAND_W, height: ISLAND_H, borderRadius: ISLAND_H / 2,
      background: "#000", zIndex: 130, pointerEvents: "none",
    }} />
  );
}

export function HomeIndicator({ light = false }: { light?: boolean }) {
  return (
    <motion.div
      animate={{ backgroundColor: light ? "rgba(255,255,255,0.7)" : "rgba(23,23,23,0.85)" }}
      transition={{ duration: 0.25 }}
      style={{
        position: "absolute", bottom: 8, left: "50%", x: "-50%",
        width: 140, height: 5, borderRadius: 3, zIndex: 130, pointerEvents: "none",
      }}
    />
  );
}

export default function PhoneScreen({
  children, statusLight = false,
}: { children: React.ReactNode; statusLight?: boolean }) {
  return (
    <div
      data-phone-screen=""
      style={{
        position: "relative",
        width: SCREEN_W, height: SCREEN_H,
        borderRadius: SCREEN_RADIUS,
        overflow: "hidden",
        background: "#FFFFFF",
        flexShrink: 0,
        boxShadow: "0 40px 90px -20px rgba(14,18,27,0.30), 0 0 0 1px rgba(14,18,27,0.06)",
        isolation: "isolate",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        color: "var(--text-strong-950, #171717)",
        WebkitFontSmoothing: "antialiased",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {children}
      <StatusBar light={statusLight} />
      <DynamicIsland />
      <HomeIndicator />
    </div>
  );
}
