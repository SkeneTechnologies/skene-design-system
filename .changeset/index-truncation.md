---
"@skene/design-system": patch
---

docs: the module index carried 89 full paragraphs on the route that must be cheapest

`design/index.md` was 8,895 tokens, of which **6,371 was one section**: "By
namespace", listing all 89 modules with the whole of each `useFor`. The intent
index above it already covers the same 89 modules in 2,126 tokens, so the file
paid for a second and longer listing of one set — on the one route you take when
you do *not* know what you are looking for, which is exactly the route that has
to be cheap.

It now carries the lead sentence, capped, the way the page templates already do.
The full prose is one fetch away in the module's own page, which is where an
agent goes next anyway.

- `design/index.md`: 8,895 → **5,809** tokens
- finding a module (DESIGN.md + index): 12,645 → **9,560**
- the tree: 147,406 → 144,320

Nothing was lost that the index needed: the nine rows that came out under 28
characters are terse because the module is (`ui/button` — "The action
primitive."), and 23 rows hit the cap and end in an ellipsis that points at the
module page.

Left at full length deliberately: a page template's `load_bearing` table, which
names one or two modules a page of that archetype must carry. Two paragraphs
there is not a listing, it is the answer.
