---
paths:
  - "app/**"
  - "lib/**"
  - "components/**"
  - "supabase/**"
  - "proxy.ts"
---

# Security

Every request is untrusted, including ones from logged-in users.

- Verify the user on the server, then check they may act on this specific resource. Authentication is "who are you"; authorization is "may you do this". Do both.
- Never take user IDs, roles, ownership, prices, amounts, capacity or status from the client. Derive them on the server.
- Hiding a button is not access control.
- Validate request bodies, params, form data, uploads and webhook payloads on the server.
- Never log, return or bundle secrets. Never log passwords, tokens or more personal data than needed.
- Webhooks: verify signatures, make handlers idempotent, and trust the provider's payment state, not the client's.
- Return friendly errors. Never expose raw database errors or stack traces.

The full review checklist lives in the `security-reviewer` agent.
