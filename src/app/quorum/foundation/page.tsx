"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AgentSteps,
  AvatarStack,
  InspectHighlight,
  Popover,
  PopoverRow,
  Shimmer,
  SkeletonLines,
  SourceChip,
  SourceChips,
  Tooltip,
  type AgentStep,
  type Person,
} from "@/components/quorum/primitives";

/* ───────────────────────────────────────────────────────────────
   The foundation gallery.

   Every primitive, rendered live, on one page. It is here so the
   design system can be *seen* rather than read out of a stylesheet —
   and so tomorrow's build can check a component's real behaviour
   before composing with it.

   Not a product surface. Nothing here is part of the demo.
   ─────────────────────────────────────────────────────────────── */

const PEOPLE: Person[] = [
  { id: "u_maya", name: "Maya", role: "Designer", active: true },
  { id: "u_rohan", name: "Rohan", role: "PM", active: true },
  { id: "u_arun", name: "Arun", role: "Engineer", active: false },
  { id: "u_sam", name: "Sam Okafor", role: "Research", active: false },
  { id: "u_lee", name: "Lee", role: "Data", active: false },
];

/* The step labels from /docs/06-AGENT_BEHAVIOR.md, run on a loop so
   the running → done transition can actually be watched. */
const SCRIPT = [
  "Checking product context",
  "Checking design review guidance",
  "Checking precedent metrics",
  "Composing answer",
];

function useLoopingSteps(): AgentStep[] {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setDone((n) => (n > SCRIPT.length ? 0 : n + 1)),
      1400,
    );
    return () => clearInterval(id);
  }, []);

  return SCRIPT.map((label, i) => ({
    id: `s${i}`,
    label,
    status: i < done ? "done" : i === done ? "running" : "pending",
  }));
}

function Section({
  n,
  title,
  note,
  children,
}: {
  n: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section style={S.section}>
      <div style={S.sectionHead}>
        <span style={S.num}>{n}</span>
        <div>
          <h2 style={S.h2}>{title}</h2>
          <p style={S.note}>{note}</p>
        </div>
      </div>
      <div style={S.demo}>{children}</div>
    </section>
  );
}

