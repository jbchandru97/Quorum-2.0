# Design system and interaction guidance

## Intent
Quorum should borrow the **interaction grammar** of the `design-companion-nu` reference product without becoming a clone. The design language should feel:
- clean
- editorial
- restrained
- tool-like
- context-first
- motion-light but polished

## Source of these findings

Everything below marked **Extracted** was read from the source of the Design Companion repo, not inferred from the deployed page.

| | |
|---|---|
| Repo | `jbchandru97/design-companion` (private) |
| Deployment | `https://design-companion-nu.vercel.app` → redirects to `/intro/` |
| Files read | `site/styles.css` (2,024 lines), `site/app.js`, `site/sandbox/companion.js`, `site/sandbox/index.html`, `site/intro/index.html`, `04-design-direction.md` |
| Build | Static site. No framework, no build step; `vercel.json` serves `site/` with `cleanUrls`. |

The repo has two visual registers, and they differ in one deliberate way:

- **the page** (`/intro`) — the case study. `--signal` is blue `#4B4DED`.
- **the app** (`/sandbox`) — the working canvas, scoped under `.app-body`. It remaps `--signal` to orange `#EA7639` and softens the rules.

**Quorum takes the app register.** Quorum's accent is orange, so the sandbox's `--signal` is the direct match, and the app register is the one built for chrome floating over content — which is exactly Quorum's situation.

The source repo was not modified.

---

## Visual principles
1. **The product canvas is primary.** Quorum UI must feel like a thin layer over the host app.
2. **Low chrome.** Avoid heavy frames or dense admin UI in the review overlay.
3. **Context appears when needed.** Keep the screen calm until a user selects or asks something.
4. **Editorial hierarchy.** Clear typography, lots of whitespace, concise text blocks.
5. **Subtle motion, not spectacle.** Shimmer and multi-step loading should signal intelligence without becoming noisy.

The reference states its own rule more sharply, and it is worth carrying over verbatim:

> Six colours. Three typefaces. No shadows, no radii, no gradients.
> `--signal` and `--evidence` are semantic, not decorative. If a colour appears somewhere that is not agent presence or provenance, it is wrong.

It also names three things to avoid as current AI-design tells: cream backgrounds near `#F4F1EA`, terracotta accents near `#D97757`, near-black with acid green, and gradient orbs.

---

## Typography — **Extracted**

Loaded from Google Fonts in both `site/intro/index.html` and `site/sandbox/index.html`:

```
Bricolage+Grotesque:opsz,wght@12..96,400..600
Inter:wght@400;500
JetBrains+Mono:wght@400;500
```

Three faces, three roles. The role split is the single most important thing to copy:

| Role | Face | Used for |
|---|---|---|
| Display | Bricolage Grotesque | Headlines and section titles **only** |
| Body | Inter | Prose, captions, anything read as a sentence |
| Utility | JetBrains Mono | Tags, plan rows, provenance labels, counts, paths, keys |

> The mono is doing real work: it is what separates interface artifacts from page prose. A tag looks like a tag because it is set in mono at small size with a tight box, not because it has a coloured pill background.

### Exact values from `styles.css`

| Element | Declaration |
|---|---|
| Body base | `400 17px/1.6 Inter`; `18px` at ≥900px; `font-feature-settings: 'cv11','ss01'` |
| `h1` | `500 clamp(38px, 6.1vw, 80px)/1.02`; `opsz 96`; tracking `-.028em`; `max-width: 16ch` |
| `h2` | `500 clamp(28px, 3.5vw, 44px)/1.1`; `opsz 48`; tracking `-.022em`; `max-width: 20ch` |
| Card title | `500 clamp(20px, 2vw, 24px)/1.15`; `opsz 24`; tracking `-.015em` |
| `h3` / UI title | `500 1em/1.4 Inter` |
| Panel title | `500 12.5px/1 Inter` |
| Body in UI | `400 12.5–13px/1.5 Inter` |
| Eyebrow | `500 12px/1 mono`; tracking `.04em` |
| Chip / tag | `400–500 11–11.5px/1 mono` |
| Smallest label | `400 9.5–10.5px/1 mono`; tracking `.04–.06em`; often uppercase |

