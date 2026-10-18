#!/usr/bin/env bash
# One-time setup for a new project created from this template.
#
#   scripts/setup.sh [project-name]
#
# Renames the package, records where the agent kit comes from, installs
# dependencies, creates the GitHub labels the workflow uses, and runs the
# checks once so you know the starting point is green.

set -euo pipefail

KIT_SOURCE="${KIT_SOURCE:-https://github.com/gedewon/ai-product-template.git}"

root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$root"
name="${1:-$(basename "$root")}"

step() { printf '\n==> %s\n' "$1"; }

step "Checking tools"
node_major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
if [ "$node_major" -lt 22 ]; then
  echo "Node 22 or newer is required (found: $(node -v 2>/dev/null || echo none))." >&2
  exit 1
fi
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found. Run: corepack enable" >&2
  exit 1
fi
echo "node $(node -v), pnpm $(pnpm -v)"

step "Naming the package: $name"
node -e '
  const fs = require("fs");
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  pkg.name = process.argv[1];
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
' "$name"

step "Recording the kit source"
mkdir -p .claude
if [ ! -f .claude/kit-version ]; then
  printf 'source=%s\ncommit=initial\nsynced=%s\n' "$KIT_SOURCE" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > .claude/kit-version
fi
cat .claude/kit-version

step "Local environment"
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example. Fill in real values there; it is gitignored."
else
  echo ".env.local already exists; left alone."
fi

step "Installing dependencies"
pnpm install

step "Creating GitHub labels"
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1 && gh repo view >/dev/null 2>&1; then
  gh label create spec            --color 5319e7 --description "Feature spec from /to-spec" --force
  gh label create ready-for-agent --color 0e8a16 --description "Ticket an agent can pick up with /implement" --force
  gh label create blocked         --color b60205 --description "Waiting on another issue" --force
  gh label create needs-human     --color fbca04 --description "Needs a product or architecture decision" --force
  gh label create critical        --color d93f0b --description "Touches a critical area in AGENTS.md" --force
  gh label create bug             --color d73a4a --description "Something is broken" --force
else
  echo "Skipped: gh is not installed, not logged in, or this repo has no GitHub remote yet."
  echo "Run this script again after 'gh auth login' and pushing to GitHub."
fi

step "Running the checks"
pnpm check:full

cat <<'EOF'

Setup complete. Next:
  1. Fill in the TODO(setup) sections in AGENTS.md: what the product is,
     its critical areas and invariants, and its critical journeys.
  2. Commit pnpm-lock.yaml with the rest: git add -A && git commit -m "chore: set up project"
  3. Start the first feature with /grill-with-docs in Claude Code.
EOF
