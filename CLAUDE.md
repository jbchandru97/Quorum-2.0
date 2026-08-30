# CLAUDE HANDOFF — Quorum 2.0 (hackathon prototype)

> State-of-the-repo handoff, audited on branch `feature/hackathon-prototype`
> (commit `015187f` — "Real message routing and generic agent behaviour").
> Read `AGENTS.md` first for hard rules (vendored trees, Context.dev credit costs,
> Convex workflow). Docs in `docs/00`–`12` are the source of truth for intent.

---

## 1. What this is

Quorum is a collaborative review overlay that mounts on top of a running product
(a vendored clone of the Malbank / Aql AI banking app). Reviewers select UI
elements, open threads, ask an agent grounded questions, get live external
evidence via Context.dev, synthesize action items, and see everything in a
workspace. Backend is Convex (realtime); deployment `dev:reminiscent-caiman-439`
(team jayabalachandar-j, project quorum). Env lives in gitignored `.env.local`
(`NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`, `CONTEXT_DEV_API_KEY`).

Run: `npm install && npm run dev` → http://localhost:3000
Backend fn changes: `npm run dev:convex` alongside. Seed: `npx convex run seed:demo`.
Reset demo data: `npx convex run seed:resetDemo` (or `⇧R` in the overlay).

---

## 2. Build-plan status (docs/10-BUILD_PLAN.md — the de-facto rubric)

| Phase | Status |
|---|---|
| 0 Read & inspect | done |
| 1 Project foundation (layouts, primitives, vendored host) | DONE |
| 2 Convex backend (schema, threads/messages/actions/presence/seed) | DONE |
| 3 Overlay interaction (toolbar, select/draw, markers, panel) | DONE |
| 4 Realtime collaboration (live queries, presence heartbeats) | DONE |
| 5 Agent UX (agent messages, thinking steps, source chips) | DONE |
| 6 Scenario adapters (rationale/playbook/precedent/delay) | DONE |
| 7 Real Context.dev call (`external` kind, live web search) | DONE — needs `CONTEXT_DEV_API_KEY`; 1 credit per run |
| 8 Actions (Resolve, Add to actions, actions popover) | DONE — but synthesis is HARDCODED (see §5) |
| 9 Workspace (/quorum/threads two-column, filters) | DONE |
| 10 Demo wizard (11 steps, →/←/⇧R keys) | DONE |
| 11 Hardening / rehearsal | NOT VERIFIED — needs live run-throughs |

All 14 features in `docs/01-FEATURES.md` have implementations. The remaining work
is polish, rehearsal, and the known limitations in §5–6.

---

## 3. User journey (the scripted demo)

1. Open `/demo/playground?review=1` — Malbank dashboard with dark Quorum toolbar
   at the bottom (Review · Free flow · Inspect · Threads · Actions · presence).
2. **Free flow** (default): host product fully usable. **Inspect**: click selects
   an element, drag ≥6px draws a region, `Esc` cancels. Committing a target
   auto-returns to free flow and opens the side thread panel.
3. The scripted anchor is the AI nudge CTA (`data-quorum-target="ai-insight-prompt"`
   in `src/app/demo/playground/page.tsx`) — the ONLY element with curated context.
4. First message from Maya (local reviewer, always Maya · Designer) creates a
   Convex thread. Untagged Maya messages or `@Quorum` summon the agent; tagging
   `@Rohan`/`@Arun` silences it and shows "waiting for @X".
5. Agent answer kinds (`classifyQuestion` in `src/lib/quorum/agent-kinds.ts`):
   - `rationale` (why/intent) → fixtures/context/product-rationale.md
   - `playbook` (usability/validate) → fixtures/internal/design-review-playbook.md
   - `precedent` (metrics/analytics) → fixtures/analytics/precedent.json (21% vs 9%)
   - `delay` (timing) → honest "not documented", prompts to tag PM
   - `external` (competitors/best practices) → LIVE Context.dev web search
   - `unknown` → admits no source, suggests tagging a human
6. **Add to actions** → agent posts summary + 2 action items to Convex.
   **Resolve** flips thread status (reopenable).
7. Wizard (`WizardConductor` + `wizard-steps.ts`, 11 steps) drives this exact
   script with `→` next / `←` back / `⇧R` reset. Step 6 sends a realtime PM
   reply; step 7 does the real Context.dev call; step 11 routes to the workspace.
8. `/quorum/threads` — live Convex workspace: thread list, Open/Resolved/Actions
   filters, expandable conversations, action items, link back to the review.

---

## 4. What is REAL vs seeded vs hardcoded

