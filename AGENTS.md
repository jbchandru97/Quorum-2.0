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
- Overlay modes: `Free flow` (default — the host product stays fully usable) and `Inspect` (click selects an element, dragging draws a region, `Esc` returns to free flow). Committing a target auto-returns to free flow.
- Overlay chrome (toolbar, panel, popovers, markers, wizard chip) renders with the dark token register from `review.css` so it stands out over the light demo product.
- Demo keys: `→` next step, `←` back (UI-only steps), `⇧R` or the chip's `↺ reset` button clears Convex demo data + reloads. `Esc` blurs the composer so the arrows reach the conductor.
- Agent answers come from `POST /api/agent` (`src/lib/quorum/agent.ts`). Free-form questions are routed by `classifyQuestion` in `src/lib/quorum/agent-kinds.ts` (shared client/server): `rationale|playbook|precedent|delay` read `fixtures/` and are gated to the documented target (`ai-insight-prompt`) — other targets get honest not-found answers; `external` performs a real Context.dev search using the reviewer's own question (1 credit per run); `unknown` admits it and suggests tagging a human; `actions` synthesizes the two scripted action items.
- Message routing: tagging a teammate (@Rohan/@Arun/@Maya) hands the thread to them and the agent stays silent; @Quorum, or an untagged message from the local reviewer, summons the agent. Remote participants' untagged replies never auto-summon it.
- The scripted element target is the AI nudge CTA marked `data-quorum-target="ai-insight-prompt"` in `src/app/demo/playground/page.tsx` — the one review-anchor change to the vendored demo tree.
- `src/app/demo/**` and `src/components/demo/**` stay vendored otherwise; do not edit or lint them.
