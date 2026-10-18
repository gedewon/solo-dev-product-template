# Project instructions

Shared instructions for every coding agent working in this repo (Claude Code reads this through `CLAUDE.md`). Keep it under 150 lines: anything that only matters for part of the codebase goes in `.claude/rules/` with a `paths:` filter, and any multi-step procedure goes in a skill.

## What this project is

<!-- TODO(setup): two or three sentences. Who uses it, what it does for them, and what is in and out of scope right now. -->

## Stack

- Next.js 16 (App Router), React 19, TypeScript in strict mode
- Tailwind CSS 4, themed from the tokens in `app/globals.css`
- Vitest + Testing Library for tests
- pnpm, Node 22
<!-- TODO(setup): add Supabase, payments, email, analytics and error reporting as the project adopts them. -->

## Commands

```bash
pnpm dev           # local dev server
pnpm check         # typecheck + lint + tests: run before calling anything done
pnpm check:full    # check + production build: what CI runs
pnpm test:watch    # tests in watch mode
```

## Hard rules

1. **Authorization lives on the server.** Verify the user and check they may act on this specific resource in server code or the database. Never trust IDs, roles, prices, amounts, capacity or status sent by the client. Hiding a button is not access control.
2. **Secrets stay server-side.** No secrets in client code, logs, responses or commits. Server-only keys are never imported by a `'use client'` module.
3. **Rules that must always hold are enforced by the database** (constraints, unique indexes, transactions), not only by application code. Assume two requests can arrive at the same moment.
4. **No raw colour values in components.** Use the semantic utilities from `app/globals.css` (`bg-surface`, `text-fg-muted`). If a token is missing, add it to the token file; don't hardcode a value.
5. **Every schema change is a new migration.** Never edit a migration that has been committed.
6. **Never claim a check passed if you didn't run it.** Report what you actually verified.

## Critical areas

Changes here get the full treatment: invariants written down first, security and database reviewers, tests for concurrency and duplicates.

<!-- TODO(setup): list this product's critical areas and their invariants. Delete the example. -->

| Area | Invariants |
|---|---|
| _Example: Bookings_ | _A member books only for themselves. A slot never exceeds capacity, even under concurrent requests. One active booking per member per slot. Cancelling twice has the same effect as cancelling once._ |

Always critical, in any product: authentication, authorization and roles, payments and anything involving money, personal or sensitive data, destructive migrations.

## Critical user journeys

<!-- TODO(setup): the three to five journeys that must never break, e.g. sign up → find X → book → pay. These get end-to-end tests. -->

## Definition of done

- The requested behaviour works, including its failure states (unauthorized, invalid input, not found, conflict).
- Authorization and business rules are enforced server-side or in the database.
- Tests cover the new behaviour; a bug fix comes with a regression test.
- `pnpm check` passes. `pnpm check:full` passes for changes to routing, config, env or dependencies.
- The diff has been reviewed, and the report says what was actually run.

## Where things live

| Path | What it is |
|---|---|
| `CONTEXT.md` | Domain glossary. Created when the first term is pinned down. Use its words in code and docs. |
| `docs/adr/` | Decisions that are hard to reverse and surprising without context. |
| `docs/agents/issue-tracker.md` | How agents read and write tickets, and the label vocabulary. |
| `.claude/rules/` | Focused rules; most load only when matching files are touched. |
| `.claude/skills/` | Workflow skills: spec, tickets, implement, review, verify, ship. See `WORKFLOW.md`. |
| `.claude/agents/` | Security and database reviewers. |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
