"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../AppState";
import { NAV_CLEARANCE, SAFE_TOP, SCREEN_H } from "../PhoneScreen";
import { SHEET_RADIUS, SPRING_SOFT } from "../theme";
import {
  DailyExpenseCard, GradientHeader, HEADER_H, IncomeExpenseRow, JuneNudgeCard,
  RoundUpCard, SpendingWidget, TransactionList,
} from "../HomeCards";

/* The sheet overlaps the gradient by this much, so it reads as a surface
   lifted over the header rather than a seam. */
const OVERLAP = 26;
/* Where the sheet's top edge meets the status bar. */
const FLIP_AT = HEADER_H - OVERLAP - SAFE_TOP - 16;

export default function HomeScreen({
  active, onStatusLight,
}: { active: boolean; onStatusLight: (light: boolean) => void }) {
  const { state, dispatch } = useApp();
  const [settled, setSettled] = useState(false);
  const [scrim, setScrim] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  /* The Spending Summary starts calm, then invites — the desktop's beat. */
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 450);
    return () => clearTimeout(t);
  }, []);
  const attract = settled && !state.widgetAdded;

  /* Status bar follows the surface behind it: light over the gradient,
     dark once the white sheet has risen past it. */
  const onScroll = useCallback(() => {
    if (!active) return;
    const top = scrollRef.current?.scrollTop ?? 0;
    const overGradient = top < FLIP_AT;
    onStatusLight(overGradient);
    /* once the sheet passes under the status bar it needs a surface of its
       own, or transactions scroll straight through the clock */
    setScrim(!overGradient);
  }, [active, onStatusLight]);

  useEffect(() => {
    if (active) onScroll();
  }, [active, onScroll]);

  const scrollToEl = useCallback((el: HTMLElement | null, pad = 130) => {
    const sc = scrollRef.current;
    if (!sc || !el) return;
    const delta = el.getBoundingClientRect().top - sc.getBoundingClientRect().top;
    sc.scrollTo({ top: sc.scrollTop + delta - pad, behavior: "smooth" });
  }, []);

  /* Landing back on Home after saving: bring the new card into view. */
  useEffect(() => {
    if (!active || !state.widgetHighlight) return;
    const t = setTimeout(() => scrollToEl(widgetRef.current), 420);
    return () => clearTimeout(t);
  }, [active, state.widgetHighlight, scrollToEl]);

  /* The nudge sits at the top of the feed, so return there first —
     otherwise it arrives off-screen for a user parked by their chart. */
  useEffect(() => {
    if (!active || !state.widgetAdded) return;
    if (state.juneFlow || state.juneNudge || state.step !== 4) return;
    const back = setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 1900);
    const show = setTimeout(() => dispatch({ type: "showJuneNudge" }), 2500);
    return () => { clearTimeout(back); clearTimeout(show); };
  }, [active, state.widgetAdded, state.juneFlow, state.juneNudge, state.step, dispatch]);

  /* Round-Up arrives only once both habit patterns are resolved. */
  useEffect(() => {
    if (!active || !state.notifyResolved || state.roundUp) return;
    const t = setTimeout(() => dispatch({ type: "showRoundUp" }), 900);
    return () => clearTimeout(t);
  }, [active, state.notifyResolved, state.roundUp, dispatch]);

  return (
    /* deep indigo behind everything so an overscroll at the top reveals
       the header colour, never a white seam */
    <div style={{ position: "absolute", inset: 0, background: "#130360" }}>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{
          position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden",
          WebkitOverflowScrolling: "touch", overscrollBehavior: "contain",
        }}
      >
        <GradientHeader />

        {/* white sheet, lifted over the gradient */}
        <div style={{
          position: "relative",
          marginTop: -OVERLAP,
          background: "#fff",
          borderTopLeftRadius: SHEET_RADIUS,
          borderTopRightRadius: SHEET_RADIUS,
          minHeight: SCREEN_H - HEADER_H + OVERLAP + NAV_CLEARANCE,
          paddingTop: 18,
          paddingBottom: NAV_CLEARANCE + 18,
          boxShadow: "0 -12px 32px -12px rgba(19,3,96,0.28)",
        }}>
          {/* grabber-style seam detail */}
          <div style={{
            position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)",
            width: 38, height: 4, borderRadius: 3, background: "rgba(16,24,40,0.10)",
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "0 16px" }}>
            <AnimatePresence mode="popLayout">
              {state.juneNudge && (
                <JuneNudgeCard
                  key="june"
                  onTap={() => dispatch({ type: "openAI", autostart: "june" })}
                />
              )}
              {state.roundUp && (
                <RoundUpCard key="roundup" onClose={() => dispatch({ type: "dismissRoundUp" })} />
              )}
            </AnimatePresence>

            <IncomeExpenseRow />

            <SpendingWidget
              attract={attract}
              onOpenAI={() => dispatch({ type: "openAI", autostart: "may" })}
            />

            <AnimatePresence>
              {state.widgetAdded && (
                <motion.div
                  key="daily"
                  ref={widgetRef}
                  initial={{ opacity: 0, height: 0, scale: 0.96 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  transition={SPRING_SOFT}
                  style={{ overflow: "visible" }}
                >
                  <DailyExpenseCard
                    glow={state.widgetHighlight}
                    onGlowDone={() => dispatch({ type: "clearHighlight" })}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <TransactionList />
          </div>
        </div>
      </div>

      {/* status-bar scrim — appears only once the white sheet is behind it */}
      <motion.div
        initial={false}
        animate={{ opacity: scrim ? 1 : 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: SAFE_TOP + 2,
          zIndex: 40, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.94) 58%, rgba(255,255,255,0))",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          maskImage: "linear-gradient(to bottom, #000 62%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 62%, transparent)",
        }}
      />
    </div>
  );
}
