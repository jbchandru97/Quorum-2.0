"use client";

/* ───────────────────────────────────────────────────────────────
   Personalisation over time, as a timeline.

   The user asks the same question in all three columns. What moves
   is what the product knows about them, shown as the profile it
   has built, and the answer that knowledge buys.

   Focus travels: the rail fills toward the next dot to carry the
   eye, the question lands, then the answer. Loops.
   ─────────────────────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { STAGES, STAGE_Q } from "./copy";
import { AqlMark } from "@/components/demo/AqlMark";

export default function StageTimeline() {
  /* one counter, three phases per stage: 0 travel · 1 question · 2 answer.
     Keeps setState in the timer, never in the effect body. */
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const phase = tick % 3;
    const t = setTimeout(() => setTick(v => v + 1),
      phase === 0 ? 800 : phase === 1 ? 980 : 3500);
    return () => clearTimeout(t);
  }, [tick]);

  const active = Math.floor(tick / 3) % STAGES.length;
  const phase = tick % 3;

  return (
    <div className="cs-tl">
      <ol className="cs-tl-rail">
        {STAGES.map((s, i) => {
          /* the segment to this dot's right fills as focus moves onto
             the next stage, then fades, it leads the eye, it isn't a
             progress bar */
          const seg = active === i + 1 ? (phase === 0 ? " run" : " done") : "";
          return (
            <li key={s.n} className={i === active ? "on" : ""}>
              <span className="dot" />
              {i < STAGES.length - 1 && <span className={`seg${seg}`} />}
              <p className="cs-who">{s.n}</p>
              <h4>{s.h}</h4>
            </li>
          );
        })}
      </ol>

      {/* notes, profiles and chats are siblings in one grid, so each row
          stays aligned however long a note runs */}
      <div className="cs-tl-cols">
        {STAGES.map((s, i) => (
          <p key={s.n + "-n"} className={`cs-tl-note${i === active ? " on" : ""}`}>{s.d}</p>
        ))}

        {STAGES.map((s, i) => (
          <div key={s.n + "-k"} className={`cs-knows${i === active ? " on" : ""}`}>
            {s.type
              ? <span className="pill type">{s.type}</span>
              : <span className="pill unknown">Type not known yet</span>}
            {s.habit && <span className="pill habit">{s.habit}</span>}
          </div>
        ))}

        {STAGES.map((s, i) => (
          <div key={s.n + "-c"} className={`cs-chat${i === active ? " on" : ""}`}>
            {/* a stage that has already played stays on screen, so the three
                answers can be read against each other; the cycle clears on wrap */}
            <div className="cs-chat-q" data-in={i < active || (i === active && phase >= 1) ? "1" : "0"}>
              {STAGE_Q}
            </div>
            <div className="cs-chat-a" data-in={i < active || (i === active && phase >= 2) ? "1" : "0"}>
              <span className="cs-chat-mark" aria-hidden="true"><AqlMark size={16} /></span>
              <p>{s.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
