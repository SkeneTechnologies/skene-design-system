---
"@skene/design-system": minor
---

feat: per-module rules instead of a copied block; the design tree is served as well as shipped

**The boilerplate was copied, not generic.** Every leaf carried the same 228
tokens of non-negotiables — 38% of the smallest module pages. Measured across
the 89 modules the rules do not apply evenly: the light-class warning binds on
76 and on the other 13 it told the reader to worry about a class the module
already applies; `content is props` is a sections/patterns concern and was noise
on 30 primitives; `chrome.*` invariance touches about a third. Every input
needed to say which bind was already in `context.yaml`.

Module pages now carry **What binds this module**, computed from the module's own
polarity, namespace and prose. 28 carry one rule, 31 carry two, 30 carry three —
and `sections/trust-panel` now reads "you do NOT owe it the light class" instead
of being warned about one it applies itself. Median module page 1,069 → 959
tokens; the smallest 596 → 467; the tree 144,320 → 136,397. Page templates, the
index, the token values and `DESIGN.md` keep the full set: those are the files
where composition is decided and all three bind.

**The tree is now served as well as shipped.** Three route handlers in the docs
app expose `design/**`, `DESIGN.md` and `styles.css` as `text/markdown` and
`text/css` with CORS open, so an agent with a URL and no checkout can fetch the
same paths a consumer reads from `node_modules`. Serving the stylesheet is the
half that matters most for context: the CSS loads in the reader's browser, and
only the class names need documenting.

An earlier draft of this change also REMOVED `design/` from the tarball, on the
argument that it cost every install ~136k tokens. That was wrong and is
reverted. Tokens are spent when something reads them; on disk the tree is 708KB
beside 13MB of assets. Removing it saved nothing measurable and broke the one
consumer that would publish it — which installs the package and serves the files
straight out of `node_modules`. Shipping never prevented serving.
