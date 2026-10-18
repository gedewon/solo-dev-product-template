#!/usr/bin/env node
// PreToolUse hook for Edit and Write. Blocks changes that instructions alone
// can't reliably prevent. Exit code 2 blocks the tool call and sends the
// message on stderr back to Claude.
//
// Blocked:
//   - real env files (.env, .env.local, .env.production, ...); .env.example is allowed
//   - the lockfile (change dependencies with pnpm, which rewrites it)
//   - anything inside .git/
//   - editing a committed migration (write a new migration instead)

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // not our business if the payload is unreadable
}

const filePath = input?.tool_input?.file_path;
if (typeof filePath !== 'string' || filePath === '') process.exit(0);

const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const abs = path.resolve(projectDir, filePath);
const rel = path.relative(projectDir, abs).split(path.sep).join('/');
const base = path.posix.basename(rel);

function block(reason) {
  process.stderr.write(`Blocked edit to ${rel}: ${reason}\n`);
  process.exit(2);
}

if (/^\.env(\..+)?$/.test(base) && base !== '.env.example') {
  block('env files hold real secrets. Add new variables to .env.example and ask the user to set the value.');
}

if (base === 'pnpm-lock.yaml') {
  block('the lockfile is generated. Change dependencies with pnpm add/remove/update instead.');
}

if (rel === '.git' || rel.startsWith('.git/') || rel.includes('/.git/')) {
  block('never edit git internals directly.');
}

// A migration that is committed may already have run somewhere. One you just
// created and haven't committed yet is still yours to fix.
function isCommitted(file) {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', file], { cwd: projectDir, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (/(^|\/)supabase\/migrations\/[^/]+\.sql$/.test(rel) && existsSync(abs) && isCommitted(abs)) {
  block('this migration is committed and may already have run. Create a new migration instead of editing it.');
}

process.exit(0);
