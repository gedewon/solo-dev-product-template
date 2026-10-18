# Git

Protect the user's work.

- Feature and fix work goes through `/implement`: a worktree on its own branch, Conventional Commits, push, PR. Agents open PRs; the user merges.
- Before changing files, check `git status` and leave unrelated changes alone. Before finishing, review `git status` and `git diff`.
- Never force push, rewrite or amend pushed commits, reset or clean the working tree, or delete branches or files you didn't create, unless the user asks.
- Never commit `.env` files, keys, tokens, credentials or private data.

## Commit messages and PR titles

[Conventional Commits](https://www.conventionalcommits.org/): `<type>[optional scope]: <description>`.

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `revert`. Add a scope when it names the area (`fix(booking): ...`). Mark breaking changes with `!` (`feat!: ...`) or a `BREAKING CHANGE:` footer. Write the description short and imperative: "add X", not "added X".
