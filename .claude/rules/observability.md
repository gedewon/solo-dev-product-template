---
paths:
  - "app/**"
  - "components/**"
  - "lib/**"
  - "instrumentation*.ts"
  - "sentry.*.config.ts"
  - "docs/analytics/**"
---

# Observability

Sentry answers "what broke". PostHog answers "what do people do, and did this feature work". Both were set up by `/setup-observability`; if they aren't installed yet, don't add them as a side effect of another task.

## Product analytics (PostHog)

- Every event is listed in `docs/analytics/tracking-plan.md` before it ships. Add the row in the same change that adds the `capture` call.
- Event names are `object_verb` in snake case and past tense: `booking_created`, `plan_upgraded`, `search_performed`. Properties are snake case too.
- Capture outcomes on the server when the server decides them (a payment succeeded, a booking was confirmed); the client can lie or be blocked. Capture intent and UI interaction on the client.
- No personal data in event properties: no emails, names, phone numbers, addresses, free-text input or tokens. Identify users by their internal ID only.
- Feature flags gate risky rollouts. Read flags on the server where the decision matters; a client-side flag is a UI hint, not access control. Remove a flag and its dead branch once the rollout is finished.

## Errors (Sentry)

- Don't swallow unexpected errors. Let them reach Sentry, or capture them explicitly with context, then show the user a friendly message.
- Expected failures (validation, unauthorized, not found, conflict) are normal responses, not Sentry errors.
- Attach the user's internal ID and useful tags (feature, route). Never attach request bodies, tokens, cookies or personal data.

## Both

- Keys live in environment variables listed in `.env.example`. The public client keys are safe to expose; anything marked server-only is not.
- Tests never send real events or errors. The SDKs stay disabled when `NODE_ENV` is `test`.
