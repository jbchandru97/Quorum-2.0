# Architecture

## Repository model
Quorum is a **new standalone project/repository**. Do not build Quorum inside either source repository.

Claude Code has access to the user's GitHub repositories and should use two existing repos as sources:

1. **Malbank / Aql AI source repo**
   - identify the repo corresponding to the deployed app `mal-ai-three`
   - deployed reference: `https://mal-ai-three.vercel.app`
   - clone/copy the relevant application into the new Quorum project as an embedded demo app
   - do not alter the original repo

2. **Design Companion reference repo**
   - identify the repo corresponding to the deployed app `design-companion-nu`
   - deployed reference: `https://design-companion-nu.vercel.app`
   - inspect its source to extract design tokens, fonts, interaction primitives, hover inspection behavior, loading/shimmer patterns, agent multi-step states, motion, and reusable UI structure
   - do not clone its product logic wholesale; only recreate reusable design/interaction primitives inside Quorum

## Target project structure

```text
quorum/
  app/ or src/
    quorum/                  # Quorum workspace app
    demo/                    # cloned Malbank host app routes
  components/
    quorum/
      overlay/
      threads/
      agent/
      workspace/
      primitives/
  lib/
    integrations/
    demo/
  docs/
  fixtures/
  public/
```

## Runtime surfaces

### A. Quorum workspace
Standalone Quorum UI. Suggested route:
- `/quorum` or `/`

Contains the lightweight Threads experience.

### B. Embedded Malbank demo app
A cloned copy of Malbank runs **inside the Quorum project** under a separate route, for example:
- `/demo/playground`
- `/demo/intro`

The Quorum overlay is mounted on top of this cloned host app.

This means the demo stays entirely inside the new Quorum deployment and never depends on modifying the original Malbank deployment.

## Design Companion extraction
Before creating Quorum primitives, inspect the Design Companion repo and write refined findings into `02-DESIGN.md`. Extract/rebuild reusable primitives such as:
- inspect hover outline
- mode toolbar patterns
- shimmer/loading states
- agent thinking / multi-step UI
- floating panels and overlays
- typography/tokens
- motion/easing conventions

Do not copy unrelated screens or business logic.

## State ownership
### UI-local state
- current review mode
- hover target
- active selection
- side-panel state
- wizard step

### Convex-backed state
- previews
- threads
- messages
- presence
- actions
- thread status

## Agent layer
Thin orchestration layer for the scripted scenario:
- local repo/fixture context
- internal-process fixture docs
- seeded analytics
- real Context.dev request
- human replies through Convex

## Selection anchors
Support:
- element anchors
- region anchors

## Demo wizard
Keep the wizard/controller isolated from real product components. It should trigger the same interactions the user could perform manually.

## Important boundaries
- Never edit the original Malbank repo as part of Quorum implementation.
- Never edit the original Design Companion repo.
- Quorum owns all new code.
- The cloned Malbank app is a demo fixture inside Quorum.
- The Design Companion repo is a reference source for reusable design/interaction patterns.
