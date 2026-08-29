---
source: Product rationale
provenance: cited
target: ai-insight-prompt
---

# Why the AI entry point sits inside Spending Summary

The AI entry point was intentionally placed inside Spending Summary because
that is where the user is already evaluating spending. The goal was to
introduce AI where the question naturally arises, rather than asking the user
to discover a separate AI destination first.

## What is documented

- Placement inside `SpendingSummary`, adjacent to the weekly total.
- The nudge as an entry point into the assistant, not as an answer surface.
- Copy kept short so it does not compete with the spending figure.

## What is not documented

The delay before the nudge appears is present in the implementation but has no
written rationale. Anyone answering "why the delay?" from this document alone
should say so rather than infer one.
