"use client";

import { useState } from "react";
import { AqlMark } from "@/components/demo/AqlMark";

/* The assistant's opening screen, rebuilt as a specimen so the three
   user types can be compared side by side. Pick a type and the starters
   rewrite, which is the whole argument of this section. */

const TYPES = [
  { id: "optimiser", name: "Curious Optimiser",
    sub: "Starters tuned to finding opportunities.",
    s: ["Where did I spend the most last month?",
        "Find saving opportunities in my May spending",
        "Show me my food delivery habit"] },
  { id: "checker", name: "Anxious Checker",
    sub: "Starters tuned to reassurance.",
    s: ["Am I still on track this month?",
        "Did anything unusual go out this week?",
        "How much is left after my bills?"] },
  { id: "scroller", name: "Passive Scroller",
    sub: "Starters that do the work for them.",
    s: ["Give me a 10-second summary",
        "Show me bills due this week",
        "What changed since last month?"] },
];

export default function PersonaStarters() {
  const [pick, setPick] = useState(0);
  const t = TYPES[pick];

  return (
    <div className="ps">
      <div className="ps-pills" role="tablist" aria-label="User type">
        {TYPES.map((x, i) => (
          <button key={x.id} role="tab" aria-selected={i === pick}
                  className={i === pick ? "on" : ""} onClick={() => setPick(i)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className="ps-screen">
        <div className="ps-bar"><i /><i /><i /><span>aql.ae/assistant</span></div>
        <div className="ps-body">
          <AqlMark size={38} />
          <p className="ps-hi">Hello, Mathew</p>
          <p className="ps-sub">{t.sub}</p>
          <div className="ps-starters">
            {t.s.map((q, i) => (
              <div className="ps-starter" key={q} style={{ animationDelay: `${i * 70}ms` }}>
                <span>{q}</span>
                <i>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7h9M11.5 7 7.5 3M11.5 7l-4 4" stroke="currentColor"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
