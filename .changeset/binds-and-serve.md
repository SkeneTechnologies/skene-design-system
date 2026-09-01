---
"@skene/design-system": minor
---

feat: per-module rules instead of a copied block; the design tree is served, not shipped

Two things I had defended as trades. Only one was.

**The boilerplate was copied, not generic.** Every leaf carried the same 228
tokens of non-negotiables — 38% of the smallest module pages. Measured across
the 89 modules, the rules do not apply evenly: the light-class warning binds on
76 and on the other 13 it told the reader to worry about a class the module
already applies; `content is props` is a sections/patterns concern and was noise
on 30 primitives; `chrome.*` invariance touches about a third. Every input
needed to say which bind was already in `context.yaml`.

Module pages now carry **What binds this module**, computed from the module's own
polarity, namespace and prose. 28 modules carry one rule, 31 carry two, 30 carry
three — and `sections/trust-panel` now reads "you do NOT owe it the light class"
instead of being warned about one it applies itself. Median module page 1,069 →
959 tokens; the smallest 596 → 467; the tree 144,320 → 136,397. Page templates,
the index, the token values and `DESIGN.md` keep the full set: those are the
files where composition is decided and all three bind.

**The tree is bigger than the YAML because both shipped to everyone.** They are
the same facts for two different readers — an agent with the checkout greps the
YAML, an agent with a URL fetches the tree — and every install carried ~136k
tokens of a surface most consumers never open. Shrinking was never the fix.

`design/` is now served from the docs app and removed from `files` and
`exports`; `DESIGN.md` still ships, because it is 3.7k and it is the map that
names the origin. The stylesheet is served too, at `styles.css`, which is the
half of this pattern that keeps the token vocabulary out of a model's context
entirely: the CSS loads in the reader's browser and only the names need
documenting.

Routes are path-checked after resolution, not by pattern, and a test asserts all
three exist — a tree that is neither shipped nor served is a dead pointer, which
`llms.txt` has already shipped once.
