# Agent instructions

## Verification

- Run `npm run lint` after source changes.
- Run `npm run build` before considering application changes complete.
- Do not make live Context.dev calls from automated tests; mock the wrapper instead because every live call costs credits.

## Context.dev

- Required server environment variable: `CONTEXT_DEV_API_KEY`.
- Keep the key in an ignored local `.env.local` file and in the deployment platform's secret store. Never expose it through a `NEXT_PUBLIC_` variable or browser code.
- Route all Context.dev calls through `src/lib/quorum/context-dev.ts`.
- The application-facing endpoint is `POST /api/context/search` with a JSON body containing `query`.
- The integration uses Web Search (`POST /web/search`) for live external evidence and competitor-pattern research in review threads.
- SDK and setup docs: https://docs.context.dev/quickstart
- Web Search docs: https://docs.context.dev/api-reference/web-scraping/search
- Troubleshooting docs: https://docs.context.dev/optimization/troubleshooting
- The SDK is configured for two bounded retries and handles retryable 408, 429, and 5xx responses. Do not add unbounded retry loops.

## Convex

- The hosted Convex project is `quorum`; local deployment configuration lives in the ignored `.env.local` file.
- Required client variable: `NEXT_PUBLIC_CONVEX_URL`. `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_SITE_URL` are managed by the Convex CLI.
- Run `npm run dev:convex` alongside `npm run dev` while changing functions or schema. Run `npx convex dev --once` to generate types and deploy backend changes once.
- Convex schema and functions live in `convex/`; generated files under `convex/_generated/` must not be edited manually.
- The root `ConvexClientProvider` is in `src/app/ConvexClientProvider.tsx`.
- `npx convex run seed:demo` idempotently seeds the scripted users and Malbank preview.
- Keep queries index-backed. Current indexes cover threads by preview/status, messages by thread, actions by preview/thread, and presence by preview/user/activity.
- `npx convex run seed:resetDemo` clears threads/messages/actions/presence for a clean rehearsal (users and previews stay).
- Convex docs: https://docs.convex.dev/quickstart/nextjs

## Review overlay & demo

- The review surface is `/demo/playground?review=1`. The overlay mounts through `src/components/quorum/overlay/ReviewMount.tsx` and is driven by the session provider in `ReviewSession.tsx`; the wizard (`WizardConductor.tsx` + `wizard-steps.ts`) drives the same session verbs the UI binds to.
- The overlay starts folded into a launcher bubble (bottom-left); clicking it expands the tool, and the dock's `×` folds it back. The wizard's step 1 expands it.
- Overlay modes: `Move` (default — the host product stays fully usable), `Draw` (sweep a box over an area to comment on it), `Select` (inspect and pick an element). `Esc` returns to Move; committing a target auto-returns to Move.
- Threads open popup-first: an anchored dialog beside the bubble/selection (side chosen by available space, max-height + scroll, `ThreadPopup.tsx`); its header expand control promotes it to the pinned side panel (`ThreadPanel.tsx`). Shared conversation body lives in `ThreadContent.tsx`.
- The control dialog is dockable: drag its grip handle; dropping in the left quarter of the screen docks it vertically in the bottom-left corner, anywhere else returns it to the bottom centre. Threads/Actions open as a flush same-width extension of the dialog (`ReviewDock.tsx`), not detached popovers.
- Overlay chrome (toolbar, panel, popovers, markers, wizard chip) renders with the dark token register from `review.css` so it stands out over the light demo product.
- Demo keys: `→` next step, `←` back (UI-only steps), `⇧R` or the chip's `↺ reset` button clears Convex demo data + reloads. `Esc` blurs the composer so the arrows reach the conductor.
- Agent answers come from `POST /api/agent` (`src/lib/quorum/agent.ts`). Free-form questions are routed by `classifyQuestion` in `src/lib/quorum/agent-kinds.ts` (shared client/server). `rationale|delay|unknown` REALLY search the codebase (`src/lib/quorum/repo-search.ts` over `src/app/demo`, `src/components/demo`, `fixtures`, `docs`) and cite file:line matches; fixture docs additionally answer the documented target (`ai-insight-prompt`). `playbook` (internal process, Atlassian mark) and `precedent` (analytics, Amplitude mark) are seeded by design. `actions` synthesizes the two scripted action items. Never fabricate a source.
- `external` is a REAL two-hop Context.dev pipeline (~3 credits per run): phase 1 web-searches the question to identify the comparable products/pages to look at, phase 2 scrapes the top pages to Markdown (`web.webScrapeMd`) and reads them for question-relevant lines. The answer cites the scraped pages and carries a "Lookup trail" findings block; it falls back to real search snippets only if every scrape fails, never to a canned answer.
- Connector brand marks live in `src/assets/brands/` (atlassian.svg, amplitude.svg) and render through `BrandAtlassian`/`BrandAmplitude` in `overlay/icons.tsx` on source chips and agent steps.
- Message routing: tagging a teammate (@Rohan/@Arun) hands the thread to them and the agent stays silent; @Quorum, or an untagged message from the local reviewer, summons the agent. Remote participants' untagged replies never auto-summon it.
- Tagged teammates reply automatically after ~1.4s via `simulatedReplyFor` in `src/lib/quorum/demo-script.ts` (scripted lines for scripted beats, persona-plausible otherwise; never repeats a line already said in the thread; a reply that tags someone chains once). Agent answers that recommend a human carry a persisted `suggestion` rendered as a one-tap "Ask <name>" bar that sends the tag + question.
- Composer tagging is Figma-style: typing `@` opens a name dropdown (arrows navigate, Tab/Enter commits, Esc dismisses).
- Actions: a message can be captured as an action from its hover `+ Action` control; resolving the scripted thread runs the agent synthesis (summary + suggested actions); other threads get a closing summary. Actions are removable everywhere (`actions.remove` mutation, `×` in the dock extension and workspace).
- The scripted element target is the AI nudge CTA marked `data-quorum-target="ai-insight-prompt"` in `src/app/demo/playground/page.tsx` — the one review-anchor change to the vendored demo tree.
- `src/app/demo/**` and `src/components/demo/**` stay vendored otherwise; do not edit or lint them.
