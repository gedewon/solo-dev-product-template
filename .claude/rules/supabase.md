---
paths:
  - "supabase/**"
  - "lib/supabase/**"
  - "**/*.sql"
---

# Supabase

Supabase is both infrastructure and a security boundary.

- Use the right client for the context: the browser client in client code, the server client in server code, the service-role client only in server-only modules, and only after your own authorization check.
- Every user-reachable table has RLS enabled and an intentional policy per operation. For each table, answer: who can read, create, update and delete, and which relationship proves it? Never add a permissive policy to get unblocked.
- Rules that must always hold are database constraints (`not null`, `unique`, `check`, foreign keys), not application checks.
- Assume concurrent requests. Capacity-limited and counter-like writes must be atomic: one statement, a row lock, a constraint, or a database function.
- Several related writes go in one transaction.
- Every schema change is a new migration in `supabase/migrations/`. Never edit a migration that has already run (a hook blocks it); write a new one. Never change the production schema by hand.
- Add indexes for real query patterns, after checking an existing index doesn't already cover them.
- Regenerate database types after a schema change if the project uses generated types.

The full review checklist lives in the `database-reviewer` agent.
