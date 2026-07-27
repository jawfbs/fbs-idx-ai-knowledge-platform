---
name: prompt-router
description: Route employee questions in the FBS Knowledge Platform to the best available skill, connector, or source. Use when a request may belong to Flexmls Help, listing search, internal company knowledge, support response generation, analytics, or another registered workflow.
---

# Prompt Router

1. Classify the request by intent, entity, product, and required action.
2. Read the active route registry before choosing a destination.
3. Prefer the most specific matching skill over a general search route.
4. Route Flexmls how-to, settings, permissions, subscriptions, and error questions to `flexmls-help-router`.
5. Route property and listing criteria to `flexmls-listing-search`.
6. Route requests to draft customer-facing support content to `idx-support-response` after facts are verified.
7. Route unresolved, repeated, contradictory, or low-confidence questions to `knowledge-gap-triage` in addition to returning the best available answer.
8. Use company knowledge search for internal policies, processes, projects, decisions, and documentation not covered by a product-specific skill.
9. Never silently fall back when a connector or source is unavailable. State the failed route and use the next authorized route.
10. Log the selected route, confidence, latency, source set, and whether the question was answered.
11. When confidence is below the configured threshold, present the best-supported answer and mark it for review rather than inventing certainty.
