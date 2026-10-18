#!/usr/bin/env bash
# Pull the latest agent kit (skills, agents, hooks, shared rules) from the
# template repo into this project.
#
#   scripts/sync-kit.sh [--dry-run] [SOURCE]
#
# SOURCE is a local path to the template, or a git URL. Default: the source
# recorded in .claude/kit-version, else $KIT_SOURCE, else DEFAULT_KIT_SOURCE.
#
# The template's .claude/kit-manifest.txt decides what is synced:
#   replace  overwritten on every sync (directories are replaced whole)
#   seed     copied only when the project doesn't have it yet
#
# Everything runs inside main(), called on the last line, so bash has read
# the whole script before this file can be replaced by the sync itself.

set -euo pipefail

DEFAULT_KIT_SOURCE="https://github.com/gedewon/solo-dev-product-template.git"

main() {
  local dry_run=0 source=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --dry-run|-n) dry_run=1 ;;
      -h|--help) sed -n '2,15p' "$0"; return 0 ;;
      *) source="$1" ;;
    esac
    shift
  done

  local root
  root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
  local version_file="$root/.claude/kit-version"

  if [ -z "$source" ] && [ -f "$version_file" ]; then
    source="$(sed -n 's/^source=//p' "$version_file" | head -n 1)"
  fi
  source="${source:-${KIT_SOURCE:-$DEFAULT_KIT_SOURCE}}"

  local tpl tmp=""
  if [ -d "$source" ]; then
    tpl="$(cd "$source" && pwd)"
  else
    tmp="$(mktemp -d)"
    trap 'rm -rf "$tmp"' EXIT
    echo "Fetching kit from $source"
    git clone --quiet --depth 1 "$source" "$tmp/kit"
    tpl="$tmp/kit"
  fi

  if [ "$tpl" = "$root" ]; then
    echo "Source and destination are the same repo; nothing to sync." >&2
    return 1
  fi

  local manifest="$tpl/.claude/kit-manifest.txt"
  if [ ! -f "$manifest" ]; then
    echo "No .claude/kit-manifest.txt in $source" >&2
    return 1
  fi

  local added=0 updated=0 unchanged=0 skipped=0 missing=0
  local mode path src dst state
  while read -r mode path _; do
    case "$mode" in ''|'#'*) continue ;; esac
    path="${path%/}"
    src="$tpl/$path"
    dst="$root/$path"

    if [ ! -e "$src" ]; then
      echo "  missing in template  $path"
      missing=$((missing + 1))
      continue
    fi

    if [ ! -e "$dst" ]; then
      state="add"
    elif [ "$mode" = "seed" ]; then
      state="keep"
    elif diff -rq "$src" "$dst" >/dev/null 2>&1; then
      state="same"
    else
      state="update"
    fi

    case "$state" in
      same) unchanged=$((unchanged + 1)); continue ;;
      keep) echo "  kept (project-owned) $path"; skipped=$((skipped + 1)); continue ;;
      add) echo "  add                  $path"; added=$((added + 1)) ;;
      update) echo "  update               $path"; updated=$((updated + 1)) ;;
    esac

    if [ "$dry_run" -eq 0 ]; then
      mkdir -p "$(dirname "$dst")"
      rm -rf "$dst"
      cp -R "$src" "$dst"
    fi
  done < "$manifest"

  echo
  echo "added $added, updated $updated, unchanged $unchanged, project-owned $skipped, missing in template $missing"

  if [ "$dry_run" -eq 1 ]; then
    echo "Dry run: nothing was written."
    return 0
  fi

  chmod +x "$root/scripts/"*.sh 2>/dev/null || true

  local commit="unknown"
  commit="$(git -C "$tpl" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  mkdir -p "$root/.claude"
  {
    echo "source=$source"
    echo "commit=$commit"
    echo "synced=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  } > "$version_file"

  echo "Recorded kit version $commit in .claude/kit-version."
  echo "Review with 'git diff', then commit: chore: sync agent kit ($commit)"
}

main "$@"; exit
