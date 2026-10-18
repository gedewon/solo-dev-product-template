---
name: setup-observability
description: One-time setup of Sentry (errors) and PostHog (product analytics, feature flags) in this project, using each vendor's official wizard, then brought in line with the repo's privacy, environment and testing rules. Ends with a PR.
disable-model-invocation: true
argument-hint: "[sentry | posthog | both]  (default: both)"
---

# Set up observability

Install Sentry and PostHog with their official wizards, so the code matches the current SDKs, then tighten what the wizards generate to fit this repo. Run once per project.

## 0. Isolate and check

- Work in a worktree on `chore/observability`, as in `/implement` step 3.
- If either tool is already installed (check `package.json` for `@sentry/nextjs`, `posthog-js`, `posthog-node`), skip its wizard and go straight to its review in step 3.

## 1. Run the wizards

Both wizards sign in through the browser, so the user runs them. Ask the user to run each command in this session with the `!` prefix, from the worktree, and wait for each to finish:

```
! npx @sentry/wizard@latest -i nextjs
! npx -y @posthog/wizard@latest
```

Tell them what to choose when asked:

- **Sentry**: yes to tracing and source-map upload; no to session replay for now; no to the example page (or delete it after).
- **PostHog**: let it instrument the client and the server. Decline the MCP install; this repo's `.mcp.json` already has it.

If the user is in a session where they can't run commands (a cloud session), stop and ask them to run this skill from a local session.

## 2. Read what changed

`git status` and `git diff`. List every file the wizards added or changed. Read all of it before editing; don't assume the generated code matches these notes, since SDKs change.

## 3. Bring it in line with this repo

**Secrets and environment**

- The wizards may write keys into `.env`, `.env.local` or `.env.sentry-build-plugin`. Make sure every such file is gitignored (`.env*` covers most; add `.env.sentry-build-plugin` if needed). The hook blocks you from editing them, which is intended.
- Add every variable the code now reads to `.env.example`, with a comment saying where it comes from and whether it is public (`NEXT_PUBLIC_*`) or server-only. The Sentry auth token for source maps is server-only and belongs in the CI and hosting secrets, not in the repo.
- Tell the user which variables to set in GitHub Actions secrets and in the hosting provider.

**Privacy**

- Sentry: `sendDefaultPii` is `false`. No request bodies or cookies attached. Set `environment` from an env var so production and preview errors stay apart.
- PostHog: create person profiles for identified users only; mask all inputs if session recording is on; identify users by internal ID, never by email.
- Note in the PR that the privacy policy should mention both tools.

**Tests and local dev**

- Neither SDK sends anything when `NODE_ENV` is `test`. Guard the init calls, or point them at a no-op in `vitest.setup.ts`.
- Decide with the user whether development sends events. Default: Sentry off in development, PostHog on with a separate dev project or off.

**Ad blockers (PostHog)**

- If the wizard didn't set one up, add a reverse proxy through a Next.js rewrite (`/ingest` → PostHog's ingest host for the user's region) so events aren't lost to ad blockers. Check PostHog's current Next.js docs for the exact host names.

**Errors and flags**

- Errors in Server Components, Server Actions and route handlers reach Sentry. Add a `global-error.tsx` if the wizard didn't.
- Add a small server-side helper for reading feature flags, so `/implement` has one obvious way to gate a rollout.

## 4. Tracking plan and decision

- Add the events the wizard instrumented to `docs/analytics/tracking-plan.md`. Rename any that don't follow `object_verb` past tense.
- Write `docs/adr/NNNN-sentry-and-posthog.md`: why these two tools, what is captured, what is deliberately not captured.

## 5. Verify and ship

Call the Skill tool with "verify", running the full build. Then commit (`chore: add Sentry and PostHog`), push, and open a PR that lists the environment variables the user must set and where. Remove the worktree after the push.

## 6. Connect the agents

Tell the user to run `/mcp` once in Claude Code and authenticate the `sentry` and `posthog` servers from `.mcp.json`. After that, `/triage` and `/weekly-review` can read errors and metrics.
