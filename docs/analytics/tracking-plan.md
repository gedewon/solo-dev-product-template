# Tracking plan

Every analytics event the product sends. If it isn't here, it shouldn't be in the code. Specs name the events a feature needs in their Success Metrics section; `/implement` adds the rows here in the same PR as the code.

Naming: `object_verb`, snake case, past tense. Properties in snake case. No personal data in properties. See `.claude/rules/observability.md`.

| Event | Fired when | Where (client/server) | Properties | Feature / spec |
|---|---|---|---|---|
| `$pageview` | A page loads (automatic) | client | (automatic) | baseline |
| `user_signed_up` | An account is created | server | `method` | baseline |

## Feature flags

| Flag key | Gates | Rollout plan | Remove when |
|---|---|---|---|
| | | | |

## Dashboards

<!-- Link the PostHog dashboards the weekly review reads. -->
