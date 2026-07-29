---
name: connector-health-monitor
description: Check registered FBS knowledge connectors such as Confluence, Google Drive, Flexmls MCP, GitHub, and approved websites for availability, authentication, latency, and usable results. Use for health checks and connector incident triage.
---

# Connector Health Monitor

1. Read the registered source inventory and test only enabled connectors.
2. Verify authentication, reachability, response time, expected tool availability, and a representative read query.
3. Classify each result as healthy, degraded, unauthorized, unavailable, or misconfigured.
4. Record the failing step and safe remediation guidance without exposing secrets.
5. Distinguish connector failure from empty search results.
6. Produce a source-by-source summary and identify routes affected by each failure.
