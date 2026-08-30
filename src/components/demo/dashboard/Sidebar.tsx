"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Lottie from "lottie-react";
import walletAnimation from "@/assets/demo/wallet-animation.json";
import { AqlMark } from "@/components/demo/AqlMark";

const navItems = [
  { label: "Dashboard",    href: "/",             icon: IconDashboard    },
  { label: "My Cards",     href: "/cards",        icon: IconCard         },
  { label: "Transfer",     href: "/transfer",     icon: IconTransfer     },
  { label: "Transactions", href: "/transactions", icon: IconTransactions },
  { label: "Exchange",     href: "/exchange",     icon: IconExchange     },
  { label: "Settings",     href: "/settings",     icon: IconSettings     },
  { label: "Support",      href: "/support",      icon: IconSupport      },
];

function IconDashboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.75 3.25C16.9489 3.25 17.1397 3.32902 17.2803 3.46967C17.421 3.61032 17.5 3.80109 17.5 4V16C17.5 16.1989 17.421 16.3897 17.2803 16.5303C17.1397 16.671 16.9489 16.75 16.75 16.75H3.25C3.05109 16.75 2.86032 16.671 2.71967 16.5303C2.57902 16.3897 2.5 16.1989 2.5 16V4C2.5 3.80109 2.57902 3.61032 2.71967 3.46967C2.86032 3.32902 3.05109 3.25 3.25 3.25H16.75ZM9.25 10.75H4V15.25H9.25V10.75ZM16 10.75H10.75V15.25H16V10.75ZM9.25 4.75H4V9.25H9.25V4.75ZM16 4.75H10.75V9.25H16V4.75Z" fill="currentColor"/>
    </svg>
  );
}

function IconCard() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3.25 3.25H16.75C16.9489 3.25 17.1397 3.32902 17.2803 3.46967C17.421 3.61032 17.5 3.80109 17.5 4V16C17.5 16.1989 17.421 16.3897 17.2803 16.5303C17.1397 16.671 16.9489 16.75 16.75 16.75H3.25C3.05109 16.75 2.86032 16.671 2.71967 16.5303C2.57902 16.3897 2.5 16.1989 2.5 16V4C2.5 3.80109 2.57902 3.61032 2.71967 3.46967C2.86032 3.32902 3.05109 3.25 3.25 3.25ZM16 9.25H4V15.25H16V9.25ZM16 7.75V4.75H4V7.75H16ZM11.5 12.25H14.5V13.75H11.5V12.25Z" fill="currentColor"/>
    </svg>
  );
}

function IconTransfer() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M13.0375 10.0375L16.75 13.75L13.0375 17.4625L11.977 16.402L13.879 14.4992L4 14.5V13H13.879L11.977 11.098L13.0375 10.0375ZM6.9625 2.53748L8.023 3.59798L6.121 5.49998H16V6.99998H6.121L8.023 8.90198L6.9625 9.96248L3.25 6.24998L6.9625 2.53748Z" fill="currentColor"/>
    </svg>
  );
}

function IconTransactions() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5C14.1423 2.5 17.5 5.85775 17.5 10C17.5 14.1423 14.1423 17.5 10 17.5C5.85775 17.5 2.5 14.1423 2.5 10H4C4 13.3135 6.6865 16 10 16C13.3135 16 16 13.3135 16 10C16 6.6865 13.3135 4 10 4C7.9375 4 6.118 5.04025 5.03875 6.625H7V8.125H2.5V3.625H4V5.5C5.368 3.6775 7.54675 2.5 10 2.5ZM10.75 6.25V9.68875L13.1823 12.121L12.121 13.1823L9.25 10.3098V6.25H10.75Z" fill="currentColor"/>
    </svg>
  );
}

