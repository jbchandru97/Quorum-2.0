/* ───────────────────────────────────────────────────────────────
   Saved framing for each embedded build.

   `zoom` multiplies "fit the frame width"; `x`/`y` pan the build
   inside the frame; `h` is the frame height.

   `reveal` keeps the frame blank until the app has reached the
   state we want, so a still shot never shows itself assembling.
   `play` runs a scripted interaction; `loop` replays it.

   Arrange with ?edit=1, then Export and paste back here.
   ─────────────────────────────────────────────────────────────── */

export type EmbedCfg = {
  src: string;
  zoom: number;
  x: number;
  y: number;
  h: number;
  /* content-box width the framing was authored against; defaults to the
     step media column (618.81), the full column is 1048 */
  base?: number;
  play?: "hero" | "tag" | "panel";
  loop?: number;    // seconds before replay
  reveal?: number;  // ms held blank after each load
};

export const EMBEDS: Record<string, EmbedCfg> = {
  /* the whole arc on a loop: types the question, answer + panel, follow-up,
     then saves the chart to the dashboard. base 1048 because the hero spans
     the full column, not the narrower step media column. */
  hero:      { src: "/demo/playground/assistant?demo=hero&shiftEmpty=16&nav=collapsed", zoom: 1, x: 0, y: -5, h: 650, base: 1048, play: "hero", loop: 21, reveal: 300 },
  empty:     { src: "/demo/playground/assistant?demo=empty&chrome=0", zoom: 1, x: 0, y: 0, h: 400 },
  /* stacked in a full-width block, so it shares the hero's reference */
  home:      { src: "/demo/playground/assistant", zoom: 1.05, x: 0, y: -5, h: 430, base: 1048 },

  /* the nudge arriving is the point, so it plays at true speed */
  nudge:     { src: "/demo/playground?demo=dashboard&chrome=0", zoom: 1.95, x: -571, y: -165, h: 380 },

  /* stills: open already answered, already open */
  answer:    { src: "/demo/playground/assistant?demo=summary&chrome=0&nav=collapsed&instant=1", zoom: 1.65, x: -76, y: -120, h: 390 },
  drill:     { src: "/demo/playground/assistant?demo=summary&chrome=0&nav=collapsed&instant=1", zoom: 1.75, x: -462, y: -52, h: 410 },
  /* lands answered, then loops the follow-up gesture without re-sending */
  tag:       { src: "/demo/playground/assistant?demo=summary&chrome=0&nav=collapsed&instant=1", zoom: 1.55, x: -54, y: -172, h: 410, play: "tag" },

  saved:     { src: "/demo/playground?demo=saved&chrome=0", zoom: 1.7, x: -419, y: -156, h: 410, loop: 9 },
  /* the report surfacing in the nav is the point, so true speed */
  navcard:   { src: "/demo/playground?demo=navcard&chrome=0", zoom: 1.85, x: -6, y: -7, h: 400 },

  optin:     { src: "/demo/playground/assistant?demo=june&chrome=0&instant=1", zoom: 1.75, x: -154, y: -271, h: 400 },
  roundup:   { src: "/demo/playground?demo=roundup&chrome=0&instant=1", zoom: 1.85, x: -4, y: -310, h: 400 },
};
