---
"@skene/design-system": minor
---

docs: split the module indexes into `design/index.md`, leaving DESIGN.md at ~3.7k tokens

Measured after the token split: 8.9k of DESIGN.md's remaining 12.3k tokens were
two overlapping answers to "which module?" — the intent index and the module
catalogue. Every agent that opened the file to check a contrast floor, a spacing
step or the `chrome.*` rule paid for both.

They are now one fetch. `DESIGN.md` is **3.7k** and carries only what does not
belong anywhere else: the three non-negotiable rules, surface roles, the reach
ladder, `must`/`must_not`, the page archetypes, the spine, the scales, contrast,
and known gaps. It opens with a routing table that prices each next fetch, so an
agent can decide what to spend before spending it:

| you are | open | roughly |
|---|---|---|
| finding a module, by intent or by name | `design/index.md` | 9k |
| reaching for one module you can name | `design/<module>.md` | 2k |
| building a whole page | `design/pages/<archetype>.md` | 3k |
| picking a colour or a value | `design/tokens.md` | 7k |

That table also says the thing the split makes easy to forget: there are 102
files here and together they are larger than the YAML they were generated from.
The split buys a cheap answer to one question, not a cheap corpus.

Also fixes a real bug in the generator's `prose()` helper. It wrapped bare HTML
tags in backticks with a lookaround, which fired *inside* existing code spans —
`` `design/<module>.md` `` came out as `` `design/`<module>`.md` ``, broken code
with a stray tag. It now splits on code spans and rewrites only what is outside
them. A check across all 102 emitted files finds zero lines with unbalanced
backticks.