Note that display type always carries an explicit `font-variation-settings: 'opsz' N` matched to its size. It is a variable font on both `wght` and `opsz`, and the reference sets both.

### In Quorum
`src/app/layout.tsx` loads all three through `next/font/google`; Bricolage declares `axes: ["opsz"]` and omits `weight` so the `opsz` settings are live. Roles are exposed as `--q-display`, `--q-body`, `--q-mono`.

Quorum's body base is **15px**, not 17px, because Quorum is an application rather than an essay. The type *scale* and the role split are unchanged.

---

## Colour — **Extracted**

### The page register

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FBFBF9` | Panels, cards, anything that floats |
| `--ink` | `#16171A` | Primary text, frames |
| `--muted` | `#6E7076` | Secondary text, captions |
| `--rule` | `#E4E3DE` | Hairlines, borders |
| `--signal` | `#4B4DED` | Agent presence and inference only |
| `--evidence` | `#5C6B4A` | Fetched data and cited sources only |

### The app register (`.app-body`) — what Quorum uses

```css
--signal: #EA7639;          /* orange */
--canvas: #F7F7F5;          /* the ground panels sit on */
--rule:   #F1F0EC;          /* softer than the page rule */
--fill:   rgba(22,23,26,.03);      /* hover wash */
--line:   rgba(22,23,26,.12);      /* border over content */
--line-strong: rgba(22,23,26,.22);
--input-bg: #FCFCFB;
```

Derived accent values used throughout: `rgba(234,118,57,.12)` for a selected-mode fill, `.10` for a highlight fill, `.14`–`.18` for animated sweeps.

Full dark remap exists under `:root[data-theme="dark"]` — `--paper #16171A`, `--ink #F2F2EE`, `--muted #9A9CA4`, `--rule #2B2C32`, `--signal #F0874C`, `--evidence #9AB07C`. Success green: `--ok #1B9A4A` light / `#4CC277` dark.

### In Quorum
`src/app/globals.css`, prefixed `--q-*`, with the dark remap carried over. Roles are unchanged: the accent means agent presence, selection, or inference — never decoration.

---

## Radii, borders and elevation — **Extracted**