function IconExchange() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 17.5C5.85775 17.5 2.5 14.1423 2.5 10C2.5 5.85775 5.85775 2.5 10 2.5C14.1423 2.5 17.5 5.85775 17.5 10C17.5 14.1423 14.1423 17.5 10 17.5ZM10 16C11.5913 16 13.1174 15.3679 14.2426 14.2426C15.3679 13.1174 16 11.5913 16 10C16 8.4087 15.3679 6.88258 14.2426 5.75736C13.1174 4.63214 11.5913 4 10 4C8.4087 4 6.88258 4.63214 5.75736 5.75736C4.63214 6.88258 4 8.4087 4 10C4 11.5913 4.63214 13.1174 5.75736 14.2426C6.88258 15.3679 8.4087 16 10 16ZM6.25 10.75H13V12.25H10V14.5L6.25 10.75ZM10 7.75V5.5L13.75 9.25H7V7.75H10Z" fill="currentColor"/>
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7.5145 4.00004L9.46975 2.04479C9.61039 1.90418 9.80112 1.8252 10 1.8252C10.1989 1.8252 10.3896 1.90418 10.5302 2.04479L12.4855 4.00004H15.25C15.4489 4.00004 15.6397 4.07905 15.7803 4.21971C15.921 4.36036 16 4.55112 16 4.75004V7.51453L17.9552 9.46979C18.0958 9.61043 18.1748 9.80116 18.1748 10C18.1748 10.1989 18.0958 10.3896 17.9552 10.5303L16 12.4855V15.25C16 15.4489 15.921 15.6397 15.7803 15.7804C15.6397 15.921 15.4489 16 15.25 16H12.4855L10.5302 17.9553C10.3896 18.0959 10.1989 18.1749 10 18.1749C9.80112 18.1749 9.61039 18.0959 9.46975 17.9553L7.5145 16H4.75C4.55108 16 4.36032 15.921 4.21967 15.7804C4.07901 15.6397 4 15.4489 4 15.25V12.4855L2.04475 10.5303C1.90414 10.3896 1.82516 10.1989 1.82516 10C1.82516 9.80116 1.90414 9.61043 2.04475 9.46979L4 7.51453V4.75004C4 4.55112 4.07901 4.36036 4.21967 4.21971C4.36032 4.07905 4.55108 4.00004 4.75 4.00004H7.5145ZM5.5 5.50003V8.13629L3.63625 10L5.5 11.8638V14.5H8.13625L10 16.3638L11.8637 14.5H14.5V11.8638L16.3637 10L14.5 8.13629V5.50003H11.8637L10 3.63629L8.13625 5.50003H5.5ZM10 13C9.20435 13 8.44129 12.684 7.87868 12.1214C7.31607 11.5587 7 10.7957 7 10C7 9.20438 7.31607 8.44132 7.87868 7.87871C8.44129 7.31611 9.20435 7.00003 10 7.00003C10.7956 7.00003 11.5587 7.31611 12.1213 7.87871C12.6839 8.44132 13 9.20438 13 10C13 10.7957 12.6839 11.5587 12.1213 12.1214C11.5587 12.684 10.7956 13 10 13ZM10 11.5C10.3978 11.5 10.7794 11.342 11.0607 11.0607C11.342 10.7794 11.5 10.3979 11.5 10C11.5 9.60221 11.342 9.22068 11.0607 8.93937C10.7794 8.65807 10.3978 8.50003 10 8.50003C9.60217 8.50003 9.22064 8.65807 8.93934 8.93937C8.65803 9.22068 8.5 9.60221 8.5 10C8.5 10.3979 8.65803 10.7794 8.93934 11.0607C9.22064 11.342 9.60217 11.5 10 11.5Z" fill="currentColor"/>
    </svg>
  );
}

