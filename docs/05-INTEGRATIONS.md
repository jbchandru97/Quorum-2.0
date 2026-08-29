# Integrations

## Integration principle
Only some integrations must be truly live for the hackathon. Others can be scenario-specific or seeded.

## Must be real

### 1. Convex
Use real Convex for:
- storing previews
- storing threads
- storing messages
- storing actions
- tracking status changes
- presence / active collaborators if shown
- realtime updates between browser windows

### 2. Context.dev
At least one thread must trigger a **real** Context.dev request.

#### Demo requirement
A user asks for an external reference / competitor pattern question.
The app should:
1. show agent thinking steps
2. call a backend/server action that hits Context.dev
3. receive actual response data
4. transform the result into an in-thread answer
5. show visible source attribution/chips

## Can be seeded / local for the scenario

### 3. Internal docs
Can be local markdown/JSON fixtures or local repo docs representing:
- design review playbook
- product rationale
- prior decisions

### 4. Analytics
Can be seeded scenario data representing precedent metrics from a similar pattern.
It should feel real in the UI, but does not need a live Amplitude/PostHog integration.

### 5. Repo understanding
For the demo, it is acceptable to use curated local markdown/source mappings rather than fully generalized codebase indexing.

## Devin
Devin is used to build the project during the hackathon.
If time permits, the final UI may include a simple “send actions to coding agent” affordance, but the demo should not depend on a live autonomous implementation completing.

## Suggested integration points

### Repo / local context adapter
Functions such as:
- find rationale for selected target
- find component usage for selected target
- find internal review process guidance

### Analytics adapter
Functions such as:
- get precedent pattern metric
- get interaction summary by known key

### Context.dev adapter
Functions such as:
- search / fetch competitor or public reference content
- transform raw result into concise answer + source metadata

## Failure behavior
- If Context.dev fails, show clear error and keep thread usable.
- If local context not found, agent should say it couldn’t find it.
- Never fabricate certainty.
