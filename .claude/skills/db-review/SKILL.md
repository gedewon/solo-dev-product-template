---
name: db-review
description: Run a focused database review of the current changes with the database-reviewer agent.
disable-model-invocation: true
argument-hint: "[fixed point, default: merge-base with origin/main]"
---

Run the `database-reviewer` agent on the diff between `HEAD` and the fixed point the user gave (default: the merge-base with `origin/main`). Pass it the diff command, the changed migrations, schema and query files, and the Critical Invariants from the related spec or ticket if there is one.

Relay its report as it is. Don't fix anything unless the user asks.
