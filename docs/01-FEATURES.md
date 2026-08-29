# Features

## Surface A — Review overlay (primary)

### 1. Bottom control bar
Persistent minimal bottom floating bar with:
- review mode controls: **Select** and **Draw**
- thread count
- open/resolved filter access
- action count
- active user avatars / presence
- entry point to all threads

#### Requirements
- Should feel light and secondary to the product canvas.
- Must remain visible throughout the demo.
- Clicking counts or dropdowns opens lightweight overlays, not full-page transitions.

### 2. Element selection
User can hover interactive UI and select a concrete element.

#### Behavior
- Hover shows inspect-style outline.
- Click attaches thread to a specific element anchor.
- Selection chip should show contextual breadcrumbs if available (e.g. Dashboard / SpendingSummary / AIInsightPrompt).

### 3. Region draw selection
User can drag to mark a region if they are not technically fluent enough to pick a DOM element.

#### Behavior
- Mouse drag draws a clean overlay rectangle.
- Releasing opens a thread anchored to the region.
- Region selection is acceptable for non-precise feedback.

### 4. Thread bubbles
Every selection creates a visible bubble / marker on the canvas.

#### Behavior
- Marker opens the thread in the side panel.
- Open thread marker is visually stronger than inactive ones.
- Resolved markers can be hidden or shown through filter controls.

### 5. Side thread panel
Primary conversation surface.

#### Contents
- selected target summary
- thread title / short label
- conversation messages
- agent messages and human replies in same thread
- composer with mention support
- actions: **Resolve** and **Add to actions**

#### Requirements
- Must support a mixed conversation from agent + PM + Designer + Engineer.
- Messages should render in a clean, readable, product-review style.
- Agent source chips should be visible when relevant.

### 6. Presence
Lightweight awareness only.

#### Requirements
- Show 3 participants: PM, Designer, Engineer.
- Presence can appear in bottom bar and/or thread panel.
- Enough to communicate multiplayer behavior.

### 7. Thread list / filters
Accessible from bottom bar.

#### Requirements
- View Open threads
- View Resolved threads
- View Actions
- Thread list items show title, status, target, participants, and last activity.

## Surface B — Agent behavior inside threads

### 8. Grounded answer from local repo/context
For the scripted scenario, the agent must be able to answer using local markdown/source context.

### 9. Internal company-process answer
Agent can answer a question like “validate this against our usability review process” using a local/internal document fixture.

### 10. External evidence via Context.dev
At least one thread must trigger a real Context.dev request and present the returned insight in-thread.

### 11. Human fallback
When the agent cannot answer, it should say so clearly and encourage tagging a human.

### 12. Action synthesis
When user clicks **Add to actions**, the agent summarizes the thread and creates a concise action item:
- what should change
- target
- scope / constraints
- acceptance guidance

## Surface C — Quorum workspace app (secondary)

### 13. Left sidebar
Tabs:
- Threads (working)
- Users (visual only)
- Settings (visual only)

### 14. Threads page
Two-column layout.

#### Left column
List of reviews / threads with filters.
Show:
- preview/project name
- preview URL/domain
- open/resolved counts
- participants
- action count
- last activity

#### Right column
Selected review/thread details.
Show:
- preview name
- open preview link
- participants
- summary counts
- expandable thread conversations
- action items created from those threads

## Thread actions and statuses

### Thread statuses
- Open
- Resolved

### Action states (hackathon-level)
- Created
- Pending (optional visual only)

## Essential edge cases
- Thread created from region instead of element still works.
- Agent can fail gracefully and still keep the conversation usable.
- Resolved threads should not disappear forever; they must be filterable.
- If a thread creates actions, thread can still be resolved.