- **Radius is zero almost everywhere.** Squared corners are the default. The exceptions are deliberate and few: `border-radius: 999px` on pills (`.wk-opt`, `.wk-pill`, `.pf-pill`, and the inline tag inside the app's prompt box), and `50%` on avatars and status dots.
- **Borders are 1px hairlines.** `1.5px` marks something selected or in scope. `2px` appears only on focus rings.
- **No shadows on page chrome.** The reference is explicit about this.
- **One exception, and Quorum uses it:** surfaces that float over canvas content do carry a soft shadow — `.vh-menu` uses `0 6px 24px rgba(22,23,26,.07)`, and `.pf-pill` uses `box-shadow: 0 0 0 1px var(--rule)` as a hairline substitute.

### In Quorum
Flat everywhere, with `0 6px 24px rgba(22,23,26,.08)` on exactly two things — the floating toolbar and popovers — because both sit over a host app Quorum does not control, and a hairline alone gives them no edge on a white page.

---

## Motion — **Extracted**

### Easing

```css
--ease: cubic-bezier(.2, .7, .2, 1);        /* nearly everything */
cubic-bezier(.22, .8, .3, 1)                /* long panel travel */
cubic-bezier(.3, .8, .4, 1)
```

### Durations actually in the stylesheet

| Band | Values | Used for |
|---|---|---|
| Affordance | 120–160ms | hover, press, key-down |
| Ring travel | 170ms | the inspect ring moving between targets |
| Default | `--t: 220ms` | chips, rows, reveals, tooltips |
| Reveal | 200–260ms | messages, notes, entry panels |
| Panel | 300–320ms | popovers, status surfacing |
| Long travel | 500–760ms | camera moves, edge panel slide-in (620ms) |
| Ambient loop | 1.1s–2.6s | pulse, breathe, shimmer, sheen |

Stagger between list items is **80ms**.

### The entry pattern
One idiom, used everywhere. A node is inserted carrying a `.pre` class, then a forced reflow (`void node.offsetWidth`) and the class is removed on the next frame:

```js
enter(node, parent) {
  if (!still) node.classList.add('pre');
  parent.appendChild(node);
  if (!still) { void node.offsetWidth; node.classList.remove('pre'); }
}
```

`.pre` is `opacity: 0` plus a small offset — `translateY(3–5px)`, sometimes with `scale(.975)`. Under reduced motion the class is never added, so the end state renders directly.

### Reduced motion
A blanket `@media (prefers-reduced-motion: reduce)` zeroes every transition and animation. Ambient effects are replaced with their mid-state (`.scope::before` holds at `opacity: .08`) rather than disappearing. **The sequence still runs — only the animation stops.**

### In Quorum
`--q-ease`, `--q-ease-out`, and the duration bands as `--q-t-fast` / `--q-t` / `--q-t-panel` / `--q-t-travel` / `--q-snap`, with `--q-stagger: 80ms`. The `.pre` idiom is `q-enter` + `q-pre` in `globals.css`, driven from `requestAnimationFrame` instead of a forced reflow.

---

## Layering — **Extracted**

The reference's z-index ladder: `2–7` canvas content · `20–30` rails, HUD, zoom · `34` status · `40` cursor · `45` title card · `50–60` tour, edge panel, topbar · `70` menus · `80` empty state and annotation ink · `90` the mascot layer · `200` launch screen.

### In Quorum
Quorum sits over a host app whose own stacking it does not control, so the whole layer starts at **1000** and leaves `0–999` to the host:

```
--q-z-highlight 1010   inspect ring, region marquee
--q-z-marker    1020   thread bubbles
--q-z-panel     1040   side panel
--q-z-toolbar   1060   the bottom bar
--q-z-popover   1080   popovers, menus, tooltips
--q-z-modal     1100
```

Portalling to `<body>` matters as much as the numbers: a host's `transform` or `overflow: hidden` would otherwise clip the overlay regardless of z-index.

---

## Core interaction patterns — **Extracted**

### 1. Hover inspection — the snap ring
The most transferable mechanic in the reference.

- `document.elementFromPoint(x, y)` finds what is under the cursor.
- In Inspect mode it resolves to `node.closest('[data-el]')`; otherwise to the enclosing frame. Targets opt in by carrying a `data-el` attribute.
- **One persistent ring element is moved**, not a new one drawn per target. Its `left/top/width/height` are transitioned at 170ms, so it *glides* between targets. This single decision is what makes hover inspection feel like an instrument rather than a hover state.
- The ring is placed at `rect - 3px` and `size + 6px`, so it never sits on the target's own edge.
- A label rides the ring: `snap-label`, mono 10.5px, solid `--signal` ground, white text.
- Ambiguity is a first-class state: two candidate rings (the second dashed) plus a small numbered `snap-choice` popover.
- Keyboard deepens into a child or widens to the parent, re-placing the same ring.

### 2. Selection treatment
`outline: 1.5px solid --signal` with `outline-offset: 3px`, plus four 5px corner handles drawn as `::before`/`::after` on the element and on a helper span — paper fill, accent border. Reads as a design tool's selection, not a focus ring.

### 3. Mode toolbar
`.mode-switch` is a solid-ground inline-flex group with a hairline border; buttons are 28px tall, `500 11.5px` body type with a 13px stroked icon, joined by `border-left` rather than separated by gaps. The selected button takes the paper ground; the rest stay muted. `aria-pressed` is maintained.

Quorum's adaptation: **Select** and **Draw** rather than Move and Inspect, and the active button takes the accent wash instead of paper, because Quorum's bar floats over a host app and needs a stronger read of which tool is held.

### 4. Loading — text shimmer
Not a spinner. A light sweeps through the words themselves:

```css
.shimmer {
  background-image:
    linear-gradient(90deg, transparent calc(50% - var(--spread)), var(--sh), transparent calc(50% + var(--spread))),
    linear-gradient(var(--sb), var(--sb));
  background-size: 250% 100%, auto;
  -webkit-background-clip: text;
  animation: shimmer 2s linear infinite;
}
```

`--spread` is set per element from the label's own length — `label.length * 2` px — so one pass reads as a single light crossing the phrase regardless of how long it is. Under reduced motion the text simply renders solid.

The block variant for content that has not arrived is a diagonal accent sweep (`gensheen`, 2.2s linear).

### 5. Multi-step agent progress
The structure is `wk-group` → `wk-head` (chevron · label · count) → `wk-sub` → `wk-step` rows, each row being `wk-tool` (icon) · `wk-txt` · `wk-dot`.

Lifecycle, as driven in `companion.js`:

1. Row is inserted with `.pre` and `.active`; its text carries `.shimmer`.
2. On completion: `.active` → `.done`, shimmer removed, and the dot is replaced with a tick — `<path d="M2.5 6.4l2.4 2.4 4.6-5"/>`.
3. The header count runs `1 of 4`, `2 of 4`, …
4. When every row settles, the group gains `.done .closed`, the count becomes `4 steps`, and the list collapses — so a long answer is not buried under its own scaffolding.

The running row's dot is a 6px accent circle pulsing at 1.1s. A pending row is a 5px hollow square.

### 6. Contextual side surfaces
Two shapes, both in the reference:

- **Edge panel** (`.ho`) — `position: absolute`, docked right, `transform: translateX(calc(100% - 32px))` when closed, `translateX(0)` when open, over **620ms** with the softer ease. The 32px it leaves behind is a rail with vertical uppercase mono text, so the surface stays discoverable while occupying almost nothing.
- **Card panel** (`.conv-panel`) — enters with `opacity` + `translateY(-2px) scale(.97)`, `transform-origin: 50% 0`, 200/300ms. Stacked-card edges are faked with two `::before`/`::after` strips behind it.

### 7. Provenance marks — the highest-value detail
Three marks, **distinguished by shape as well as colour**, so they work in greyscale:

| Mark | Shape | Colour |
|---|---|---|
| Fetched data | filled square | `--evidence` |
| Cited principle | hollow square | `--evidence` |
| Model inference | filled circle | `--signal` |

> Every note produced on the canvas carries exactly one. This is the highest-value detail in the whole design.

Quorum adds a fourth for a human source: hollow circle, neutral stroke.

### 8. Chips and pills
Two distinct treatments, and the distinction is meaningful:

- **Interface artifact** — mono, hairline box, square: a source, a file, a key.
- **Choice affordance** — body face, `border-radius: 999px`, and when selected an accent wash with a transparent border: an option the user picks.

### 9. Icons
All inline SVG on a 16×16 grid (12–13px rendered), `fill: none`, `stroke: currentColor`, `stroke-width: 1.2–1.4`, round caps and joins. No icon font, no icon library, and no filled icons except deliberate solid marks (the cursor, the agent core).

---

## Motion to support in Quorum

- hover inspect ring travels between targets — 170ms
- side panel enters from the edge — 620ms, `--q-ease-out`
- thread bubble animates in — 220ms, `q-pre` idiom
- agent thinking shimmer, spread scaled to the label
- multi-step rows animate in sequentially — 80ms stagger
- agent response reveals naturally
- the right-arrow wizard triggers the same real UI behaviour, never a jump cut

---

## Workspace app visual guidance

The standalone Quorum workspace uses the same token set and the same restraint:
- left sidebar, simple content area, neutral surfaces, hairline rules
- counts set in mono with tabular numerals, on a rule, not in cards
- placeholder states say what will be there and what has to happen first
- reserved areas are marked with a dashed hairline, which reads as reserved rather than broken

---

## Where this lives in Quorum

| Concern | Path |
|---|---|
| Tokens, type, motion, layering | `src/app/globals.css` |
| Primitive styles | `src/components/quorum/primitives/primitives.css` |
| Primitives | `src/components/quorum/primitives/` |
| Review chrome (shell) | `src/components/quorum/overlay/` |
| Workspace | `src/components/quorum/workspace/` |
| Live gallery of every primitive | `/quorum/foundation` |

## Logo usage
Use the simple Quorum symbol only — `src/components/quorum/QuorumMark.tsx`. A ring with a filled accent sector: a quorum is a threshold, so the mark is the share of the group that has weighed in. Geometric, not a character, legible at 16px. `tone="light"` inverts the ring for dark grounds. No wordmark is needed for the prototype.
