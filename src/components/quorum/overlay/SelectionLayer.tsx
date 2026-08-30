"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InspectHighlight, OverlayPassive, type Rect } from "@/components/quorum/primitives";
import { TARGET_ATTR, targetByKey } from "@/lib/quorum/targets";
import { useReviewSession, type Selection } from "./ReviewSession";

/* ───────────────────────────────────────────────────────────────
   SelectionLayer — how a target gets picked.

   Two modes. Free flow (default): the overlay is completely
   passive and the host product behaves exactly as shipped. Inspect:
   the pointer becomes the review instrument — hovering glides one
   ring between candidates, a click anchors an element, and dragging
   past a small threshold draws a region instead. Committing a
   target returns the pointer to free flow.
   ─────────────────────────────────────────────────────────────── */

type Hover = { rect: Rect; label: string; el: Element; key?: string };

const DRAG_THRESHOLD = 6;
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

const truncateLabel = (s: string): string => (s.length > 40 ? `${s.slice(0, 37)}…` : s);

const NAMED_ANCESTORS = new Set([
  "section", "nav", "aside", "main", "header", "footer", "table", "form", "article",
]);

/** A short human-readable name for a generic element. */
function describeElement(el: Element): string {
  const attr =
    el.getAttribute("aria-label") ??
    el.getAttribute("title") ??
    (el instanceof HTMLImageElement ? el.alt : null);
  if (attr?.trim()) return truncateLabel(attr.trim());
  const heading = el.querySelector("h1, h2, h3, h4, h5, h6")?.textContent?.trim();
  if (heading) return truncateLabel(heading.replace(/\s+/g, " "));
  const text = el.textContent?.trim().replace(/\s+/g, " ");
  if (text) return truncateLabel(text);
  return el.tagName.toLowerCase();
}

/** Readable ancestry for a generic element: up to three named ancestors. */
function buildBreadcrumb(el: Element): string[] {
  const crumbs: string[] = [];
  let cur: Element | null = el.parentElement;
  while (cur && cur !== document.body && crumbs.length < 3) {
    const aria = cur.getAttribute("aria-label")?.trim();
    if (aria || NAMED_ANCESTORS.has(cur.tagName.toLowerCase())) {
      const heading = cur
        .querySelector(":scope > h1, :scope > h2, :scope > h3, :scope > h4")
        ?.textContent?.trim();
      crumbs.unshift(truncateLabel(aria || heading || cur.tagName.toLowerCase()));
    }
    cur = cur.parentElement;
  }
  return crumbs;
}

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
  const draggingRef = useRef(false);

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
    return { rect: toRect(r), label: describeElement(generic), el: generic };
  }, []);

  /* ── inspect mode: one set of capture listeners ─────────────── */
  useEffect(() => {
    if (mode !== "inspect") {
      downAt.current = null;
      draggingRef.current = false;
      return;
    }

    /* Crosshair everywhere while the instrument is held. */
    document.documentElement.setAttribute("data-quorum-inspect", "1");

    const onMove = (e: MouseEvent) => {
      const start = downAt.current;
      if (start) {
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (draggingRef.current || Math.hypot(dx, dy) > DRAG_THRESHOLD) {
          draggingRef.current = true;
          setDrag({
            x: Math.min(start.x, e.clientX),
            y: Math.min(start.y, e.clientY),
            width: Math.abs(dx),
            height: Math.abs(dy),
          });
          return;
        }
      }
      setHover(resolveHover(e.clientX, e.clientY));
    };

    const onDown = (e: MouseEvent) => {
      if (isOverlayNode(e.target as Element)) return;
      /* The host must not react — and text must not select — while
         the pointer is the review instrument. */
      e.preventDefault();
      e.stopPropagation();
      downAt.current = { x: e.clientX, y: e.clientY };
      draggingRef.current = false;
    };

    const onUp = (e: MouseEvent) => {
      const start = downAt.current;
      downAt.current = null;
      if (!start) return;
      e.preventDefault();
      e.stopPropagation();

      if (draggingRef.current) {
        draggingRef.current = false;
        setDrag((rect) => {
          if (rect && rect.width >= MIN_REGION && rect.height >= MIN_REGION) {
            session.select({ kind: "region", rect });
          }
          return null;
        });
        return;
      }

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
              breadcrumb: buildBreadcrumb(h.el),
              rect: h.rect,
            };
      session.select(sel);
      setHover(null);
    };

    const onClick = (e: MouseEvent) => {
      /* Swallow every host click while inspecting. */
      if (isOverlayNode(e.target as Element)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        downAt.current = null;
        draggingRef.current = false;
        setDrag(null);
        session.setMode("flow");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown, true);
    window.addEventListener("mouseup", onUp, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.removeAttribute("data-quorum-inspect");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown, true);
      window.removeEventListener("mouseup", onUp, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [mode, resolveHover, session]);

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

  const inspecting = mode === "inspect";

  return (
    <>
      {inspecting && <div className="q-inspect-veil" aria-hidden="true" />}

      <OverlayPassive>
        <InspectHighlight
          rect={inspecting && !drag ? (hover?.rect ?? null) : null}
          label={hover?.label}
          variant="hover"
        />
        <InspectHighlight
          rect={inspecting ? drag : null}
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
