"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InspectHighlight, OverlayPassive, type Rect } from "@/components/quorum/primitives";
import { TARGET_ATTR, targetByKey } from "@/lib/quorum/targets";
import { useReviewSession, type Selection } from "./ReviewSession";

/* ───────────────────────────────────────────────────────────────
   SelectionLayer — how a target gets picked.

   Three modes. Move (default): the overlay is completely passive
   and the host product behaves exactly as shipped. Select: hovering
   glides one ring between elements and a click anchors the one
   under the cursor. Draw: dragging sweeps a dashed marquee and
   releasing anchors the region. Committing a target — either way —
   returns the pointer to Move.
   ─────────────────────────────────────────────────────────────── */

type Hover = { rect: Rect; label: string; el: Element; key?: string };

const MIN_REGION = 12;

/** Quorum chrome must never hit-test as a host target. */
function isOverlayNode(node: Element | null): boolean {
  return Boolean(
    node?.closest("[data-quorum-overlay], .q-popover, .q-tooltip, .q-wizard-chip"),
  );
}

/** A stable-enough selector for a generic element anchor. */
function buildSelector(el: Element): string {
  if (el.id) return `#${CSS.escape(el.id)}`;
  const parts: string[] = [];
  let cur: Element | null = el;
  for (let depth = 0; cur && cur !== document.body && depth < 4; depth++) {
    const tag = cur.tagName.toLowerCase();
    const parent: Element | null = cur.parentElement;
    if (!parent) break;
    const siblings = Array.from(parent.children).filter((c) => c.tagName === cur!.tagName);
    parts.unshift(siblings.length > 1 ? `${tag}:nth-of-type(${siblings.indexOf(cur) + 1})` : tag);
    cur = parent;
  }
  return parts.join(" > ");
}

const toRect = (r: DOMRect): Rect => ({ x: r.x, y: r.y, width: r.width, height: r.height });

