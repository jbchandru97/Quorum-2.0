"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../AppState";
import { NAV_CLEARANCE, SAFE_BOTTOM, SAFE_TOP } from "../PhoneScreen";
import { type Category } from "../data";
import { CARD_SHADOW, DISPLAY, DIVIDER, HAIRLINE, gradTint } from "../theme";
import { IconArrowUp, IconClose, IconPlus, Tappable } from "../ui";
import { AnnotationDot } from "../HomeCards";
import { AISummary, LoadingIndicator, UserBubble, WeeklyMessage, type CardRef } from "../AIMessages";
import DeepDiveSheet from "../DeepDiveSheet";
import { AqlMark } from "@/components/demo/AqlMark";

const SUB = "var(--text-sub-600, #5C5C5C)";
const SOFT = "var(--text-soft-400, #A3A3A3)";
const STRONG = "var(--text-strong-950, #171717)";
const BORDER = "1px solid var(--stroke-soft-200, #F4F4F4)";

const SUGGESTION = "Break down my expenses last week on a daily basis";

type Msg =
  | { role: "user"; text: string; cardRef: CardRef | null }
  | { role: "summary" }
  | { role: "weekly" };

export default function MalAIScreen({
  active, onComposerFocus, onSheetChange,
}: {
  active: boolean;
  onComposerFocus: (v: boolean) => void;
  onSheetChange: (open: boolean) => void;
}) {
  const { state, dispatch } = useApp();
  const june = state.juneFlow;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"fetching" | "building" | "followup">("fetching");
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("New conversation");
  const [cardRef, setCardRef] = useState<CardRef | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [deepDive, setDeepDive] = useState<Category | null>(null);
  const [ddLoading, setDdLoading] = useState(false);
  const [donutSel, setDonutSel] = useState<Category | null>(null);
  const [savedRow, setSavedRow] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notifyDone, setNotifyDone] = useState(false);
  const [focused, setFocused] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const notifyArmed = useRef(false);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  /* grow the composer with its content, up to a few lines */
  const autoGrow = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 92)}px`;
  }, []);
  useEffect(autoGrow, [input, autoGrow]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, savedRow, notify]);

  useEffect(() => { onComposerFocus(focused); }, [focused, onComposerFocus]);

  /* A presented sheet owns the bottom of the screen on iOS — the tab bar
     goes with it. */
  useEffect(() => { onSheetChange(deepDive !== null); }, [deepDive, onSheetChange]);

  const openDeepDive = useCallback((c: Category, withLoading: boolean) => {
    setDeepDive(prev => {
      if (prev !== null) return c;                 // already open — just swap
      if (withLoading) { setDdLoading(true); after(3000, () => setDdLoading(false)); }
      return c;
    });
  }, [after]);

  const send = useCallback((text: string, ref: CardRef | null) => {
    const first = messages.length === 0;
    setMessages(m => [...m, { role: "user", text, cardRef: ref }]);
    setCardRef(null); setInput(""); setSuggestion("");
    setLoading(true);

    if (first) {
      setTitle("Monthly spend summary");
      dispatch({ type: "advance", to: 2 });
      setPhase("fetching");
      after(2500, () => { setPhase("building"); openDeepDive("Food", true); });
      after(5500, () => {
        setLoading(false);
        setMessages(m => [...m, { role: "summary" }]);
      });
    } else {
      setPhase("followup");
      after(2000, () => {
        setLoading(false);
        setMessages(m => [...m, { role: "weekly" }]);
      });
    }
  }, [messages.length, dispatch, after, openDeepDive]);

  const sendRef = useRef(send);
  useEffect(() => { sendRef.current = send; });

  /* Scripted entry — the dashboard CTA and the June nudge both land here.
     Read the intent once at mount and depend on nothing: this screen is
     remounted (via conversationKey) for every scripted run, and an effect
     that depended on `autostart` would cancel its own timer the moment it
     cleared the flag. Empty deps also keep it correct under StrictMode's
     double-invoke, which a ref guard would not. */
  const entryIntent = useRef(state.autostart);
  useEffect(() => {
    if (entryIntent.current === "none") return;
    const t = setTimeout(() => {
      sendRef.current("Show me my monthly spend summary", null);
      dispatch({ type: "clearAutostart" });
    }, 420);
    return () => clearTimeout(t);
  }, [dispatch]);

  /* Habit pattern 2 — only for the user who came back via the nudge.
     A presented sheet covers the composer, so the opt-in waits until the
     report has been read AND put away. That is also the truer moment for
     it: the offer to automate lands after the review, not during it. */
  const reportRead = useRef(false);
  useEffect(() => {
    if (june && deepDive && !ddLoading) reportRead.current = true;
  }, [june, deepDive, ddLoading]);

  useEffect(() => {
    if (!june || notifyArmed.current) return;
    if (!reportRead.current || deepDive !== null) return;
    notifyArmed.current = true;
    after(700, () => setNotify(true));
  }, [june, deepDive, after]);

  /* Referencing a card is a request to say something, so the report steps
     aside and hands the screen back to the composer. On desktop both lived
     side by side; on a phone one of them has to yield. */
  const followUp = (label: string, value: string) => {
    setCardRef({ label, value });
    setSuggestion(SUGGESTION);
    setDeepDive(null);
    if (label === "Total Expenses") dispatch({ type: "advance", to: 3 });
    setTimeout(() => inputRef.current?.focus(), 260);
  };

  const handleSave = () => {
    dispatch({ type: "addWidget" });
    setSavedRow(true);
  };

  const handleSetItUp = () => {
    setNotifyDone(true);
    after(1900, () => { setNotify(false); dispatch({ type: "resolveNotify" }); });
  };

  const empty = messages.length === 0 && !loading;
  const canSend = input.trim().length > 0 || cardRef !== null;

  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg-white-0,#fff)", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{
        flexShrink: 0, paddingTop: SAFE_TOP, paddingLeft: 12, paddingRight: 12, paddingBottom: 8,
        display: "flex", alignItems: "center", gap: 6,
        borderBottom: empty ? "1px solid transparent" : DIVIDER }}>
        <Tappable scale={0.85} style={{ display: "flex", padding: 6, color: SUB }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3.25 4.75h13.5M3.25 10h9M3.25 15.25h13.5" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </Tappable>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0, fontSize: 14, lineHeight: "19px", color: STRONG, fontWeight: 600,
            letterSpacing: "-0.015em",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p>
        </div>
        <Tappable
          scale={0.9}
          disabled={empty}
          onTap={() => {
            setMessages([]); setTitle("New conversation"); setInput(""); setCardRef(null);
            setSuggestion(""); setDeepDive(null); setLoading(false); setSavedRow(false);
            setNotify(false); setNotifyDone(false); setDonutSel(null);
          }}
          style={{ display: "flex", padding: 6, color: STRONG, opacity: empty ? 0.3 : 1 }}
        >
          <IconPlus size={20} />
        </Tappable>
      </div>

      {/* conversation */}
      <div style={{
        flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden",
        WebkitOverflowScrolling: "touch", overscrollBehavior: "contain",
        display: "flex", flexDirection: "column",
        justifyContent: empty ? "center" : "flex-start",
        padding: "14px 16px 8px" }}>
        {empty ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <style>{`
            `}</style>
            <span style={{ display: "flex" }}>
              <AqlMark size={42} animate="pendulum" delay="0.35s" />
            </span>
            <div style={{ textAlign: "center" }}>
              <p style={{
                margin: "0 0 4px", fontFamily: DISPLAY, fontSize: 21, fontWeight: 500,
                color: STRONG, letterSpacing: "-0.5px" }}>Hello, Mathew</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: SOFT }}>
                What can I help you with today?
              </p>
            </div>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 9, marginTop: 4 }}>
              {[
                { text: "Where did I spend the most last month?", live: true },
                { text: "What bills do I have due this week?", live: false },
              ].map(c => (
                <Tappable
                  key={c.text}
                  scale={0.97}
                  disabled={!c.live}
                  onTap={() => c.live && send("Show me my monthly spend summary", null)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "15px 16px", borderRadius: 18,
                    background: "linear-gradient(#fff,#fff) padding-box, " + gradTint(0.45) + " border-box",
                    border: "1px solid transparent",
                    boxShadow: CARD_SHADOW,
                    opacity: c.live ? 1 : 0.6 }}
                >
                  <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500, color: SUB, lineHeight: "18px" }}>
                    {c.text}
                  </span>
                  <span style={{
                    width: 26, height: 26, borderRadius: 8, border: BORDER, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center", color: SOFT }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7h9M11.5 7 7.5 3M11.5 7l-4 4" stroke="currentColor"
                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Tappable>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: "auto" }}>
            {messages.map((m, i) => {
              if (m.role === "user") return <UserBubble key={i} text={m.text} cardRef={m.cardRef} />;
              if (m.role === "summary") return (
                <AISummary
                  key={i} june={june} selected={donutSel} onSelect={setDonutSel}
                  onDeepDive={c => openDeepDive(c, false)} onFollowUp={followUp}
                />
              );
              return (
                <WeeklyMessage
                  key={i} saved={state.widgetAdded} onSave={handleSave} onFollowUp={followUp}
                />
              );
            })}
            {loading && <LoadingIndicator phase={phase} june={june} />}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* composer stack */}
      <motion.div
        initial={false}
        animate={{ paddingBottom: focused ? SAFE_BOTTOM + 12 : NAV_CLEARANCE + 14 }}
        transition={{ type: "spring", stiffness: 420, damping: 38 }}
        style={{ flexShrink: 0, padding: "0 16px", background: "var(--bg-white-0,#fff)" }}
      >
        {/* habit-forming pattern 2 */}
        <AnimatePresence>
          {notify && (
            <motion.div
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 6, height: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{
                marginBottom: 8, padding: "10px 12px", borderRadius: 13,
                background: gradTint(0.12), border: "1px solid rgba(180,158,250,0.4)" }}>
                {notifyDone ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ display: "flex", flexShrink: 0 }}><AqlMark size={16} /></span>
                    <span style={{ fontSize: 12, lineHeight: "17px", color: STRONG, fontWeight: 500 }}>
                      You&apos;re all set — we&apos;ll notify you when your monthly report is ready.
                    </span>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                      <span style={{ display: "flex", flexShrink: 0, marginTop: 1 }}><AqlMark size={16} /></span>
                      <span style={{ flex: 1, fontSize: 12, lineHeight: "17px", color: STRONG }}>
                        Aql can prepare your spending report automatically each month.
                      </span>
                      <AnnotationDot text="We introduce this opt-in once we recognise a user performing the same action repeatedly — like reviewing monthly spend 2–3 times — to encourage the habit of regularly checking in on their finances." />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Tappable
                        scale={0.95} onTap={handleSetItUp}
                        style={{
                          flex: 1, height: 32, borderRadius: 9, background: "var(--neutral-gray-900,#1C1C1C)",
                          display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#fff" }}>Set it up</span>
                      </Tappable>
                      <Tappable
                        scale={0.95}
                        onTap={() => { setNotify(false); dispatch({ type: "resolveNotify" }); }}
                        style={{
                          height: 32, padding: "0 14px", borderRadius: 9, border: BORDER,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "rgba(255,255,255,0.7)" }}
                      >
                        <span style={{ fontSize: 12.5, fontWeight: 500, color: SUB }}>Not now</span>
                      </Tappable>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* widget-saved confirmation */}
        <AnimatePresence>
          {savedRow && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{
                marginBottom: 8, padding: "9px 11px", borderRadius: 11, border: BORDER,
                display: "flex", alignItems: "center", gap: 8, background: "var(--bg-weak-25,#FCFCFC)" }}>
                <span style={{ display: "flex", flexShrink: 0 }}><AqlMark size={15} /></span>
                <span style={{ flex: 1, fontSize: 12, color: SUB, fontWeight: 500 }}>
                  Widget saved to my dashboard
                </span>
                <Tappable
                  scale={0.94}
                  onTap={() => { setSavedRow(false); dispatch({ type: "viewDashboard" }); }}
                  style={{ fontSize: 12, fontWeight: 600, color: STRONG, whiteSpace: "nowrap" }}
                >
                  View
                </Tappable>
                <Tappable scale={0.85} onTap={() => setSavedRow(false)} style={{ display: "flex", color: SOFT }}>
                  <IconClose size={16} />
                </Tappable>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* suggestion pill — the mobile stand-in for pressing Tab */}
        <AnimatePresence>
          {suggestion && (
            <motion.div
              initial={{ opacity: 0, y: 6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 4, height: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 34 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ display: "flex", gap: 7, paddingBottom: 8, overflowX: "auto", scrollbarWidth: "none" }}>
                <Tappable
                  scale={0.96}
                  onTap={() => {
                    setInput(suggestion); setSuggestion("");
                    inputRef.current?.focus();
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
                    height: 32, padding: "0 12px", borderRadius: 999,
                    background: gradTint(0.11), border: "1px solid rgba(180,158,250,0.4)" }}
                >
                  <span style={{ display: "flex" }}><AqlMark size={13} /></span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: STRONG, whiteSpace: "nowrap" }}>
                    {suggestion}
                  </span>
                </Tappable>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* input */}
        <div style={{
          border: HAIRLINE, borderRadius: 24, background: "#fff", padding: 9,
          boxShadow: focused
            ? "0 0 0 3px rgba(180,158,250,0.18), " + CARD_SHADOW
            : CARD_SHADOW,
          transition: "box-shadow 0.22s ease" }}>
          <AnimatePresence>
            {cardRef && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6,
                  padding: "6px 8px 6px 10px", borderRadius: 9, background: "var(--bg-weak-50,#FBFBFB)" }}>
                  <span style={{ display: "block" }}>
                    <span style={{ display: "block", fontSize: 9.5, color: SOFT, lineHeight: "12px" }}>
                      {cardRef.label}
                    </span>
                    <span style={{
                      display: "block", fontSize: 11.5, fontWeight: 500, color: STRONG,
                      fontVariantNumeric: "tabular-nums" }}>{cardRef.value}</span>
                  </span>
                  <Tappable
                    scale={0.85}
                    onTap={() => { setCardRef(null); setSuggestion(""); }}
                    style={{ display: "flex", color: SUB }}
                  >
                    <IconClose size={14} />
                  </Tappable>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <textarea
              ref={inputRef}
              value={input}
              rows={1}
              onChange={e => setInput(e.target.value)}
              onInput={autoGrow}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (canSend) send(input.trim(), cardRef); }
              }}
              placeholder="Ask Aql anything…"
              style={{
                flex: 1, minWidth: 0, border: "none", outline: "none", resize: "none",
                background: "transparent", fontSize: 15, lineHeight: "21px", color: STRONG,
                fontFamily: "inherit", padding: "6px 2px 6px 6px", maxHeight: 92 }}
            />
            <Tappable
              scale={0.9}
              disabled={!canSend}
              onTap={() => canSend && send(input.trim(), cardRef)}
              style={{
                width: 36, height: 36, borderRadius: 999, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: canSend ? "#171717" : "rgba(16,24,40,0.05)",
                color: canSend ? "#fff" : SOFT,
                transition: "background 0.2s ease, color 0.2s ease" }}
            >
              <IconArrowUp size={17} color="currentColor" />
            </Tappable>
          </div>
        </div>

        <p style={{ margin: "7px 0 0", textAlign: "center", fontSize: 10.5, color: SOFT }}>
          Aql AI can make mistakes — always double-check important figures.
        </p>
      </motion.div>

      {/* the desktop's right-hand panel, re-expressed as a sheet */}
      {active && (
        <DeepDiveSheet
          cat={deepDive}
          loading={ddLoading}
          june={june}
          onClose={() => setDeepDive(null)}
          onCatChange={c => openDeepDive(c, false)}
        />
      )}
    </div>
  );
}
