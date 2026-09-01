---
"@skene/design-system": minor
---

docs: emit `DESIGN.md` and one Markdown file per module and per page template

The seven `machine/*.yaml` contracts are the authority and stay the authority.
But they assume a reader with the package on disk and a budget to open seven
files, and the package is published restricted, so an agent outside a consumer
repo can reach none of them. `llms.txt` has been linking `/AGENTS.md` and
`/machine/context.yaml` — root-relative paths that resolve to nothing an
unauthenticated agent can fetch.

`scripts/generate-design-md.mjs` emits the same facts as Markdown, split so that
ONE fetch answers one question: `DESIGN.md` for the system — tokens, scales,
rules, contrast floors and the index — then `design/pages/<archetype>.md` for a
whole page, or `design/<module>.md` for one module, at the module's own path.
100 files, none of them authored.

Each file restates the non-negotiables and the module's polarity rather than
linking to them. The duplication is the point: the two defects this package
keeps shipping are a light surface without the `light` class (text at 1.08:1)
and a `chrome.*` token on a surface that flips, and both are made by an agent
that read one file and followed no link out of it. A page template also carries
the band grammar from `machine/layouts.yaml` — ground alternation, mirroring,
rhythm — so the page lands in the same grammar as the pages that ship.

`npm run design:check` runs inside `npm run verify` and fails the build when a
contract was edited and the Markdown was not, the same gate `tokens:check`
already applies to `docs/brand.md`. `__tests__/design-md.test.ts` is the
coverage half: the byte-diff compares the generator's output to the generator's
output, so it would stay green if the generator started dropping modules — which
it did, in the first cut. Four archetypes record `observed` rather than
`optional`, and dropping that key emptied `home-page`, the densest route in the
corpus and the only recorded evidence for five modules.

`DESIGN.md` and `design/` are in `files` and `exports`, so a consuming agent
told to open one can actually open it.
