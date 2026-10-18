---
paths:
  - "app/**"
  - "components/**"
  - "proxy.ts"
  - "next.config.ts"
---

# Next.js

This is Next.js 16. APIs have changed since most training data: `middleware.ts` is now `proxy.ts`, and request APIs such as `cookies()`, `headers()` and `params` are async. When unsure, read the guide in `node_modules/next/dist/docs/` before writing code, and heed deprecation warnings.

- Server Components by default. Add `'use client'` only for state, effects, event handlers or browser APIs, and push it as far down the tree as possible.
- Secrets, service-role clients, privileged queries and authorization logic stay in server code. Mark server-only modules with `import 'server-only'` (add the `server-only` package the first time you need it) so an accidental client import fails the build.
- Use one mutation pattern per project (Server Actions or Route Handlers) and follow whichever is already there.
- Every async user-facing flow handles loading, empty, error, unauthorized and forbidden states.
- Don't add caching until you know how fresh the data must be.
- Don't ship work you don't need to the client: no large client components, no duplicate requests, no fetching whole tables to show a few rows.
