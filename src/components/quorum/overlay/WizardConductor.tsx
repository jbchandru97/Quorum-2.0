"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Shimmer } from "@/components/quorum/primitives";
import { useReviewSession } from "./ReviewSession";
import { WIZARD_STEPS } from "./wizard-steps";

/* ───────────────────────────────────────────────────────────────
   WizardConductor — the right-arrow demo driver.

   → runs the next step; ← walks back where a step is UI-only;
   ⇧R resets Convex demo data and reloads for a clean rehearsal.
   Kept to one small mono chip so the review UI stays the show.
   ─────────────────────────────────────────────────────────────── */

export function WizardConductor() {
  const session = useReviewSession();
  const router = useRouter();

  const [done, setDone] = useState(0); /* steps completed */
  const [running, setRunning] = useState(false);
  const busyRef = useRef(false);

  const sessionRef = useRef(session);
  const doneRef = useRef(done);
  useEffect(() => {
    sessionRef.current = session;
    doneRef.current = done;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT" || t.isContentEditable)) return;

      if (e.key === "R" && e.shiftKey) {
        e.preventDefault();
        void (async () => {
          await sessionRef.current.resetDemoData();
          /* The host app keys its own state off sessionStorage. */
          sessionStorage.clear();
          window.location.href = "/demo/playground?review=1";
        })();
        return;
      }

      if (e.key === "ArrowLeft") {
        const idx = doneRef.current - 1;
        const step = WIZARD_STEPS[idx];
        if (step?.back && !busyRef.current) {
          step.back({ session: sessionRef.current, push: router.push });
          setDone(idx);
        }
        return;
      }

      if (e.key !== "ArrowRight") return;
      if (busyRef.current) return;
      const idx = doneRef.current;
      const step = WIZARD_STEPS[idx];
      if (!step) return;

      e.preventDefault();
      busyRef.current = true;
      setRunning(true);
      void step
        .run({ session: sessionRef.current, push: router.push })
        .catch(() => {})
        .finally(() => {
          busyRef.current = false;
          setRunning(false);
          setDone(idx + 1);
        });
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  const total = WIZARD_STEPS.length;
  const current = WIZARD_STEPS[done];

  return (
    <div className="q-wizard-chip" aria-live="polite">
      {done === 0 && !running && (
        <span>
          demo · <b>→</b> to start · ⇧R reset
        </span>
      )}
      {running && (
        <span className="is-live">
          <Shimmer>{`${done + 1}/${total} · ${WIZARD_STEPS[done].label}`}</Shimmer>
        </span>
      )}
      {!running && done > 0 && done < total && (
        <span>
          <b>{done}/{total}</b> · next: {current?.label} · <b>→</b>
        </span>
      )}
      {!running && done >= total && <span>demo complete · ⇧R reset</span>}
    </div>
  );
}
