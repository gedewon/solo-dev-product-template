# Deepening a cluster

> Rewritten for this template because the original file was missing. Replace it with the original if you find it.

Deepening turns several shallow modules that callers must coordinate into one module with a small interface. Do it in this order.

## 1. Sort the dependencies

For every dependency the cluster has, decide which category it falls in. The category decides what crosses the new seam.

| Category | Examples | What to do |
|---|---|---|
| Pure logic you own | calculations, validation, state transitions | Pull inside the module. Never a seam. |
| Your own persistence | your database tables, queries | Usually inside. Test against a real local database, not a mock. |
| External systems | payments, email, third-party APIs | Put behind a seam with an adapter. Mock or fake only here. |
| Time, randomness, IDs | `Date.now()`, UUIDs | Pass in as a parameter or a small adapter, so tests can fix them. |
| Framework plumbing | request objects, cookies, headers | Keep at the edge. Translate to plain values before calling the module. |

## 2. Seam discipline

- Name the seam after the role it plays, not the vendor: `PaymentGateway`, not `StripeClient`.
- One adapter means a hypothetical seam. Don't add the seam until a second adapter exists, unless the dependency is external (category 3), where the test fake is the second adapter.
- A seam passes plain data in and out. If callers must understand the adapter's types, the seam is leaking.

## 3. Replace, don't layer

Don't wrap the old modules in a new facade and leave them callable. That adds a layer and keeps every old path alive.

1. Write tests against the new interface first, describing the behaviour callers rely on.
2. Move the implementation inside, behind the interface.
3. Point each caller at the new interface.
4. Delete the old modules and the tests that tested them directly. Tests that went past the old interfaces were testing implementation details.

If step 4 feels risky, the new interface tests are missing behaviour. Add them before deleting.

## 4. Check the result

- Apply the deletion test to the new module: deleting it should make complexity reappear across callers.
- Callers should need fewer imports and fewer calls than before.
- A bug in the cluster's logic should now be fixable in one file.