export function SelectionLayer() {
  const session = useReviewSession();
  const { mode, selection, agentRun, activeThread, panelOpen } = session;

  const [hover, setHover] = useState<Hover | null>(null);
  const hoverRef = useRef(hover);
  useEffect(() => {
    hoverRef.current = hover;
  });

  const [drag, setDrag] = useState<Rect | null>(null);
  const downAt = useRef<{ x: number; y: number } | null>(null);

  const resolveHover = useCallback((x: number, y: number): Hover | null => {
    const el = document.elementFromPoint(x, y);
    if (!el || isOverlayNode(el)) return null;

    const known = el.closest(`[${TARGET_ATTR}]`);
    if (known) {
      const key = known.getAttribute(TARGET_ATTR) ?? undefined;
      const target = key ? targetByKey(key) : undefined;
      return {
        rect: toRect(known.getBoundingClientRect()),
        label: target?.label ?? key ?? "target",
        el: known,
        key,
      };
    }

    /* Generic fallback: the nearest thing that reads as a unit. */
    const generic = el.closest("button, a, table, nav, aside, [role='button']") ?? el;
    const r = generic.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return null;
    if (r.width * r.height > window.innerWidth * window.innerHeight * 0.5) return null;
    return { rect: toRect(r), label: generic.tagName.toLowerCase(), el: generic };
  }, []);

  /* Crosshair + host-click suppression while either tool is held. */
  useEffect(() => {
    if (mode === "move") return;
    document.documentElement.setAttribute("data-quorum-inspect", "1");
    const onClick = (e: MouseEvent) => {
      if (isOverlayNode(e.target as Element)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        downAt.current = null;
        setDrag(null);
        session.setMode("move");
      }
    };
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.removeAttribute("data-quorum-inspect");
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [mode, session]);

  /* ── SELECT: hover ring + click to anchor an element ─────────── */
  useEffect(() => {
    if (mode !== "select") return;

    const onMove = (e: MouseEvent) => setHover(resolveHover(e.clientX, e.clientY));
    const onDown = (e: MouseEvent) => {
      if (isOverlayNode(e.target as Element)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const onUp = (e: MouseEvent) => {
      if (isOverlayNode(e.target as Element)) return;
      e.preventDefault();
      e.stopPropagation();
      const h = hoverRef.current;
      if (!h) return;
      const sel: Selection =
        h.key && targetByKey(h.key)
          ? {
              kind: "element",
              key: h.key,
              selector: `[${TARGET_ATTR}="${h.key}"]`,
              label: targetByKey(h.key)!.label,
              breadcrumb: targetByKey(h.key)!.breadcrumb,
              rect: h.rect,
            }
          : {
              kind: "element",
              selector: buildSelector(h.el),
              label: h.label,
              breadcrumb: [],
              rect: h.rect,
            };
      session.select(sel);
      setHover(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown, true);
    window.addEventListener("mouseup", onUp, true);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown, true);
      window.removeEventListener("mouseup", onUp, true);
    };
  }, [mode, resolveHover, session]);

  /* ── DRAW: sweep a marquee, release to anchor the region ─────── */
  useEffect(() => {
    if (mode !== "draw") {
      downAt.current = null;
      return;
    }

    const onDown = (e: MouseEvent) => {
      if (isOverlayNode(e.target as Element)) return;
      e.preventDefault();
      e.stopPropagation();
      downAt.current = { x: e.clientX, y: e.clientY };
      setDrag({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
    };
    const onMove = (e: MouseEvent) => {
      const start = downAt.current;
      if (!start) return;
      setDrag({
        x: Math.min(start.x, e.clientX),
        y: Math.min(start.y, e.clientY),
        width: Math.abs(e.clientX - start.x),
        height: Math.abs(e.clientY - start.y),
      });
    };
    const onUp = (e: MouseEvent) => {
      const start = downAt.current;
      downAt.current = null;
      if (!start) return;
      e.preventDefault();
      e.stopPropagation();
      setDrag((rect) => {
        if (rect && rect.width >= MIN_REGION && rect.height >= MIN_REGION) {
          session.select({ kind: "region", rect });
        }
        return null;
      });
    };

    window.addEventListener("mousedown", onDown, true);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, true);
    return () => {
      window.removeEventListener("mousedown", onDown, true);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp, true);
    };
  }, [mode, session]);

  /* ── the committed ring: selection, or the thread in scope ───── */
  const [anchorRect, setAnchorRect] = useState<Rect | null>(null);
  useEffect(() => {
    const compute = (): Rect | null => {
      if (selection) {
        if (selection.kind === "region") return selection.rect;
        const el = document.querySelector(selection.selector);
        return el ? toRect(el.getBoundingClientRect()) : selection.rect;
      }
      if (activeThread && panelOpen) {
        const a = activeThread.anchorData;
        if (a.type === "element") {
          const el = document.querySelector(a.selector);
          return el ? toRect(el.getBoundingClientRect()) : (a.rect ?? null);
        }
        return { x: a.x, y: a.y, width: a.width, height: a.height };
      }
      return null;
    };
    const update = () => setAnchorRect(compute());
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const iv = setInterval(update, 500);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      clearInterval(iv);
    };
  }, [selection, activeThread, panelOpen]);

  const anchorLabel =
    selection?.kind === "element"
      ? selection.label
      : selection?.kind === "region"
        ? "region"
        : activeThread?.title;

  return (
    <>
      {mode !== "move" && <div className="q-inspect-veil" aria-hidden="true" />}

      <OverlayPassive>
        <InspectHighlight
          rect={mode === "select" ? (hover?.rect ?? null) : null}
          label={hover?.label}
          variant="hover"
        />
        <InspectHighlight
          rect={mode === "draw" ? drag : null}
          label="region"
          variant="tentative"
          inset={0}
        />
        <InspectHighlight
          rect={anchorRect}
          label={anchorLabel}
          variant={agentRun ? "scope" : "selected"}
        />
      </OverlayPassive>
    </>
  );
}
