# Demo data

## Participants
### Designer
- Name: Maya
- Role: Designer

### PM
- Name: Rohan
- Role: PM

### Engineer
- Name: Arun
- Role: Engineer

## Target product
- Project name: Malbank / Aql AI
- Source app reference: `https://mal-ai-three.vercel.app`
- In Quorum, cloned review page should run at `/demo/playground`
- In Quorum, cloned explanation page should run at `/demo/intro`

## Selected primary target
- Target label: AI insight nudge
- Suggested breadcrumb: `Dashboard / SpendingSummary / AIInsightPrompt`

## Local rationale answer
Suggested local answer:
“The AI entry point was intentionally placed inside Spending Summary because that is where the user is already evaluating spending. The goal was to introduce AI where the question naturally arises, rather than asking the user to discover a separate AI destination first.”

## Internal design-review playbook guidance
Suggested internal criteria:
- discoverability
- clarity / transparency
- cognitive load
- consistency with existing patterns
- user control

Suggested agent assessment:
- **Pass** on discoverability
- **Needs review** on transparency because the nudge does not explain what will be analyzed before the click

## Seeded analytics precedent
Question it should answer:
“How did a similar contextual AI prompt perform elsewhere in the product?”

Suggested answer:
“The contextual AI prompt used in Monthly Insights reached **21% engagement** in its first two weeks, compared with **9%** for the persistent AI navigation entry during the same period.”

## PM undocumented rationale
Question:
“Why does the nudge appear after a delay rather than immediately?”

PM answer:
“I wanted the dashboard to establish itself first. If the AI treatment appeared immediately, it competed with the spending number the user came to see.”

## Context.dev question
Question:
“How do comparable finance products introduce an AI assistant?”

Implementation note:
Use a real Context.dev fetch/search against one or more public reference URLs or pages relevant to finance products / AI assistant patterns.

## Engineer scope answer
Question:
“How large is the copy change?”

Suggested answer:
“This component is shared across the dashboard, Monthly Insights, and the empty state. Updating the base component would affect all three surfaces and require broader validation. A dashboard-only scoped change is quick; a full shared-component update should be handled separately.”

## PM timeline constraint
“We need to move fast and show this in the customer preview this week.”

## Expected actions
### Action 1
**Title**: Update dashboard AI nudge copy
**Summary**: Clarify that Aql AI will analyze recent spending before the user enters the assistant.

### Action 2
**Title**: Refactor shared AI nudge component
**Summary**: Evaluate the shared component across all surfaces and apply a consistent transparency pattern later.