function IconSupport() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4C8.4087 4 6.88258 4.63214 5.75736 5.75736C4.63214 6.88258 4 8.4087 4 10H6.25C6.64782 10 7.02936 10.158 7.31066 10.4393C7.59196 10.7206 7.75 11.1022 7.75 11.5V15.25C7.75 15.6478 7.59196 16.0294 7.31066 16.3107C7.02936 16.592 6.64782 16.75 6.25 16.75H4C3.60218 16.75 3.22064 16.592 2.93934 16.3107C2.65804 16.0294 2.5 15.6478 2.5 15.25V10C2.5 5.85775 5.85775 2.5 10 2.5C14.1423 2.5 17.5 5.85775 17.5 10V15.25C17.5 15.6478 17.342 16.0294 17.0607 16.3107C16.7794 16.592 16.3978 16.75 16 16.75H13.75C13.3522 16.75 12.9706 16.592 12.6893 16.3107C12.408 16.0294 12.25 15.6478 12.25 15.25V11.5C12.25 11.1022 12.408 10.7206 12.6893 10.4393C12.9706 10.158 13.3522 10 13.75 10H16C16 8.4087 15.3679 6.88258 14.2426 5.75736C13.1174 4.63214 11.5913 4 10 4ZM4 11.5V15.25H6.25V11.5H4ZM13.75 11.5V15.25H16V11.5H13.75Z" fill="currentColor"/>
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10.7958 9.9992L7.08334 6.2867L8.14384 5.2262L12.9168 9.9992L8.14384 14.7722L7.08334 13.7117L10.7958 9.9992Z" fill="currentColor"/>
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 12.25L5.5 7.75H14.5L10 12.25Z" fill="#5C5C5C"/>
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9.5 12L5.5 8L9.5 4" stroke="var(--icon-sub-600, #5C5C5C)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconChevronRightSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6.5 12L10.5 8L6.5 4" stroke="var(--icon-sub-600, #5C5C5C)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BuildingIcon() {
  return (
    <div style={{
      width: 32, height: 32, position: "relative",
      background: "#262626", overflow: "hidden", borderRadius: 999, flexShrink: 0 }}>
      {/* Back building — smaller, left, low opacity */}
      <div style={{ width: 15, height: 31, left: 4, top: 13, position: "absolute", opacity: 0.48, background: "white", borderRadius: 2 }} />
      <div style={{ width: 3, height: 3, left: 7, top: 16, position: "absolute", background: "#262626" }} />
      <div style={{ width: 3, height: 3, left: 7, top: 22, position: "absolute", background: "#262626" }} />
      <div style={{ width: 3, height: 3, left: 7, top: 27, position: "absolute", background: "#262626" }} />
      {/* Front building — taller, right, brighter */}
      <div style={{ width: 15, height: 31, left: 12, top: 6, position: "absolute", background: "rgba(255,255,255,0.80)", boxShadow: "0px 4px 4px rgba(255,255,255,0.25) inset", borderRadius: 2 }} />
      <div style={{ width: 3, height: 3, left: 15, top: 10, position: "absolute", background: "#262626" }} />
      <div style={{ width: 3, height: 3, left: 15, top: 15, position: "absolute", background: "#262626" }} />
      <div style={{ width: 3, height: 3, left: 15, top: 21, position: "absolute", background: "#262626" }} />
      <div style={{ width: 3, height: 3, left: 15, top: 26, position: "absolute", background: "#262626" }} />
      <div style={{ width: 3, height: 3, left: 21, top: 10, position: "absolute", background: "#262626" }} />
      <div style={{ width: 3, height: 3, left: 21, top: 15, position: "absolute", background: "#262626" }} />
      <div style={{ width: 3, height: 3, left: 21, top: 21, position: "absolute", background: "#262626" }} />
      <div style={{ width: 3, height: 3, left: 21, top: 26, position: "absolute", background: "#262626" }} />
    </div>
  );
}

const MAL_ACTIVE_BG = "linear-gradient(135deg, rgba(219,162,211,0.20) 21%, rgba(195,160,235,0.20) 36%, rgba(180,158,250,0.20) 45%, rgba(148,121,241,0.20) 58%, rgba(116,84,232,0.20) 69%, rgba(78,41,221,0.20) 83%, rgba(19,3,96,0.20) 97%)";
const MAL_CARD_BG = "linear-gradient(135deg, rgba(219,162,211,0.10) 21%, rgba(195,160,235,0.10) 36%, rgba(180,158,250,0.10) 45%, rgba(148,121,241,0.10) 58%, rgba(116,84,232,0.10) 69%, rgba(78,41,221,0.10) 83%, rgba(19,3,96,0.10) 97%)";

