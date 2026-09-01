# @skene/design-system

Tokens, the Tailwind v4 theme, and the agent contracts. Consumed today by
`skene-site` and by `skene-marketing-website` — the live public site, which
installs 0.14.0 and reaches the package on 226 import statements across 36
files, more than any other surface. `skene-dashboard` is where the tokens and
the generators came from and still runs its own copies. Two consumers, not one
— see `machine/rules.yaml` for what each surface actually installs, and
`machine/layouts.yaml` for the layout contracts — what this package ships,
what it only records, and the marketing grammar its sections get composed into.

The "one consumer, not three" line that stood here until 2026-08-27 was
measured against `skene-marketing-website`'s `main`, where the dependency was
genuinely absent because the work sat on a branch. An agent that read it
concluded the design system did not apply to the site it was editing.

## For agents

Read these before writing a component. They ship inside the package, so they are
in `node_modules/@skene/design-system/`:

| file | answers |
|---|---|
| `machine/context.yaml` | **which module to reach for**, and what each one can also be used for. Start here. |
| `machine/components.yaml` | what you must not do with a given component. |
| `machine/rules.yaml` | the reach ladder, and the seven things never to do. |
| `machine/layouts.yaml` | the page-level geometry. Every block carries a `status`: `shipped_here` is the scale you can build on, `marketing` (`composed_here`) is the band grammar — rhythm, ground alternation, the 5fr/7fr split, the cream inset, the gap constants — that the public site composes these sections into. |
| `machine/compositions.yaml` | which sections a page of a given kind carries, in ten archetypes derived from 19 composing routes on `skene-marketing-website`. Every count in it is recomputed from its own route citations by `__tests__/compositions.test.ts`; `corpus.history` records the one time they were not, when the corpus dropped its two densest routes and every denominator went two short. |
| `docs/sections.md` | prose: the decision paths, and the overlaps with a verdict for each. |
| `inventory.json` | the generated index: every module with its exports, line count, gallery **cases** and authored usage, plus the ten resolved design decisions with their verdicts. This is what `seen:` in `context.yaml` points at. Import it as `@skene/design-system/inventory.json`, or read `docs-app/app/decisions/inventory.json` under the package root. |

Nothing pointed at these until 2026-08-13, which is the failure they were built
to prevent: the package has 89 modules and ten adjudicated clusters where the
same visual object was drawn twice, every one of them by somebody who could not
find the first. Each is in `inventory.json` with its verdict — the same ten
named two rows above, which this sentence read as "twenty" until 2026-09-01.
If you are about to write a card, a chip, a table, a framed window or a
textured field, grep `machine/context.yaml` first.

This repo exists because those two apps had drifted into one design system split
in half. The dashboard owned `design-tokens.json` and the generators; the
marketing site had no token file at all, just a block in `globals.css` marked
`@generated ... run npm run tokens:css` — a script that did not exist in that
repo. Its tokens had been generated in the dashboard and pasted across by hand,
and the pasting had stopped. A value-level diff of the two stylesheets found 253
custom properties, 127 in agreement and 12 in genuine conflict.

## Install

### From the registry. This is the path new consumers take.

```bash
npm install @skene/design-system
```

The scope stays `@skene`, and that is the entire reason this publishes to
npmjs rather than GitHub Packages. GitHub Packages' npm registry requires the
package scope to equal the repository owner, so the package would have had to
become `@skenetechnologies/design-system` — a rename that rewrites the import
specifier in every file of every consumer, which is precisely the churn this
package exists to remove. npmjs keeps the specifier, so a migration is one line
in a consumer's `package.json` and nothing else. The price is a paid plan and
an `NPM_TOKEN`. It is cheaper than the rename.

It is published **restricted**, so an install with no credential fails — and it
fails as a 404, which reads as "no such package" rather than "you are not
authenticated". Do not go looking for a typo in the name.

Two places the token belongs, and one it never does.

**Local dev: the developer's `~/.npmrc`.**

```
//registry.npmjs.org/:_authToken=<token>
```

**CI: a repository secret, given to npm by `actions/setup-node`.**

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    registry-url: https://registry.npmjs.org
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

`registry-url` is the load-bearing line: it is what makes setup-node write an
`.npmrc` that reads `NODE_AUTH_TOKEN`. Without it the secret is an environment
variable nothing consults, and the install dies with the same anonymous 404 as
no token at all.

**Never a project-level `.npmrc`.** That is a token in a commit. This
repository is public, and a committed credential is leaked the moment it is
pushed regardless — rotating it is the only remedy, and you find out you needed
to from a secret-scanning alert. `.npmrc` is gitignored here for that reason;
gitignore it in the consumer too.

### What a consumer gains by moving

- **No 36 MB clone on every cold CI install.** A git dependency fetches the
  repository, `.git` and all. The published tarball is 12.85 MB and arrives
  already resolved.
- **An ordinary semver range in `dependencies`**, resolved by npm, instead of a
  hand-maintained range embedded in a URL. That embedded range has gone stale
  four times; the note below is kept as the record of it.
- **`npm outdated` and Renovate start working.** Neither has anything to say
  about a git URL, which is why no consumer has ever been told a new version of
  this package exists.

### Legacy: the git dependency

Supported until every consumer has migrated, and not a day longer — it is also
why `dist/` is still committed and still gated. Everything from here to `## Use`
describes this path only.

Installed this way there is no npm registry and no npm token:

```jsonc
"@skene/design-system": "git+https://github.com/SkeneTechnologies/skene-design-system.git#semver:^0.17.0"
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
tag and pins the commit. At `^0.17.0` the range resolves `v0.17.0`, the tag the
release that bumped package.json to it also pushed.
(This sentence read `v0.3.0` for six releases, then `v0.10.0` for another, then
`v0.11.0` through the 0.12.0 release — the same drift the note above warns
about, in the paragraph that warns about it, now three times over. The 0.13.0
release is the first one the gates caught rather than a reader, and 0.16.0 and
0.17.0 the second and third: each time both the range and this sentence went
stale on the version bump and both failed the build before anyone read them. Treat it as
something a release updates, per that note, not something anyone remembers by
hand. `__tests__/package-contract.test.ts` fails while it is stale, which is
how this one was found rather than read.)

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

`docs-app/` is a Next app rendering 88 of the 89 modules as 97 cases in both
modes, and it is the instrument every duplicate collapse in this package was
proven against. The one module with no case is exactly the one
`machine/context.yaml` marks `seen: []` and tells an agent to treat as
unproven — `ui/sonner`, a toast host with no resting state to snapshot.

This sentence has now gone stale twice. It said "all 79 modules" until the
total reached 89, was corrected to "79 of the 89 modules as 85 cases, and the
ten that gained no case", and that correction was stale in turn — the real
figures were 88, 97 and one. A count in a document an agent is meant to trust
is a claim like any other, and this one is now gated: see
`__tests__/agent-entry-point.test.ts`, which reads them out of
`inventory.json`. Run it root-first:

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
