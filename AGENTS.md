# @skene/design-system

Skill file for coding agents. Tokens, a Tailwind v4 theme, 89 components, and
machine-readable contracts that say which one to reach for.

This file exists because those contracts had no entry point at a name anything
looks for. They shipped from 2026-08-13 and were pointed at only by README
prose, which works for an agent reading top-down and not for one that lands in
the directory and looks for `AGENTS.md`.

## First run — you have just added this to a repo

Do these in order. Step 3 is the one that fails silently, so it is the one with
a proof attached; the rest fail loudly and need no ceremony.

1. **Install it.** `npm install @skene/design-system` — see Installation below
   for the credential, since the package is restricted.
2. **Wire the stylesheet.** The two `@import` lines in Configuration, at the top
   of the app's own stylesheet.
3. **Add the `@source` line, then PROVE it took.** This is the step that has
   shipped a broken page with no error and no warning:

   ```bash
   npm run build
   grep -r "min-h-14" .next/static/css/ || echo "NOT GENERATED — @source did not take"
   ```

   `min-h-14` is a utility only this package's components use, so it reaches the
   stylesheet only if your build scanned the package. Under Turbopack it does
   not by default, and the symptom is a component that renders at zero height
   rather than an error — `LogoRow` shipped exactly that. If the grep misses,
   the `@source` path in Configuration is wrong for your stylesheet's location:
   count the `../` again.
4. **Decide theming.** `next-themes` is an optional peer. Install it if the app
   flips light/dark; skip it if the app is dark-only. Nothing else in the
   package needs it.
5. **Render one component end to end** before building a page — a `Button` is
   enough. It proves resolution, styles and the theme class in one go.
6. **Then read `machine/context.yaml`.** Not before: the setup above is
   mechanical, and the contracts are for deciding what to build.

Two things worth knowing before your first section, because both have shipped
defects rather than being theoretical:

- A **light surface on a dark page needs the `light` class on its root.**
  Check the module's `polarity` in `machine/context.yaml`. Without it,
  mode-aware tokens resolve to their dark values against a light fill, which has
  shipped text at 1.08:1.
- **Deep-import.** `@skene/design-system/ui/button`, not the root barrel, when
  you care about the React Server Components boundary.

## Installation

```bash
npm install @skene/design-system
```

The package is published **restricted**, so the install needs a credential. In
CI, let `actions/setup-node` write the runner's `.npmrc`:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 22
    registry-url: https://registry.npmjs.org
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Locally the token belongs in `~/.npmrc`. **Never a project-level `.npmrc`** —
that is a token in a commit.

Consumers not yet migrated install it as a git dependency instead:

```json
"@skene/design-system": "git+https://github.com/SkeneTechnologies/skene-design-system.git#semver:^0.24.0"
```

## Configuration

Two lines at the top of the app's stylesheet:

```css
@import "tailwindcss";                      /* stays in the app, exactly once */
@import "@skene/design-system/styles.css";
```

And one the package cannot add for you:

```css
@source "../../node_modules/@skene/design-system/dist";
```

Path is relative to *your* stylesheet — that one is right for
`src/app/globals.css`; one at `app/globals.css` drops a `../`.

Add it unconditionally. The package declares its own `@source`, which is enough
under the Tailwind CLI and Vite, but **under Turbopack it is not**: the build
resolves the `@import` and then never scans the imported file's own `@source`,
so every utility only the package's components use is silently absent. That
shipped — `LogoRow` rendered as a zero-height strip, no error and no warning,
because `min-h-14` never reached the stylesheet. The line is idempotent where
the package's own `@source` already works, since Tailwind dedupes scanned files.

## Usage

```tsx
import { Button } from '@skene/design-system/ui/button'
import { FeatureRow } from '@skene/design-system/sections/feature-row'
import { tokens } from '@skene/design-system/tokens'

tokens.color.brand.peach       // { light: "#89684a", dark: "#fec089" }
tokens.color.chrome.surface[0] // "#0a0a0a" — invariant, never inverts
```

Deep-import for the tightest React Server Components boundary. The root barrel
carries no `"use client"` directive on purpose, so `import { Card } from
'@skene/design-system'` stays server-renderable; only the 28 modules that need
it carry the directive themselves. Which 28 is a fact you should read rather
than remember: `client: true` in `machine/context.yaml`, and the `client` field
in `inventory.json`.

## Skills — for an agent that has not read this file

The contracts above assume you already came here. Three Agent Skills ship in the
package so that an agent working in a consumer repo is routed to them by what it
is doing, without going looking. They split by moment, not by surface:

| skill | fires when |
|---|---|
| `skills/skene-design-system-setup` | adding the package to a repo, or its components render unstyled or at zero height |
| `skills/skene-design-system` | writing or changing any component — before you write it, not after |
| `skills/skene-design-system-pages` | assembling a whole page or a multi-section band |

From a consumer they are under `node_modules/@skene/design-system/skills/`.

## The contracts — read in this order

All of these ship inside the package, so from a consumer they are under
`node_modules/@skene/design-system/`.