function MalNavItem({ active = false, isOnDashboard = false, collapsed = false }: { active?: boolean; isOnDashboard?: boolean; collapsed?: boolean }) {
  // useRouter must stay first — it registers internal Next.js hooks whose
  // position in the fiber's hook list must remain stable across renders.
  const router = useRouter();
  const [showCard, setShowCard] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipY, setTooltipY] = useState(0);
  const tooltipAnchorRef = useRef<HTMLButtonElement>(null);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOnDashboard) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("dashboardWidgetAdded") !== "true") return;
    if (sessionStorage.getItem("mal-ai-skip-card") === "true") {
      sessionStorage.removeItem("mal-ai-skip-card");
      return;
    }

    const t = setTimeout(() => {
      setShowCard(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setCardVisible(true)));
    }, 2000);
    return () => clearTimeout(t);
  }, [isOnDashboard]);

  useEffect(() => {
    const reset = () => { setShowCard(false); setCardVisible(false); };
    window.addEventListener("mal-dashboard-reset", reset);
    return () => window.removeEventListener("mal-dashboard-reset", reset);
  }, []);

  if (collapsed) {
    if (showCard) {
      return (
        <>
          <style>{`
            @keyframes malCardShimmerCollapsed {
              0%   { transform: translateX(-60px) rotate(-18deg); }
              100% { transform: translateX(120px) rotate(-18deg); }
            }
          `}</style>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <button
              ref={tooltipAnchorRef}
              onClick={() => {
                sessionStorage.setItem("mal-ai-autostart", "true");
                sessionStorage.setItem("mal-ai-june-flow", "true");
                window.dispatchEvent(new CustomEvent("mal-wizard-advance", { detail: { to: 6 } }));
                router.push("/demo/playground/assistant");
              }}
              onMouseEnter={() => {
                if (tooltipAnchorRef.current) {
                  const r = tooltipAnchorRef.current.getBoundingClientRect();
                  setTooltipY(r.top + r.height / 2);
                }
                tooltipTimeout.current = setTimeout(() => setTooltipVisible(true), 300);
              }}
              onMouseLeave={() => {
                if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
                setTooltipVisible(false);
              }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 8, borderRadius: 8,
                background: MAL_CARD_BG,
                outline: "1px solid rgba(219,162,211,0.35)",
                outlineOffset: -1,
                border: "none", cursor: "pointer", width: "100%",
                position: "relative", height: 36,
                overflow: "hidden",
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "translateY(0)" : "translateY(-6px)",
                transition: "opacity 0.4s ease, transform 0.4s ease" }}
            >
              <div>
                <AqlMark size={16} animate="pendulum" delay="1s" />
              </div>
              {/* Shimmer sweep */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-20px",
                  left: 0,
                  width: 50,
                  height: "200%",
                  background: "linear-gradient(90deg, transparent 0%, rgba(219,162,211,0.15) 35%, rgba(180,158,250,0.18) 55%, transparent 100%)",
                  pointerEvents: "none",
                  animation: "malCardShimmerCollapsed 3.5s cubic-bezier(0.76, 0, 0.24, 1) 0.6s infinite" }}
              />
            </button>
            {/* Tooltip — fixed to escape overflow:hidden + z-index stacking */}
            {tooltipVisible && (
              <div style={{
                position: "fixed",
                left: 82,
                top: tooltipY,
                transform: "translateY(-50%)",
                background: "#171717",
                borderRadius: 8,
                boxShadow: "0px 4px 16px rgba(14,18,27,0.24)",
                padding: "8px 10px",
                zIndex: 9999,
                pointerEvents: "none",
                whiteSpace: "nowrap" }}>
                <span style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 12, fontWeight: 500, lineHeight: "18px",
                  color: "#ffffff", display: "block" }}>
                  Deep dive on your June spending
                </span>
              </div>
            )}
          </div>
        </>
      );
    }

    return (
      <button
        onClick={() => router.push("/demo/playground/assistant")}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 8, borderRadius: 8,
          background: active ? MAL_ACTIVE_BG : "transparent",
          border: "none", cursor: "pointer", width: "100%",
          position: "relative", height: 36,
          transition: "background 0.15s" }}
        onMouseEnter={(e) => {
          if (!active) (e.currentTarget as HTMLElement).style.background = MAL_ACTIVE_BG;
        }}
        onMouseLeave={(e) => {
          if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        {active && (
          <span style={{
            position: "absolute", left: -16, top: 8,
            width: 4, height: 20,
            background: "linear-gradient(135deg, #DBA2D3 21%, #C3A0EB 36%, #B49EFA 45%, #9479F1 58%, #7454E8 69%, #4E29DD 83%, #130360 97%)",
            borderRadius: "0 4px 4px 0" }} />
        )}
        <AqlMark size={16} solid={active} />
      </button>
    );
  }

  if (showCard) {
    return (
      <>
        <style>{`
          @keyframes malCardIn {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes malCardShimmer {
            0%   { transform: translateX(-120px) rotate(-18deg); }
            100% { transform: translateX(320px)  rotate(-18deg); }
          }
        `}</style>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <button
            ref={tooltipAnchorRef}
            onClick={() => {
              sessionStorage.setItem("mal-ai-autostart", "true");
              sessionStorage.setItem("mal-ai-june-flow", "true");
              window.dispatchEvent(new CustomEvent("mal-wizard-advance", { detail: { to: 6 } }));
              router.push("/demo/playground/assistant");
            }}
            onMouseEnter={() => {
              if (tooltipAnchorRef.current) {
                const r = tooltipAnchorRef.current.getBoundingClientRect();
                setTooltipY(r.top + r.height / 2);
              }
              tooltipTimeout.current = setTimeout(() => setTooltipVisible(true), 400);
            }}
            onMouseLeave={() => {
              if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
              setTooltipVisible(false);
            }}
            style={{
              width: "100%", border: "none", cursor: "pointer", textAlign: "left",
              padding: "8px 12px",
              background: MAL_CARD_BG,
              borderRadius: 8,
              outline: "1px solid rgba(219,162,211,0.30)",
              outlineOffset: -1,
              display: "flex", flexDirection: "column", gap: 8,
              overflow: "hidden",
              position: "relative",
              opacity: cardVisible ? 1 : 0,
              transform: cardVisible ? "translateY(0)" : "translateY(-6px)",
              transition: "opacity 0.4s ease, transform 0.4s ease" }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div>
                  <AqlMark size={16} animate="pendulum" delay="1s" />
                </div>
              </span>
              <span style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontWeight: 500, fontSize: 14, lineHeight: "20px",
                color: "var(--text-sub-600)" }}>Aql AI</span>
            </div>
            {/* Divider */}
            <div style={{ height: 1, background: "#DBA2D3", opacity: 0.5, alignSelf: "stretch" }} />
            {/* Subtext row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                flex: 1,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontWeight: 400, fontSize: 12, lineHeight: "16px",
                color: "var(--text-sub-600)" }}>
                Deep dive on your June spending
              </span>
              <span style={{ color: "var(--icon-sub-600)", flexShrink: 0, display: "flex" }}>
                <IconChevronRight />
              </span>
            </div>
            {/* Shimmer sweep overlay */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-40px",
                left: 0,
                width: 110,
                height: "200%",
                background: "linear-gradient(90deg, transparent 0%, rgba(219,162,211,0.12) 35%, rgba(180,158,250,0.15) 55%, transparent 100%)",
                pointerEvents: "none",
                animation: "malCardShimmer 3.5s cubic-bezier(0.76, 0, 0.24, 1) 0.6s infinite" }}
            />
          </button>

          {/* Tooltip — fixed to escape overflow:hidden + z-index stacking */}
          {tooltipVisible && (
            <div style={{
              position: "fixed",
              left: 210,
              top: tooltipY,
              transform: "translateY(-50%)",
              background: "#171717",
              borderRadius: 8,
              boxShadow: "0px 4px 16px rgba(14,18,27,0.24)",
              padding: "8px 10px",
              width: 280,
              zIndex: 9999,
              pointerEvents: "none" }}>
              <span style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 12, fontWeight: 500, lineHeight: "18px",
                color: "#ffffff",
                display: "block" }}>
                This will be surfaced to the user the following month to encourage the habit of regularly reviewing their spend
              </span>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <button
      /* Quorum: review anchor for the scripted demo — see
         fixtures/context/component-map.json. */
      data-quorum-target="ai-assistant-tab"
      onClick={() => router.push("/demo/playground/assistant")}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 12px", borderRadius: "var(--radius-8)",
        background: active ? MAL_ACTIVE_BG : "transparent",
        border: "none", cursor: "pointer", width: "100%",
        textAlign: "left", position: "relative", height: 36,
        transition: "background 0.15s" }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = MAL_ACTIVE_BG;
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {active && (
        <span style={{
          position: "absolute", left: -16, top: 8,
          width: 4, height: 20,
          background: "linear-gradient(135deg, #DBA2D3 21%, #C3A0EB 36%, #B49EFA 45%, #9479F1 58%, #7454E8 69%, #4E29DD 83%, #130360 97%)",
          borderRadius: "0 4px 4px 0" }} />
      )}
      <span style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <AqlMark size={16} solid={active} />
      </span>
      <span style={{
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontWeight: 500, fontSize: 14, lineHeight: "20px",
        letterSpacing: "-0.084px", flex: 1,
        color: active ? "var(--text-strong-950)" : "var(--text-sub-600)",
        whiteSpace: "nowrap",
        overflow: "hidden" }}>
        Aql AI
      </span>
      {active && (
        <span style={{ color: "var(--icon-sub-600)", flexShrink: 0, display: "flex" }}>
          <IconChevronRight />
        </span>
      )}
    </button>
  );
}