export default function FoundationPage() {
  const steps = useLoopingSteps();

  const popRef = useRef<HTMLButtonElement | null>(null);
  const tipRef = useRef<HTMLButtonElement | null>(null);
  const [popOpen, setPopOpen] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);

  /* A live target for the inspect ring: hovering the swatches below
     moves the one ring between them, which is the whole point of the
     primitive and impossible to see in a still. */
  const [ring, setRing] = useState<{ rect: DOMRect; label: string } | null>(null);
  const track = (label: string) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) =>
      setRing({ rect: e.currentTarget.getBoundingClientRect(), label }),
    onMouseLeave: () => setRing(null),
  });

  return (
    <>
      <header className="q-ws-head">
        <h1 className="q-ws-h1">Foundation</h1>
        <span className="q-ws-head-note">primitives · not a product surface</span>
      </header>

      <div style={S.scroll}>
        <p style={S.lede}>
          Rebuilt from the interaction patterns in the Design Companion
          reference. Each one is generic: it knows how to look and behave, and
          nothing about threads, agents, or data.
        </p>

        <Section
          n="01"
          title="Inspect highlight"
          note="One ring that travels. Hover the blocks — it glides between them rather than blinking."
        >
          <div style={S.rowWrap}>
            {["SpendingSummary", "AIInsightPrompt", "TransactionsTable"].map((label) => (
              <div key={label} style={S.target} {...track(label)}>
                {label}
              </div>
            ))}
          </div>
          <InspectHighlight rect={ring?.rect ?? null} label={ring?.label} />
          <p style={S.caption}>
            Variants: <code style={S.code}>hover</code> ·{" "}
            <code style={S.code}>selected</code> (corner handles) ·{" "}
            <code style={S.code}>tentative</code> (dashed) ·{" "}
            <code style={S.code}>scope</code> (the one thing that breathes)
          </p>
        </Section>

        <Section
          n="02"
          title="Agent steps"
          note="Multi-step progress rather than a spinner. The running row shimmers; finished rows go quiet and keep a tick."
        >
          <div style={S.panelish}>
            <AgentSteps steps={steps} title="Working" doneTitle="Answered" />
          </div>
        </Section>

        <Section
          n="03"
          title="Shimmer and skeleton"
          note="The light sweeps through the words themselves, so the text you are waiting on is the thing that animates."
        >
          <div style={{ ...S.panelish, display: "flex", flexDirection: "column", gap: 14 }}>
            <Shimmer>Fetching external reference…</Shimmer>
            <SkeletonLines lines={3} />
          </div>
        </Section>

        <Section
          n="04"
          title="Source chips"
          note="Provenance by shape as well as colour, so it survives greyscale and a washed-out projector."
        >
          <SourceChips>
            <SourceChip label="Product rationale" provenance="cited" detail="repo" />
            <SourceChip label="Design review playbook" provenance="cited" detail="internal" />
            <SourceChip label="Analytics precedent" provenance="fetched" detail="21%" />
            <SourceChip label="Model inference" provenance="inferred" />
            <SourceChip label="Rohan · PM" provenance="human" />
          </SourceChips>
        </Section>

        <Section
          n="05"
          title="Avatar stack"
          note="Initials over a hue derived from the name, so a stack is legible before any image loads. Presence is a dot on the ring."
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <AvatarStack people={PEOPLE.slice(0, 3)} size={26} />
            <AvatarStack people={PEOPLE} size={26} max={3} />
            <AvatarStack people={PEOPLE.slice(0, 2)} size={34} />
          </div>
        </Section>

        <Section
          n="06"
          title="Popover and tooltip"
          note="Both portal out and position themselves in viewport coordinates, so they escape any clipped ancestor and flip when they would run off screen."
        >
          <div style={{ display: "flex", gap: 12 }}>
            <button
              ref={popRef}
              type="button"
              style={S.button}
              onClick={() => setPopOpen((v) => !v)}
            >
              Open popover
            </button>
            <button
              ref={tipRef}
              type="button"
              style={S.button}
              onMouseEnter={() => setTipOpen(true)}
              onMouseLeave={() => setTipOpen(false)}
              onFocus={() => setTipOpen(true)}
              onBlur={() => setTipOpen(false)}
            >
              Hover for tooltip
            </button>
          </div>

          <Popover
            open={popOpen}
            anchorRef={popRef}
            onClose={() => setPopOpen(false)}
            heading="Threads"
            placement="bottom"
            align="start"
            minWidth={260}
          >
            <PopoverRow hint="4" active onClick={() => {}}>
              Open
            </PopoverRow>
            <PopoverRow hint="2" onClick={() => {}}>
              Resolved
            </PopoverRow>
            <PopoverRow hint="2" onClick={() => {}}>
              Actions
            </PopoverRow>
          </Popover>

          <Tooltip open={tipOpen} anchorRef={tipRef}>
            mono, 10.5px, never takes a pointer
          </Tooltip>
        </Section>

        <Section
          n="07"
          title="Overlay, toolbar and side panel"
          note="Composed together as the review chrome. They mount over the host product rather than on this page."
        >
          <p style={S.caption}>
            See them in place at{" "}
            <Link style={S.link} href="/demo/playground">
              /demo/playground
            </Link>
            . The bar is click-through except for its own controls, and the
            panel parks off-screen leaving a rail behind.
          </p>
        </Section>

        <Section
          n="08"
          title="Type and colour"
          note="Three faces, three roles. Six values in the palette; --signal and --evidence are semantic, never decorative."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ ...S.specimen, fontFamily: "var(--q-display)", fontSize: 30, fontVariationSettings: "'opsz' 48", letterSpacing: "-0.022em" }}>
              Bricolage Grotesque — display
            </span>
            <span style={{ ...S.specimen, fontFamily: "var(--q-body)", fontSize: 15 }}>
              Inter — body, for prose and everything a person reads as a sentence
            </span>
            <span style={{ ...S.specimen, fontFamily: "var(--q-mono)", fontSize: 12 }}>
              JetBrains Mono — labels, counts, paths, provenance
            </span>

            <div style={{ display: "flex", gap: 1, marginTop: 6 }}>
              {[
                ["--q-paper", "paper"],
                ["--q-canvas", "canvas"],
                ["--q-rule", "rule"],
                ["--q-muted", "muted"],
                ["--q-ink", "ink"],
                ["--q-signal", "signal"],
                ["--q-evidence", "evidence"],
              ].map(([token, name]) => (
                <div key={token} style={S.swatchCell}>
                  <span style={{ ...S.swatch, background: `var(${token})` }} />
                  <span style={S.swatchName}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  scroll: { flex: 1, minHeight: 0, overflow: "auto", padding: "24px 24px 64px" },
  lede: {
    font: "400 14px/1.6 var(--q-body)",
    color: "var(--q-muted)",
    maxWidth: "62ch",
    marginBottom: 8,
  },
  section: { padding: "26px 0", borderTop: "1px solid var(--q-rule)", marginTop: 18 },
  sectionHead: { display: "flex", gap: 14, marginBottom: 18 },
  num: {
    font: "500 11px/1.5 var(--q-mono)",
    color: "var(--q-muted)",
    letterSpacing: ".04em",
    flex: "0 0 28px",
  },
  h2: {
    font: "500 17px/1.25 var(--q-display)",
    fontVariationSettings: "'opsz' 24",
    letterSpacing: "-0.014em",
    color: "var(--q-ink)",
  },
  note: {
    marginTop: 5,
    font: "400 13px/1.55 var(--q-body)",
    color: "var(--q-muted)",
    maxWidth: "64ch",
  },
  demo: { paddingLeft: 42 },
  rowWrap: { display: "flex", gap: 10, flexWrap: "wrap" },
  target: {
    padding: "22px 18px",
    border: "1px solid var(--q-rule)",
    background: "var(--q-paper)",
    font: "400 11px/1 var(--q-mono)",
    color: "var(--q-muted)",
    cursor: "default",
  },
  panelish: {
    border: "1px solid var(--q-rule)",
    background: "var(--q-paper)",
    padding: "14px 16px",
    maxWidth: 460,
  },
  caption: {
    marginTop: 12,
    font: "400 12.5px/1.6 var(--q-body)",
    color: "var(--q-muted)",
    maxWidth: "64ch",
  },
  code: { font: "400 11px/1 var(--q-mono)", color: "var(--q-ink)" },
  link: { font: "400 11.5px/1 var(--q-mono)", color: "var(--q-ink)" },
  button: {
    font: "400 12px/1 var(--q-body)",
    color: "var(--q-ink)",
    border: "1px solid var(--q-rule)",
    background: "var(--q-paper)",
    padding: "9px 12px",
  },
  specimen: { color: "var(--q-ink)" },
  swatchCell: { display: "flex", flexDirection: "column", gap: 6, width: 78 },
  swatch: { display: "block", height: 40, border: "1px solid var(--q-rule)" },
  swatchName: { font: "400 10px/1 var(--q-mono)", color: "var(--q-muted)" },
};