| # | file | answers |
|---|---|---|
| 1 | `machine/context.yaml` | **which module to reach for**, and what else each one is good for. 91 modules. Start here, always. |
| 2 | `machine/components.yaml` | what you must **not** do with the one you picked. |
| 3 | `machine/rules.yaml` | the reach ladder, the `must_not` list, and `ask_first_when`. |
| 4 | `machine/tokens.yaml` | the token vocabulary, and which role belongs on which surface. |
| 5 | `machine/compositions.yaml` | **how whole pages are assembled** — section order per page archetype, load-bearing vs optional, derived from pages that were actually built. |
| 6 | `machine/layouts.yaml` | the layout scale that applies here, the modules that draw a dashboard for a marketing page, and skene-dashboard's forward contract — each block carries a `status` saying which. |
| 7 | `machine/accessibility.yaml` | the a11y contracts, including contrast floors. |
| — | `docs/sections.md` | prose: decision paths, and every measured overlap with a verdict. |
| — | `docs/brand.md`, `docs/principles.md`, `docs/ux-patterns.md` | voice, principles, interaction patterns. |
| — | `design-tokens.json` | the 241 token values themselves. |

One and two are a pair, and the split is deliberate: `components.yaml` states
constraints and does not say which component to pick, which is why its header
sends you to `context.yaml` first and back afterwards.

### If you cannot open seven files

The table above assumes a checkout and a budget. `DESIGN.md` and the tree under
`design/` carry the same facts as Markdown, split so that ONE fetch answers one
question — the shape Vercel's `design.md` is built around, over contracts that
were already here.

The tree ships in the package AND is served at
`https://www.skene.ai/resources/docs/`. Both, because they reach different
readers and shipping never prevented serving: an agent with the checkout reads
`node_modules/@skene/design-system/design/`, an agent with only a URL fetches
the same file over HTTP. On disk it is 708KB beside 13MB of assets, so the
question of whether to ship it was never a real cost.

| you are | open |
|---|---|
| orienting: rules, scales, floors, page archetypes | `DESIGN.md` — the short one, and it ships |
| finding a module, by intent or by name | `design/index.md` |
| picking a colour or a value | `design/tokens.md` — every token value, kept out of `DESIGN.md` |
| building a whole page | `design/pages/<archetype>.md` — 10 of them |
| reaching for one module | `design/<module>.md`, at the module's own path |

The stylesheet is served too, at `styles.css`. That is deliberate: the CSS loads
in the reader's browser rather than in your context, so the token vocabulary
costs nothing to use and only the names have to be documented.

Do not read the tree. The index tables in `DESIGN.md` are the retrieval step:
find the row, open that one file, stop.

All of it is **generated** by `scripts/generate-design-md.mjs` from the YAML
above, which stays the authority. `npm run design` regenerates;
`npm run design:check` runs inside `npm run verify` and fails the build when a
contract was edited and the Markdown was not.

## Before you write a component

**Grep `machine/context.yaml`.** There are 91 modules and a documented history
of the same visual object being drawn twice by someone who could not find the
first — ten adjudicated clusters of it, each recorded in `inventory.json` with
its verdict. If you are about to write a card, a
chip, a table, a framed window or a textured field, it already exists.

Four fields per entry earn the read:

- `useFor` — what it is for.
- `alsoFor` — what else it covers. Every claim carries a `via` naming the prop,
  default or export that makes it true, and a test rejects a claim that cannot
  cite one, so these are read out of source rather than reasoned to.
- `notFor` — the component you probably meant instead. 144 such edges exist.
- `sameAs` — a near-duplicate this is easy to confuse with. Enforced symmetric,
  so it reads the same from either side.
- `intent` — tags from a controlled vocabulary, declared at the top of the file.
  This is the index to read backwards: you know what you are trying to DO, and
  the tag takes you to the candidates without reading 89 entries.

## Fields that bite if you skip them

- **`polarity`** — whether the module puts a theme class on its own root. A
  light surface on a dark page without it resolves mode-aware tokens to their
  dark values against a light fill, which has shipped text at 1.08:1.
- **`seen`** — the gallery cases that have ever rendered it. **An empty list
  means nothing in this repository has ever rendered the module, so treat its
  claims as unproven.** ONE module is in that state today and it is
  meant to be: `ui/sonner`, a toast host that renders nothing until something
  calls it, so it has no resting state to snapshot. Every other module in the
  package has been rendered on `/components` and has a light and a dark baseline
  behind it. Two of them hold a state that is known to be WRONG and say so in
  the case — see `docs/sections.md`.
- **`overrides`** — what a caller can reach from outside. `style` means the
  module writes an inline style that beats any class you pass.

## Rules that are not negotiable

Full list in `machine/rules.yaml`; these three cause the most damage:

1. **`chrome.*` is invariant and cannot invert.** Use it only on surfaces that
   never flip. Anything on a surface that flips uses the theme-aware `text.*`.
2. **A light surface on a dark page needs the `light` class on its root.**
3. **Content is props.** No section hardcodes copy.

## Verifying a change to this package

```bash
npm run verify        # tokens, contrast, contracts, story coverage, tests, build
npm run visual        # committed screenshot baselines; needs Docker
npm run visual:update # regenerate them when a pixel change is intended
```

`npm run visual` compares committed `*-linux.png` baselines inside a pinned
Playwright container, and it has to run in that container — a host run
rasterises fonts differently and every snapshot mismatches.

## Known soft spots

Written down rather than left to be discovered. `docs/sections.md` carries the
measured overlaps with a verdict for each; read the chip cluster before adding
any small label — nine shapes, drifted twice in a column nobody was tabulating,
now pinned by `__tests__/chip-cluster.test.ts`.
