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

## Generating candidates

```bash
npm run eval:generate -- --dry-run          # plan + prompt, calls nothing
npm run eval:generate -- --case product-security
npm run eval:generate -- --n 3 --effort xhigh
npm run eval -- --candidates evals/runs/<stamp> --measure
```

**The agent gets `DESIGN.md` and one tool.** Not a context dump — dumping the
whole tree would measure "does a big pile of docs work" and prove nothing about
the split the tree exists for. `read_design_file` resolves nothing outside
`DESIGN.md` and `design/`, so the agent cannot fall back to `machine/*.yaml`,
the source, or the gallery. That restriction *is* the experiment: it puts the
model in the position of an agent in someone else's editor with a URL and no
checkout, which is the reader `DESIGN.md` was built for and the one nothing had
ever tested.

**The retrieval trace is the finding.** Every path the agent opens is recorded,
so a run answers questions no other gate here can:

- which files an agent actually reaches for, and in what order
- how many it needs before it can build a page — the routing table in
  `DESIGN.md` claims one or two; a run says whether that holds
- which paths it tries that **do not exist**, reported separately. A miss is the
  docs implying a file that was never generated, and it is a docs bug.

Each run writes `<label>.tsx` beside a `<label>.json` carrying the model, the
effort, the turn count, token usage, a dollar estimate, and the trace.

**Runs are not fixtures.** Output goes to `evals/runs/<stamp>/`, which git
ignores, never to `candidates/`. A generated file landing among the fixtures
would turn a finding about the model into a red build. For the same reason
scoring a run wants `--measure`, which reports without enforcing the `bad-*`
convention — a generated candidate makes no claim about whether it should fail.

**Every run costs money.** `--dry-run` prints the plan and the full prompt
without calling anything. Credentials come from the environment or an
`ant auth login` profile; nothing here prompts for a key or stores one.

## Rendering it

```bash
npm run eval:render                        # every fixture, both themes
npm run eval:render -- --case product-security --shot
```

Source checks read the file. The defect this package keeps shipping is not in
the file: text at 1.08:1 happens when a token RESOLVES wrong against a ground
three ancestors up, and no amount of reading the candidate will show it.

So this renders. The candidate is bundled against the real `dist/`,
server-rendered, given a stylesheet Tailwind generates by scanning `dist/` and
the candidate, and loaded in Chromium. Every run of visible text is measured:
computed colour, the first opaque background above it, ratio against the floors
in `machine/accessibility.yaml`. Both themes, because `chrome.*` and `themed`
share their dark values and diverge only in light.

It found the defect on its first full run: `bad-light-without-class`, built to
trip the *source* check, measures **1.07:1**. Two checks agreeing from opposite
directions is the point.

**It will not score what it cannot see.** Text on a background image has no
computable ground — the textured fields are exactly that — so it is reported as
unscorable, never as a pass. And a colour the harness cannot read throws rather
than being skipped: the first cut parsed `rgb()` only, so every `oklch()` colour
was dropped silently. That was eleven of twelve text runs on the first page
measured, and it reported a clean page.

Not in `npm run verify`: it needs a browser, like `npm run visual`. The test
suite skips it when Chromium is absent rather than failing — a red build for a
missing browser teaches people to ignore red builds.

## Judging the argument

```bash
npm run eval:judge -- --dry-run --case product-security
npm run eval:judge -- --candidates evals/runs/<stamp>
```

Neither the scorer nor the renderer can answer what the brief actually asks: does
the page make the argument it was commissioned to make, in an order that carries
it? A page can satisfy `load_bearing` and still put the evidence before the thing
the evidence is about, which reverses it.

Three rules keep this from becoming a vibe. It scores the **brief**, never the
taste — the rubric is the case's own `must_argue` plus the archetype's `argues`
line from `compositions.yaml`. Every verdict must **cite** a module, a section or
an ordering, and `dropUncited` discards the ones that do not — enforced in code,
because a rule that lives only in a prompt is one the model may decline to
follow. And it never overrides a contract: where a rule is machine-checkable the
machine owns it, and the judge is **advisory** — it never fails a build.

## What is still missing

**No model has run either half.** The generator and the judge are written, their
pure parts are tested, and `--dry-run` prints exactly what would be sent — but
this environment has no `ANTHROPIC_API_KEY` and no `ant` CLI, so nothing has
called a model. That is a credential, not a design problem: both are one
command away on a machine that has one. The renderer, which needs no key, has
run and is reported above.
