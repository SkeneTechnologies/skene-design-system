---
"@skene/design-system": minor
---

feat(evals): render candidates and measure contrast on real pixels; add an advisory judge

**`npm run eval:render`.** Source checks read the file, and the defect this
package keeps shipping is not in the file — text at 1.08:1 happens when a token
resolves wrong against a ground three ancestors up. The candidate is now bundled
against the real `dist/`, server-rendered, given a stylesheet Tailwind generates
by scanning `dist/`, and loaded in Chromium. Every run of visible text is
measured against the floors in `machine/accessibility.yaml`, in both themes,
because `chrome.*` and `themed` share their dark values and diverge only in
light.

It found the defect on its first full run: `bad-light-without-class`, written to
trip the *source* check, measures **1.07:1**. A source check and a pixel check
agreeing from opposite directions is the point of having both.

Two things it refuses to do. Text on a background image has no computable ground
— the textured fields are exactly that — so it reports unscorable rather than
passing. And a colour it cannot read throws instead of being skipped: the first
cut parsed `rgb()` only, and Chromium returns these components' colours as
`oklch()`, so **eleven of twelve text runs on the first page were dropped
silently and it reported a clean page**. Colours now go through a canvas, which
normalises every CSS colour space.

Not in `npm run verify` — it needs a browser, like `npm run visual`. The suite
skips those tests when Chromium is absent rather than failing.

**`npm run eval:judge`.** Neither the scorer nor the renderer answers what the
brief asks: does the page argue what it was commissioned to argue, in an order
that carries it? A page can satisfy `load_bearing` and still put the evidence
before the thing the evidence is about. The judge scores the brief — the case's
`must_argue` plus the archetype's `argues` line — never the taste; every verdict
must cite a module, section or ordering, and `dropUncited` discards the ones
that do not, enforced in code rather than asked for in the prompt; and it is
advisory, so it never fails a build.

Still unrun against a model: this environment has no credential. `--dry-run`
prints exactly what would be sent, for both the generator and the judge.
