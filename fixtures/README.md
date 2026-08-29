# Fixtures

Local demo context for the scripted scenario in `/docs/07-DEMO_STORY.md`.

Per `/docs/05-INTEGRATIONS.md`, some things must be live for the hackathon
and some may be seeded. This folder is the seeded half, and it is labelled
so the UI never has to imply otherwise.

| Path | Stands in for | Provenance mark |
|---|---|---|
| `context/` | repo understanding — product rationale, component map | `cited` |
| `internal/` | the team's own design-review playbook | `cited` |
| `analytics/` | precedent metrics from a comparable pattern | `fetched` |
| `seed/` | demo participants and the reviewable preview | — |

**Not in here, and must not be:** the Context.dev step. That one is a real
request at demo time (`/docs/05-INTEGRATIONS.md` §2). If it fails, the thread
shows the failure and stays usable — it never falls back to a canned answer,
because a fabricated external source is the one guardrail in
`/docs/06-AGENT_BEHAVIOR.md` with no exceptions.

Analytics here are precedent for a *comparable* pattern, never metrics for the
new interaction itself. The copy in `analytics/precedent.json` says so, and
should keep saying so wherever it is surfaced.
