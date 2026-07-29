---
name: failed-search-recovery
description: Recover unanswered or low-confidence FBS searches by retrying approved alternate terminology, related sources, broader routes, and fallback connectors. Use when the primary search returns no usable answer.
---

# Failed Search Recovery

1. Preserve the original question and failed route details.
2. Retry with product aliases, abbreviations, error text, likely synonyms, and narrowed entities.
3. Expand to approved fallback sources in authority order without bypassing permissions.
4. Stop after the configured retry limit or when evidence quality declines.
5. Return the best supported result, attempted routes, and remaining uncertainty.
6. Send unresolved cases to `knowledge-gap-triage` and log the recovery outcome.
