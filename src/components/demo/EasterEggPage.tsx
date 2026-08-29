"use client";

import Lottie from "lottie-react";
import openEnvelope from "@/assets/demo/open-envelope.json";
import Sidebar from "@/components/demo/dashboard/Sidebar";
import Topbar from "@/components/demo/dashboard/Topbar";

const SLUG_TITLES: Record<string, string> = {
  cards: "My Cards",
  transfer: "Transfer",
  transactions: "Transactions",
  exchange: "Exchange",
  settings: "Settings",
  support: "Support",
};

export default function EasterEggPage({ slug }: { slug: string }) {
  const title = SLUG_TITLES[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div style={{ display: "flex", height: "100vh", minWidth: 1280, backgroundColor: "var(--bg-weak-25, #FAFAFA)" }}>
      <Sidebar />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, backgroundColor: "var(--bg-weak-25, #FAFAFA)" }}>
        {/* Topbar strip — gray zone */}
        <div style={{ flexShrink: 0, paddingLeft: 32, paddingRight: 32, paddingTop: 14, paddingBottom: 14 }}>
          <Topbar title={title} variant="dashboard" />
        </div>

        {/* White content box */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--bg-white-0, white)",
          borderTopLeftRadius: 20,
          borderLeft: "1px solid var(--stroke-soft-200, #F4F4F4)",
          borderTop: "1px solid var(--stroke-soft-200, #F4F4F4)",
        }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "24px 32px 48px",
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: "100%",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 520 }}>
            {/* Lottie envelope — negative left margin compensates for internal whitespace in the animation */}
            <div style={{ marginBottom: 20, marginLeft: -18 }}>
              <Lottie animationData={openEnvelope} loop style={{ width: 80, height: 80 }} />
            </div>

            {/* Heading */}
            <h2 style={{
              margin: "0 0 20px",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 16, fontWeight: 600, lineHeight: "24px",
              color: "var(--text-strong-950)",
              letterSpacing: "-0.2px",
            }}>
              You found it, hi there 👋
            </h2>

            {/* Paragraphs */}
            {[
              "Since you made it this far, a quick note from the person behind this.",
              "I'm JB. I moved to Dubai in January. It's been a personal goal for a long time and I finally made it here. Now I want to build something that matters in this region, not just work here.",
              null, // spacer paragraph — Freshworks/BrowserStack
              "What excites me about Aql isn't just the brief. It's the moment. A new company, a product that hasn't been fully shaped yet, a region that's ready for it. That's the environment where everything I've learned becomes most useful and where I'd do my best work.",
              "This isn't just an assignment submission to me. Even though this prototype covers a small slice of what Aql AI could be, I built it by imagining myself as the designer here, with a vision for the product, not just an answer to the brief. That's the part I can't switch off.",
              "I strongly feel I can do a lot more here. Would love the chance to.",
            ].map((para, i) => {
              if (para === null) {
                return (
                  <p key={i} style={{
                    margin: "0 0 14px",
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 14, fontWeight: 400, lineHeight: "22px",
                    color: "var(--text-sub-600)",
                  }}>
                    I&apos;ve spent the last few years leading product verticals at{" "}
                    <span style={{ color: "var(--text-strong-950)", fontWeight: 500 }}>Freshworks</span> and{" "}
                    <span style={{ color: "var(--text-strong-950)", fontWeight: 500 }}>BrowserStack</span>
                    {", "}two of the most respected product companies in the world. I didn&apos;t just design features. I grew product areas from the ground up, established UX practices, interviewed users, mapped journeys, identified opportunities, and tracked the metrics to know if any of it actually worked. That kind of ownership changes how you think about product.
                  </p>
                );
              }
              const isLast = i === 5;
              return (
                <p key={i} style={{
                  margin: isLast ? "0 0 16px" : "0 0 14px",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 14, fontWeight: 400, lineHeight: "22px",
                  color: "var(--text-sub-600)",
                }}>
                  {para}
                </p>
              );
            })}

            {/* Sign-off */}
            <p style={{
              margin: "0 0 28px",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 14, fontWeight: 500, lineHeight: "20px",
              color: "var(--text-sub-600)",
            }}>
              // JB
            </p>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: "var(--stroke-soft-200)", marginBottom: 24 }} />

            {/* Below-card note */}
            <p style={{
              margin: "0 0 8px",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 12, fontWeight: 400, lineHeight: "18px",
              color: "var(--text-soft-400)",
            }}>
              This prototype is limited to the Dashboard and Aql AI pages.
            </p>

            <button
              onClick={() => {
                sessionStorage.removeItem("mal-wizard-step");
                sessionStorage.removeItem("mal-wizard-crossflow");
                sessionStorage.removeItem("dashboardWidgetAdded");
                sessionStorage.removeItem("dashboardWidgetHighlight");
                sessionStorage.removeItem("mal-ai-june-flow");
                window.location.href = "/";
              }}
              style={{
                padding: 0,
                background: "transparent", border: "none", cursor: "pointer",
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 12, fontWeight: 500, lineHeight: "18px",
                color: "var(--text-sub-600)",
                textDecoration: "underline",
                textUnderlineOffset: 2,
                display: "block",
              }}
            >
              Go back to dashboard
            </button>
          </div>
          </div>
        </div>
        </div>{/* end white content box */}
      </main>
    </div>
  );
}