REAL (live):
- All Convex reads/writes: threads, messages, actions, presence, users, previews.
- Presence heartbeats (Maya every 20s; Rohan/Arun via wizard step 1).
- Context.dev web search for `external` answers (`src/lib/quorum/context-dev.ts`),
  through `POST /api/agent`. Costs 1 credit per run — never mock this in the
  demo, never call it from automated tests.

SEEDED (fixtures/, loaded by `npx convex run seed:demo`):
- 4 demo users, the Malbank preview, product rationale, playbook, precedent,
  component map.

HARDCODED:
- The two "synthesized" action items (`agent.ts` ~l193–223) — always the same,
  regardless of the conversation.
- All fixture-backed answers gated to `ai-insight-prompt` only (`targets.ts`
  `PRIMARY_TARGET_KEY`); any other selection gets an honest not-found answer.
- Demo script lines (`demo-script.ts`), local user identity (always Maya),
  mention pills (@Quorum/@Rohan/@Arun only).
- `/quorum/users` page renders `fixtures/seed/users.json`, NOT Convex.
- `/quorum/foundation` gallery: all data hardcoded (it's a design showcase).

---

## 5. Dead buttons, 404s, and stubs (patching backlog)

### Vendored Malbank demo (`src/app/demo`, `src/components/demo` — DO NOT lint;
### edits here are supposed to be minimal, but these are the known dead ends):

| Element | Problem |
|---|---|
| Sidebar: Dashboard | `href="/"` → redirects to /quorum/threads (Quorum workspace), NOT the Malbank dashboard. Wrong destination. |
| Sidebar: My Cards, Transfer, Transactions, Exchange, Settings, Support | `href="/cards"` etc. — top-level routes that DON'T EXIST → Next.js 404. 6 dead nav items. |
| Sidebar: Aql AI | WORKS → `/demo/playground/assistant` |
| Sidebar CrossFlow "See how it works" | No href/onClick — pure decoration. |
| Topbar: search, send-money icon, hide/bell/profile | All decorative, no handlers. |
| Dashboard quick actions (Send Money, Receive, Deposit, Pay Bills, Create Invoice) | Dead — no handlers. |
| "See where you can spend less" CTA | WORKS → assistant page (and is the review anchor). |
| WizardPanel "Go to Dashboard →" / "Reset Prototype" | Both go to `/` → land in the Quorum workspace, not the demo. Wrong destination. |
| `/demo/intro` "Back" button | `<a>` with no href — dead. |
| `/demo/[...slug]` catch-all | Renders a friendly EasterEggPage (not a 404), but its "Go back to dashboard" also goes to `/` → wrong destination. |
| `/demo/mobile` tab bar | Local state only, no routing (by design). |

Suggested patches (low risk, demo-safe): point sidebar dead items at
`/demo/<slug>` so the EasterEggPage catches them instead of 404ing; change the
"back to dashboard" targets from `/` to `/demo/playground`.

### Quorum surfaces:

| Element | Problem |
|---|---|
| /quorum/foundation popover rows (Open/Resolved/Actions) | `onClick={() => {}}` no-op stubs (acceptable — it's a gallery). |
| /quorum/settings | Entirely static placeholder, zero controls. |
| /quorum/users | Static fixture list, no actions; not wired to Convex users. |
| Workspace brand mark | Decorative, not a home link. |
| Threads page empty-state mention of the review URL | Plain text, not a link. |

### Overlay: NO dead controls found. Every toolbar/panel/popover/marker button
is wired to a real ReviewSession verb backed by Convex.

---

## 6. Known limitations / rough edges (from code audit)

- Action synthesis ignores the actual conversation (hardcoded 2 items) even
  though the UI copy says "synthesizes action items from this discussion".
- Only ONE curated target; free-form inspection of other elements yields
  honest-but-empty answers. Fine for demo, thin for judging "does it generalize".
- `waitingOn` regex only knows @Rohan/@Arun/@Maya on the LAST message; brittle.
- `ReviewMount` doesn't react to `?review` changes without full navigation.
- `buildSelector` nth-of-type anchors are fragile if the DOM shifts (falls back
  to stored rect).
- No auth / user switching — reviewer is always Maya; teammates are simulated.
- `seed:resetDemo` deletes row-by-row (fine at demo scale).
- 3 high-severity npm audit findings (transitive; not addressed).
- `CONTEXT_DEV_API_KEY` was shared in plaintext during setup — ROTATE after the
  hackathon.

---

## 7. Verification commands

- `npm run lint` after source changes (demo trees excluded by eslint config).
- `npm run build` before considering changes complete.
- `npx convex dev --once` to deploy backend/schema changes.
- Rehearsal: `⇧R` in the overlay (or `npx convex run seed:resetDemo`) for a
  clean run; keep Context.dev live at demo time (never canned).
