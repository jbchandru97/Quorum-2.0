import type { Metadata } from "next";
import "./gradient-tokens.css";

export const metadata: Metadata = {
  title: "Gradient Tokens — Internal",
  robots: { index: false, follow: false },
};

const GRAD = "linear-gradient(135deg, #DBA2D3 21%, #C3A0EB 36%, #B49EFA 45%, #9479F1 58%, #7454E8 69%, #4E29DD 83%, #130360 97%)";

/** Absolutely-positioned gradient layer — won't affect child opacity */
function GradientBg({ opacity = 0.15 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: GRAD,
        opacity,
        borderRadius: "inherit",
        pointerEvents: "none",
      }}
    />
  );
}

export default function GradientsPage() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", backgroundColor: "#f4f4f8", padding: "48px 64px", color: "#1a1a2e" }}>

      {/* Page header */}
      <div style={{ marginBottom: 64 }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7454E8", margin: "0 0 12px" }}>
          Internal Utility · /gradients
        </p>
        <h1 style={{ fontSize: 40, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.1, color: "#1a1a2e" }}>
          Gradient Token System
        </h1>
        <p style={{ fontSize: 16, color: "#666", margin: 0, maxWidth: 560 }}>
          Single CSS custom property — one linear gradient, applied everywhere.
          Backgrounds use 15% opacity; icons and borders run at full opacity.
        </p>
      </div>

      {/* ── Section 1: Gradient stops ──────────────────────────── */}
      <section style={{ marginBottom: 72 }}>
        <SectionLabel>Gradient Stops</SectionLabel>
        <div style={{ display: "flex", gap: 0, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", height: 80 }}>
          {[
            { hex: "#DBA2D3", stop: "21%" },
            { hex: "#C3A0EB", stop: "36%" },
            { hex: "#B49EFA", stop: "45%" },
            { hex: "#9479F1", stop: "58%" },
            { hex: "#7454E8", stop: "69%" },
            { hex: "#4E29DD", stop: "83%" },
            { hex: "#130360", stop: "97%" },
          ].map((s) => (
            <div key={s.hex} style={{ flex: 1, backgroundColor: s.hex, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "0 0 8px" }}>
              <span style={{ fontSize: 9, fontFamily: "monospace", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{s.stop}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, borderRadius: 12, overflow: "hidden", height: 40, background: GRAD }} />
        <p style={{ margin: "10px 0 0", fontSize: 12, fontFamily: "monospace", color: "#888" }}>
          linear-gradient(135deg, #DBA2D3 21%, #C3A0EB 36%, #B49EFA 45%, #9479F1 58%, #7454E8 69%, #4E29DD 83%, #130360 97%)
        </p>
      </section>

      {/* ── Section 2: Background (15% opacity) ────────────────── */}
      <section style={{ marginBottom: 72 }}>
        <SectionLabel>.bg-mesh-gradient — Background at 15% opacity</SectionLabel>
        {/* Hero */}
        <div style={{ position: "relative", borderRadius: 24, padding: "56px 48px", overflow: "hidden", marginBottom: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <GradientBg opacity={0.15} />
          <p style={{ fontSize: 13, letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase", color: "#7454E8", margin: "0 0 12px", position: "relative" }}>
            Hero Section
          </p>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 16px", color: "#1a1a2e", lineHeight: 1.2, position: "relative" }}>
            Your finances,<br/>beautifully clear.
          </h2>
          <p style={{ fontSize: 16, color: "#444", margin: "0 0 28px", maxWidth: 440, position: "relative" }}>
            Track spending, manage savings, and plan for what's next — all in one place.
          </p>
          <button style={{
            padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "#1a1a2e", fontWeight: 600, fontSize: 15, color: "#fff",
            position: "relative",
          }}>
            Get started
          </button>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "Total Balance", value: "AED 14,480.24", sub: "+12.4% this month" },
            { label: "Total Income",  value: "AED 36,240.28", sub: "Last 30 days"      },
            { label: "Total Spend",   value: "AED 1,800.00",  sub: "Weekly limit: 2000" },
          ].map((card) => (
            <div key={card.label} style={{ position: "relative", borderRadius: 20, padding: "28px 24px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <GradientBg opacity={0.15} />
              <p style={{ fontSize: 13, fontWeight: 500, color: "#666", margin: "0 0 8px", position: "relative" }}>{card.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px", letterSpacing: "-0.5px", position: "relative" }}>{card.value}</p>
              <p style={{ fontSize: 12, color: "#888", margin: 0, position: "relative" }}>{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Text Fill ────────────────────────────────── */}
      <section style={{ marginBottom: 72 }}>
        <SectionLabel>.text-mesh-gradient — Text Fill</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, background: "#fff", borderRadius: 20, padding: "40px 36px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h1 className="text-mesh-gradient" style={{ fontSize: 56, fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: "-1px" }}>
            Display Heading
          </h1>
          <h2 className="text-mesh-gradient" style={{ fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            Section Heading
          </h2>
          <h3 className="text-mesh-gradient" style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
            Card Title or Subheading
          </h3>
          <p style={{ fontSize: 16, color: "#555", margin: 0 }}>
            Regular body text stays legible.{" "}
            <span className="text-mesh-gradient" style={{ fontWeight: 600 }}>Inline gradient accent</span>{" "}
            can be used for highlights within a sentence too.
          </p>
        </div>
      </section>

      {/* ── Section 4: Icon Fill ────────────────────────────────── */}
      <section style={{ marginBottom: 72 }}>
        <SectionLabel>SVG Icon Fill — 100% opacity</SectionLabel>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px" }}>
          Inline SVG with embedded <code>&lt;linearGradient&gt;</code> matching the same 135° stops.
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 32, background: "#fff", borderRadius: 20, padding: "40px 36px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          {[24, 36, 48, 64, 80].map((size) => (
            <MeshIcon key={size} size={size} shape="star" />
          ))}
          <div style={{ marginLeft: 16, display: "flex", gap: 24, alignItems: "center" }}>
            <MeshIcon size={48} shape="heart" />
            <MeshIcon size={48} shape="zap" />
          </div>
        </div>
      </section>

      {/* ── Section 5: Borders — 100% opacity ──────────────────── */}
      <section style={{ marginBottom: 72 }}>
        <SectionLabel>.border-mesh-gradient — Border at 100% opacity</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          {/* Gradient fill button */}
          <button className="bg-mesh-gradient" style={{
            padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer",
            fontWeight: 600, fontSize: 15, color: "#fff",
          }}>
            Primary
          </button>

          {/* Gradient border */}
          <button className="border-mesh-gradient" style={{
            padding: "12px 28px", borderRadius: 12, cursor: "pointer",
            fontWeight: 600, fontSize: 15, color: "#4E29DD",
            "--border-bg": "#fff",
            "--border-width": "2px",
          } as React.CSSProperties}>
            Outlined
          </button>

          {/* Ghost */}
          <button style={{
            padding: "12px 28px", borderRadius: 12, cursor: "pointer",
            fontWeight: 600, fontSize: 15, border: "none",
            background: "rgba(116,84,232,0.10)",
            color: "#4E29DD",
          }}>
            Ghost
          </button>

          {/* Icon button — full gradient */}
          <button className="bg-mesh-gradient" style={{
            width: 44, height: 44, borderRadius: 12, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </button>

          {/* Pill */}
          <button className="bg-mesh-gradient" style={{
            padding: "8px 20px", borderRadius: 999, border: "none", cursor: "pointer",
            fontWeight: 500, fontSize: 13, color: "#fff",
          }}>
            Badge / Pill
          </button>

          {/* Thick border example */}
          <div className="border-mesh-gradient" style={{
            padding: "20px 24px", borderRadius: 16,
            "--border-bg": "#f4f4f8",
            "--border-width": "3px",
            fontSize: 14, color: "#333",
          } as React.CSSProperties}>
            3px gradient border on a card
          </div>
        </div>
      </section>

      {/* ── Section 6: Token Reference ─────────────────────────── */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>CSS Token Reference</SectionLabel>
        <pre style={{
          background: "#1a1a2e", color: "#B49EFA", borderRadius: 16, padding: "32px 36px",
          fontSize: 13, lineHeight: 1.8, overflowX: "auto",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        }}>{`/* ── Import ──────────────────────────────── */
@import './gradient-tokens.css';

/* ── Utility classes ─────────────────────── */
.bg-mesh-gradient      /* full-opacity gradient background   */
.text-mesh-gradient    /* gradient text fill                 */
.border-mesh-gradient  /* gradient border (padding-box)      */
.icon-mesh-gradient    /* gradient icon via CSS mask         */

/* ── CSS variables ───────────────────────── */
--border-bg: white;    /* background color behind the border */
--border-width: 2px;   /* border thickness                   */

/* ── The gradient ────────────────────────── */
var(--gradient-mesh-primary)
/* linear-gradient(135deg,
     #DBA2D3 21%,  /* mauve-pink   */
     #C3A0EB 36%,  /* soft lavender */
     #B49EFA 45%,  /* periwinkle   */
     #9479F1 58%,  /* medium violet */
     #7454E8 69%,  /* vivid purple  */
     #4E29DD 83%,  /* deep indigo   */
     #130360 97%   /* near-black    */
   ) */

/* ── Usage: background at custom opacity ─── */
/* Use an absolute child div with opacity:    */
/* <div style={{ position:'relative' }}>      */
/*   <div style={{                            */
/*     position:'absolute', inset:0,          */
/*     background:'var(--gradient-mesh-primary)',*/
/*     opacity: 0.15,                         */
/*     borderRadius:'inherit',                */
/*     pointerEvents:'none',                  */
/*   }} />                                    */
/*   {children}                               */
/* </div>                                     */`}
        </pre>
      </section>

    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", margin: 0 }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: 1, backgroundColor: "#e4e4e8" }} />
    </div>
  );
}

const PATHS = {
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  zap: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
};

function MeshIcon({ size, shape = "star" }: { size: number; shape?: keyof typeof PATHS }) {
  const id = `grad-${shape}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="21%"  stopColor="#DBA2D3" />
          <stop offset="36%"  stopColor="#C3A0EB" />
          <stop offset="45%"  stopColor="#B49EFA" />
          <stop offset="58%"  stopColor="#9479F1" />
          <stop offset="69%"  stopColor="#7454E8" />
          <stop offset="83%"  stopColor="#4E29DD" />
          <stop offset="97%"  stopColor="#130360" />
        </linearGradient>
      </defs>
      <path d={PATHS[shape]} fill={`url(#${id})`} />
    </svg>
  );
}
