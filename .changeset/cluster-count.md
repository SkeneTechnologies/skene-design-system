---
"@skene/design-system": patch
---

docs: the cluster count was twenty in seven places and ten in the registry

"Twenty measured clusters where the same visual object was drawn twice" was
quoted in `README.md`, `AGENTS.md`, both halves of the component skill, a test
comment, `machine/compositions.yaml` and `scripts/build-context.mjs`. Nothing
backed it. `inventory.json` holds **ten** adjudicated decisions, and `README.md`
called them "the ten resolved design decisions" two rows above saying twenty.
`docs/sections.md` — the file `AGENTS.md` says carries "every measured overlap
with a verdict" — documents three.

All seven now say ten and point at the registry. `compositions.yaml`'s
"twenty-first duplicate cluster" becomes "an eleventh", which is the claim it
was making: this is the next one, not one of the documented set.

Gated in `__tests__/agent-entry-point.test.ts`, which reads the count out of
`inventory.json` and refuses any of the six surfaces quoting another. The gate's
own first cut failed open twice, and both were found by mutating each file in
turn rather than trusting it:

- it matched a single line, so it was blind to `ten adjudicated\n * clusters` —
  two of the six files wrap the claim mid-phrase behind a comment prefix. It now
  flattens comment markers and whitespace before matching.
- it dropped ordinals as unparseable, so `the twenty-first duplicate cluster`
  passed silently. An ordinal is a different claim — it must equal the registry
  count plus one — and is now checked as one.

Left alone: every other "twenty" in the repository is a real route or page
count — the twenty competitor-comparison pages, the twenty routes of the
largest archetype, the twenty pages the band grammar was measured on.
