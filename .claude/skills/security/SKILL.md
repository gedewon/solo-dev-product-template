---
name: security
description: Run a focused security review of the current changes with the security-reviewer agent.
disable-model-invocation: true
argument-hint: "[fixed point, default: merge-base with origin/main]"
---

Run the `security-reviewer` agent on the diff between `HEAD` and the fixed point the user gave (default: the merge-base with `origin/main`). Pass it the diff command, the list of changed files, and the Critical Invariants from the related spec or ticket if there is one.

Relay its report as it is: confirmed vulnerabilities, likely risks, optional hardening. Don't fix anything unless the user asks.
