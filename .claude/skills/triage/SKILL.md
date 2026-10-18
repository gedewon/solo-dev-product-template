---
name: triage
description: Turn new production errors (Sentry) and pending dependency updates (Dependabot PRs) into a short, prioritised list of tickets and merge recommendations. Creates bug tickets; never merges or fixes anything itself. Safe to run on a schedule.
disable-model-invocation: true
argument-hint: "[since, default: 24h]"
---

# Triage

Look at what changed in production and in dependencies since the last run, and turn it into work the loop can pick up. You create tickets and recommendations. You don't fix code, merge PRs or resolve Sentry issues.

The window defaults to the last 24 hours; the user can pass another (`7d`).

## 1. Production errors (Sentry)

If the `sentry` MCP server isn't connected or authenticated, say so, skip to step 2, and tell the user to run `/mcp`.

1. List unresolved issues that are new or regressed in the window, in the production environment. Note for each: title, first and last seen, event count, users affected, release, culprit.
2. Drop noise: errors from browser extensions or bots, and issues already linked to an open GitHub issue (search open issues for the Sentry issue ID or short ID).
3. For each remaining issue, read the latest event's stack trace and breadcrumbs. Find the code it points to.
4. Rank by users affected first, then by whether it touches a critical area in `AGENTS.md`, then by frequency.
5. For each issue worth fixing, create a GitHub issue following `docs/agents/issue-tracker.md`:
   - title: what the user experiences, not the exception name
   - labels: `bug`, plus `critical` if it touches a critical area, plus `ready-for-agent` when the cause and the fix location are clear, otherwise `needs-human`
   - body: what happens and to whom, the Sentry link and short ID, a stack trace excerpt (a few frames, no personal data), the likely cause with file references, and acceptance criteria that start with "a regression test reproduces the error"
6. Add a comment on the Sentry issue linking the GitHub issue, if the MCP server allows it.

## 2. Dependency updates (Dependabot)

1. `gh pr list --label dependencies --state open --json number,title,url,statusCheckRollup`.
2. For each PR, check CI status and what kind of update it is.
   - **Grouped minor and patch, CI green**: recommend merging.
   - **Major update**: read the package's release notes or changelog for breaking changes. Search the codebase for the APIs that changed. Recommend merging, or create a `ready-for-agent` ticket describing the migration work.
   - **CI red**: read the failure. Create a ticket for the fix, or recommend closing if the update is unnecessary.
   - **Security update**: list first, whatever its size.
3. Don't merge, approve or close anything.

## 3. Report

```
## Triage <date> (<window>)

### Errors
| Rank | Issue | Users | Ticket | Status |
...
Ignored: <n> (why)

### Dependencies
| PR | Update | CI | Recommendation |
...

### Suggested next step
<the single most important thing, e.g. "/implement #57">
```

If the project keeps an Obsidian vault (see `weekly-review`), append this report to that week's note too.
