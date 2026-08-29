# Prompt runbook

## Today — Prompt 1 (Claude Code)

```text
You are setting up the FOUNDATION for a new standalone hackathon project called **Quorum**.

Quorum must be its OWN new project/repository. Do NOT build Quorum inside any existing repository.

You have access to my GitHub repositories. Use that access to locate and inspect these two existing projects:

1. **Malbank / Aql AI**
   - identify the GitHub repo corresponding to the deployed app: https://mal-ai-three.vercel.app
   - this is the host/demo product
   - clone/copy the relevant app into the NEW Quorum project so it runs as an internal demo surface under Quorum-owned routes such as `/demo/intro` and `/demo/playground`
   - preserve the existing Malbank interactions and visual behavior
   - DO NOT modify or commit changes back to the original Malbank repo

2. **Design Companion**
   - identify the GitHub repo corresponding to the deployed app: https://design-companion-nu.vercel.app
   - inspect this repo deeply to extract reusable design and interaction patterns
   - specifically inspect: exact fonts, typography scale, tokens, hover/inspect interaction, selection treatment, floating toolbar behavior, loading/shimmer animation, agent thinking states, multi-step agent progress, response reveal/stream behavior, side panels/popovers, motion timing/easing, icon usage, spacing, radii, and layering/z-index patterns
   - update `/docs/02-DESIGN.md` with the concrete implementation findings
   - rebuild useful reusable primitives inside Quorum
   - DO NOT modify the original Design Companion repo and DO NOT copy unrelated product/business logic

Before doing any implementation, read every file in `/docs` in numeric order and treat those files as the source of truth.

IMPORTANT HACKATHON BOUNDARY FOR TODAY:
Today you are ONLY allowed to prepare scaffolding, design system, generic reusable components, cloned demo-host setup, and basic application shells. DO NOT build Quorum's core collaboration functionality today.

TODAY'S WORK:
1. Create/initialize the standalone Quorum project structure.
2. Pull the Malbank source app into Quorum as the embedded demo application at `/demo/*`.
3. Verify `/demo/intro` and `/demo/playground` run from the Quorum project.
4. Inspect Design Companion source and refine `02-DESIGN.md`.
5. Recreate generic reusable UI primitives based on Design Companion:
   - overlay root/shell
   - floating toolbar shell
   - generic inspect highlight primitive (visual primitive only)
   - side-panel shell
   - popover/tooltip primitives
   - avatar stack primitive
   - shimmer/loading primitive
   - agent multi-step/loading presentation primitive
   - source chip primitive
6. Create the lightweight Quorum workspace shell:
   - left sidebar with Threads / Users / Settings
   - two-column Threads-page shell
   - placeholder states only
7. Create/organize local fixture docs/data that tomorrow's build will use.
8. Ensure everything is visually coherent and runnable.

DO NOT IMPLEMENT TODAY:
- Convex setup/schema
- real threads/messages
- realtime multiplayer
- real presence behavior
- selection creating threads
- region drawing creating threads
- agent routing/answers
- Context.dev calls
- action synthesis
- Resolve/Add to actions behavior
- demo wizard

At the end, report:
- which source repos you identified
- what you cloned from Malbank into Quorum
- what design/interaction patterns you extracted from Design Companion
- what foundation components were created
- what remains for tomorrow
```

## Tomorrow — Prompt 2 (Devin)

```text
We are now building the ACTUAL Quorum hackathon prototype.

Quorum is a standalone repo. The repo already contains:
- a cloned Malbank/Aql AI demo app under `/demo/*`
- generic reusable design/interaction primitives extracted from the Design Companion repo
- `/docs` describing the complete product and demo scenario

Read every `/docs` file in numeric order and treat them as the source of truth.

The original source repos must remain untouched:
- Malbank source reference: repo corresponding to https://mal-ai-three.vercel.app
- Design Companion reference: repo corresponding to https://design-companion-nu.vercel.app

Now build Quorum's actual hackathon functionality inside this Quorum repo.

REQUIRED REAL INTEGRATIONS:
1. Convex must be real for persistence + realtime collaboration.
2. The scripted external-reference interaction must use a real Context.dev request.
3. Devin is genuinely being used as the coding agent for this build.

BUILD ORDER:
1. Follow `/docs/10-BUILD_PLAN.md`.
2. Set up Convex schema/queries/mutations.
3. Build real selection/draw → thread flow over `/demo/playground`.
4. Build thread panel, messages, realtime updates, and presence.
5. Implement scenario-specific agent/context behavior.
6. Implement the real Context.dev step.
7. Implement Resolve and Add to actions.
8. Build the lightweight Quorum workspace Threads page.
9. Build the right-arrow demo wizard/conductor.
10. Harden the full scripted flow for the 3-minute demo.

Favor the scripted scenario over generalization. Do not expand scope.

When done, provide:
- implemented feature summary
- exact Context.dev live flow
- Convex schema/data flow summary
- known limitations
- exact demo rehearsal steps
```

## Tomorrow — Prompt 3 (optional hardening)

```text
Polish and harden the existing Quorum hackathon prototype without adding major scope.

Focus only on:
- animation smoothness
- thread/presence clarity
- wizard reliability
- Context.dev loading/failure handling
- workspace readability
- small UX fixes required for a clean 3-minute demo

Do not add new product areas.
```
