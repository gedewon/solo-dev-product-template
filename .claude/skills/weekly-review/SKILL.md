---
name: weekly-review
description: The weekly CEO-mode review. Pulls what shipped, how it performed (PostHog), what broke (Sentry), dependency and ticket health, writes a review note into the Obsidian vault, and proposes the next two or three bets.
disable-model-invocation: true
argument-hint: "[week, default: the last 7 days]"
---

# Weekly review

Close the loop: did what we shipped last week work, what broke, and what should we bet on next? You gather and summarise; the user decides.

## 1. Where the note goes

- If `OBSIDIAN_VAULT` is set and the folder is reachable, write to `$OBSIDIAN_VAULT/Projects/<repo name>/Reviews/<YYYY>-W<ww>.md`, creating folders as needed. Write plain Markdown files directly; don't depend on the Obsidian app or its CLI being available.
- Otherwise write to `docs/reviews/<YYYY>-W<ww>.md` in the repo and mention that the vault wasn't reachable.

If a note for this week already exists (`/triage` may have appended to it), add to it rather than overwriting.

## 2. Gather

Run what's available and say what wasn't:

- **Shipped**: PRs merged in the window (`gh pr list --state merged --search "merged:>=<date>"`), with the tickets and specs they close.
- **Did it work**: for each spec that shipped, read its Success Metrics section and query PostHog (MCP) for those events and metrics: this week against the week before, or before and after release. Check active feature flags in `docs/analytics/tracking-plan.md`: which are fully rolled out and should be removed.
- **What broke**: Sentry (MCP) totals for the week: new issues, regressions, the top issues by users affected, crash-free sessions if available. Note which are already ticketed.
- **Health**: open Dependabot PRs and how old they are; open tickets by label (`ready-for-agent`, `needs-human`, `blocked`, `critical`); PRs waiting for the user's review.
- **Agent friction**: from this week's PRs and conversations, anything the agents got wrong more than once.

## 3. Write the note

Use this shape, short and factual. Call the Skill tool with "unslop" on the prose.

```markdown
---
type: weekly-review
project: <repo>
week: <YYYY>-W<ww>
tags: [review]
---

# <repo>: week <ww>

## Shipped
- <feature> ([[link to spec or PR]]): <one line on the result vs its success metric>

## Numbers
| Metric | This week | Last week | Note |

## What broke
- <issue>: <users affected>, <ticket or "not ticketed">

## Health
- Dependencies: <n open, oldest n days>
- Tickets: <n ready-for-agent, n needs-human, n blocked>
- Flags to remove: <keys>

## Lessons
- <what we learned about the product>
- <agent friction> → <proposed fix to the kit: rule, skill or hook>

## Bets for next week
1. <bet>: why, and the signal that would tell us it worked
2. ...
```

## 4. Hand back

Show the user the summary, the path to the note, and the proposed bets. Ask which bet to take on. When they pick one, suggest `/grill-with-docs` on it.

If a lesson points at the kit itself (a rule agents keep breaking, a missing check), say that the fix belongs in the template repo and should be synced to every project with `scripts/sync-kit.sh`. If the vault has a `Learnings/` folder, add a dated one-line note there too, so lessons carry across projects.
