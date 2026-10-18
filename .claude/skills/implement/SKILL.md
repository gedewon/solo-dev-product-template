---
name: implement
description: Implement a ticket, spec or described change end to end. Worktree, risk triage, TDD, verification, three-axis review, then a pull request for the user to merge.
disable-model-invocation: true
argument-hint: "[ticket number, ticket path, or a description of the change]"
---

# Implement

Take one piece of work from "ready" to "pull request open". The user merges; you never do.

The argument is a ticket reference (`#42`, a `.scratch/.../issues/NN-*.md` path) or a plain description. Run the steps in order without stopping to ask permission between them. Stop only at the gates in step 2 and the approval list at the end.

## 1. Load the context

- Ticket or spec: read the full body and comments (see `docs/agents/issue-tracker.md`). If the ticket names a parent spec, read it too. If any of its blockers are still open, stop and say which.
- `CONTEXT.md` for domain vocabulary, and ADRs in `docs/adr/` for the area you'll touch.
- The code you'll change and its existing tests. Follow the patterns already there.

## 2. Triage the risk

Pick the tier from what the change touches, not from how small the diff looks:

| Tier | When | What changes in this run |
|---|---|---|
| **Simple** | Copy, styling, docs, an obvious one-file fix, a rename | Skip the plan. Still verify and review. |
| **Normal** | Changes app behaviour inside existing boundaries | Plan only if there's no spec or ticket. |
| **Cross-cutting** | New tables or endpoints, new permissions, external integrations, background jobs, caching | Plan, and expect the Risk axis to pull in specialists. |
| **Critical** | Any critical area listed in `CLAUDE.md`: auth, authorization, payments, money, capacity or concurrency-sensitive writes, access control, sensitive data, destructive migrations | Write the invariants first (below). Both specialists review. |

A ticket labelled `critical` is Critical. Never downgrade a critical change because the implementation looks easy. If you discover risk partway through (a race condition, a permission gap), move up a tier and say so.

**Plan gate.** For Normal and Cross-cutting work that came as a plain description with no spec or ticket, write a short plan before coding: goal, approach, modules touched, data changes, security impact, seams to test, risks. Show it and wait for a go-ahead. Skip this when the user already said to go ahead or the work comes from a ticket.

**Invariants gate.** For Critical work, list the invariants before coding: who may do this, what must always be true, what happens when two requests hit the same resource at once, what happens when the same request arrives twice, and where each rule is enforced (database constraint, transaction, server check). Take them from the spec's Critical Invariants section if it has one. If the spec doesn't cover them, show the list and wait for confirmation.

## 3. Isolate the work

Work in a separate worktree on a new branch, never on the branch that is checked out, even if it looks fine.

- Fetch first: `git fetch origin`.
- Use Claude Code's built-in worktree support if it is available. Otherwise: `git worktree add .claude/worktrees/<slug> -b <type>/<slug> origin/main`, then work inside it.
- Branch name: Conventional Commits type plus a short slug, e.g. `feat/gym-search`, `fix/double-booking`. Include the ticket number when there is one: `feat/42-gym-search`.

If the main checkout has uncommitted changes, leave them alone and mention them in your final report.

## 4. Build

Call the Skill tool with "tdd" and work in vertical slices at the seams the spec or ticket names. Run the typechecker and the single test file you're working on as you go. Keep the scope to what the ticket asks; note unrelated problems for the report instead of fixing them.

## 5. Verify

Call the Skill tool with "verify". Do not continue while it reports FAIL: diagnose, fix, verify again.

## 6. Review

Call the Skill tool with "code-review" against the merge-base with `origin/main`. For each finding, check it against the actual code; a reviewer can be wrong. Fix the valid ones, then run "verify" again and re-review only the areas you changed. Repeat until no required changes remain.

## 7. Ship the branch

1. Commit using Conventional Commits (`feat(search): add gym search by neighbourhood`). Several focused commits are fine.
2. Push: `git push -u origin <branch>`.
3. Open the PR with `gh pr create`. Title: the same Conventional Commits form. Body: follow `.github/pull_request_template.md`, including `Closes #<ticket>` when there is one, the tier, the invariants for Critical work, the review summary per axis, and the verification commands you actually ran with their results.
4. Remove the worktree once the push succeeded; the branch lives on the remote.

If push or PR creation fails, say so and stop. Don't work around it.

## Final report

```
PR: <link>
Tier: <tier> (and why)
Implemented: <what changed, in user terms>
Review: Standards <n findings>, Spec <n>, Risk <n>; what was fixed, what was deliberately left
Verification: <commands run and their result>
Not done / follow-ups: <anything out of scope you noticed>
```

Never claim a check passed if you didn't run it.

## Stop and ask before

- a destructive migration, or anything that changes or deletes production data
- changing how authentication or payments work
- adding a major dependency
- an architectural decision that would be hard to reverse

For each, say what will change, the impact, how to roll it back, and how you'll verify it. Ordinary implementation choices inside the existing architecture don't need approval.
