"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { CAT_CONFIG, MERCHANT_COLORS } from "./data";
import { AqlMark } from "@/components/demo/AqlMark";


/* ───────────────────────────────────────────────────────────────
   Tappable — the mobile stand-in for :hover.
   Touch has no hover, so every interactive surface answers with a
   press: a quick scale-down + dim that settles on a spring.
   ─────────────────────────────────────────────────────────────── */
export function Tappable({
  children, onTap, scale = 0.96, disabled, style, ...rest
}: {
  children: React.ReactNode;
  onTap?: () => void;
  scale?: number;
  disabled?: boolean;
} & Omit<HTMLMotionProps<"button">, "onTap" | "children" | "style">
  & { style?: React.CSSProperties }) {
  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onTap}
      whileTap={disabled ? undefined : { scale, opacity: 0.75 }}
      transition={{ type: "spring", stiffness: 600, damping: 32 }}
      style={{
        background: "transparent", border: "none", padding: 0, margin: 0,
        cursor: disabled ? "default" : "pointer", WebkitTapHighlightColor: "transparent",
        textAlign: "left", font: "inherit", color: "inherit",
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

/* ─── category pill icon ─── */
export function CatIcon({ type, size = 16 }: { type: string; size?: number }) {
  const cfg = CAT_CONFIG[type] ?? CAT_CONFIG.Others;
  const pad = Math.round(size * 0.34);
  return (
    <div style={{
      padding: pad, backgroundColor: cfg.bg, borderRadius: 9999,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <svg width={size} height={size} viewBox="0 0 15 15" fill="none">
        <path d={cfg.path} fill={cfg.iconColor} />
      </svg>
    </div>
  );
}

/* ─── merchant logo ─── */
export function MerchantLogo({ merchant, size = 36 }: { merchant: string; size?: number }) {
  const wrap = (children: React.ReactNode, bg = "#fff", border = false) => (
    <div style={{
      width: size, height: size, borderRadius: 9999, flexShrink: 0, overflow: "hidden",
      background: bg, display: "flex", alignItems: "center", justifyContent: "center",
      outline: border ? "1px solid var(--stroke-soft-200,#F4F4F4)" : "none", outlineOffset: -1,
    }}>{children}</div>
  );
  const img = (src: string, alt: string, fit: "cover" | "contain" = "cover", inset = 0) => (
    <img src={src} alt={alt} style={{
      width: `calc(100% - ${inset * 2}px)`, height: `calc(100% - ${inset * 2}px)`, objectFit: fit,
    }} />
  );

  if (merchant === "Starbucks") return wrap(img("/logos/starbucks.png", "Starbucks"));
  if (merchant === "McDonald's") return wrap(img("/logos/mcdonalds.svg", "McDonald's"));
  if (merchant === "KFC") return wrap(img("/logos/kfc.svg", "KFC", "contain", 7), "#fff", true);
  if (merchant === "Noon" || merchant === "Noon Food")
    return <img src="/logos/noon.svg" alt="Noon" style={{ width: size, height: size, flexShrink: 0 }} />;
  if (merchant === "Careem" || merchant === "Careem Food")
    return <img src="/logos/careem.svg" alt="Careem" style={{ width: size, height: size, flexShrink: 0 }} />;
  if (merchant === "Talabat")
    return <img src="/logos/talabat.svg" alt="Talabat" style={{ width: size, height: size, flexShrink: 0 }} />;

  if (merchant === "Salary") return wrap(
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 20 20" fill="none">
      <path d="M10 3.5V16.5M10 3.5L5.5 8M10 3.5L14.5 8" stroke="#1FC16B" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 10 10)" />
    </svg>, "#E3F7EC");

  const bg = MERCHANT_COLORS[merchant] ?? "#8A8A8A";
  const light = bg === "#FEEE00";
  return wrap(
    <span style={{
      fontSize: size * 0.4, fontWeight: 700, color: light ? "#171717" : "#fff",
      fontFamily: "var(--font-inter),Inter,sans-serif", lineHeight: 1,
    }}>{merchant[0].toUpperCase()}</span>, bg);
}

/* ─── icons ─── */
type IP = { size?: number; color?: string; active?: boolean };

export const IconHome = ({ size = 24, color = "currentColor", active }: IP) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 10.2L12 4l8 6.2V19a1 1 0 0 1-1 1h-4v-5.5h-6V20H5a1 1 0 0 1-1-1v-8.8Z"
      fill={active ? color : "none"} stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const IconCard = ({ size = 24, color = "currentColor", active }: IP) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" fill={active ? color : "none"} stroke={color} strokeWidth="1.6" />
    <path d="M3 10h18" stroke={active ? "#fff" : color} strokeWidth="1.6" />
  </svg>
);

export const IconActivity = ({ size = 24, color = "currentColor", active }: IP) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 13.5h3.5L9 7.5l3.5 9L15 11h6" stroke={color} strokeWidth={active ? 2.2 : 1.6}
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconMore = ({ size = 24, color = "currentColor", active }: IP) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {[6, 12, 18].map(y => (
      <circle key={y} cx="12" cy={y} r={active ? 2 : 1.6} fill={color} />
    ))}
  </svg>
);

export const IconChevronRight = ({ size = 20, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M7.5 5L12.5 10L7.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconClose = ({ size = 20, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M14.5 5.5L5.5 14.5M5.5 5.5L14.5 14.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconFollowUp = ({ size = 16, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M4 10.5 1.5 8 4 5.5M1.8 8H9a4.2 4.2 0 0 1 4.2 4.2v1.3"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconArrowUp = ({ size = 18, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M9 14.5V3.5M9 3.5L4 8.5M9 3.5l5 5" stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPlus = ({ size = 20, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M10 4.5v11M4.5 10h11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconInfo = ({ size = 14, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke={color} strokeWidth="1.2" />
    <path d="M7 6.2v4M7 4.1v.9" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const IconBell = ({ size = 22, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <path d="M11 3.5a5 5 0 0 0-5 5v3.2L4.8 14.2a.6.6 0 0 0 .5.9h11.4a.6.6 0 0 0 .5-.9L16 11.7V8.5a5 5 0 0 0-5-5ZM9.2 17.5a1.9 1.9 0 0 0 3.6 0"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconSend = ({ size = 20, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M17.5 2.5 9.2 10.8M17.5 2.5l-5.3 15-3-6.7-6.7-3 15-5.3Z"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconRequest = ({ size = 20, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M10 3.5v11M10 14.5 5.5 10M10 14.5 14.5 10" stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconDeposit = ({ size = 20, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M10 4.5v11M4.5 10h11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconBill = ({ size = 20, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="4.25" y="2.75" width="11.5" height="14.5" rx="1.2" stroke={color} strokeWidth="1.5" />
    <path d="M7.25 8h5.5M7.25 11h5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconInvoice = ({ size = 20, color = "currentColor" }: IP) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M5 4.2 6.9 3l1.9 1.2L10.7 3l1.9 1.2L14.5 3v13.2a1.3 1.3 0 0 1-1.3 1.3H6.3A1.3 1.3 0 0 1 5 16.2V4.2Z"
      stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M7.8 8h4.4M7.8 11h4.4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const QUICK_ICONS = {
  Send: IconSend, Request: IconRequest, Deposit: IconDeposit,
  "Pay Bills": IconBill, Invoice: IconInvoice,
} as const;
