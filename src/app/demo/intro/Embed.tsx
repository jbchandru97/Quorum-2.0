"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { EMBEDS, type EmbedCfg } from "./embeds";

/* ───────────────────────────────────────────────────────────────
   A framed window onto the live build.

   The whole app runs inside — same origin, fully clickable — but
   the frame shows only the part that matters, at a saved zoom and
   position. Open with ?edit=1 to re-frame: Position to drag and
   zoom, Interact to click the build into a different state, then
   Save. Export copies the config to paste into embeds.ts.
   ─────────────────────────────────────────────────────────────── */

const APP_W = 1440;
const APP_H = 900;
const LS_KEY = "mal-cs-embeds";
/* Saved framing is keyed to a version. Bump this whenever the defaults in
   embeds.ts change meaningfully — otherwise a stale localStorage entry
   silently masks the new config and edits appear to do nothing. */
const CONFIG_VERSION = 3;
const CHANGED = "mal-cs-embeds-change";

/* Saved framing is client-only external state, so it's read through a
   store rather than assigned into state from an effect. */
type Overrides = Record<string, EmbedCfg>;
const EMPTY: Overrides = {};
let cache: Overrides | null = null;

function snapshot(): Overrides {
  if (!cache) {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      const { __v, ...rest } = raw as { __v?: number } & Overrides;
      cache = __v === CONFIG_VERSION ? (rest as Overrides) : {};
    } catch { cache = {}; }
  }
  return cache;
}
function subscribe(cb: () => void) {
  window.addEventListener(CHANGED, cb);
  return () => window.removeEventListener(CHANGED, cb);
}
function write(next: Overrides) {
  cache = next;
  localStorage.setItem(LS_KEY, JSON.stringify({ __v: CONFIG_VERSION, ...next }));
  window.dispatchEvent(new Event(CHANGED));
}
function useOverrides() {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}
const noopSub = () => () => {};
function useEditMode() {
  return useSyncExternalStore(
    noopSub,
    () => new URLSearchParams(location.search).get("edit") === "1",
    () => false
  );
}

