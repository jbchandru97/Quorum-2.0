"use client";

import Lottie from "lottie-react";
import openEnvelope from "@/assets/demo/open-envelope.json";
import { useApp, type Tab } from "../AppState";
import { NAV_CLEARANCE, SAFE_TOP } from "../PhoneScreen";
import { Tappable } from "../ui";

const SUB = "var(--text-sub-600, #5C5C5C)";
const SOFT = "var(--text-soft-400, #A3A3A3)";
const STRONG = "var(--text-strong-950, #171717)";

const TITLES: Record<string, string> = {
  cards: "My Cards",
  activity: "Activity",
  more: "More",
};

export default function StubScreen({ tab }: { tab: Tab }) {
  const { dispatch } = useApp();

  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg-white-0,#fff)" }}>
      <div style={{
        position: "absolute", inset: 0, overflowY: "auto",
        paddingTop: SAFE_TOP, paddingBottom: NAV_CLEARANCE + 20,
        WebkitOverflowScrolling: "touch",
      }}>
        <div style={{ padding: "6px 20px 0" }}>
          <p style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 600, color: STRONG }}>
            {TITLES[tab] ?? tab}
          </p>

          <div style={{ width: 72, height: 72, marginLeft: -14, marginBottom: 12 }}>
            <Lottie animationData={openEnvelope} loop style={{ width: 72, height: 72 }} />
          </div>

          <h2 style={{
            margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: STRONG, letterSpacing: "-0.2px",
          }}>
            You found it, hi there 👋
          </h2>

          {[
            "Since you made it this far, a quick note from the person behind this.",
            "I'm JB. I moved to Dubai in January. It's been a personal goal for a long time and I finally made it here. Now I want to build something that matters in this region, not just work here.",
          ].map((p, i) => (
            <p key={i} style={{ margin: "0 0 13px", fontSize: 13.5, lineHeight: "21px", color: SUB }}>{p}</p>
          ))}

          <p style={{ margin: "0 0 13px", fontSize: 13.5, lineHeight: "21px", color: SUB }}>
            I&apos;ve spent the last few years leading product verticals at{" "}
            <span style={{ color: STRONG, fontWeight: 500 }}>Freshworks</span> and{" "}
            <span style={{ color: STRONG, fontWeight: 500 }}>BrowserStack</span>, two of the most respected
            product companies in the world. I didn&apos;t just design features. I grew product areas from the
            ground up, established UX practices, interviewed users, mapped journeys, identified
            opportunities, and tracked the metrics to know if any of it actually worked. That kind of
            ownership changes how you think about product.
          </p>

          {[
            "What excites me about Aql isn't just the brief. It's the moment. A new company, a product that hasn't been fully shaped yet, a region that's ready for it. That's the environment where everything I've learned becomes most useful and where I'd do my best work.",
            "This isn't just an assignment submission to me. Even though this prototype covers a small slice of what Aql AI could be, I built it by imagining myself as the designer here, with a vision for the product, not just an answer to the brief. That's the part I can't switch off.",
            "I strongly feel I can do a lot more here. Would love the chance to.",
          ].map((p, i) => (
            <p key={i} style={{ margin: "0 0 13px", fontSize: 13.5, lineHeight: "21px", color: SUB }}>{p}</p>
          ))}

          <p style={{ margin: "0 0 22px", fontSize: 13.5, fontWeight: 500, color: SUB }}>{"// JB"}</p>

          <div style={{ height: 1, background: "var(--stroke-soft-200,#F4F4F4)", marginBottom: 18 }} />

          <p style={{ margin: "0 0 8px", fontSize: 12, lineHeight: "18px", color: SOFT }}>
            This prototype is limited to the Home and Aql AI tabs.
          </p>
          <Tappable
            scale={0.96}
            onTap={() => dispatch({ type: "setTab", tab: "home" })}
            style={{
              fontSize: 12, fontWeight: 500, color: SUB,
              textDecoration: "underline", textUnderlineOffset: 2,
            }}
          >
            Go back to Home
          </Tappable>
        </div>
      </div>
    </div>
  );
}
