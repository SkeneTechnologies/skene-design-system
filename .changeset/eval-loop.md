---
"@skene/design-system": minor
---

feat(evals): score a page an agent built against the contracts it was given

Every gate in this repository checked the documents against each other.
`tokens:check` proves `docs/brand.md` matches the JSON, `design:check` proves
`DESIGN.md` matches the YAML, `agent-entry-point.test.ts` proves the counts in
the prose are real. All internal consistency, and none of it had ever measured
the thing the contracts exist for.

`npm run eval` does. A case (`evals/cases/*.yaml`) is a brief — an archetype, a
reader, what the page must argue — and deliberately does not name the modules,
because that is the decision under test. A candidate is the `.tsx` written from
it. The scorer reads it the way `machine/compositions.yaml` was derived, imports
in source order, and applies ten checks, each citing the contract it comes from:

`load_bearing`, `module_exists`, `polarity` (the 1.08:1 defect, finally
machine-checkable), `arbitrary_hex`, `chrome_role`, `page_declares_ground`,
`rhythm_tall_once`, `marketing_card`, `local_copy`, and `not_for` as advisory.

Candidates are files on disk, so this runs in CI with no API key, no cost and no
flake. `--candidates <dir>` points elsewhere, so a harness that generates them
from a brief can drop output in without the scorer changing.

Two things are deliberately not checked, and `evals/README.md` says so rather
than leaving it to be discovered: `content_is_props` is not decidable from one
file, since a page supplying copy and a section hardcoding it look identical
from outside; and nothing renders, because contrast on real pixels needs the
pinned container `npm run visual` already has.

**The fixtures are the assertion.** Each `bad-*` candidate breaks exactly one
rule and `__tests__/eval.test.ts` pins which check must catch it — a check with
no failing fixture fails the suite. That gate earned itself immediately: two
checks shipped broken on first write and both failed OPEN, reporting a clean
page. `rhythm_tall_once` counted `py-[128px]`, which is also the `md:` step of
the default rhythm, so it saw two tall bands on pages with none.  `polarity`
tested `/\blight\b/`, which matches inside `bg-brand-light` — the very utility
that paints the light ground — so the check read the defect as its own fix and
passed the fixture written to fail it.

Still missing, and named in the README: nothing yet generates a candidate by
handing an agent `DESIGN.md` and nothing else. This measures that the scorer
works and that the contracts are expressible as checks. It does not yet measure
a model.
