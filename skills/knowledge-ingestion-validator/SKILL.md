---
name: knowledge-ingestion-validator
description: Validate documents and source batches before ingestion by checking format, extraction, authority, duplication, permissions, metadata, freshness, and test retrieval.
---
# Knowledge Ingestion Validator
1. Verify source ownership, allowed audience, format, and extraction quality.
2. Check duplicates, stale versions, missing metadata, and restricted sections.
3. Run representative retrieval tests against expected content.
4. Return pass, conditional pass, or fail with remediation steps.
5. Never ingest secrets or unsupported private customer data.
