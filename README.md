# @skene/design-system

Tokens, the Tailwind v4 theme, and the agent contracts. Consumed today by
`skene-site`, and by nothing else: `skene-marketing-website` has zero matches in
its package.json, its lockfile and its source, and `skene-dashboard` is where the
tokens and the generators came from but still runs its own copies. One consumer,
not three — see `machine/rules.yaml` for what each surface actually installs.

## For agents

Read these before writing a component. They ship inside the package, so they are
in `node_modules/@skene/design-system/`:

| file | answers |
|---|---|
| `machine/context.yaml` | **which module to reach for**, and what each one can also be used for. Start here. |
| `machine/components.yaml` | what you must not do with a given component. |
| `machine/rules.yaml` | the reach ladder, and the seven things never to do. |
| `docs/sections.md` | prose: the decision paths, and the overlaps with a verdict for each. |

Nothing pointed at these until 2026-08-13, which is the failure they were built
to prevent: the package has 79 modules and twenty measured clusters where the
same visual object was drawn twice, every one of them by somebody who could not
find the first. If you are about to write a card, a chip, a table, a framed
window or a textured field, grep `machine/context.yaml` first.

This repo exists because those two apps had drifted into one design system split
in half. The dashboard owned `design-tokens.json` and the generators; the
marketing site had no token file at all, just a block in `globals.css` marked
`@generated ... run npm run tokens:css` — a script that did not exist in that
repo. Its tokens had been generated in the dashboard and pasted across by hand,
and the pasting had stopped. A value-level diff of the two stylesheets found 253
custom properties, 127 in agreement and 12 in genuine conflict.

## Install

Consumed as a git dependency, so there is no npm registry and no npm token:

```jsonc
"@skene/design-system": "git+https://github.com/SkeneTechnologies/skene-design-system.git#semver:^0.11.0"
```

npm resolves `semver:` against git **tags**, and `package-lock.json` pins the
exact commit, so `npm ci` is deterministic. A version with no tag resolves
nothing — tag every release:

```bash
npx changeset version              # bumps package.json, writes CHANGELOG.md
git commit -am "chore(release): <version>"
git tag -a v<version> -m "v<version>"
git push origin main && git push origin v<version>
```

> Annotate the tag. `git push --follow-tags` pushes **annotated tags only** and
> skips a lightweight one without a word of complaint, so `git tag v0.9.2` +
> `--follow-tags` pushes the commit and silently leaves the release untagged —
> which presents downstream as `#semver:` resolving nothing. Caught here by
> checking `git ls-remote --tags` after the push, which is the only place the
> absence is visible.

> The range must actually contain the version. This line read `^0.1.0` while the
> package was `0.2.0`, which matches no tag at all — the documented install was
> broken and nothing caught it, because no consumer had tried it yet. It then
> went stale again at `^0.4.0` against a published `0.6.0`, and a third time at
> `^0.6.0` against `0.8.0` — the same defect with a different number each time,
> caught only by someone reading the file. Treat this line as something a
> release updates rather than something anyone remembers.

Verified by installing this package from a clean directory with only the git
dependency in `package.json`: the range above resolves to the highest matching
tag and pins the commit. At `^0.11.0` the range resolves `v0.11.0`, the tag the
release that bumped package.json to it also pushed.
(This sentence read `v0.3.0` for six releases, then `v0.10.0` for another —
the same drift the note above warns about, in the paragraph that warns about
it. Treat it as something a release updates, per that note, not something
anyone remembers by hand.)

### CI needs nothing. That is a recent fact, and it is worth knowing why.

No token, no SSH key, no `insteadOf` rewrite, no secret in Vercel. `npm ci` on a
bare runner is enough.

The repository was private until 0.9.2, and every install off a laptop failed on
a runner with `remote: Repository not found` — which reads as a bad credential
and is not one. Three tokens were regenerated and a deploy key attempted before
the cause was found, so the mechanism is recorded here rather than left to be
rediscovered.

