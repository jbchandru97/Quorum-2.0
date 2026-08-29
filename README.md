# Quorum

**The collaborative decision stack for AI-native product teams.**

AI made building fast. The bottleneck moved to deciding — understanding why
something exists, validating it against real context, aligning the people who
have to agree, and turning that into a change someone can actually implement.
Quorum turns the running product into the surface where that happens.

---

## Run it

```bash
npm install && npm run dev
```

| Route | What it is |
|---|---|
| `/quorum/threads` | The workspace. Threads and actions, after a review. |
| `/quorum/foundation` | Every design primitive, rendered live. |
| `/demo/playground` | The review host — Malbank / Aql AI. |
| `/demo/playground?review=1` | The same, with Quorum's review chrome over it. |
| `/demo/intro` | The host app's case study. |

`/` redirects to the workspace.

---

## What is in here

Quorum is a standalone project. It draws on two existing repos, and modifies
neither of them.

### The cloned host — `src/app/demo`, `src/components/demo`

A copy of **Malbank / Aql AI** (`jbchandru97/mal-ai`, deployed at
`mal-ai-three.vercel.app`) runs inside Quorum as the product a team reviews.
Cloning it rather than pointing at the live deployment means the demo has no
external dependency and the original repo is never touched.

**Treat this tree as vendored.** The only changes from source are the ones
needed to run it under `/demo`: import paths namespaced, routes re-prefixed,
and its global stylesheet scoped to `.mal-root` so its tokens and reset cannot
leak into Quorum's own surfaces. It is excluded from linting for the same
reason — see `eslint.config.mjs`.

### The design system — `src/app/globals.css`, `src/components/quorum`

Rebuilt from the interaction patterns in **Design Companion**
(`jbchandru97/design-companion`, deployed at `design-companion-nu.vercel.app`).
Patterns and tokens were extracted from its source; no product logic was
copied. The concrete findings — exact fonts, the type scale, easing curves,
duration bands, the snap-ring mechanic, the provenance marks — are written up
in [`docs/02-DESIGN.md`](docs/02-DESIGN.md).

The primitives in `src/components/quorum/primitives` are generic. None of them
knows about threads, messages, presence, or agents; product meaning is composed
on top of them.

### Fixtures — `fixtures/`

Seeded local context for the scripted demo: participants, the reviewable
preview, product rationale, the design-review playbook, analytics precedent.
[`fixtures/README.md`](fixtures/README.md) marks what is seeded and what must
stay live — the Context.dev step is real at demo time and must never fall back
to a canned answer.

### Docs — `docs/`

The source of truth, in numeric order. Scope, features, design, architecture,
data model, integrations, agent behaviour, the demo story and data, the wizard,
the build plan, the pitch.

---

## Layout

```
src/
  app/
    layout.tsx           Quorum root — fonts, tokens
    demo/                the cloned Malbank host  ← vendored
    quorum/              the workspace
  components/
    demo/                cloned Malbank components  ← vendored
    quorum/
      primitives/        generic, reusable
      overlay/           review chrome (shell)
      workspace/         the workspace frame
  lib/quorum/            typed fixture access
fixtures/                seeded demo context
docs/                    the source of truth
```

---

## Status

Foundation only. Scaffolding, design system, primitives, the cloned host, and
the application shells are in place. The collaboration layer — Convex, threads,
messages, realtime, presence, selection, the agent, Context.dev, actions, and
the demo wizard — is not built yet. See [`docs/10-BUILD_PLAN.md`](docs/10-BUILD_PLAN.md).

Placeholder states throughout say what will be there rather than showing a
zero, because nothing has been counted yet and that is not the same as having
counted nothing.
