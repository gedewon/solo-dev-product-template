# Security

## Reporting a vulnerability

Please don't open a public issue for a security problem. Use GitHub's private reporting instead: open the repository's **Security** tab and choose **Report a vulnerability**. Describe the problem, the files involved and how to reproduce it.

You should hear back within a week. Once a fix is ready, the report is published with credit to you, unless you'd rather stay anonymous.

## What counts

This repository is a template, so the most important parts to report are the ones every project inherits:

- ways around `.claude/hooks/protect-files.mjs` or the denied commands in `.claude/settings.json`
- skill or agent instructions that would lead Claude to expose secrets, weaken authorization or run destructive commands
- problems in `scripts/setup.sh` or `scripts/sync-kit.sh`, which run on contributors' machines
- vulnerable dependencies in the starter app that Dependabot hasn't flagged

## Supported versions

Only the latest commit on `main` is supported. Projects created from the template get fixes by running `scripts/sync-kit.sh`.
