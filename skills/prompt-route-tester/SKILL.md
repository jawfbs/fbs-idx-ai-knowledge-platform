---
name: prompt-route-tester
description: Test configured FBS prompt routes with representative questions and report incorrect classifications, weak confidence, missing coverage, and fallback behavior. Use after route changes or before release.
---

# Prompt Route Tester

1. Load enabled routes, priorities, thresholds, and representative test questions.
2. Run positive, negative, ambiguous, and connector-failure cases.
3. Compare selected routes and confidence against expected outcomes.
4. Report false positives, false negatives, collisions, and uncovered intents.
5. Recommend precise route or trigger changes with regression tests.
6. Do not approve a route set that silently falls back or bypasses authorization rules.
