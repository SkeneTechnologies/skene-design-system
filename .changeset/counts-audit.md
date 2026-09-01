---
"@skene/design-system": patch
---

fix(inventory): `client` missed 21 of 28 client modules, and four quoted counts were wrong

`build-inventory.mjs` tested `src.trimStart().startsWith("'use client'")` —
single quotes only. 21 of the 29 directives in `src` are written
`"use client";`, so `inventory.json` reported **7** client modules where
`machine/context.yaml` reported 28. That file ships as
`@skene/design-system/inventory.json` and is what `seen:` points at, so an agent
reading it to decide whether a deep import keeps its server boundary got the
wrong answer for 21 of 89 modules, silently. `package-contract.test.ts` matched
the double-quoted form all along and never compared the two.

Three documents had drifted off the same fact or off their own sources:

- `AGENTS.md` said "only the 8 modules that need it carry the directive". 28 do.
  The 8 traces back to the inventory bug above.
- `llms.txt` said 331 token values; `design-tokens.json` has 241. It also said
  the pages skill tabulates "eight archetypes" when the skill says ten and
  `compositions.yaml` carries ten — the index was wrong about the file it
  indexes.
- `README.md`'s gallery paragraph said "79 of the 89 modules as 85 cases" and
  "the ten that gained no case"; the real figures are 88, 97 and one. That
  paragraph was itself written to correct an earlier staleness, and explains at
  length how the previous number rotted.

All four are now gated in `__tests__/agent-entry-point.test.ts`, which reads
each figure out of the generated source rather than trusting the prose. Before
this the only gated count was "89 modules", in two of the three entry points —
and its comment cited "the 8 modules that need `use client`" as its example of
another count that was true.

Left alone deliberately: "twenty measured clusters", repeated in `README.md`,
`AGENTS.md`, both skills and a test comment. Nothing in the repository backs it.
`inventory.json` carries ten adjudicated decisions (six resolved) and
`docs/sections.md` gives three overlaps a verdict, and `README.md` says "the ten
resolved design decisions" two lines above saying twenty. The right number is a
judgement about history rather than a lookup, so it is reported rather than
guessed. `DESIGN.md` now cites the registry it can count instead of repeating
the figure.
