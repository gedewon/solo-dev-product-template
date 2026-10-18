#!/usr/bin/env node
// Checks that the agent kit is internally consistent. Run with `pnpm check:kit`.
//
// It fails when:
//   - a skill or agent has no frontmatter, no name or no description
//   - a skill's name differs from its folder name
//   - a skill tells Claude to call a skill that doesn't exist, or one that only
//     the user can start (disable-model-invocation: true)
//   - a Markdown link inside a skill points at a missing file
//   - a doc mentions a repo path in backticks that doesn't exist
//   - a doc names a *-reviewer agent that doesn't exist
//   - .claude/kit-manifest.txt lists a missing file, or misses a skill or rule
//   - .claude/settings.json or .mcp.json isn't valid JSON

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const problems = [];
const fail = (file, msg) => problems.push(`${relative(root, file) || file}: ${msg}`);

function walk(dir, keep) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === "worktrees") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p, keep));
    else if (keep(p)) out.push(p);
  }
  return out;
}

function frontmatter(file) {
  const m = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fields = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-z-]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return fields;
}

// Skills and agents
const skillsDir = join(root, ".claude/skills");
const skills = {};
for (const name of existsSync(skillsDir) ? readdirSync(skillsDir) : []) {
  const file = join(skillsDir, name, "SKILL.md");
  if (!existsSync(file)) continue;
  const fm = frontmatter(file);
  if (!fm) { fail(file, "no frontmatter"); continue; }
  if (!fm.name || !fm.description) fail(file, "frontmatter needs name and description");
  else if (fm.name !== name) fail(file, `name "${fm.name}" doesn't match folder "${name}"`);
  skills[name] = { userOnly: fm["disable-model-invocation"] === "true" };
}
const agentsDir = join(root, ".claude/agents");
for (const file of walk(agentsDir, p => p.endsWith(".md"))) {
  const fm = frontmatter(file);
  if (!fm || !fm.name || !fm.description) fail(file, "agent frontmatter needs name and description");
}

// Skill-to-skill calls and links inside skills
for (const file of walk(skillsDir, p => p.endsWith(".md"))) {
  const text = readFileSync(file, "utf8");
  const calls = [...text.matchAll(/Skill tool (?:with|twice, for) "([a-z-]+)"(?: and "([a-z-]+)")?/g)].flatMap(m => [m[1], m[2]]).filter(Boolean);
  for (const target of calls) {
    if (!skills[target]) fail(file, `calls missing skill "${target}"`);
    else if (skills[target].userOnly) fail(file, `calls "${target}", which only the user can start`);
  }
  for (const [, link] of text.matchAll(/\]\(([^)#:]+\.md)\)/g)) {
    if (!existsSync(join(dirname(file), link))) fail(file, `broken link ${link}`);
  }
}

// Repo paths and agents mentioned in docs
const docs = [
  ...["README.md", "WORKFLOW.md", "AGENTS.md", "CLAUDE.md", "CONTRIBUTING.md", "SECURITY.md"].map(f => join(root, f)).filter(existsSync),
  ...walk(join(root, "docs"), p => p.endsWith(".md")),
  ...walk(join(root, ".claude"), p => p.endsWith(".md")),
  ...walk(join(root, ".github"), p => p.endsWith(".md")),
];
// Paths that are examples or that only exist after setup.
const allowed = new Set([".claude/kit-version", ".claude/skills/booking-domain/", "docs/reviews/"]);
for (const file of docs) {
  const text = readFileSync(file, "utf8");
  for (const [, p] of text.matchAll(/`((?:docs|\.claude|scripts|\.github|app|lib)\/[A-Za-z0-9_./-]+)`/g)) {
    if (/[<*]|NNNN|NN-/.test(p) || allowed.has(p)) continue;
    if (!existsSync(join(root, p.replace(/\/$/, "")))) fail(file, `mentions missing path ${p}`);
  }
  for (const [, agent] of text.matchAll(/`([a-z-]+-reviewer)`/g)) {
    if (!existsSync(join(agentsDir, `${agent}.md`))) fail(file, `mentions missing agent ${agent}`);
  }
}

// Kit manifest
const manifestFile = join(root, ".claude/kit-manifest.txt");
if (existsSync(manifestFile)) {
  const manifest = readFileSync(manifestFile, "utf8");
  for (const line of manifest.split("\n")) {
    const [mode, p] = line.trim().split(/\s+/);
    if ((mode === "replace" || mode === "seed") && !existsSync(join(root, p.replace(/\/$/, "")))) fail(manifestFile, `lists missing ${p}`);
  }
  for (const name of Object.keys(skills)) {
    if (!manifest.includes(`.claude/skills/${name}/`)) fail(manifestFile, `doesn't list skill ${name}`);
  }
  for (const file of walk(join(root, ".claude/rules"), p => p.endsWith(".md"))) {
    const p = relative(root, file);
    if (!manifest.includes(p)) fail(manifestFile, `doesn't list rule ${p}`);
  }
}

// JSON config
for (const f of [".claude/settings.json", ".mcp.json"]) {
  const file = join(root, f);
  if (!existsSync(file)) continue;
  try { JSON.parse(readFileSync(file, "utf8")); } catch (e) { fail(file, `invalid JSON: ${e.message}`); }
}

if (problems.length) {
  console.error(`Kit check failed with ${problems.length} problem(s):\n` + problems.map(p => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`Kit check passed: ${Object.keys(skills).length} skills, ${walk(agentsDir, p => p.endsWith(".md")).length} agents, ${docs.length} docs.`);
