# evals — does an agent given the contracts build an on-brand page?

Every other gate in this repository checks the documents against each other.
`tokens:check` proves `docs/brand.md` matches the JSON. `design:check` proves
`DESIGN.md` matches the YAML. `agent-entry-point.test.ts` proves the counts in
the prose are real. All of it is internal consistency, and none of it has ever
measured the thing the contracts exist for.

This does. Run it:

```bash
npm run eval              # all cases
npm run eval -- --case product-security
npm run eval -- --json    # machine-readable, for a harness
```

## The three pieces

**A case** (`cases/*.yaml`) is a brief, not a spec: an archetype, who the reader
is, and what the page has to argue. It deliberately does not name the modules —
that is the decision being tested.

**A candidate** (`candidates/<case>/<label>.tsx`) is what an agent wrote from
that brief. Candidates are files on disk, so this runs in CI with no API key, no
cost and no flake. `--candidates <dir>` points the scorer somewhere else, so a
harness that generates them can drop its output in without this changing.

**The scorer** (`scripts/eval.mjs`) reads a candidate the way
`machine/compositions.yaml` was derived — imports in source order — and applies
ten checks. Every one cites the contract it comes from, because a rule an agent
is asked to follow should be traceable to the file that decided it.

| check | catches | from |
|---|---|---|
| `load_bearing` | a page of this archetype missing a band every real one carries | `compositions.yaml` |
| `module_exists` | a module invented rather than found in the index | `context.yaml` |
| `polarity` | a light ground with no `light` class — the 1.08:1 defect | `context.yaml`, `rules.yaml` |
| `arbitrary_hex` | a literal hex in a class string | `rules.yaml must_not` |
| `chrome_role` | `chrome.*` on a surface that flips | `rules.yaml surface_roles` |
| `page_declares_ground` | a band painting its own ground | `layouts.yaml` |
| `rhythm_tall_once` | more than one signature band | `layouts.yaml` |
| `marketing_card` | `Card` in a marketing grid instead of `FeatureRow` | `rules.yaml must` |
| `local_copy` | a primitive copied into the app | `rules.yaml must` |
| `not_for` | advisory — a `notFor` edge touching a module used | `context.yaml` |

Two things are deliberately **not** checked. `content_is_props` is not decidable
from one file: a page supplying copy and a section hardcoding it look identical
from outside. And nothing here renders — contrast on real pixels needs a browser
and belongs with `npm run visual`, which already has the pinned container.

## The loop

The scoring is the instrument. The loop is the point.

1. **Run the cases and read the failures.**
2. A failure the contracts **already forbid** is a *docs* failure: the guidance
   existed and did not reach the agent. Fix the guidance, `npm run design`.
3. A failure the contracts **do not forbid** is a *contract gap*: nobody had
   decided the rule. Decide it, write it into `machine/*.yaml`, then add the
   check here so it cannot be argued about again.
4. A finding that recurs across cases becomes a check. A finding that appears
   once is recorded, not generalised — the standard `compositions.yaml` holds
   itself to.

## Why the fixtures are named `bad-*`

Each is built to break exactly one rule, and `__tests__/eval.test.ts` pins which
check must catch it. This is not decoration. Two checks shipped broken on first
write and **both failed open**, reporting a clean page:

- `rhythm_tall_once` counted `py-[128px]`, which is also the `md:` step of the
  *default* rhythm — so it reported two tall bands on pages that had none.
- `polarity` tested `/\blight\b/` against the class string, which matches inside
  `bg-brand-light`, the very utility that paints the light ground. The check
  read the defect as its own fix and passed the fixture written to fail it.

A check that silently stops firing is worse than no check: it turns "nobody
looked" into "it passed". So adding a check to `scripts/eval.mjs` means adding a
fixture that makes it fail, and the test suite refuses a scoreable check that no
fixture breaks.

## What is still missing

**Candidates are hand-written.** Nothing here yet generates one from a brief by
handing an agent `DESIGN.md` and nothing else — which is the real experiment,
and the reason `--candidates` takes a directory. Until that runs, this measures
that the scorer works and that the contracts are expressible as checks; it does
not yet measure a model.

**No rendered stage.** Structure and vocabulary are checkable from source.
Whether the result *looks* right is not.
