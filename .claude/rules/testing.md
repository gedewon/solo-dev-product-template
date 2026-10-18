---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "vitest.config.mts"
  - "vitest.setup.ts"
---

# Testing

How to write tests is in the `tdd` skill. In short:

- Test behaviour through public interfaces, not implementation details.
- Expected values come from an independent source (a literal, a worked example, the spec), never recomputed the way the code computes them.
- Mock only at system boundaries (external APIs, time, randomness). Test database behaviour against a real local database.
- Test files sit next to the code: `thing.ts` and `thing.test.ts`. Import from `vitest` explicitly.
- Highest value first: authorization, the critical invariants in `CLAUDE.md`, then the critical user journeys.
- A bug fix starts with a failing test that reproduces it.
