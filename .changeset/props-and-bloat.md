---
"@skene/design-system": minor
---

feat(evals): a `props_exist` check; enum values where the prop is read; leaner page templates

Three fixes from running the loop by hand — reading `DESIGN.md`, following its
routing, building a page, then probing the scorer with a deliberately broken one.

**`props_exist`.** A candidate with `kind="purple"` on a required enum, invented
`spin`/`elevation` props and a TYPE rendered as a component scored 6/6 —
identical to a correct page — because every other check reads imports and class
strings. All ten committed fixtures turned out to call APIs that do not exist.
The check validates component names, required props, unknown props and enum
values against `context.yaml` and `components.yaml`, and reports each precisely.
It needed a real JSX scanner: `columns={[{ header: 'Field' }]}` nests braces and
quotes inside one attribute, so a regex to the next `>` truncates the tag
mid-value and invents attributes from the remainder.

**Enum values in the Props table.** `ArtFrame.kind` was typed `ArtFrameKind`,
required, with the Types table for that module empty and the three legal values
eighty lines below under Constraints. The Props table named a type it never
defined, on the one prop whose own docs say picking wrong "is not a styling
slip, it is a miscue". Values now render where the prop is read, and the Types
section is headed **not components** — `KeyValueRow` reads like a row component,
is a type, and was rendered as one in four fixtures.

**Leaner page templates, 3,528 → 2,546 tokens for use-case-page.** `Optional`
carried full `useFor` paragraphs for thirteen modules the file itself calls "not
a recommendation" — a third of the page. It now carries the lead sentence and a
link. `Polarity obligations` restated one identical sentence for thirteen of
fifteen rows; it is grouped, so each rule is stated once against the modules it
covers.

Also fixes a rendering bug: some contract prose pre-escapes its pipes
(`Dimension \| Skene`), which the cell escaper escaped again and rendered as a
literal backslash.
