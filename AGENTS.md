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
- Convex docs: https://docs.convex.dev/quickstart/nextjs
