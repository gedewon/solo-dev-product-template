---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.mts"
---

# TypeScript

- Strict mode stays on. No `any`; use `unknown` and narrow it.
- No `as` casts to silence the compiler, and no `@ts-ignore` or `@ts-expect-error` without a comment explaining why.
- Validate external input (requests, environment, third-party responses, database JSON) at the boundary, then work with typed values inside.
- Prefer domain types over primitives: a `BookingStatus` union, not a `string`.
- Make impossible states unrepresentable where it's cheap: discriminated unions over several optional booleans.
- Make nullability explicit and handle it where it arises.
- One definition per type. Derive related types (`Pick`, `Omit`, `z.infer`) instead of copying them.
