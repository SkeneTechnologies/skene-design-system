# Changesets

Every PR touching `src/`, `styles/` or `design-tokens.json` needs one. CI fails
without it.

The point is the gate, not the automation. Consumers read tokens **by name** in
CSS, so TypeScript cannot catch a rename or a removal for them — the author has
to say what kind of change it is, at the time they make it.

## Bump types

| change | bump |
|---|---|
| new component, new cva variant, new token | minor |
| token **value** change (`#171717` → `#181818`) | minor — visible, but nothing breaks |
| token **rename or removal** | **major** — apps reference these by name |
| removing a `@theme inline` mapping | **major** — silently deletes a utility class |
| changing `--spacing` or `--radius` | **major** — global geometry shift |
| component prop removal, DOM change, `data-slot` change | **major** — apps style via those selectors |
| class tweak inside a component, a11y fix, dependency bump | patch |

When unsure between minor and major, ask whether an app could break *without a
type error*. If yes, it is major.
