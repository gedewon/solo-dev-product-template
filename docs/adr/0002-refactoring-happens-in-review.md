# Refactoring happens in review, not in the TDD loop

The `tdd` skill runs red → green only; refactoring moves to the `code-review` stage. Agents that refactor inside the loop tend to churn code between cycles and widen the diff, and a separate review pass, with fresh context and the smell baseline, finds better refactors than the agent that just wrote the code.

## Consequences

Cleanups accumulate until review, so review must act on Standards findings rather than only list them. `/implement` treats hard Standards violations as required changes before the PR opens.
