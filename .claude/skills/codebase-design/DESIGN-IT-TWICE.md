# Design it twice

> Rewritten for this template because the original file was missing. Replace it with the original if you find it.

The first interface you think of is rarely the best. Generate several radically different ones in parallel, then compare.

## Process

1. **Write the brief.** One paragraph: what the module does for its callers, the call sites that exist today (with file paths), the behaviour that must be preserved, and the constraints (ADRs, `CONTEXT.md` terms, performance).

2. **Spawn three sub-agents in parallel**, each with the same brief and one forcing constraint, so they can't converge on the same design:
   - **Minimal**: the fewest possible entry points. One function if it can be done.
   - **Caller-shaped**: design from the call sites backwards. The interface is whatever makes the most common call site shortest.
   - **Data-first**: design around the data and its states. Operations are transitions between named states.

   Each returns: the interface as a TypeScript signature plus its invariants and error modes, two call sites rewritten against it, which dependencies sit behind which seam, and the test list a caller would write. Under 300 words each.

3. **Compare** in a table, one row per design:

   | Design | Entry points | Depth (behaviour behind the interface) | Locality (where a bug would be fixed) | Seams and adapters | Tests needed |
   |---|---|---|---|---|---|

4. **Recommend one**, or a hybrid that takes a named piece from each. Say what you are giving up.

5. **Hand the decision to the user.** Interface choices are hard to reverse. If they pick a design for a non-obvious reason, offer an ADR.