`package-lock.json` records the dependency as `git+ssh://git@github.com/…`, no
matter which protocol `package.json` asks for; npm normalises GitHub URLs when it
writes a lockfile. **npm does not then read that URL as an instruction.** Measured
on a public repo with ssh disabled (`GIT_SSH_COMMAND=/bin/false`), an empty
`$HOME`, no git config and a cold cache: `npm ci` succeeds, and the only host it
contacts is

```
https://codeload.github.com/<owner>/<repo>/tar.gz/<sha>
```

an unauthenticated HTTPS tarball. Git is never invoked. So the `git+ssh` string
in the lockfile is cosmetic for a public repository, and re-resolving lockfiles
to "fix" it is work that changes nothing.

For a **private** repository the same call is what fails: codeload 404s for an
unauthenticated client, npm falls back to the ssh URL, and a runner with no key
dies there. One cause, two symptoms that look unrelated. If this package is ever
made private again, the fix is a token rewritten into the git config for all
three URL spellings — `ssh://git@github.com/`, `git@github.com:` and
`https://github.com/` — using `git config --global --add` on the second and
third, because a plain `git config` REPLACES a multi-valued key instead of
appending and leaves exactly one rewrite in place.

The one thing that does still break a consumer: a commit that no longer exists.
The lockfile pins a SHA, and codeload 404s on a SHA that has been force-pushed
away or that lived in a deleted repository. Recreating this remote from scratch
means every consumer must re-resolve, and every tag must be pushed again or
`#semver:` matches nothing.

## Use

Two lines at the top of the app's stylesheet:

```css
@import "tailwindcss";                      /* stays in the app, exactly once */
@import "@skene/design-system/styles.css";
```

### And one more, which the package cannot add for you

```css
@source "../../node_modules/@skene/design-system/dist";
```

(Path relative to *your* stylesheet — the line above is right for a stylesheet
at `src/app/globals.css`; one at `app/globals.css` drops one `../`.)

The package's own `styles/index.css` already declares
`@source "../dist/**/*.js"` so that its components' classes are generated, and
under the Tailwind CLI and Vite that is sufficient. **Under Turbopack it is
not**: the marketing site's build resolved the `@import`, then never scanned
the imported file's own `@source`, so every utility that only the package's
components use was silently absent from the emitted CSS. Observed shipping,
not hypothesised: `LogoSlot`'s `min-h-14` and the card animation's
`aspect-square` never made it into the app's stylesheet, and `LogoRow`
rendered as a zero-height strip — no error, no warning, a component that
simply is not there. Classes the app also happens to use elsewhere are
generated anyway, which is exactly what makes the gap invisible until a
component leans on a utility nobody else does.

The line is idempotent where the package's own `@source` already works —
Tailwind dedupes scanned files — so add it unconditionally rather than
per-bundler.

Tokens are also importable as typed values:

```ts
import { tokens } from '@skene/design-system/tokens'

tokens.color.brand.peach          // { light: "#89684a", dark: "#fec089" }
tokens.color.surface[0]           // { light: "#fafafa", dark: "#0a0a0a" }
tokens.color.chrome.surface[0]    // "#0a0a0a"
```

> That first line read `"#fec089"` until 0.9.5, which is the dark value alone.
> Copying it gave `[object Object]` in a style value, and the paragraph
> immediately below already said why. These three comments are now asserted
> against the real export, so a sample that stops being true fails the build.

Mode-aware tokens surface as `{ light, dark }` rather than collapsing to one
mode. A caller that wants a single colour has to say which. Collapsing would
bake one theme into the export, and the two apps have opposite defaults.

## The two surface roles

The one thing to understand before using this package.

`surface.*` and `text.*` used to mean two different things depending on which
repo you were in:

| | meaning | example |
|---|---|---|
| `chrome.surface.*`, `chrome.text.*` | **fixed dark**, regardless of theme | a terminal panel or code block that stays dark on a light page |
| `surface.*`, `text.*` | **theme-aware**, inverts to a zinc ladder in light | the page itself |

They share their dark values and diverge only in light, which is exactly why the
ambiguity survived so long. Both roles now exist under distinct names, so each
app migrates its own call sites on its own schedule.

Picking wrongly is silent, so it is enforced by tests:

- making `chrome.*` mode-aware turns the dashboard's dark panels light on its
  default theme, and drops 8 foreground/background pairs below the WCAG floor
