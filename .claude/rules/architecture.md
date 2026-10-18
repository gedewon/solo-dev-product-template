# Architecture

Prefer simple over impressive. Add complexity only when the product needs it today.

- Reuse the patterns already in the codebase before inventing one. One way to fetch data, one way to mutate.
- No abstraction for a hypothetical future need. Before adding one, ask: does this problem happen more than once, and does the abstraction make the code easier to understand or to test? If not, write the direct version.
- Keep domain logic explicit and out of presentational components.
- Keep privileged operations on the server.
- Prefer composition over inheritance. Avoid circular dependencies.
- Use the vocabulary in `CONTEXT.md` for names. For module and interface design, the `codebase-design` skill has the shared terms (module, interface, seam, depth).
- Record a decision in `docs/adr/` only when it is hard to reverse, surprising without context, and the result of a real trade-off.
