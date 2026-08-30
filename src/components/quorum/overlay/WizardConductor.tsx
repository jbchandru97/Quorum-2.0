"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Shimmer } from "@/components/quorum/primitives";
import { useReviewSession } from "./ReviewSession";
import { WIZARD_STEPS } from "./wizard-steps";

/* ───────────────────────────────────────────────────────────────
   WizardConductor — the right-arrow demo driver.

   → runs the next step; ← walks back where a step is UI-only;
   ⇧R or the chip's reset button clears Convex demo data and
   reloads for a clean rehearsal. Esc leaves the composer so the
   arrows always come back to the conductor.
   ─────────────────────────────────────────────────────────────── */

export function WizardConductor() {
  const session = useReviewSession();
  const router = useRouter();

  const [done, setDone] = useState(0); /* steps completed */
  const [running, setRunning] = useState(false);
  const [resetting, setResetting] = useState(false);
  const busyRef = useRef(false);

  const sessionRef = useRef(session);
  const doneRef = useRef(done);
  useEffect(() => {
    sessionRef.current = session;
    doneRef.current = done;
  });

  const reset = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setResetting(true);
    try {
      await sessionRef.current.resetDemoData();
    } catch {
      /* Even if the wipe fails, reload into a clean client state. */
    }
    /* The host app keys its own flows off sessionStorage. */
    sessionStorage.clear();
    window.location.assign("/demo/playground?review=1");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT" || t.isContentEditable);

      /* Esc always hands the keyboard back to the conductor. */
      if (e.key === "Escape" && typing) {
        t.blur();
        return;
      }
      if (typing) return;

      if ((e.key === "R" || e.key === "r") && e.shiftKey) {
        e.preventDefault();
        void reset();
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
  }, [router, reset]);

  const total = WIZARD_STEPS.length;
  const current = WIZARD_STEPS[done];

  return (
    <div className="q-wizard-chip" aria-live="polite">
      {resetting ? (
        <span className="is-live">
          <Shimmer>resetting demo data…</Shimmer>
        </span>
      ) : (
        <>
          {done === 0 && !running && (
            <span>
              demo · <b>→</b> to start
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
          {!running && done >= total && <span>demo complete</span>}
          <button
            type="button"
            className="q-wizard-reset"
            onClick={() => void reset()}
            title="Clear demo data and restart (⇧R)"
          >
            ↺ reset
          </button>
        </>
      )}
    </div>
  );
}
