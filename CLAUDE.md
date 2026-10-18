# CLAUDE.md

The shared project instructions live in AGENTS.md so every coding agent reads the same rules. This import loads them:

@AGENTS.md

## How work flows here

Most work goes through these skills. `WORKFLOW.md` explains them for humans.

| Step | Skill | Who starts it |
|---|---|---|
| Sharpen an idea | `/grill-with-docs` | the user |
| Write it down | `/to-spec` | the user |
| Slice it into tickets | `/to-tickets` | the user |
| Build one ticket or change | `/implement` | the user |
| Release check | `/ship` | the user |
| Test-first loop | `tdd` | `/implement`, or when the user asks |
| Run the checks | `verify` | before calling anything done |
| Three-axis review | `code-review` | `/implement`, or when the user asks |

For a small change the user asks for directly (copy, styling, a one-line fix), skip the ceremony: make the change, run `pnpm check`, and say what you ran.

## Kit-managed files

Skills, agents, hooks and most rules come from the project template and are updated with `scripts/sync-kit.sh` (the list is in `.claude/kit-manifest.txt`). Don't hand-edit those files here; improvements go into the template, then get synced. Project-specific skills and rules use their own file names, for example `.claude/skills/booking-domain/`.
