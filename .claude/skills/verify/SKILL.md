---
name: verify
description: Run the project's real checks (typecheck, lint, tests, and build when asked) and report PASS or FAIL honestly. Use before calling any work done, before review, and whenever the user asks to verify or check the code.
---

# Verify

Prove the current state of the code with the project's own commands. Never claim a check passed if you didn't run it.

## 1. Find the commands

Read the `scripts` in `package.json`. This template defines:

- `pnpm check`: kit consistency, typecheck, lint, unit and integration tests
- `pnpm check:full`: `check` plus the production build

Use those. If the project has added more (`test:e2e`, `db:test`), run the ones relevant to the change. Only run commands that exist; never invent one.

## 2. Run

- Default: `pnpm check`.
- Run `pnpm check:full` when the change touches routing, config, environment variables, server/client boundaries or dependencies, when called from `ship`, or when the user asks for a build.
- If the change touches the database and the project has database tests, run them too.

## 3. On failure

For each failure, record: the command, the error, the root cause, the fix, and the rerun result. Fix and rerun until it passes or you are blocked. Don't skip, disable or weaken a test to make it pass. If a test is wrong, say why before changing it.

## 4. Report

Finish with exactly one of:

```
VERIFICATION: PASS
<each command run, one per line>
```

```
VERIFICATION: FAIL
<failing command>: <reason>
```
