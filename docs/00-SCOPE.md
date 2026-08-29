# Quorum — Scope

## Product one-liner
**Quorum is the collaborative decision stack for AI-native product teams.**

## Core insight
AI has made building dramatically faster. PMs prototype in code, designers increasingly work in code, and engineers can ship with coding agents. As implementation gets cheaper and faster, the bottleneck moves to **decision-making**: understanding why something exists, validating it with the right context, aligning cross-functional stakeholders, and turning that discussion into an actionable change.

## Hackathon objective
Build a working prototype of Quorum as a **separate project/repository**. Inside the Quorum project, include a cloned copy of the existing **Malbank / Aql AI** app as the demo host application. Quorum should run the cloned Malbank experience under its own route/URL inside the new Quorum project.

## Demo surfaces
1. **Live review overlay** mounted over the cloned Malbank demo app inside the Quorum project (primary demo surface).
2. **Lightweight Quorum workspace app** with a Threads view showing persistent discussions and actions (secondary demo surface shown at the end).

## What the demo must prove
1. Teams can select an element or draw over a region in a live coded product.
2. A shared thread can be created around that selected target.
3. The agent can answer with grounded context.
4. The agent can admit uncertainty and the team can tag another human.
5. Real-time collaboration works through Convex.
6. One external-context step is powered by a **real Context.dev call**.
7. Threads can be resolved or converted into action items.
8. Actions are visible in the lightweight Quorum workspace.
9. Devin is genuinely used to build the product.

## Demo implementation rule
Build for the demonstrated scenario first. Generalize only where doing so makes the scenario easier, cleaner, or more credible.

## Pre-existing assets disclosure
- The **Malbank / Aql AI** app is a pre-existing application that will be cloned into the new Quorum project as the host/demo fixture.
- The source repo to inspect/clone is the repo corresponding to the deployed project `mal-ai-three` (`https://mal-ai-three.vercel.app`).
- The **Design Companion** reference repo corresponding to `design-companion-nu` (`https://design-companion-nu.vercel.app`) is a separate pre-existing repo used only to extract design system and reusable interaction patterns.
- Quorum itself remains a separate new project/repo.
- All Quorum collaboration/review functionality should be built during the hackathon.

## In scope for hackathon
- Quorum overlay inside the Malbank repo
- Thread creation from element selection and from region selection
- Shared thread conversation panel
- Realtime thread/message persistence via Convex
- Presence indicators / active collaborators (lightweight)
- Grounded agent responses for the scripted scenario
- Real Context.dev response for one thread
- Resolve thread
- Add to actions
- Lightweight Quorum workspace → Threads page
- Demo wizard/conductor to step through the live demo using the keyboard (right arrow)

## Out of scope for hackathon
- Full production SDK packaging or npm publishing
- Complex auth and permissions
- Full generalized analytics integrations
- Full Jira/Confluence/Notion integrations
- Full repo indexing / semantic code graph
- Multi-project admin and settings depth
- Version diffing / before-after history
- Notifications, inboxes, email digests
- Robust export / import
- Autonomous agent implementation loop that must finish live

## Long-term vision (do not build now)
In the long term, Quorum can become an SDK installed into any coded prototype or preview environment. For the hackathon, keep Quorum as a separate app/repo and embed a cloned Malbank app inside it as the review host. Do not modify the original Malbank repo.
