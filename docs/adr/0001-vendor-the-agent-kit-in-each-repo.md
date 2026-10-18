# Vendor the agent kit in each repo instead of a plugin

The workflow skills, reviewer agents, hooks and rules are copied into each project's `.claude/` folder and updated with `scripts/sync-kit.sh`, rather than installed as a Claude Code plugin. Cloud sessions (claude.ai/code) don't load plugins, neither user-installed nor enabled in the repo's settings, but they do load the repo's own `.claude/` folder, so a plugin would leave the workflow missing whenever work runs in the cloud.

## Consequences

Kit files can drift if someone edits them inside a project. `CLAUDE.md` says not to, `.claude/kit-manifest.txt` lists which files the kit owns, and `.claude/kit-version` records which template commit a project last synced from. Fixes go into the template first, then get synced.
