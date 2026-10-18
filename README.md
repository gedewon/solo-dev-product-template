# Solo dev product template

A Next.js starter with an AI development workflow built in. Claude Code shapes ideas into specs, slices specs into tickets, builds each ticket test-first in its own worktree, reviews its own work on three axes, and opens a pull request. You make the product decisions and merge.

`WORKFLOW.md` explains the day-to-day loop. This file covers setup and maintenance.

## Start a new project

1. On GitHub, click **Use this template** to create the new repo, then clone it.
2. Run the setup script:

   ```bash
   corepack enable          # once per machine, provides pnpm
   scripts/setup.sh my-app
   ```

   It renames the package, creates `.env.local`, installs dependencies, creates the GitHub labels the workflow uses, and runs `pnpm check:full`.
3. Fill in the `TODO(setup)` sections in `AGENTS.md`: what the product is, its critical areas and their invariants, and its critical user journeys. The workflow leans on these.
4. Commit, including `pnpm-lock.yaml`, and push.
5. In Claude Code, run `/setup-observability` to add Sentry and PostHog, merge its PR, then run `/mcp` to sign in to both. Set up Obsidian once per machine (see `WORKFLOW.md`).
6. Run `/grill-with-docs` with your first feature idea.

## What's inside

```
AGENTS.md                      shared instructions for every coding agent
CLAUDE.md                      imports AGENTS.md, adds the Claude workflow
WORKFLOW.md                    the human guide to the loop
.claude/
  skills/                      grill-with-docs, to-spec, to-tickets, implement, tdd,
                               verify, code-review, security, db-review, ship,
                               setup-observability, triage, weekly-review,
                               grilling, domain-modeling, codebase-design,
                               improve-codebase-architecture, unslop
  agents/                      security-reviewer, database-reviewer
  rules/                       git and architecture load always; typescript, nextjs,
                               security, supabase, testing and observability load
                               only for matching files
  hooks/protect-files.mjs      blocks edits to .env files, the lockfile, .git/, committed migrations
  settings.json                command allowlist, denied commands, hook registration
  kit-manifest.txt             which files the kit owns
.mcp.json                      Sentry and PostHog MCP servers for the agents
docs/
  agents/issue-tracker.md      how agents use GitHub Issues, and the label set
  analytics/tracking-plan.md   every analytics event and feature flag
  adr/                         decisions; two to start with
scripts/
  setup.sh                     one-time project setup
  sync-kit.sh                  pull kit updates into a project
.github/                       CI (pnpm check:full), Dependabot, PR and issue templates
app/, lib/                     a minimal Next.js 16 app with design tokens and one test
```

## Design choices

- **Instructions are short and scoped.** Only `AGENTS.md`, `CLAUDE.md` and two rules load in every session. The rest load when matching files are touched, or when a skill runs. Each checklist lives in exactly one place: security in the `security-reviewer` agent, database in `database-reviewer`, verification in `verify`.
- **Risk decides process.** `/implement` sorts work into Simple, Normal, Cross-cutting and Critical. Critical work writes its invariants down before any code and always gets both specialist reviewers.
- **Review has three axes.** Standards, Spec and Risk run in parallel and are reported separately, so a clean, on-spec change with a security hole still fails.
- **Enforce what matters.** The hook and the denied commands can't be talked around. Instructions cover the rest. See "What enforces what" in `WORKFLOW.md`.
- **Agents open PRs; you merge.** Merging is a denied command.
- **The kit lives in each repo.** Cloud sessions don't load plugins, but they do load a repo's `.claude/` folder. See `docs/adr/0001-vendor-the-agent-kit-in-each-repo.md`.
- **The loop closes.** Specs name a success metric and its events, `/implement` adds them, `/triage` turns Sentry errors and Dependabot PRs into tickets, and `/weekly-review` checks the metric and writes the result to Obsidian. Sentry and PostHog are installed by `/setup-observability` with the vendors' own wizards, so the SDK code is always current.
- **Product integrations are added when needed.** Supabase, payments and email are not pre-wired. Wire them in the first project that needs them, then pull the proven setup back into this template.

## Maintain the kit

The kit is the set of files listed in `.claude/kit-manifest.txt`.

- **Improve it here.** Edit skills, agents, rules or the hook in this repo and commit.
- **Pull it into a project.** In the project, run `scripts/sync-kit.sh --dry-run`, then `scripts/sync-kit.sh`, review the diff, and commit. The script records the source and commit in `.claude/kit-version`.
- **Adopt it in an existing repo.** Copy `scripts/sync-kit.sh` into that repo and run it with this template's path or URL as the argument. `replace` files are written; `seed` files are added only where missing. Then remove the repo's older duplicates of the same workflows, and make sure its `CLAUDE.md` imports `AGENTS.md`.

If your template repo isn't `github.com/gedewon/solo-dev-product-template`, change `DEFAULT_KIT_SOURCE` in `scripts/sync-kit.sh` and `KIT_SOURCE` in `scripts/setup.sh`.

## Rewritten reference files

Three reference files that the original skills linked to were missing, so they were rewritten for this template. Each is marked at the top. Replace them if you find the originals:

- `.claude/skills/codebase-design/DEEPENING.md`
- `.claude/skills/codebase-design/DESIGN-IT-TWICE.md`
- `.claude/skills/improve-codebase-architecture/HTML-REPORT.md`
