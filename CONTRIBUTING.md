# Contributing

Thanks for helping improve the template. Most contributions change the agent kit: the skills, agents, rules and hook in `.claude/`. A few change the starter app or the docs.

## Before you start

- For a bug, a typo or a small fix, open a pull request directly.
- For a new skill, a change to how a skill behaves, or anything that changes the workflow, open an issue first with the **Kit change** template. Say what goes wrong today and what should happen instead. Changes to the workflow affect every project that syncs the kit, so it helps to agree on the behaviour before writing it.

## Set up

```bash
git clone https://github.com/gedewon/solo-dev-product-template.git
cd solo-dev-product-template
corepack enable
pnpm install
pnpm check:full
```

`pnpm check` runs the kit check, typecheck, lint and tests. `pnpm check:full` adds the production build. CI runs the same steps on every pull request.

## How the repo is organised

| Path | What it is | Owned by |
|---|---|---|
| `.claude/skills/`, `.claude/agents/`, `.claude/rules/`, `.claude/hooks/` | The agent kit | the kit; synced into projects |
| `WORKFLOW.md`, `docs/workflow/loop.html`, `scripts/sync-kit.sh`, `scripts/check-kit.mjs` | Kit docs and tools | the kit; synced into projects |
| `.claude/settings.json`, `.mcp.json`, `.github/`, `docs/agents/`, `docs/analytics/` | Starting points | each project after the first sync |
| `AGENTS.md`, `CLAUDE.md`, `app/`, `lib/` | The starter project | each project from day one |

`.claude/kit-manifest.txt` lists every kit file. A file marked `replace` is overwritten in every project on each sync, so a change to it reaches everyone. A file marked `seed` is copied once.

## Changing a skill

A skill is a folder in `.claude/skills/` with a `SKILL.md` and, sometimes, reference files.

1. Keep the frontmatter valid: `name` matches the folder, and `description` says when to use the skill. Add `disable-model-invocation: true` when only the user should start the skill, such as `/implement` or `/ship`.
2. A skill can call another skill with the phrase `call the Skill tool with "name"`. The called skill must exist and must not be user-only. `pnpm check:kit` checks both.
3. Put each checklist in one place. If a rule already lives in an agent or another skill, point to it instead of copying it.
4. Write instructions in plain, direct sentences. Run the `unslop` skill on new prose.
5. Test the change in a real project. Create a scratch project from the template, or use one you already have, and pull in your branch:

   ```bash
   scripts/sync-kit.sh /path/to/your/clone-of-this-repo
   ```

   Then run the skill in Claude Code on a small, realistic task, and describe what happened in the pull request.

## Adding a skill, rule or agent

- Add the new path to `.claude/kit-manifest.txt`. `pnpm check:kit` fails if a skill or rule is missing from it.
- Give a rule that only matters for some files a `paths:` list in its frontmatter, so it loads only when those files are touched.
- Add the skill to the table in `CLAUDE.md` and the command table in `WORKFLOW.md`. If it changes the loop, update the diagram in `WORKFLOW.md` and the step data in `docs/workflow/loop.html`.

## Pull requests

- Branch from `main`, and name the branch after the change: `feat/triage-labels`, `fix/sync-kit-spaces`.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and the pull request title, for example `feat(skills): add a release-notes skill`.
- Fill in the pull request template. List the checks you actually ran; a reviewer reads that section first.
- Keep each pull request to one change. Small pull requests get reviewed sooner.

## Known gaps

Three reference files that two skills link to were rewritten for this template, because the originals were missing. Each is marked at the top. Pull requests that improve them are welcome:

- `.claude/skills/codebase-design/DEEPENING.md`
- `.claude/skills/codebase-design/DESIGN-IT-TWICE.md`
- `.claude/skills/improve-codebase-architecture/HTML-REPORT.md`

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