export default function Embed({ id, caption }: { id: string; caption?: string }) {
  const base = EMBEDS[id];
  const overrides = useOverrides();
  const edit = useEditMode();

  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const [draft, setDraft] = useState<Partial<EmbedCfg>>({});
  const [w, setW] = useState(0);
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [loadN, setLoadN] = useState(0);
  const [mode, setMode] = useState<"interact" | "position">("position");

  /* Saved framing is a scratchpad for ?edit=1, never a source of truth.
     Applying it outside edit mode let a months-old drag silently override
     embeds.ts, so a normal visit always renders the committed config. */
  const cfg: EmbedCfg = edit
    ? { ...base, ...(overrides[id] ?? {}), ...draft }
    : base;

  /* play/loop ride along in the URL so the embedded build drives itself */
  const frameSrc = (() => {
    const extra: string[] = [];
    if (cfg.play) extra.push(`play=${cfg.play}`);
    if (cfg.loop) extra.push(`loop=${cfg.loop}`);
    if (!extra.length) return cfg.src;
    return cfg.src + (cfg.src.includes("?") ? "&" : "?") + extra.join("&");
  })();

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const ro = new ResizeObserver(e => setW(e[0].contentRect.width));
    ro.observe(el);
    const io = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && setLive(true)),
      { rootMargin: "2200px" }
    );
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  /* a still state stays hidden until the app has settled, so the viewer
     never sees it animating into place — derived, not assigned in an effect */
  useEffect(() => {
    if (!ready || !cfg.reveal) return;
    const t = setTimeout(() => setRevealed(true), cfg.reveal);
    return () => clearTimeout(t);
  }, [ready, cfg.reveal, loadN]);
  const shown = ready && (!cfg.reveal || revealed);

  const scale = (w ? w / APP_W : 1) * cfg.zoom;
  /* The framing was set against a container of `base` px wide. If the column
     is narrower, the pan offsets and the frame height have to shrink by the
     same factor, or the build slides inside the frame and leaves a gap. */
  /* The reference is a CONTENT-box width, because that is what the observer
     above reports: the step media track is 620.81px border-box, less the
     frame's 1px border each side. Framing was authored at the shell's max
     width, so k lands on 1 there and the saved positions render untouched. */
  const authoredAt = cfg.base ?? 618.81;
  const k = w ? w / authoredAt : 1;
  const patch = (p: Partial<EmbedCfg>) => setDraft(d => ({ ...d, ...p }));

  const save = useCallback(() => {
    let src = cfg.src;
    try {
      const loc = frame.current?.contentWindow?.location;
      if (loc) {
        // strip the params we add ourselves, or each save compounds them
        const u = new URLSearchParams(loc.search);
        ["play", "loop", "reveal"].forEach(k => u.delete(k));
        const qs = u.toString();
        src = loc.pathname + (qs ? "?" + qs : "");
      }
    } catch { /* keep configured src */ }
    write({ ...snapshot(), [id]: { ...cfg, src } });
    setDraft({});
  }, [cfg, id]);

  const onDown = (e: React.PointerEvent) => {
    if (mode !== "position") return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: cfg.x, oy: cfg.y };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    patch({
      x: Math.round(drag.current.ox + (e.clientX - drag.current.x)),
      y: Math.round(drag.current.oy + (e.clientY - drag.current.y)),
    });
  };
  const onUp = () => { drag.current = null; };

  return (
    <figure className="embed-fig">
      <div ref={host} className="embed" style={{ aspectRatio: `${authoredAt} / ${cfg.h}` }}>
        {!shown && <span className={cfg.reveal ? "embed-quiet" : "embed-skel"} aria-hidden="true" />}
        {live && (
          <iframe
            ref={frame}
            src={frameSrc}
            title={caption || "Aql AI prototype"}
            onLoad={() => { setReady(true); setRevealed(false); setLoadN(n => n + 1); }}
            style={{
              width: APP_W, height: APP_H, border: 0, display: "block",
              transform: `translate(${cfg.x * k}px, ${cfg.y * k}px) scale(${scale})`,
              transformOrigin: "top left",
              opacity: shown ? 1 : 0, transition: "opacity .45s ease",
              // A showcase, not a toy: hovering or clicking an embed must not
              // drive the app. Re-enabled only while re-framing.
              pointerEvents: edit ? "auto" : "none",
            }}
          />
        )}
        {edit && mode === "position" && (
          <div className="embed-grab" onPointerDown={onDown} onPointerMove={onMove}
               onPointerUp={onUp} onPointerCancel={onUp} />
        )}
      </div>

      {edit && (
        <div className="embed-edit">
          <div className="seg">
            <button className={mode === "position" ? "on" : ""} onClick={() => setMode("position")}>Position</button>
            <button className={mode === "interact" ? "on" : ""} onClick={() => setMode("interact")}>Interact</button>
          </div>
          <span className="lbl">Zoom</span>
          <button onClick={() => patch({ zoom: Math.max(0.5, +(cfg.zoom - 0.05).toFixed(2)) })}>−</button>
          <b>{cfg.zoom.toFixed(2)}×</b>
          <button onClick={() => patch({ zoom: +(cfg.zoom + 0.05).toFixed(2) })}>+</button>
          <span className="lbl">Height</span>
          <button onClick={() => patch({ h: Math.max(200, cfg.h - 20) })}>−</button>
          <b>{cfg.h}</b>
          <button onClick={() => patch({ h: cfg.h + 20 })}>+</button>
          <button onClick={() => setDraft({ ...base })}>Reset</button>
          <button className="save" onClick={save}>Save view</button>
          <code>{id}</code>
        </div>
      )}

      {caption && <figcaption className="cap">{caption}</figcaption>}
    </figure>
  );
}

/* Floating export bar — only in ?edit=1 */
export function EmbedExporter() {
  const edit = useEditMode();
  const [msg, setMsg] = useState("");
  if (!edit) return null;

  const exportCfg = async () => {
    const merged: Overrides = { ...EMBEDS, ...snapshot() };
    const body = Object.entries(merged)
      .map(([k, v]) => {
        /* Every field must survive a round-trip. play/loop carry the scripted
           animations; base is the container width the framing was set against,
           and an embed that loses it rescales against the wrong reference. */
        const extra =
          (v.base ? `, base: ${v.base}` : "") +
          (v.play ? `, play: ${JSON.stringify(v.play)}` : "") +
          (v.loop ? `, loop: ${v.loop}` : "") +
          (v.reveal ? `, reveal: ${v.reveal}` : "");
        return `  ${(k + ":").padEnd(10)} { src: ${JSON.stringify(v.src)}, zoom: ${v.zoom}, x: ${v.x}, y: ${v.y}, h: ${v.h}${extra} },`;
      })
      .join("\n");
    const out = `export const EMBEDS: Record<string, EmbedCfg> = {\n${body}\n};`;
    try { await navigator.clipboard.writeText(out); setMsg("Copied — paste into embeds.ts"); }
    catch { console.log(out); setMsg("Copy blocked — logged to console"); }
    setTimeout(() => setMsg(""), 3200);
  };

  return (
    <div className="embed-export">
      <span>Framing mode</span>
      <button onClick={exportCfg}>Export config</button>
      <button onClick={() => { localStorage.removeItem(LS_KEY); cache = null; location.reload(); }}>Clear saved</button>
      {msg && <em>{msg}</em>}
    </div>
  );
}