function CrossFlowCard({ visible, onClose, isHoverExpanded = false }: { visible: boolean; onClose: () => void; isHoverExpanded?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [annotationVisible, setAnnotationVisible] = useState(false);
  const annotationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [productTooltipKey, setProductTooltipKey] = useState(0);
  const [productTooltipTop, setProductTooltipTop] = useState(0);
  const [productTooltipLeft, setProductTooltipLeft] = useState(210);
  const [showProductTooltip, setShowProductTooltip] = useState(false);

  useEffect(() => {
    if (!visible) return;
    // Never show on hover-driven expansions, only on the real first-time arrival
    if (isHoverExpanded) return;
    // Only show once per session
    if (sessionStorage.getItem("roundup-tooltip-shown") === "true") return;
    sessionStorage.setItem("roundup-tooltip-shown", "true");

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setProductTooltipTop(rect.top + rect.height / 2);
      setProductTooltipLeft(rect.right + 10);
    }
    setShowProductTooltip(true);
    setProductTooltipKey(k => k + 1);
    const t = setTimeout(() => setShowProductTooltip(false), 3400);
    return () => clearTimeout(t);
  }, [visible, isHoverExpanded]);

  return (
    <div style={{ padding: "0 12px 16px", flexShrink: 0 }}>
      {/* Product tooltip — fixed outside the nav, bounces toward it then fades */}
      {showProductTooltip && (
        <>
          <style>{`
            @keyframes malRoundupBounce {
              0%   { transform: translateY(-50%) translateX(0);    opacity: 0; }
              6%   { transform: translateY(-50%) translateX(0);    opacity: 1; }
              18%  { transform: translateY(-50%) translateX(-12px); opacity: 1; }
              28%  { transform: translateY(-50%) translateX(0);    opacity: 1; }
              40%  { transform: translateY(-50%) translateX(-12px); opacity: 1; }
              50%  { transform: translateY(-50%) translateX(0);    opacity: 1; }
              78%  { transform: translateY(-50%) translateX(0);    opacity: 1; }
              100% { transform: translateY(-50%) translateX(0);    opacity: 0; }
            }
          `}</style>
          <div
            key={productTooltipKey}
            style={{
              position: "fixed",
              left: productTooltipLeft,
              top: productTooltipTop,
              display: "flex", alignItems: "center",
              animation: "malRoundupBounce 3.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
              pointerEvents: "none",
              zIndex: 9999 }}
          >
            {/* Arrow pointing left toward the nav */}
            <div style={{
              width: 0, height: 0, flexShrink: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderRight: "6px solid #171717" }} />
            <div style={{
              background: "#171717", borderRadius: 8,
              boxShadow: "0px 4px 16px rgba(14,18,27,0.24)",
              padding: "6px 10px",
              whiteSpace: "nowrap" }}>
              <span style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 12, fontWeight: 500, lineHeight: "18px",
                color: "#ffffff", display: "block" }}>
                Introducing Round-Up.
              </span>
            </div>
          </div>
        </>
      )}

      <div
        ref={cardRef}
        style={{
          position: "relative",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.4s ease-out, transform 0.4s ease-out" }}
        onMouseEnter={() => { annotationTimer.current = setTimeout(() => setAnnotationVisible(true), 400); }}
        onMouseLeave={() => { if (annotationTimer.current) clearTimeout(annotationTimer.current); setAnnotationVisible(false); }}
      >

        {/* Card */}
        <div style={{
          background: "var(--bg-white-0)",
          borderRadius: 10,
          outline: "1px solid var(--stroke-soft-200)",
          outlineOffset: -1,
          display: "flex", flexDirection: "column",
          overflow: "hidden" }}>
          {/* Lottie animation */}
          <div style={{ width: 100, height: 100 }}>
            <Lottie animationData={walletAnimation} loop style={{ width: 100, height: 100 }} />
          </div>
          {/* Content */}
          <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 14, fontWeight: 500, lineHeight: "20px",
                color: "var(--text-strong-950)" }}>
                Save AED 240 — one dirham at a time
              </span>
              <span style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 12, fontWeight: 400, lineHeight: "16px",
                color: "var(--text-sub-600)" }}>
                Based on your May spending, you could have set aside AED 240 just by rounding up your spare change on every purchase. Small amounts, consistent habit.
              </span>
            </div>
            <button
              style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 4, alignSelf: "flex-start" }}
            >
              <span style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 12, fontWeight: 500, lineHeight: "16px",
                color: "var(--text-strong-950)", textDecoration: "underline" }}>
                See how it works
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="var(--icon-strong-950,#171717)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* X close button — 8px from top-right */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", right: 8, top: 8,
            padding: 2, background: "transparent",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M14.5 5.5L5.5 14.5M5.5 5.5L14.5 14.5" stroke="var(--icon-sub-600,#5C5C5C)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Annotation tooltip — hover, positioned above transactions table */}
        {annotationVisible && (
          <div style={{
            position: "absolute", left: "calc(100% + 10px)", top: "50%",
            transform: "translateY(-50%)",
            background: "#171717", borderRadius: 8,
            boxShadow: "0px 4px 16px rgba(14,18,27,0.24)",
            padding: "8px 10px", width: 280, zIndex: 9999, pointerEvents: "none" }}>
            <span style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 12, fontWeight: 500, lineHeight: "18px",
              color: "#ffffff", display: "block" }}>
              When a user reviews their AI-generated spend summary, we surface relevant product suggestions. Here we show potential round-up savings based on their actual spend — introducing a savings feature at a moment when their spending habits are top of mind.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [showCrossFlow, setShowCrossFlow] = useState(false);
  const [crossFlowVisible, setCrossFlowVisible] = useState(false);
  // Always start expanded (false) — identical on server and client, no hydration mismatch.
  // A useEffect then reads sessionStorage and applies the user's saved preference.
  const [collapsed, setCollapsed] = useState(false);
  // Temporary hover-driven expansion (doesn't persist to sessionStorage)
  const [tempExpanded, setTempExpanded] = useState(false);
  const hoverExpandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [crossflowTooltipVisible, setCrossflowTooltipVisible] = useState(false);
  const [crossflowTooltipY, setCrossflowTooltipY] = useState(0);
  const crossflowBtnRef = useRef<HTMLButtonElement>(null);

  // effectiveCollapsed drives all display — respects hover-expand override
  const effectiveCollapsed = collapsed && !tempExpanded;

  // Restore saved collapsed state after hydration (client-only)
  useEffect(() => {
    if (sessionStorage.getItem("sidebar-collapsed") === "true") {
      setCollapsed(true);
    }
  }, []);

  // Persist user's explicit collapse/expand choices
  useEffect(() => {
    sessionStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (sessionStorage.getItem("dashboard-crossflow") !== "true") return;
    sessionStorage.removeItem("dashboard-crossflow");
    setShowCrossFlow(true);
    setTimeout(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => setCrossFlowVisible(true)));
    }, 300);
  }, []);

  useEffect(() => {
    const reset = () => {
      // Expand nav on any prototype reset
      setCollapsed(false);
      setTempExpanded(false);
      sessionStorage.setItem("sidebar-collapsed", "false");
      setCrossFlowVisible(false);
      setTimeout(() => setShowCrossFlow(false), 400);
    };
    window.addEventListener("mal-dashboard-reset", reset);
    return () => window.removeEventListener("mal-dashboard-reset", reset);
  }, []);

  return (
    <aside style={{
      width: effectiveCollapsed ? 72 : 200,
      minWidth: effectiveCollapsed ? 72 : 200,
      height: "100%",
      backgroundColor: "var(--bg-weak-25)",
      display: "flex", flexDirection: "column", flexShrink: 0,
      position: "relative", zIndex: 2,
      transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)" }}>
      {/* Toggle button — sits at the right edge, centered on the Dashboard item */}
      <button
        onClick={() => { setCollapsed(c => !c); setTempExpanded(false); }}
        style={{
          position: "absolute",
          right: -12,
          top: 130,
          width: 24, height: 24,
          borderRadius: 999,
          backgroundColor: "var(--bg-white-0)",
          border: "1px solid var(--stroke-soft-200)",
          boxShadow: "0px 1px 4px rgba(10,13,20,0.10)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          flexShrink: 0,
          transition: "box-shadow 0.15s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0px 2px 8px rgba(10,13,20,0.16)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0px 1px 4px rgba(10,13,20,0.10)"; }}
      >
          {effectiveCollapsed ? <IconChevronRightSmall /> : <IconChevronLeft />}
      </button>

      {/* Inner clip wrapper — hides overflowing text during the width transition */}
      <div style={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8, paddingBottom: 8,
        flexShrink: 0,
        display: "flex", justifyContent: "center" }}>
        {effectiveCollapsed ? (
          <div style={{
            paddingTop: 12, paddingBottom: 12, paddingLeft: 4, paddingRight: 4,
            borderRadius: 10, backgroundColor: "var(--bg-weak-25)",
            display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <BuildingIcon />
          </div>
        ) : (
          <div style={{
            width: "100%",
            paddingLeft: 8, paddingRight: 8, paddingTop: 12, paddingBottom: 12,
            backgroundColor: "var(--bg-weak-25)",
            borderRadius: 10, display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
            <BuildingIcon />
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              <span style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontWeight: 500, fontSize: 14, lineHeight: "20px",
                color: "var(--text-strong-950)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                **6789
              </span>
            </div>
            <button style={{
              padding: 2, backgroundColor: "var(--bg-weak-25)",
              boxShadow: "0px 1px 2px rgba(10, 13, 20, 0.03)",
              borderRadius: 6, outline: "1px solid var(--stroke-soft-200)", outlineOffset: -1,
              border: "none", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0 }}>
              <IconChevronDown />
            </button>
          </div>
        )}
      </div>

      {/* Nav content */}
      <div style={{
        flex: 1,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12, paddingBottom: 16,
        display: "flex", flexDirection: "column", gap: 4 }}>
        <MalNavItem active={pathname === "/demo/playground/assistant"} isOnDashboard={pathname === "/demo/playground"} collapsed={effectiveCollapsed} />

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              label={item.label}
              active={pathname === item.href}
              icon={item.icon}
              href={item.href}
              collapsed={effectiveCollapsed}
            />
          ))}
        </nav>
      </div>

      {showCrossFlow && (
        effectiveCollapsed ? (
          /* ── Compact Lottie-only view in collapsed state ── */
          <div style={{ padding: "0 12px 16px", flexShrink: 0 }}>
            <button
              ref={crossflowBtnRef}
              onMouseEnter={() => {
                if (crossflowBtnRef.current) {
                  const r = crossflowBtnRef.current.getBoundingClientRect();
                  setCrossflowTooltipY(r.top + r.height / 2);
                }
                setCrossflowTooltipVisible(true);
                if (hoverExpandTimer.current) clearTimeout(hoverExpandTimer.current);
                hoverExpandTimer.current = setTimeout(() => {
                  setTempExpanded(true);
                  setCrossflowTooltipVisible(false);
                }, 500);
              }}
              onMouseLeave={() => {
                if (hoverExpandTimer.current) clearTimeout(hoverExpandTimer.current);
                setTempExpanded(false);
                setCrossflowTooltipVisible(false);
              }}
              style={{
                width: "100%", border: "none", cursor: "pointer", padding: 0,
                background: "transparent", borderRadius: 10, overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: crossFlowVisible ? 1 : 0,
                transform: crossFlowVisible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out" }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 10,
                background: "var(--bg-white-0)",
                outline: "1px solid var(--stroke-soft-200)", outlineOffset: -1,
                overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Lottie animationData={walletAnimation} loop style={{ width: 56, height: 56, marginTop: -4 }} />
              </div>
            </button>
            {/* Tooltip — fixed to escape overflow clipping */}
            {crossflowTooltipVisible && (
              <div style={{
                position: "fixed",
                left: 82,
                top: crossflowTooltipY,
                transform: "translateY(-50%)",
                background: "#171717",
                borderRadius: 8,
                boxShadow: "0px 4px 16px rgba(14,18,27,0.24)",
                padding: "8px 10px",
                zIndex: 9999,
                pointerEvents: "none",
                whiteSpace: "nowrap" }}>
                <span style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 12, fontWeight: 500, lineHeight: "18px",
                  color: "#ffffff", display: "block" }}>
                  Save AED 240 — one dirham at a time
                </span>
              </div>
            )}
          </div>
        ) : (
          /* ── Full CrossFlow card when expanded ── */
          <div
            onMouseLeave={() => {
              // If this expansion was hover-triggered, collapse back on leave
              if (tempExpanded) {
                if (hoverExpandTimer.current) clearTimeout(hoverExpandTimer.current);
                setTempExpanded(false);
              }
            }}
          >
            <CrossFlowCard
              visible={crossFlowVisible}
              isHoverExpanded={tempExpanded}
              onClose={() => { setCrossFlowVisible(false); setTimeout(() => setShowCrossFlow(false), 400); }}
            />
          </div>
        )
      )}
      </div>{/* end inner clip wrapper */}
    </aside>
  );
}

