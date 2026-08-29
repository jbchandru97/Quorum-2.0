# Demo wizard / conductor

## Goal
Build a deterministic demo conductor that lets the presenter step through the scenario using keyboard navigation while still triggering natural in-app interactions and animations.

## Trigger
- Right arrow = advance to next step
- Left arrow = go back where feasible

## Important rule
Advancing a step should trigger **real UI behavior**, not simply swap entire screens. Messages should animate in, agent thinking states should appear, and thread states should update visibly.

## High-level sequence

### Step 1
Open playground in Quorum review mode.
Show bottom bar, presence, and calm initial state.

### Step 2
Highlight/select the AI insight nudge.
Open a thread.
Thread question from Designer appears naturally.

### Step 3
Agent enters thinking state and returns repo-grounded rationale answer.
Message animates in.
Optional source chip appears.

### Step 4
Designer asks usability-process question.
Agent thinking steps animate.
Agent returns internal-playbook assessment.

### Step 5
Designer asks precedent analytics question.
Agent returns seeded analytics response.

### Step 6
Designer asks undocumented rationale question.
Agent responds that it couldn’t find documented rationale.
Designer tags PM.

### Step 7
PM reply appears in real time via Convex.
Could be from a second browser window or a simulated second participant writing through the same Convex path.

### Step 8
Designer asks external-reference question.
Agent shows a real Context.dev fetch state.
Thinking steps animate.
Returned answer appears with source.

### Step 9
Designer proposes a change.
PM asks Engineer how large the change is.
Engineer responds.
PM adds timeline constraint.
Engineer suggests scoped change now + backlog later.

### Step 10
User clicks **Add to actions**.
Agent synthesizes 2 action items.
Thread can then be resolved.

### Step 11
Open actions popover from bottom bar.
Show 2 actions.

### Step 12
Transition to Quorum workspace route.
Show Threads page with list and detail pane.
Selected review shows persisted conversation and actions.

## Wizard implementation guidance
- Build a small step registry rather than hardcoding logic in components.
- Each step should know:
  - preconditions
  - action to trigger
  - wait time / completion condition
  - whether it affects Convex data
  - whether it requires external fetch
- Support re-running the sequence quickly during rehearsal.

## Safety rules
- If a live step fails (especially Context.dev), show a failure message and allow moving on.
- Keep the wizard hidden or minimal during the actual review UI.