- making `surface.*` invariant removes light mode from the marketing site

### Known gap: the light brand values are derived, not designed

The brand colours were drawn against dark surfaces and at first had no light
values at all, so every one of them failed on the light ladder. Light variants
landed across 0.4.0 and 0.5.x. Measured against `surface.1`:

| token | on dark | on light |
|---|---|---|
| `brand.peach` | 11.20:1 | 4.61:1 |
| `semantic.matcha` | 14.87:1 | 4.50:1 |
| `semantic.warningAmber` | 9.40:1 | 4.60:1 |
| `semantic.errorRed` | 5.18:1 | 4.56:1 |

Every light value is the least-darkened hue-preserving value that clears 4.5:1,
recorded in each token's `$description`. No designer picked one. So the ratios
hold and the hues are whatever the arithmetic produced — the gap that remains is
aesthetic, not accessible, and the fix is a designed colour that still clears
the floor.

`__tests__/roles.test.ts` asserts that floor on all four, so a replacement that
looks better and measures worse fails the build. That block used to assert the
opposite — that peach failed on light — and the day the variants landed it broke,
which is the only reason this section was ever corrected.

Labels on a *tint* of these colours are a different ground and have their own
tokens: `semantic.{errorRed,warningAmber,matcha}OnTint`, re-derived in 0.5.2
against every fill a `StatPill` is observed on rather than one sampled 10% tint.

## Working on it

```bash
npm ci                  # first, always
npm run tokens          # regenerate styles/tokens.css and src/tokens/index.ts
npm run tokens:check    # fail if regenerating would change anything (CI guard)
npm run tokens:contrast # WCAG 2.2 gate over the real fg/bg pairs
npm test
npm run verify          # all of the above, plus the build
```

### The gallery

`docs-app/` is a Next app rendering all 79 modules as 85 cases in both modes,
and it is the instrument every duplicate collapse in this package was proven
against. Run it root-first:

```bash
npm ci                  # in the REPO ROOT, not optional
cd docs-app && npm ci && npm run dev      # /components is the gallery
```

Root first because `docs-app` depends on the package as `file:..`, which npm
resolves by symlink — so the package's 25 runtime dependencies have to be in
the root `node_modules` or the build dies on `@radix-ui/*` and `clsx` inside
`dist/`. The root `npm ci` alone is enough; `dist/` is committed, so there is
nothing to build first. If a docs-app build has already failed once, clear
`docs-app/.next` before retrying — the stale cache reports a misleading
`Can't resolve 'tailwindcss-animate'` long after the real cause is fixed.

Visual baselines are 191 committed PNGs captured in Linux containers:
`npm run visual` verifies, `npm run visual:update` rewrites them.

`design-tokens.json` is the only file to edit by hand. Everything under
`styles/` and `src/tokens/` is generated.

### Token shape

```jsonc
{ "$value": "#fec089" }                                  // mode-invariant
{ "$modes": { "light": "#fafafa", "dark": "#0a0a0a" } }  // mode-aware
```

A token with `$modes` must declare **every** mode. Partial coverage is a build
error, because silent partial coverage is how 15 of 150 tokens once ended up
with a light value while the other 135 quietly did not.

`$`-prefixed top-level groups are excluded from CSS and TS output:
`$conventions` holds prose that is not a value (`"48px / 64px (md+)"`), and
`$antiPatterns` catalogues colours that exist to be *forbidden* — they used to
live under `color`, which meant they were emitted as real utilities and the
linter allowlisted every banned hex.

### Naming

Authored camelCase, always emitted kebab-case: `chrome.surface.midGray` becomes
`--color-chrome-surface-mid-gray`. One rule, no per-token overrides, so the
output is auditable. The digit split needs two or more preceding letters, so
`deep2` becomes `deep-2` while `h1` and `h2` stay intact.

### Base mode

`--base-mode` decides which mode seeds the bare `:root`, so a document with no
theme class still renders. It is a flag rather than a constant because the two
apps invert: the marketing site hardcodes `<html class="dark">`, the dashboard is
light-default. Same JSON, two emissions.
