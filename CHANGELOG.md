# @skene/design-system

## 0.9.10

### Patch Changes

- `machine/context.yaml` now describes the eleven illustrations, not just the 79 code modules. Each asset carries its import, file, weight, kind, the modules that reference it, what it is for and what it is not for — the same contract a module entry has.

  Until now an agent could find the right component and then had to read prose to learn which halftone field belongs behind which artifact. That pairing is not decorative: the three card fields follow the live site, so the same backdrop always sits behind the same kind of artifact, and a page that picks the wrong one is wrong in a way no gate can see.

  Derived from `src/asset-urls.ts` and the source tree, authored in `scripts/context-data.json`, and gated four ways: every key `asset-urls` exposes is described, every asset has a `useFor` and a `notFor`, every named file exists at the recorded byte count, and no asset claims a consumer that does not reference it.

  Patch rather than minor deliberately: there is no runtime change, and a minor would push the version past `#semver:^0.9.0` — the range the README documents and the one consumer pins — stranding them on 0.9.9 for a contract addition they should simply receive.

## 0.9.9

### Patch Changes

- Documents a trap in `brand.peachDeep`. It is INVARIANT (#f97316 in both modes) while `brand.peach` and `brand.peachText` beside it are mode-aware, so the name reads as a sibling of a token that adapts and it is not one. Used as text on a cream ground it measures 2.51:1 against a 4.5 floor — skene-site shipped exactly that across four inline links at three viewports before a server-rendering gate caught it.

  Nothing could have caught it: `brand.peach-deep|*` sits in the contrast gate's `skip_pairs`, which excuses the token against every background. The skip stays, because the token is legitimately a gradient endpoint and a dark-ground accent, but its cost is now written on the token's own `$description` and beside the skip entry in `machine/accessibility.yaml` rather than living in two people's heads.

## 0.9.8

### Patch Changes

- `NumberedStep` gains `bodyTone: 'muted' | 'primary'`, defaulting to `muted`. Use `primary` when the step sits on media. Measured against the palest pixel of a dithered field: the muted role needs a 0.88 black scrim to clear 4.5:1, which is a wash opaque enough that the image stops being an image; the primary role clears at 0.50 and sits at 5.72:1 under 0.58, where the field still reads. A step over a photograph is a role problem, not a scrim problem.

## 0.9.7

### Patch Changes

- Closes the three remaining overrides skene-site needed to reach into this package's DOM for. Zero visual baselines move; every new prop defaults to what callers render today.

  `FeatureRow` gains `sheen` and `splitAt`. The sheen is 10% white over whatever the caller put in the visual panel, which is enough to take a label under the WCAG floor — measured at 3.801:1 / 3.896 / 4.230 across three viewports against 4.510 with it suppressed. The split breakpoint was hardcoded to `md`, wrong for a band whose visual is a table that scrolls, and overriding it hits a trap: an arbitrary variant like `min-[1200px]` sorts earlier than `md:` in the emitted stylesheet and silently loses, which reads as "the override did nothing" rather than "the override was outranked". `splitAt` takes a named breakpoint for that reason.

  `NumberedStep` gains `onLight`, spelled and defaulted exactly like `CheckList`'s. `chrome.text.primary` is `#faf1e9`, the same value as `LightSectionCard`'s fill, so a step inside that card rendered headings that were absent rather than dim, and no gate could see it. 0.9.6 documented the escape hatch; a documented workaround is still a workaround, and a caller has to already know these roles are invariant to know the override is needed.

## 0.9.6

### Patch Changes

- Three defects reported by skene-site after adopting 0.9.4, all confirmed and fixed. Zero visual baselines move: 6/6 visual suites pass unchanged.

  `GlyphBadge` now owns its glyph type size via `glyphSize`. It owned the disc's diameter and not the glyph's size, and the docstring called that deliberate — so adopting the component exactly as documented moved skene-site's events rows from 13px to the page's ambient 16px, a visible restyle of a shipped section. A reviewer there read the docstring, measured the restyle, and recommended refusing the component; the extraction nearly failed on its own documentation. `glyphSize` defaults to `undefined` (inherit), so no existing caller moves.

  `ComparisonTable`'s scroll container is now `relative`. `TableCheck` and `TableDash` carry `sr-only` labels, which is `position: absolute`, and an absolutely positioned descendant is not clipped by an `overflow` ancestor unless that ancestor is its containing block. Without it the spans escape the scroll region and add their offset to the page's horizontal extent: skene-site measured `/pricing` scrolling sideways by 320px at 390 and fixed it at the call site, paying for a package bug in a consumer.

  Eight section modules were missing from the root barrel — `glyph-badge` and `traffic-lights`, which were extracted in 0.9.x for exactly the consumer that then could not import them from the root, plus `agent-callout`, `faq-band`, `recommendation-card`, `score-ring`, `surface-tiles` and `terminal-block`, which nobody had noticed at all. A test now asserts every `src/sections/*.tsx` is exported from `src/index.ts`.

## 0.9.5

### Patch Changes

- Fixes found by verifying the published package from a clean clone rather than from a working directory.

  The contrast gate's summary counted waived failures as passes: it printed `PASS — 66 pair(s) meet WCAG AA` while 64 met it and 2 sat at 3.46:1 under `KNOWN_GAPS`. The waiver is legitimate; counting it in the one line anyone reads is not, and "66 pairs" had propagated into release notes. It now prints `64 of 66 … 2 waived`.

  The README's own usage sample documented `tokens.color.brand.peach` as `"#fec089"`, which is the dark value alone — copying the line put `[object Object]` into a style value, in a code block whose next paragraph explains that mode-aware tokens surface as `{light, dark}`. Corrected, and every `tokens.color.*` sample in the README is now asserted against the real export.

  The README also documented no install step and never mentioned `docs-app`, the gallery that every duplicate collapse in this package was proven against. Both added, including the root-first ordering constraint: `docs-app` resolves the package by symlink, so the root `npm ci` must run first or the build dies on `@radix-ui/*` inside `dist/`.

## 0.9.4

### Patch Changes

- Corrects `machine/rules.yaml` and the README: `skene-marketing-website` does **not** install this package (zero matches in its package.json, lockfile and source, at HEAD and at origin/main). The `installs` flag is what an agent reads to decide which surfaces a change can break, so the contract was claiming reach the package does not have. One consumer, not two.

  Ships the four files the contracts tell an agent to open — `scripts/check-token-contrast.ts`, `__tests__/roles.test.ts`, `__tests__/package-contract.test.ts` and `CHANGELOG.md` — which `files` previously excluded, so following `machine/rules.yaml`'s "trust that file over this one" produced ENOENT. A new test fails if a contract ever again cites a path outside the tarball.

## 0.9.3

### Patch Changes

- Prepared for a public repository: adds a LICENSE (deliberately not open source — the package carries the Skene brand marks), removes an internal Figma file key and seven internal stocktakes, and replaces the README's private-repo install section with the measured mechanism. npm fetches a GitHub dependency as an anonymous codeload tarball and never invokes git, so a public install needs no token, no SSH key and no `insteadOf` rewrite; the `git+ssh://` URL a lockfile records is not an instruction. A commit that no longer exists is the one thing that does still break a consumer.

## 0.9.2

### Patch Changes

- Generate `docs/brand.md` and `machine/tokens.yaml` instead of shipping frozen copies that claimed to be generated. Both named a generator absent from this repository and had never been rewritten since arriving from skene-dashboard: between them they carried 137 of 221 tokens, omitted the whole of `color.chrome.*`, collapsed every mode-aware token to its dark value and dropped every `$description`. Now written by `scripts/generate-token-docs.mjs`, gated by `npm run tokens:check` and by a coverage test that fails if a role goes missing from either document.

  Also corrects twelve stale factual claims across the shipped prose and the two hand-written contracts — module count, the light-mode contrast figures in `machine/accessibility.yaml` and `docs/principles.md` (all four brand tokens clear 4.5:1 and have since 0.5.x), a wrong-pair contrast figure in `docs/sections.md`, the README's six-release-stale install verification, a `coverage_canon` pointing at a file in another repo, and scope banners on the two documents that are dashboard prose kept for their reasoning.

## 0.9.1

### Patch Changes

- The README's documented install range is now checked against the version.

  That line has gone stale four times: `^0.1.0` against 0.2.0, `^0.4.0` against
  0.6.0, `^0.6.0` against 0.8.0, and — an hour after being corrected by hand —
  `^0.8.0` against the 0.9.0 released on top of it. A caret range on a 0.x version
  does not cross a minor, so each of those documented an install resolving nothing.

  Four manual fixes is the evidence it is not a memory problem.
  `package-contract.test.ts` now parses every `#semver:` range out of the README
  and asserts it satisfies `package.json` version. Mutation-tested by putting
  `^0.8.0` back: one failure, quoting both numbers.

## 0.9.0

### Minor Changes

- 7cc1ea7: `GlyphBadge`, `TrafficLights`, and a `surface` variant on `Card`.

  Three recipes that consumers were hand-rolling, extracted so there is one
  implementation of each rather than one per repo.

  `GlyphBadge` is the disc `TrustFact` draws, now its own export at a settable
  size. `TrustFact` composes it at its defaults and renders identically; a caller
  who wants the 32px version — skene-site has three rows of them — takes the badge
  directly instead of restyling a section to shorten a local file.

  `TrafficLights` replaces four copies of three coloured dots: two in skene-site's
  routes and two inside this package, in `terminal-block` and `pr-review`.
  `patterns/terminal` still draws its own through `effects.css`; that divergence is
  the recorded `terminals` decision and this is not the commit that settles it.

  `Card` gains `variant="surface"` and `asChild`, covering the
  `rounded-xl border border-surface-border bg-surface-1 p-[24px]` recipe inlined
  eight times across skene-site plus six near-copies that added `block` or
  `no-underline` — which is what `asChild` makes unnecessary.

  Also documents what `LightSectionCard` does to its children: `NumberedStep` is
  built from the invariant `chrome.text.*` roles, so inside that cream card its
  heading and body are `#faf1e9` on `#faf1e9` — absent rather than dim, and no
  build step catches it. The `light-section-card-steps` case renders the real
  composition with the two overrides a caller needs, so the baseline records the
  actual cost.

  Four cases added, eight baselines, zero modified — the existing `ui-card`,
  `section-trust-panel`, `section-terminal-block` and `section-pr-review`
  baselines hold, which is what proves each change was additive.

### Patch Changes

- a448be0: `machine/components.yaml` no longer documents components this package does not ship.

  Ten entries sat under `dashboard_chrome:` with `path:` values pointing into
  skene-dashboard — `components/dashboard-chrome/StatusPill.tsx` and friends — so
  an agent reading the package's own contract was told to open files that are not
  in it. Same class as the phantom `./theme.css` export: a string nothing
  validated.

  The key is now `consumer_overlay:` and names the repo it describes, so the block
  reads as "what that consumer has" rather than "what this package exports". Two
  tests enforce the distinction: every `import:` anywhere in the file must resolve
  inside `src/`, and every entry under `consumer_overlay` must NOT. Both
  mutation-tested.

  Six of those components are candidates for a future `chrome/` tier here. That
  promotion is gated on the dashboard importing package primitives first —
  promoting sooner forks each one a second time, because their internals still
  resolve to the dashboard's local copies of `ui/*`.

## 0.8.0

### Minor Changes

- d4c181f: `TrustPanel` and `FinalCta` take an optional `eyebrow`.

  Both are bands that ship with a kicker above the heading, and neither had a slot
  for one — so a page with an eyebrow could not adopt either component without
  dropping the line. That is why two of the largest bands on skene-site's homepage
  stayed hand-rolled markup.

  A slot rather than a string, matching `links`: `TrustPanel` renders on cream,
  where `Eyebrow`'s invariant `chrome.*` colours are near-invisible, so the caller
  passes the chip with whatever override its ground needs. `FinalCta` is
  always-dark and needs no override, and the two gallery cases show that
  difference side by side.

  Optional, and inert when omitted — asserted rather than assumed: the existing
  `section-trust-panel` and `section-final-cta` baselines did not move. The two new
  cases are appended at the end of the gallery so exercising the slot adds
  baselines without reflowing any case above them.

  Placement, since both were judgement calls: in `TrustPanel` the eyebrow goes
  inside the lifted copy block, because the panel's glow is `absolute inset-0` and
  anything outside that wrapper renders underneath it. In `FinalCta` it goes inside
  the same `max-w-[940px]` centred column as the heading, so it centres on the
  heading rather than on the viewport.

- 82f8655: `FaqBand`'s eyebrow adopts `Eyebrow`, and gets 1px of its type back.

  The inline copy had drifted: `text-[10px]` where `--font-size-pill` is **11px**,
  and `px-2.5` where the other two copies use `px-2`. Nothing could have caught
  it — three hand-written copies of one span, and the token was only ever a
  default that none of them read.

  This is the one change in the sequence that moves pixels, and it moves more than
  its own: the chip is 1px taller, so every gallery case below it lands on a
  different fractional Y. 64 baselines were regenerated — 2 are the change, 62 are
  the reflow, each verified as a ±1px capture height or a sub-2/255 mean delta
  with nothing visible side by side. The mechanism is now written into
  `components.spec.ts`, because a failure list nobody can account for is a failure
  list somebody accepts blind.

- 9f2db7e: `Bridge` renders `Eyebrow` instead of a hand-rolled copy of it.

  The copy existed for a real reason — `Eyebrow`'s colours are invariant
  `chrome.*` and render near-invisible on this band's cream — but the fix for that
  is two overrides through `className`, not a second span carrying the same
  geometry and the same two inline styles. twMerge replaces the border and text
  utilities; the 11px/0.16em comes from the component.

  Zero baseline movement, which is the proof the two were identical.

- c1bcebb: Six internal duplicates collapsed. No export removed, no pixel moved.

  `VerifyRow` and `MetaPill` were character-identical in `evaluator-verify` and
  `evaluator-panel`, which the second file's own header asked someone to fix.
  `artifactHeader` and `PanelCaption` join `artifact-shell`: the crumb+bar preamble
  was written out in three artifacts with the same explanatory comment each time,
  and the panel caption strip in four — `McpBlock` is that strip wrapped in an
  `AppPanel`, under a name that hid the fact. `STATUS_TOKEN` moves to
  `src/lib/status.ts`: `good | warn | danger` mapped to matcha/amber/red existed in
  three character-identical copies plus a fourth in `pr-review` under severity
  names. `BindingTag` and `MetaPill` are now `TagChip`, and `AskWidget`'s inline
  badge is `Chip tone="outline"` — the fourth tone `chip.tsx` said belonged there
  "the day something actually renders it", which had already happened.

  Two copies were NOT merged, and that is the point of diffing first:
  `evaluator-check`'s note strip has no `[&_code]` rules, so adopting the shared
  one would restyle a `<code>` and move pixels; `flow-diagram`'s is a `<p>` where
  the shared one is a `<div>`, and a paragraph is the right element for prose under
  a figure. Both are now commented in place with the reason.

  Proof: the visual suite green after each change with zero baseline movement, on
  the 16 artifact cases added the same day — which is what made these provable at
  all.

- 8a58d12: `machine/context.yaml` was not valid YAML. It is now, and a test says so.

  26 prop types were emitted as `type: CurvePoint[]` inside a `{ … }` flow
  mapping, where `[` opens a sequence and the parser dies on the next comma. Every
  array type in the package: `React.ReactNode[]`, `DiscoveryEvent[]`,
  `VerifyRequirement[]`. The emitter quoted scalars by the block-context rules and
  wrote them into flow context.

  It shipped in the file `README.md` lists first and labels "Start here", and the
  file `machine/components.yaml` forwards to. A consumer calling `yaml.load` got
  an exception; one with a `try`/`except` got silence and fell back to guessing —
  the exact failure the file exists to prevent. Caught by the session building
  skene-site, which tried to load it.

  The tests asserted the file EXISTS and that the README MENTIONS it, never that
  it parses — the same shape as the phantom `./theme.css` the export-map test was
  written for. `package-contract.test.ts` now loads all six `machine/*.yaml`, and
  for `context.yaml` asserts the shape a consumer indexes into rather than only
  that a parse returned something. Verified by putting the broken file back: it
  fails.

- d4276e1: Named HTML entities in JSX are now a `must_not`, with a test behind it.

  `&check;` shipped in skene-site as six literal characters while `&harr;` two
  rows away rendered correctly. The JSX entity table is a subset of HTML5's and it
  differs by compiler — verified here rather than assumed: this repo's own tsc,
  given the two as adjacent text children, emits `"&check;"` undecoded and
  `"↔"` decoded. Entities in props never decode under any compiler.

  So the rule is not "know which table your bundler ships", it is "write the
  character". `machine/rules.yaml` records it under `must_not`, and
  `package-contract.test.ts` scans every `.tsx` under `src/`. Zero offenders
  today; mutation-tested by adding one.

- a447ee8: The public near-twins get a verdict each, and one collapse.

  Six pairs draw the same object from two sides of the marketing/product line.
  Nothing is removed — each gets a decision on `/decisions`, a `sameAs` link in
  `machine/context.yaml` that the test suite keeps resolving, and where the merge
  is genuinely neutral, one implementation.

  Kept apart, with the reason recorded: `PipelineStepper` / `JourneyTrack` (same
  geometry to the connector formula, but progress and health are different
  vocabularies), `PlanCard` / `BridgeNode` (the same card at inverted polarity —
  collapsing behind a `tone` flag is what `band-polarity` already rejected), and
  the tile shells behind `OverviewTile` / `CheckResult` and `ValueCard` /
  `QuestionCard`, where only the outer class string matches and the insides
  disagree on purpose.

  Collapsed: `StatChip` and `MetaChip` onto a private `Pill` base. There the whole
  box matched and only a gap, an ink role and two mix percentages differed, so
  those became parameters — which also turns the open question in
  `docs/sections.md` §2 about adopting the window chips' rectangle into a one-line
  change rather than two.

  `ArtFrame` / `SectionBackdrop` is recorded as **not** equivalent. They load the
  same three files under different key names and reached the same 6% inset and
  22rem floor independently, but `ArtFrame` adds a radius, an opaque ground and a
  second padding variant, so a merge moves pixels. `TerminalBlock` carries an
  `@deprecated` tag naming `patterns/terminal` — the two frames differ by 4px of
  radius — and stays exported, because removing one is a MAJOR that needs both
  consumers migrated first.

<!-- Reconstructed 2026-08-13. Every release up to 0.5.4 was cut by hand with
`npm version`, so `changeset version` never ran and eight changeset files sat
unconsumed in .changeset/. The first real run folded all eight into 0.6.0,
which claimed changes that had shipped as far back as 0.3.0. Each entry below
is filed under the release its commit is actually reachable from, per
`git tag --contains`. -->

## 0.7.0

### Minor Changes

- f373323: `TerminalBlock` gains `onCopy`, reporting every copy attempt and its outcome.

  The component swallows clipboard failures on purpose — flashing "copied" for a
  copy that did not happen is worse than silence — and that is still what the
  reader sees. But the silence was total: a consumer had no way to tell "nobody
  copied" from "the copy button does not work on this origin", and clipboard
  writes fail routinely on insecure origins and whenever a user declines the
  permission.

  Found while instrumenting skene-site. Copying an install command is the
  strongest activation signal a marketing site can observe, because the next thing
  the reader does happens in a terminal nobody can see — and it was the one event
  in that site's journey baseline that could not be wired without a package
  change.

  `command` is what actually reached the clipboard, which is not always what is on
  screen: a line may carry a `display` override, and the clipboard gets `command`.

- 1f927b9: Context for all 77 modules, and `scripts/usage-data.json` retired.

  The 21 entries that existed were good prose in a file no consumer received. They
  are migrated verbatim — the writing was verified and rewriting it would have lost
  that — with a `via` citation back-filled onto every claim. That back-fill was the
  audit: 67 of 243 bullets could not name a prop on the first pass, and working
  through them found two real gaps in the derivation rather than two bad bullets.

  Row and item types are now derived (`CurvePoint`, `DiscoveryEvent`,
  `Integration`, `VerifyRequirement`), because half the reuse in this package is
  "the row's note is a ReactNode, so a chip goes there as easily as a sentence" —
  a claim about a type, which the prop table alone cannot check. Override surfaces
  are derived too: whether a module writes an inline style that beats any class you
  pass, whether it merges a className, whether it carries `use client`. A claim
  about a mechanism is checkable against the mechanism; it just is not a prop.

  `docs-app`'s `/decisions` page now reads the same authored file, so its reuse
  panel covers 77 modules instead of 21 and there is one source rather than two.

  The coverage allowlist is empty and hand-written. It landed computed — filter the
  modules that have no entry — which is an exception list derived from the thing it
  polices, and therefore a gate that could never fail.

- 6369c62: `machine/context.yaml` — which module to reach for, and what else each one does.

  Nothing shipped answered that question. `machine/components.yaml` `rules` are
  prohibitions, correct and orthogonal; the file-header comments say what a
  component was BUILT for, which is the framing that makes a reader write a
  near-copy; and the two files that were use-case framed — `scripts/usage-data.json`
  and the generated `inventory.json` — are both outside `package.json` `files`, so
  a consuming agent has never seen either.

  Generated by `scripts/build-context.mjs` from `scripts/context-data.json` plus
  facts derived from source: exports, client boundary, what each module composes,
  whether it forces a theme on its own subtree, which gallery cases show it, and
  the full prop table with types and defaults.

  Every reuse claim carries `via`, naming the prop, default or export that makes it
  true, and `__tests__/context.test.ts` fails a claim that cites nothing. A guessed
  reuse claim is worse than none: it sends an agent to the wrong component with
  confidence.

  Four gates, all wired into `verify`: coverage (a shrinking allowlist of modules
  with no entry yet), no orphans (an entry whose module was deleted still
  recommending it), referential integrity (`notFor`/`sameAs` must resolve to real
  exports), and freshness (`context:check`, byte-for-byte, exactly like
  `tokens:check`).

  Discovery is part of the change: the README had zero occurrences of `machine` or
  `docs/`, so nothing told an agent the contracts existed. It now opens with a
  "For agents" table, `machine/components.yaml` forwards with a `context:` key,
  `docs/sections.md` names its machine-readable companion, and
  `package-contract.test.ts` asserts all of it — the same guard class that caught
  the phantom `./theme.css`.

  Entries themselves land next; this release is the gate and zero authored modules.

### Patch Changes

## 0.6.0

### Minor Changes

- 466b978: The seven elements of the captured demo that had no component.

  `ScoreRing` (an arc with a value in it, `status` bound to the reserved
  `good | warn | danger` vocabulary and never peach), `AgentCallout` (the verdict
  block, both shipped instances), `RecommendationCard` (a proposal, deliberately
  without a status colour), `FaqBand` / `FaqRow` (the cream band the app kept
  re-assembling on top of `ui/accordion`), and `SurfaceTiles` / `SurfaceTile` /
  `SurfaceDetail` (the four surfaces on the halftone field).

  Plus `SkeneMark` in `patterns/`, which ships the real symbol as three files
  picked by the GROUND they sit on. Every place that drew its own stand-in — a
  ring glyph, a letter "S" — now uses the artwork.

  Three visual corrections in existing components, each verified in the browser
  against the capture:

  - `PlanGrid` is `items-stretch`. It was `items-start` on the reasoning that a
    stretched row would fight the featured card's translate; a translate never
    feeds back into layout, so all that bought was cards of unequal height whose
    prices and CTAs landed on different lines.
  - `AnnotatedCurve` strokes with a gradient that fades into the ground at the
    tail, and marks its points with rings rather than filled discs. At a constant
    weight with a filled dot the figure read as a diagonal rule with beads on it.
  - `ScoreRing`'s digits stack; set on one baseline the denominator is wider than
    the ring's inner diameter at every size.

- `SkeneLockup` — the symbol with the wordmark, in three tones.

  `onDark` and `accent` are byte-identical to the files
  `skene-marketing-website/public/img/` has been serving as `skene-logo.svg` and
  `skene-logo-accent.svg`; `onLight` is derived from `onDark` by swapping its 61
  fills, because the brand folder held no black lockup and a wordmark nobody can
  put on a cream band is a wordmark that gets redrawn locally.

  Sized by `height`, not `size`: the artwork is 1016×260, and one prop name
  meaning width in `SkeneMark` and height here ships at the wrong scale in
  whichever component the caller thought about less. `accent` is the one tone not
  named after its ground — peach symbol, white wordmark, dark grounds only.

  Also fixes `.changeset/config.json`, whose `ignore: ["skene-ds-docs"]` named a
  package that is not in this project. Every `changeset version` in this repo has
  failed validation on it; the version gate only ever checked that a changeset
  file exists, so nothing noticed.

- `asset-urls` — every shipped asset as a resolved URL string.

  The components already resolve their own artwork internally, so this is for the
  case they cannot cover: CSS written outside JSX. The marketing site styles its
  card animations with styled-components, where the texture is interpolated into a
  template string and there is no component to hand it to.

  The obvious alternative — the consumer imports the file directly and reads
  `.src` — was tried first and shipped `url("undefined")` into three live
  sections. Next's static-image transform, which is what turns an image import
  into an object with a `.src`, does not apply to a file imported out of
  node_modules under Turbopack, and a value whose shape depends on the bundler is
  not a contract this package can offer. `new URL(…, import.meta.url)` is resolved
  by every bundler and by Node, which is why the components were never affected.

  Names say what the asset IS — `journeyField`, `githubField`, `schemaField` —
  rather than `card1_bg`, which cannot be mapped to a purpose without the pairing
  table in `docs/sections.md`.

## 0.5.2

### Patch Changes

- ed40e58: Re-derive the on-tint labels and `mutedForeground` against every ground they
  actually land on. 0.5.1 fixed one instance of this and left three.

  Measured across 24 real marketing pages at 390, 768 and 1440: 72 contrast
  failures in exactly three pairs.

  | Token                          | Ground             | Was  | Now  |
  | ------------------------------ | ------------------ | ---- | ---- |
  | `semantic.matchaOnTint`        | `rgb(227,229,225)` | 4.24 | 4.60 |
  | `semantic.warningAmberOnTint`  | `rgb(233,230,224)` | 4.21 | 4.60 |
  | `shadcn.mutedForeground` light | `rgb(244,244,244)` | 4.49 | 4.64 |

  **All three are the same mistake, and 0.5.1 made it too.** A value is derived
  to clear 4.5:1 against one ground, then shipped onto several. `matchaOnTint`
  was derived against a 10% tint, but `StatPill`'s `ok` state uses a 12% fill and
  the artifacts sit on more than one card colour. `mutedForeground` was derived
  in 0.4.0 to clear on `muted` and was never checked against `card`, where it has
  been failing ever since — 42 of the 72 failures, in every component that puts
  quiet text on a card.

  The derivations now take the worst of every observed ground rather than a
  sampled one, with 0.1 of headroom.

  `mutedForeground` is a shared shadcn slot, so this moves a colour the dashboard
  also uses. It is a bug fix on a value that fails AA, and it is the second time
  this token has been darkened for exactly that reason; patching consumers around
  it does not scale, which 0.5.1 demonstrated by fixing `AppWindow`'s breadcrumb
  and missing `EvaluatorNote` and five other call sites.

## 0.5.1

### Patch Changes

- c213e92: StatPill labels were below the contrast floor on a light panel. Fixed by
  splitting the graphic colour from the text colour, the way the prototype
  already did.

  Measured off the rendered pill, at 390, 768 and 1440 alike: error-red 3.98 and
  4.36, matcha 4.26, amber 4.45, all against a 4.5:1 floor. Every status label on
  every artifact that renders inside `AppWindow`, which forces `light`.

  **The cause was not the gap the docs pointed at.** `known_gaps:
light_mode_brand_palette` quoted amber at 1.83:1 and error-red at 3.31:1, and a
  section written from that table in 0.5.0 repeated those numbers. They were two
  releases stale: 0.4.0 added light-mode variants for exactly these tokens and
  they were in use — the failing red _was_ `#c44239`, the light value. The real
  fault is narrower. Those variants were derived to clear 4.5:1 on the light
  **surface ladder**, and a pill does not sit on the surface ladder; it sits on a
  10% tint of its own graphic colour, a warmer ground, and the derivation missed
  it by 0.05 to 0.52.

  So this adds `semantic.errorRedOnTint`, `semantic.warningAmberOnTint` and
  `semantic.matchaOnTint`, derived against the ground the label is actually on
  with 0.1 of headroom rather than the minimum. Additive: no existing token value
  moves, so nothing that passes today changes. Dark values are the base tokens
  unchanged, because the dark tint is dark and the base already clears.

  The dot keeps the graphic colour rather than `currentColor`. It is a 6px shape,
  not text, so it is not held to a text floor, and leaving it undarkened keeps
  the pill's read at a glance.

  `AppWindow`'s breadcrumb moves from `muted-foreground` to `text.muted`. The
  shadcn slot measured 4.49 on that card, which is a real miss and not a rounding
  one, but it is shared with the dashboard and moving its value to win 0.01 here
  would reach further than the problem.

  `rules.yaml`'s gap entry is rewritten with what is actually true, and now says
  to trust `scripts/check-token-contrast.ts` over its own prose. The stale table
  did real damage: it sent a reader after the wrong problem with confident wrong
  numbers, which is the same failure mode as a checker that fails toward a pass.

## 0.5.0

### Minor Changes

- 8078a0d: Sixteen marketing artifact sections, ported from the site prototype.

  `ArtFrame`, `ArtPanel`, `AppWindow`, `StatPill` and `DataTable` are the shared
  shell; on top of them `PrReview`, `SideBySideDiff`, `DiscoveryTable`, `Funnel`,
  `KeyValueTable`, `EvaluatorList`, `EvaluatorCheck`, `EvaluatorVerify`,
  `EvaluatorPanel`, `LifecycleCanvas`, `McpBlock`, `IntegrationRows`,
  `OverviewTiles`, `FlowDiagram` and `TerminalBlock`.

  These are the artifacts the marketing site argues with: the PR review that
  names a broken event, the schema diff, the discovery table, the funnel with a
  dated break. They existed only as HTML inside a Python generator and 783 lines
  of app-local CSS at `site-plan/prototype`, so `skene-site` could not be built
  "from design-system sections" without them, and every one mapped to nothing
  already here. That is `ask_first_when:
a_needed_primitive_or_pattern_does_not_exist`; the founder chose the package
  over app-local components on 2026-08-12, on the reasoning that these ARE the
  marketing surface's visual language and this package is its source of truth.

  All content is props. The package ships no copy, so every string in the
  prototype's markup became a named prop. Real event names and repositories stay
  with the consumer.

  `TerminalBlock` is the only client component, because its copy-to-clipboard
  button needs state, and it is deliberately absent from the barrel: a
  `"use client"` directive on a re-exported module poisons the barrel for server
  rendering. Import it from `@skene/design-system/sections/terminal-block`.

  Two things worth knowing about the port. `StatPill` renders its status dot as a
  real element rather than the prototype's `::before` with `background:
currentColor`: a pseudo-element dot tinted by currentColor vanishes when the
  pixel-contrast harness makes glyphs transparent, and is then counted as a glyph
  pixel. And `PrReview` has no `actions` slot and takes no children, because an
  earlier version of that artifact drew an "Apply fix" button that the product
  does not have; enumerating the parts is what stops a caller adding it back.

- bcd770f: Light-mode variants for the brand and state colours, and a contrast gate that
  can actually see the shadcn slots.

  **Minor, not patch.** No token is renamed or removed, so nothing breaks by name.
  But five previously invariant tokens gain `$modes`, which means a consumer
  rendering them under `.light` now gets a different colour than it did before:

  | token                         | was       | light now |
  | ----------------------------- | --------- | --------- |
  | `color.brand.peach`           | `#fec089` | `#89684a` |
  | `color.brand.peachText`       | `#3b2402` | `#faf1e9` |
  | `color.semantic.matcha`       | `#d7f4ab` | `#677552` |
  | `color.semantic.warningAmber` | `#e6b450` | `#886a2f` |
  | `color.semantic.errorRed`     | `#f25246` | `#c44239` |

  Dark values are unchanged in every case, so a dark-only consumer (the marketing
  site today) sees no visual difference at all.

  Also changed:

  - `shadcn.sidebarPrimary` dark is brand peach instead of shadcn's default blue,
    and `shadcn.sidebarPrimaryForeground` inverts with it.
  - `shadcn.mutedForeground` light darkens from `oklch(0.556 0 0)` to
    `oklch(0.546 0 0)` — the stock value is 4.35:1 on `muted` and fails AA.

  The light values are **derived, not designed**: each is the least-darkened
  hue-preserving value clearing 4.5:1 on the light surface ladder, recorded in the
  `$description` on the token. They are a floor for a designed replacement, not a
  palette anyone chose.

## 0.4.1

### Patch Changes

- 7cc276e: `tailwindcss-animate` moves from devDependencies to dependencies, which fixes a
  consumer install that could never have worked.

  `styles/index.css` carries `@plugin "tailwindcss-animate"`, and `@plugin`
  resolves relative to the file that declares it. So the requirement belongs to
  this package, not to the app importing it. Declaring it as a devDependency
  meant it resolved everywhere inside this repository and nowhere outside it: the
  first `next build` in a fresh consumer died with

  ```
  CssSyntaxError: tailwindcss: Can't resolve 'tailwindcss-animate' in
    node_modules/@skene/design-system/styles
  ```

  at the import of `styles.css`, before any of the consumer's own code compiled.

  Nothing here could have caught it. `docs-app` builds inside the repository, so
  it has the devDependency too, and both existing consumers predate the package
  split and carry the plugin in their own `package.json` already. It was found by
  installing v0.4.0 into a clean Next 16 app, which is the only place the
  distinction between a dev and a runtime dependency is observable.

  `__tests__/package-contract.test.ts` now parses every `@plugin` and `@import` of
  a bare specifier out of `styles/*.css` and asserts each one is in `dependencies`
  or `peerDependencies`. Confirmed to fail with the plugin back under
  devDependencies before the move was made.

  `dependencies` rather than `peerDependencies`, per the rule the same test file
  already states: peer only the singletons. A Tailwind plugin has no runtime
  identity, so a duplicate copy costs a few KB and behaves identically, and
  peering it would make every consuming app range-match it by hand forever.

## 0.4.0

### Minor Changes

- 9a7c8a1: Remove the `./theme.css` export, and gate the export map against the disk.

  `./theme.css` mapped to `styles/theme.css`, which has never existed in this
  repository. No consumer could have used it: Node resolves the subpath and then
  fails on the read, so the entry was unreachable from the day it was written.
  Removing it is therefore not a breaking change despite being a removed subpath.
  There is no separate theme stylesheet, and there was never meant to be. The
  `@theme` and `@theme inline` blocks live in `styles/index.css`, which is what
  `./styles.css` already exports and what the README documents.

  The reason it survived is the part worth fixing. An `exports` target is a plain
  string; nothing validates it, and the failure only appears inside a consumer,
  where it reads as the consumer's bug rather than this package's. So
  `__tests__/package-contract.test.ts` now walks the whole export map, including
  the nested `types`/`default` conditions, and asserts every target exists. It
  was confirmed to fail on `./theme.css` before the entry was removed.

  Wildcard subpaths are checked at their directory prefix, and `dist/` targets are
  skipped when `dist` is absent, so `npm test` still runs green on a fresh clone
  before `npm run build`.

## 0.3.0

### Minor Changes

- 2883783: Sections: 21 marketing-page bands, from the captured demo and the live homepage —
  FeatureRow, ProductWindow, Finding, CheckList, PlanCard, FinalCta, SiteFooter,
  SectionBackdrop, Bridge, PipelineStepper, AskWidget, AnnotatedCurve,
  LightSectionCard, StatChip/MetaChip, Chip, JourneyTrack, ValueCards,
  QuestionGrid, TrustPanel, ComparisonTable, BillingToggle.

  Tokens 2.4.0 → 2.7.0: the marketing ladder (accent._, chrome.line._,
  chrome.text.mutedWarm\*, radius.2xl/3xl) and the vendor palette (GitHub Primer
  light, Supabase brand) under terminalChrome.

  The contrast gate can now see `rgba()` and composites translucent foregrounds
  over their background — two tokens had never been measured. Cross-repo pairing
  tests bind the texture pairing and the prototype's token transcription.
  machine/components.yaml parses for the first time and now covers patterns.

  Additive throughout. The one breaking change is internal: FeatureRow's `subtitle`
  and `action` became `lede` and `actions`, matching LightSectionCard. No external
  consumer existed.
