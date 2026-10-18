# Issue tracker

How agents read and write tickets in this repo. `/to-spec`, `/to-tickets`, `/implement` and `code-review` all follow this file.

## Tracker: GitHub Issues via `gh`

Use the `gh` CLI against this repo's remote.

| Action | Command |
|---|---|
| Read an issue with comments | `gh issue view <n> --comments` |
| List open agent work | `gh issue list --label ready-for-agent --state open` |
| Create | `gh issue create --title "<title>" --body-file <file> --label <label>[,<label>]` |
| Add or remove labels | `gh issue edit <n> --add-label <l>` / `--remove-label <l>` |
| Comment | `gh issue comment <n> --body-file <file>` |

Write bodies to a temporary file and pass `--body-file`; long bodies passed inline break on quoting.

**Blocking edges.** Put a `## Blocked by` section in the body listing `#<n>` references (or "None"). While any blocker is open, the ticket also carries the `blocked` label; whoever closes the last blocker removes it. A ticket is workable when it is open, labelled `ready-for-agent`, and every issue in its `Blocked by` list is closed.

**Linking work.** A spec issue lists its tickets in a `## Tickets` section. Each ticket names its spec in a `## Parent` section. PRs say `Closes #<ticket>`.

## Labels

| Label | Meaning |
|---|---|
| `spec` | A feature spec from `/to-spec`. Not implemented directly. |
| `ready-for-agent` | A ticket an agent can pick up with `/implement` once its blockers are closed. |
| `blocked` | Waiting on another issue. |
| `needs-human` | Needs a product or architecture decision before work continues. Say what decision in a comment. |
| `critical` | Touches a critical area in `AGENTS.md`. Gets invariants up front and both specialist reviewers. |
| `bug` | Something broken. Starts with a failing regression test. `/triage` creates these from Sentry. |
| `dependencies` | Dependabot PRs. `/triage` reviews them; the user merges. |

`scripts/setup.sh` creates these labels.

## Local fallback

When `gh` is unavailable or not authenticated, use local files instead and tell the user:

- Specs: `.scratch/<feature-slug>/spec.md`
- Tickets: `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered in dependency order, with the same sections as the GitHub body plus a `**Status:**` line holding the label.

`.scratch/` is gitignored. Move the work to GitHub once `gh` is available.