function NavItem({ label, active, icon: Icon, href, collapsed = false }: {
  label: string;
  active?: boolean;
  icon: React.ComponentType;
  href: string;
  collapsed?: boolean;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      style={{
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: collapsed ? 0 : 8,
        padding: collapsed ? 8 : "8px 12px",
        borderRadius: "var(--radius-8)",
        backgroundColor: active ? "var(--bg-soft-200)" : "transparent",
        border: "none", cursor: "pointer", width: "100%",
        textAlign: "left", position: "relative", height: 36,
        transition: "background-color 0.15s" }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-soft-200)";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      {active && (
        <span style={{
          position: "absolute", left: -16, top: 8,
          width: 4, height: 20,
          backgroundColor: "var(--text-strong-950)",
          borderRadius: "0 4px 4px 0" }} />
      )}
      <span style={{ color: active ? "var(--icon-strong-950)" : "var(--icon-sub-600)", flexShrink: 0, display: "flex" }}>
        <Icon />
      </span>
      {!collapsed && (
        <>
          <span style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 500, fontSize: 14, lineHeight: "20px",
            color: active ? "var(--text-strong-950)" : "var(--text-sub-600)",
            letterSpacing: "-0.084px", flex: 1, whiteSpace: "nowrap",
            overflow: "hidden" }}>
            {label}
          </span>
          {active && (
            <span style={{ color: "var(--icon-sub-600)", flexShrink: 0, display: "flex" }}>
              <IconChevronRight />
            </span>
          )}
        </>
      )}
    </button>
  );
}
