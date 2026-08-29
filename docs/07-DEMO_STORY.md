# Demo story

## Setup
The PM created the first coded prototype of the Aql AI / Malbank flow and shared it for review. The team is now reviewing that prototype inside Quorum.

## Roles
- **Designer**: primary reviewer who opens the first threads
- **PM**: creator of v1, responds with product intent and timeline constraints
- **Engineer**: joins when implementation scope is discussed

## Core thesis to demonstrate
The running product becomes a shared decision surface where humans and AI collaborate using context from the repo, internal docs, precedent metrics, and the outside web.

## Story beats

### Beat 1 — repo-grounded rationale
Designer selects the AI nudge in the Spending Summary area and asks why it was introduced there.

Agent answers using local product rationale.
Thread can be resolved after answer is understood.

### Beat 2 — internal design-process guidance
Designer asks to validate the interaction against the team’s usability review process.

Agent looks up internal playbook guidance and returns a concise assessment.
This establishes that the agent is grounded in the company’s own review process, not just generic heuristics.

### Beat 3 — precedent analytics
Designer asks how a similar contextual AI prompt performed elsewhere in the product.

Agent returns a seeded analytics precedent answer.
This provides evidence without claiming metrics for the brand-new interaction itself.

### Beat 4 — question the agent cannot answer
Designer asks why the nudge appears after a delay rather than immediately.

Agent says it found the behavior but not the documented rationale.
Designer tags the PM.
PM replies live with the intended rationale.
This proves multiplayer collaboration and honest uncertainty.

### Beat 5 — external reference via Context.dev
Designer asks how comparable finance products introduce an AI assistant.

Agent performs a real Context.dev request and returns external evidence.
This is the real Context.dev moment.

### Beat 6 — implementation scope discussion
Designer proposes improving the copy so the nudge explains what Aql AI will analyze before the user clicks.
PM asks the Engineer how big the change is.
Engineer replies that the base component is shared and changing it everywhere would affect multiple surfaces.
PM adds a timeline constraint: the team needs a fast customer-facing update.
Engineer proposes a scoped change now plus a follow-up cleanup later.

### Beat 7 — actions and resolution
The thread is converted into action items:
1. update dashboard AI nudge copy now
2. refactor shared component later

Resolve the thread.

### Beat 8 — Quorum workspace reveal
Open the lightweight Quorum workspace and show that all threads, statuses, and actions persist there.
