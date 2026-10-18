---
name: ship
description: Final production-readiness gate before a release. Runs the full verification, checks migrations, secrets, environment variables and operational basics, and reports what is verified and what risk remains. Never deploys unless the user explicitly asks.
disable-model-invocation: true
---

# Ship

The last check before a release. Its job is to say plainly whether this is ready and why, not to deploy.

## 1. Know what's going out

- `git status` and the diff against the last release tag (or `origin/main` if there are no tags).
- The PRs and tickets in that range. Note any labelled `critical`.

## 2. Verify

Call the Skill tool with "verify" and run the full build (`pnpm check:full`). Run end-to-end tests if the project has them. A failure here means NOT READY.

## 3. Check what tests don't catch

**Code**
- No debug output left behind (`console.log`, `debugger`, commented-out blocks) in the diff.
- No secrets in the diff or in client code. Server-only keys are not imported anywhere under client components.
- Expected failures have user-facing states: loading, empty, error, unauthorized, forbidden.

**Database** (if migrations changed)
- Every schema change is a migration; no edits to migrations that already ran.
- Migrations are safe to run on production data: no unguarded drops, renames or `NOT NULL` additions on populated tables without a backfill.
- New tables have RLS enabled with an intentional policy.
- For anything risky, run the `database-reviewer` agent on the migration range.

**Security** (if any change in range is labelled `critical` or touches auth, payments or permissions)
- Run the `security-reviewer` agent on the range.

**Operations**
- Every environment variable the code reads is listed in `.env.example` and set in the deploy target.
- Errors reach whatever error reporting the project uses.
- There is a rollback path: previous deploy, migration down-steps or a forward fix plan.

## 4. Report

```
STATUS: READY | NOT READY

Changed:
- ...

Verified:
- <command or check>: <result>

Remaining risks:
- ...
```

Report READY only when every check above passed or was genuinely not applicable. Say which were not applicable and why.

Do not deploy, run production migrations or change production data unless the user explicitly asks in this conversation. When they do, first state what will change, the impact, the rollback plan and how you'll confirm it worked.
