# How work moves through this repo

You describe outcomes and make the product and architecture decisions. Claude plans, builds, tests, reviews and opens pull requests. You merge.

## The loop

```text
idea ──/grill-with-docs──▶ shared understanding (+ CONTEXT.md, ADRs)
     ──/to-spec─────────▶ spec issue
     ──/to-tickets──────▶ ticket issues, sliced vertically, with blockers
     ──/implement #N────▶ worktree → TDD → verify → three-axis review → PR
     ──you review & merge
     ──/ship────────────▶ release readiness report
```

## Commands

| You want to | Run | What happens |
|---|---|---|
| Think a feature through | `/grill-with-docs` | Claude interviews you in rounds, one decision branch at a time, with a recommended answer for each question. Domain terms go into `CONTEXT.md` as they settle; hard-to-reverse decisions can become ADRs. |
| Write it down | `/to-spec` | Turns the conversation into a spec issue: problem, solution, user stories, implementation and testing decisions, critical invariants, out of scope. Asks you one thing: which seams to test at. |
| Plan the build | `/to-tickets` | Slices the spec into tickets that each cut through every layer and can be demoed alone, with blocking edges. You approve the breakdown before anything is published. |
| Build | `/implement #42` or `/implement add a logout button` | Works in a separate worktree, triages risk, builds test-first, runs the checks, reviews on three axes, fixes what the review finds, opens a PR. |
| Check a change | `/code-review` | Standards, Spec and Risk reviews in parallel, reported side by side. |
| Focused review | `/security`, `/db-review` | Runs one specialist reviewer on the current diff. |
| Release | `/ship` | Full build, migration and secrets checks, operational basics. Reports READY or NOT READY. Never deploys unless you ask. |
| Find structural problems | `/improve-codebase-architecture` | Finds shallow modules worth deepening, shows them in an HTML report, then grills you on the one you pick. |

For a tiny change (copy, colour, one obvious line), just ask. Claude still runs `pnpm check`.

## Risk tiers

`/implement` sorts every change into a tier, which decides how much process it gets:

| Tier | Examples | Extra steps |
|---|---|---|
| Simple | copy, styling, docs | none beyond verify and review |
| Normal | a new screen, a filter, a form | a short plan if there's no ticket |
| Cross-cutting | a new table, endpoint, integration or permission | plan; specialists join the review when the diff needs them |
| Critical | anything in the Critical areas of `AGENTS.md` | invariants written first; security and database reviewers always run |

## When Claude stops to ask

It will stop for:

- a plan or a set of invariants it needs you to confirm
- destructive migrations, production data, authentication or payment behaviour, major new dependencies, and architecture that is hard to reverse

Answer these on purpose. They are the decisions that are yours.

It will not stop to ask whether to push or open a PR; that is the agreed default.

## What enforces what

| Mechanism | Strength | Used for |
|---|---|---|
| `.claude/hooks/protect-files.mjs` | Enforced. Blocks the edit. | `.env` files, the lockfile, `.git/`, committed migrations |
| `.claude/settings.json` permissions | Enforced. Denied commands never run. | force push, hard reset, merging PRs, pushing migrations to the linked database |
| CI (`.github/workflows/ci.yml`) | Enforced on every PR | typecheck, lint, tests, build |
| `AGENTS.md`, rules, skills | Instructions. Claude follows them, but nothing forces it. | everything else |

If a rule keeps getting broken, move it up this table.

## Adding project knowledge

- **Domain words**: let `domain-modeling` record them in `CONTEXT.md` during grilling, or ask Claude to add one.
- **A complex domain** (bookings, billing): create `.claude/skills/<domain>-domain/SKILL.md` with a `name`, a `description` saying when to use it, the entities, the invariants and the edge cases. Keep the invariants in `AGENTS.md` too, so they are always loaded.
- **A rule for one part of the code**: add a file to `.claude/rules/` with `paths:` frontmatter so it loads only when those files are touched.

## Keeping the kit up to date

The skills, agents, hooks and shared rules come from the template repo. To pull improvements into this project:

```bash
scripts/sync-kit.sh --dry-run   # see what would change
scripts/sync-kit.sh             # apply, then review with git diff
```

Improve the kit in the template repo, not here, so every project gets the fix.
