---
name: code-review
description: 'Review the changes since a fixed point (commit, branch, tag, or merge-base) along three axes: Standards (does the code follow this repo''s documented standards?), Spec (does it match what the ticket or spec asked for?) and Risk (is it correct and safe?). Runs the reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, or work in progress, or asks to "review since X".'
---

Three-axis review of the diff between `HEAD` and a fixed point:

- **Standards**: does the code follow this repo's documented standards?
- **Spec**: does the code do what the originating ticket or spec asked for?
- **Risk**: is the code correct and safe? Security, data integrity, concurrency, error handling, regressions.

Each axis runs as a **parallel sub-agent** so they don't pollute each other's context. This skill then puts their reports side by side.

## Process

### 1. Pin the fixed point

Whatever the user said is the fixed point (a commit SHA, branch name, tag, `main`, `HEAD~5`, etc.). If they didn't name one, use the merge-base with `origin/main` and say so.

Capture the diff command once: `git diff <fixed-point>...HEAD` (three-dot, so the comparison is against the merge-base). Also note the commit list from `git log <fixed-point>..HEAD --oneline` and the changed files from `git diff --name-only <fixed-point>...HEAD`.

Confirm the fixed point resolves (`git rev-parse <fixed-point>`) and the diff is non-empty. A bad ref or an empty diff should fail here, not inside three parallel sub-agents.

### 2. Run the checks first

Run `pnpm check` (typecheck, lint, tests). If it fails, stop and report the failures. Reviewing code that doesn't compile or pass its tests wastes three sub-agents; fix first, then review.

### 3. Identify the spec source

Look for the originating spec or ticket, in this order:

1. Issue references in commit messages or the branch name (`#123`, `Closes #45`), fetched as described in `docs/agents/issue-tracker.md`. Read the body and comments. If the ticket names a parent spec, fetch that too.
2. A path the user passed as an argument.
3. A local ticket under `.scratch/<feature>/issues/` matching the branch name.
4. If nothing is found, ask the user where the spec is. If there isn't one, the Spec sub-agent is skipped and the report says "no spec available".

### 4. Identify the standards sources

- `CLAUDE.md` (and `AGENTS.md` if it exists).
- Every file in `.claude/rules/`. For a rule with `paths:` frontmatter, include it only if at least one changed file matches its globs.
- `CONTEXT.md` for domain vocabulary, and ADRs in `docs/adr/` that cover the touched area.

On top of whatever the repo documents, the Standards axis always carries the **smell baseline** below: a fixed set of Fowler code smells (_Refactoring_, ch.3) that applies even when a repo documents nothing. Two rules bind it:

- **The repo overrides.** A documented repo standard always wins; where it endorses something the baseline would flag, suppress the smell.
- **Always a judgement call.** Each smell is a labelled heuristic ("possible Feature Envy"), never a hard violation. Like any standard here, skip anything tooling already enforces.

Each smell reads _what it is_ → _how to fix_; match it against the diff:

- **Mysterious Name**: a function, variable, or type whose name doesn't reveal what it does or holds. → rename it; if no honest name comes, the design's murky.
- **Duplicated Code**: the same logic shape appears in more than one hunk or file in the change. → extract the shared shape, call it from both.
- **Feature Envy**: a method that reaches into another object's data more than its own. → move the method onto the data it envies.
- **Data Clumps**: the same few fields or params keep travelling together (a type wanting to be born). → bundle them into one type, pass that.
- **Primitive Obsession**: a primitive or string standing in for a domain concept that deserves its own type. → give the concept its own small type.
- **Repeated Switches**: the same `switch`/`if`-cascade on the same type recurs across the change. → replace with polymorphism, or one map both sites share.
- **Shotgun Surgery**: one logical change forces scattered edits across many files in the diff. → gather what changes together into one module.
- **Divergent Change**: one file or module is edited for several unrelated reasons. → split so each module changes for one reason.
- **Speculative Generality**: abstraction, parameters, or hooks added for needs the spec doesn't have. → delete it; inline back until a real need shows.
- **Message Chains**: long `a.b().c().d()` navigation the caller shouldn't depend on. → hide the walk behind one method on the first object.
- **Middle Man**: a class or function that mostly just delegates onward. → cut it, call the real target direct.
- **Refused Bequest**: a subclass or implementer that ignores or overrides most of what it inherits. → drop the inheritance, use composition.

### 5. Decide which specialists the Risk axis needs

Look at the changed files and the diff:

| The diff touches | Add |
|---|---|
| Auth, sessions, roles, permissions, user-supplied IDs, payments, webhooks, secrets, service-role or admin access, personal data, access codes | the `security-reviewer` agent |
| Migrations, schema, SQL, RLS policies, database functions, transactions, queries on capacity- or money-like values | the `database-reviewer` agent |
| Neither | no specialist; the general Risk sub-agent covers it |

A ticket or spec labelled `critical` always gets both specialists.

### 6. Spawn the sub-agents in parallel

**Standards sub-agent** prompt includes:

- The diff command, commit list and changed files.
- The standards files from step 4, **plus the smell baseline pasted in full** (the sub-agent has no other access to it).
- The brief: "Report, per file/hunk where relevant, (a) every place the diff violates a documented standard: cite the file and the rule; and (b) any baseline smell you spot: name it and quote the hunk. Distinguish hard violations from judgement calls: documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

**Spec sub-agent** prompt includes:

- The diff command and commit list.
- The path or fetched contents of the spec and ticket.
- The brief: "Report: (a) requirements or acceptance criteria that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong; (d) any Critical Invariant from the spec that is not enforced server-side or in the database. Quote the spec line for each finding. Under 400 words."

**Risk sub-agent** (general-purpose) prompt includes:

- The diff command, commit list and changed files.
- The brief: "Review this diff as an independent senior engineer. Don't assume it is correct. Look for, in priority order: security holes, incorrect logic and unhandled edge cases, data integrity problems, race conditions and duplicate requests, regressions in behaviour the diff didn't mean to change, and missing error states (unauthorized, forbidden, not found, conflict, invalid input). Report only real issues. For each: severity (critical / important / minor), location, problem, impact, fix. If the change is sound, say so. Under 400 words."

**Specialists** from step 5 run in the same parallel batch, each given the diff command, changed files and the spec's Critical Invariants if any. Their agent definitions carry their own checklists.

If the spec is missing, skip the Spec sub-agent and note it in the final report.

### 7. Aggregate

Present the reports under `## Standards`, `## Spec` and `## Risk` headings, verbatim or lightly cleaned. Specialist reports go under `## Risk` as `### Security` and `### Database`. Do **not** merge or rerank findings across axes; the axes are deliberately separate (see _Why separate axes_).

End with one line per axis: number of findings and the worst one, if any. Don't pick a single winner across axes.

When this review runs inside `/implement`, treat critical and important Risk findings and hard Standards or Spec violations as required changes. Check each finding against the actual code before fixing it; a reviewer can be wrong.

## Why separate axes

A change can pass one axis and fail another:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the ticket asked but breaks the project's conventions → **Spec pass, Standards fail.**
- Code that is on-spec and clean but lets one member book another member's slot → **Standards pass, Spec pass, Risk fail.**

Reporting them separately stops one axis from masking another.
