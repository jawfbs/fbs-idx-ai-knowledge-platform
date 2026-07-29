---
name: skill-registry-manager
description: Scan the repository skills directory, validate required files and metadata, build the skill registry, update counts, and expose new skills to the FBS Knowledge Platform. Use after adding, editing, renaming, or removing skills.
---

# Skill Registry Manager

1. Scan each direct child of `/skills` containing `SKILL.md`.
2. Validate lowercase hyphenated names, YAML frontmatter, descriptions, and `agents/openai.yaml`.
3. Reject duplicate names and report invalid or incomplete skills separately.
4. Generate a deterministic registry sorted by display name with path, description, status, tags, and review metadata.
5. Update application skill counts and discovery data from the generated registry rather than hardcoded values.
6. Preserve manual metadata fields and fail safely when generation would remove registered skills unexpectedly.
