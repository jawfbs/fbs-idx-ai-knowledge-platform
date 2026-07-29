---
name: idx-authorization-validator
description: Validate MLS authorization, participant approval, account ownership, and required documentation before IDX activation or account changes. Use during onboarding, transfer, reactivation, or troubleshooting.
---

# IDX Authorization Validator

1. Identify the customer, MLS, participant, office, product, domain, and requested change.
2. Compare submitted authorization against current MLS and FBS requirements.
3. Confirm signer authority, account ownership, required fields, and approval status.
4. Separate complete, incomplete, expired, conflicting, and unverifiable authorization.
5. Return missing items and the responsible party for each next action.
6. Never treat payment or a sales agreement as MLS authorization unless the governing rule explicitly allows it.
