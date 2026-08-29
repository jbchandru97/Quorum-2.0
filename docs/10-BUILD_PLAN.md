# Build plan

## Build strategy
Start from the docs. Build the smallest credible version that fully supports the scripted scenario.

## Phase 0 — Read and inspect
1. Read all docs in numeric order.
2. Use GitHub access to locate the repo corresponding to `mal-ai-three`; inspect it as the source Malbank app.
3. Use GitHub access to locate the repo corresponding to `design-companion-nu`; inspect it for design and interaction patterns.
4. Clone/copy the required Malbank application into the new Quorum project under `/demo` routes without modifying the original repo.
5. Update `02-DESIGN.md` with concrete design-system findings from Design Companion.
6. Identify where the Quorum overlay should mount over the cloned Malbank app.
7. Identify the specific UI target used in the demo.

### Acceptance criteria
- understanding of routes/pages used in demo
- understanding of target components
- implementation plan updated mentally or in notes

## Phase 1 — Project foundation
1. Set up Quorum as its own standalone project/repo.
2. Integrate the cloned Malbank app as an internal demo surface at `/demo/*`.
3. Rebuild reusable design/interaction primitives extracted from Design Companion inside Quorum.
4. Create base shells for overlay and workspace.
5. Establish global styles/tokens using the refined design guidance.

### Acceptance criteria
- project runs
- overlay shell renders
- workspace route renders

## Phase 2 — Convex
1. Set up Convex project.
2. Define schema for previews, threads, messages, actions, presence.
3. Create essential queries/mutations.

### Acceptance criteria
- thread can be created and read back
- message can be added and read back
- action can be created and read back

## Phase 3 — Overlay interaction
1. Build bottom bar.
2. Build element hover/selection.
3. Build region drawing selection.
4. Build thread markers.
5. Build side thread panel.

### Acceptance criteria
- user can open a thread from element selection
- user can open a thread from region selection
- side panel shows thread data from Convex

## Phase 4 — Realtime collaboration
1. Add realtime thread/message updates.
2. Add lightweight presence indicators.
3. Ensure second browser window reflects changes.

### Acceptance criteria
- two windows stay in sync for thread/message changes
- presence is visible enough for demo

## Phase 5 — Agent UX
1. Build agent message component.
2. Build multi-step thinking UI.
3. Support source chips.
4. Implement thread composer patterns.

### Acceptance criteria
- agent messages look polished
- loading/thinking states animate clearly

## Phase 6 — Scenario-specific context adapters
1. Repo/local rationale adapter.
2. Internal process guidance adapter.
3. Seeded analytics precedent adapter.
4. Human-mention path.

### Acceptance criteria
- all scripted non-web questions can be answered in the demo
- unknown question path supports tagging a human

## Phase 7 — Real Context.dev step
1. Implement a real Context.dev call.
2. Wire the result into one scripted thread.
3. Show source attribution.

### Acceptance criteria
- actual Context.dev response appears in-thread
- failure is handled gracefully

## Phase 8 — Actions
1. Add **Resolve**.
2. Add **Add to actions**.
3. Synthesize action items from thread discussion.
4. Show actions count and list.

### Acceptance criteria
- action items are created and visible
- thread can be resolved

## Phase 9 — Workspace
1. Build minimal sidebar.
2. Build Threads page two-column layout.
3. Show preview/review list.
4. Show selected review detail with thread conversation and actions.

### Acceptance criteria
- workspace clearly shows persisted threads and actions

## Phase 10 — Demo wizard
1. Build step-based conductor.
2. Wire keyboard controls.
3. Trigger natural UI sequences.
4. Ensure demo can be rehearsed repeatedly.

### Acceptance criteria
- right-arrow guided demo works end-to-end
- messages and agent responses animate, not jump

## Phase 11 — Hardening
1. Clean visual rough edges.
2. Ensure all demo steps still work.
3. Rehearse the live pitch and transitions.

### Acceptance criteria
- 3-minute demo runs reliably
- no dead ends or missing data
