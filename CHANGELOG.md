# @skene/design-system

## 0.23.1

### Patch Changes

- fix: `HubCard` takes `linkAs` instead of `asChild`

  `asChild` merges props into the caller's **single** child, and `HubCard` renders
  three of its own — header, body, call to action — so `Slot` has nothing to merge
  into and throws `React.Children.only`.

  This is not theoretical. 0.23.0 shipped with `asChild`, and the first consumer to
  adopt it failed its production build prerendering `/resources` on exactly that.

  `linkAs` inverts the relationship: the caller names the component that should be
  the root (`next/link`, a router link, or nothing for a bare anchor) and this
  component keeps ownership of what goes inside it.

  `asChild` is gone rather than deprecated. It shipped for one release, had one
  adopter, and that adopter could not build with it, so there is nothing in the
  field to keep working.

## 0.23.0

### Minor Changes

- feat: `HubCards` and `HubCard`, the grid where every card is a whole link

  Extracted from `skene-marketing-website`, where it existed **twice** under two
  names that had no idea about each other. `core/ResourceCard` drew the five cards
  on /resources; `core/PLGHub`'s `TopicCard` drew the cards on
  /resources/playbooks and /product-led-growth. Their grounds are byte-identical —
  same 1px hairline, same radius, same 24px padding, the same
  `rgba(20,20,20,0.6)` fill lifting to 0.8 on hover with the border going to peach
  — because one was copied from the other and neither knew.

  **The copies had drifted in exactly one place, and it is why this is a component
  rather than a convention.** `TopicIcon` took its colour as a prop, and its single
  call site passed the literal `#fac089`. The brand peach is `#fec089`. One
  character, shipped, invisible to every gate in that repository because a raw hex
  inside a styled-components prop is not a Tailwind arbitrary value. The icon here
  takes no colour prop: there was one colour in use and it was meant to be the
  brand's.

  **The whole card is the link**, which both originals did — the target is the
  card, not the six words at the bottom of it. `asChild` is there because the
  consumers are Next apps and `next/link` has to BE the root rather than sit
  inside it. Without it a caller nests an anchor in an anchor, which is invalid
  and which no typechecker reports.

  The supporting lines are a slot rather than a `details: string[]`, because the
  two originals filled that space differently: /resources listed bullets, the
  playbook cards wrote a labelled line. An array prop would have served one and
  forced the other back into a local copy, which is how there came to be two.

## 0.22.0

### Minor Changes

- feat: `NoticeBar`, the full-bleed advisory bar

  Ported from `skene-marketing-website`'s `ArchiveBanner`, which is being retired.
  Seven of its route-group layouts render one to say the page below is from an
  earlier version of the product.

  **It is not a variant of `Alert`, and the difference is structural.** `Alert` is
  an inset card with a title and a description that sits IN the content: bordered
  on four sides, rounded, inside the page's measure. This spans the viewport, sits
  ABOVE the content, carries one line, and separates itself with a single hairline
  underneath. Neither can be expressed as a variant of the other without one of
  them growing a prop that removes its own shape.

  `docs/design-system-gaps.md` in that repository recorded the absence twice, as
  gap 4 ("no callout or advisory primitive") and gap 5 ("`Alert` has no `warning`
  variant and hardcodes `role='alert'`"). This closes the first and sidesteps the
  second by taking `role` as a prop: `note` by default, because an advisory about
  the page you are already on is not an assertive live region that should
  interrupt a screen reader mid-sentence.

  **The fill is translucent on purpose.** `rgba(255,255,255,0.04)` over
  `--color-chrome-line-subtle`, both compositing rather than covering. Every page
  this sits on paints a textured header beneath it, so an opaque
  `--color-chrome-surface-*` fill would punch a flat rectangle through the dither.
  The 0.04 is transcribed from what it replaces and has no token here, because the
  package ships no alpha that low.

## 0.21.0

### Minor Changes

- fix: re-sync `JourneySignalScene` with the source it was ported from

  The port happened on 2026-08-25 and the two copies then drifted, in one
  direction: `skene-marketing-website` put six more commits into its copy and
  this file got none of them. Anything else consuming this section was rendering
  a stale scene, and the drift was invisible from either side.

  What arrives with the re-sync:

  - **Two evidence sets instead of one.** `EVIDENCE_ENG` and `EVIDENCE_GTM`, on
    founder direction 2026-08-26: the panel showed a file path and a table in
    BOTH views, which is the engineer's answer handed to a GTM reader who has no
    use for it. The scene's whole claim is that one signal has two readings, and
    Evidence was the panel not making it. `EvidenceSource` widened from
    `"code" | "db"` to include `"metric"` and `"flow"` to carry it.
  - **A copy correction, 2026-08-29.** "the metric it moves" became "the number
    it reports into". The shipped string asserted that the step MOVES the metric,
    a causal claim the consumer's `voice.md:57` bans, and it contradicted the
    panel's own "Feeds" label eight lines away.
  - **A `$dark` prop** threaded through several styled components.
  - **gsap loaded inside the entry effect** rather than at module scope, the same
    change 0.18.0 made to `CardAnimationIntegrations` for the same reason.

  Neither of the two repository-local dependencies the source carried needed
  porting, which is worth recording because they looked like blockers. Its
  `useContainerScale` is character-for-character this package's
  `lib/use-container-scale` apart from quoting and a `'use client'`, and its
  `media` import from `@/styles/breakpoints` had **zero** uses in the file.

  The export shape is unchanged: a named `JourneySignalScene` and a default.

## 0.20.0

### Minor Changes

- feat: `Eyebrow` gains an `accent` tone

  The peach chip. Ported from `skene-marketing-website`'s `SectionBadge`, which
  is being retired as that repository moves its `(landing)` tree onto this
  package.

  That component drew `outline outline-1 outline-peach` with `text-peach` at
  11px, against `#fec089`, which is this package's `brand.peach` under another
  name. It had **74 call sites** across roughly a hundred routes and it was the
  only eyebrow that tree had.

  Without this prop those 74 chips would have migrated onto the muted chrome
  default, turning every section kicker on that tree grey. That is a visual
  change wearing a refactor's clothes, and it is the failure mode the whole
  migration is trying to avoid: adopting the design system should not be how a
  brand colour quietly leaves the site. The tone IS the visual, so the tone
  becomes a prop.

  `tone="accent"` wins over `onLight` when both are set. An accent chip is
  legible on either ground, so there is nothing for `onLight` to correct.

  The default is unchanged, so every existing call site renders exactly as
  before.

## 0.19.0

### Minor Changes

- c471362: feat: a z-index scale, blur tokens, and the two glass Button variants

  All three come from one place: `skene-marketing-website` is retiring the
  styled-components system that its 97 `(landing)` routes render from, and
  anything that system holds and this package does not has to land here first,
  or the migration reimplements it in the consumer and forks the design system
  by another name.

  Most of what that system held is already here under different names, which is
  worth writing down so nobody ports it twice. Its on-dark colour ladder
  (`--color-text-on-dark-muted`, `--color-hover-on-dark`, `--color-overlay`,
  `--color-background-dark`) is the `--color-chrome-*` family. Its
  `--line-height-relaxed` is `--font-line-height-relaxed`. Its transition scale
  is `--duration-*` and `--easing-*`, which have been here since before this
  change. Its three textures and its accent lockup are byte-identical copies of
  files already in `assets/`. None of that needed porting.

  Three things did.

  **`zIndex`, eight steps.** There was no z-index token of any kind here, so
  every consumer that stacks anything picks a number. That is how
  `skene-marketing-website` ended up with a sticky nav at a hardcoded `z-[1050]`
  sitting at the same level this scale calls `modal`. The steps are transcribed
  from the system being retired: base 1, dropdown 1000, sticky 1020, fixed 1030,
  modalBackdrop 1040, modal 1050, popover 1060, tooltip 1070.

  **`blur`, three steps.** `glass` 12px for a translucent control over artwork,
  `chrome` 8px for a sticky bar over content, `panel` 50px for a dropdown
  surface. Also transcribed. The `Button` variants below are the first caller,
  and adding the token with them is the point: a hardcoded blur inside a
  component is the same fork as a hardcoded colour.

  **`Button` gains `glass` and `glass-dark`.** A translucent control that sits
  ON artwork and reads through it, rather than on a surface. Nothing here
  covered it, and the retiring CTA pairs a solid primary button with one of
  these over a full-bleed texture. Alpha values are transcribed, not chosen.

  Both variants carry a `supports-[not_(backdrop-filter:blur(0))]` fallback that
  raises the background to an opaque-enough value where `backdrop-filter` is
  unavailable. Without it the control degrades to an 0.08 alpha wash over
  artwork, which is where the label stops being readable rather than merely
  losing its frosting.

  They reach the blur through `backdrop-blur-[var(--blur-glass)]` rather than a
  named utility. The generated `@theme inline` block registers colours only, so a
  blur token in `:root` produces no utility on its own, and hand-registering one
  in `styles/index.css` would give the value two homes that can disagree.

  **`assetUrls.pixelFieldSource`.** The full-resolution original of
  `pixelField`: 3,012,190 bytes against 146,850. Both already existed, in two
  repositories, with nothing connecting them, and the consumer was shipping the
  large one whole into one page's closing CTA. It is kept here because deleting
  it there would otherwise have destroyed the only copy. It is a re-encode
  source and never something a page renders; `context-data.json` says so in its
  `notFor`.

  **Known limitation, not addressed here.** The type scale has no responsive
  behaviour, and the system being retired does: its `--font-size-hero` is 67px,
  42px and 32px across three widths, and `--font-size-lg` is 24px, 22px and
  20px. The 67, 32, 24 and 20 rungs all exist here as flat tokens; the tablet
  values do not, and adding 22px and 42px as two more flat steps would preserve
  the numbers while losing the thing that made them work. Recorded rather than
  guessed at, because fluid type is a scale decision, not a token addition.

## 0.18.0

### Minor Changes

- 7c9970b: feat: `SectionBackdrop` can draw its field in CSS, and `CardAnimationIntegrations` loads gsap lazily

  Two changes, both closing findings from a Vercel performance audit of
  www.skene.ai, and both the same shape as fixes that shipped in 0.17.0.

  **`field` prop on `SectionBackdrop`.** Same API as `ArtFrame`'s: `'image' |
'css'`, defaulting to `image`, so every existing call site renders unchanged.
  The CSS path reuses `.skene-field` from `styles/effects.css`, so there is no new
  CSS, and `texture` maps onto the `data-field` values it already keys off
  (`journey → jr`, `github → gh`, `schema → db`).

  The module comment on this component records that an earlier attempt at a
  generated field "read as a chunky checkerboard next to the actual fine dot
  halftone". That note stands against that implementation and is why this is
  opt-in rather than a swap. What changed is the implementation: `.skene-field` is
  a three-phase radial-gradient dot grid over a linear wash with its nine colours
  sampled from the assets, reviewed side by side against the raster when it
  shipped for `ArtFrame`. The new `RasterVsCss` story renders the pair for all
  three textures so the difference stays reviewable.

  Why a consumer would want it: a raster backdrop on a full-width panel is a
  Largest Contentful Paint candidate that the preload scanner cannot discover,
  because a `background-image` in an inline style is not found until CSS has
  parsed and layout has run, after which it queues at Low priority. Measured on
  www.skene.ai on 2026-09-02, that discovery delay was 2,281 ms of a 3,454 ms LCP.
  A CSS field is not an image, so it can be neither the largest paint nor
  discovered late.

  **gsap out of module scope in `CardAnimationIntegrations`.** It was imported at
  module scope with `gsap.registerPlugin(ScrollTrigger)` beside it, which put gsap
  in the component's client chunk and that chunk in the initial script list of
  every page importing it: 45 KB gzipped on the two routes that render it, for an
  animation below the fold behind a ScrollTrigger that does not fire until the
  scene reaches 80% of the viewport. Both imports now happen inside the existing
  effect.

  The same change in the consuming app took its homepage initial JavaScript from
  310,100 to 265,801 gzipped bytes. `next/dynamic` around the component does not
  achieve this and was measured not to: without `ssr: false` the chunk stays in
  the initial list, and `ssr: false` removes the server-rendered markup, which is
  not acceptable for a component carrying copy.

  The cards start hidden and the timeline is what reveals them, so a failed import
  would leave the scene blank where a static import could not. The catch reveals
  them.

## 0.17.0

### Minor Changes

- a426e1d: feat: `ArtFrame` can draw its halftone field in CSS instead of as a raster

  **Why a second way to draw the same thing.** Largest Contentful Paint takes the
  biggest painted element on the page, and a raster backdrop on a full-width frame
  is almost always it. Measured 2026-09-01 with Lighthouse 13.4.1, mobile
  emulation, one page and the same artwork three ways:

  | field                            | LCP        | LCP element |
  | -------------------------------- | ---------- | ----------- |
  | image                            | 1534 ms    | the frame   |
  | image masked to its visible band | 1509 ms    | the frame   |
  | CSS                              | **640 ms** | the `<h1>`  |

  The middle row is the one worth writing down, because it is the fix everyone
  reaches for first. Painting the artwork only in the ~30px band that actually
  shows does not help: Chrome measures the element's painted box, not the part a
  reader can see, so occluding ninety percent of it changes nothing. Downscaling
  does not help either — the 0.05 bits-per-pixel threshold below which Chrome
  ignores an image is computed from natural size, and `card1_bg` re-encoded to
  900px still measures 0.55. Only not being an image works, and when it works LCP
  falls to whatever text paints first.

  On www.skene.ai the frames sit on the pricing, developers, evaluator and
  product pages, where measured LCP is 4.5–5.6 s against a 3.6 s site median.

  **What ships.** `field?: 'image' | 'css'` on `ArtFrame`, defaulting to `image`,
  so every existing call site renders exactly as before. `styles/effects.css`
  gains `.skene-field` with `data-field="jr|gh|db"`, the three washes as a
  gradient under three offset dot grids, with the nine sampled colours named as
  local custom properties rather than inlined — they are an approximation of a
  piece of artwork, not palette roles, and naming them keeps the provenance
  visible.

  **What it is not.** It is not pixel-identical. The assets are an ordered dither
  over a photographic wash; this is a regular grid over a linear one. At the band
  an `ArtFrame` shows it reads as the same material, and side by side at full
  bleed it is flatter and more even. The new `FieldsRasterVsCss` story renders the
  pair for all three kinds so the difference is reviewable rather than described.
  That is also why this is opt-in per call site: use it where the frame is big
  enough to gate LCP, and keep the raster where the field itself is the point.

## 0.16.0

### Minor Changes

- fcc748e: feat: per-module rules instead of a copied block; the design tree is served as well as shipped

  **The boilerplate was copied, not generic.** Every leaf carried the same 228
  tokens of non-negotiables — 38% of the smallest module pages. Measured across
  the 89 modules the rules do not apply evenly: the light-class warning binds on
  76 and on the other 13 it told the reader to worry about a class the module
  already applies; `content is props` is a sections/patterns concern and was noise
  on 30 primitives; `chrome.*` invariance touches about a third. Every input
  needed to say which bind was already in `context.yaml`.

  Module pages now carry **What binds this module**, computed from the module's own
  polarity, namespace and prose. 28 carry one rule, 31 carry two, 30 carry three —
  and `sections/trust-panel` now reads "you do NOT owe it the light class" instead
  of being warned about one it applies itself. Median module page 1,069 → 959
  tokens; the smallest 596 → 467; the tree 144,320 → 136,397. Page templates, the
  index, the token values and `DESIGN.md` keep the full set: those are the files
  where composition is decided and all three bind.

  **The tree is now served as well as shipped.** Three route handlers in the docs
  app expose `design/**`, `DESIGN.md` and `styles.css` as `text/markdown` and
  `text/css` with CORS open, so an agent with a URL and no checkout can fetch the
  same paths a consumer reads from `node_modules`. Serving the stylesheet is the
  half that matters most for context: the CSS loads in the reader's browser, and
  only the class names need documenting.

  An earlier draft of this change also REMOVED `design/` from the tarball, on the
  argument that it cost every install ~136k tokens. That was wrong and is
  reverted. Tokens are spent when something reads them; on disk the tree is 708KB
  beside 13MB of assets. Removing it saved nothing measurable and broke the one
  consumer that would publish it — which installs the package and serves the files
  straight out of `node_modules`. Shipping never prevented serving.

- b0a66d7: docs: split the module indexes into `design/index.md`, leaving DESIGN.md at ~3.7k tokens

  Measured after the token split: 8.9k of DESIGN.md's remaining 12.3k tokens were
  two overlapping answers to "which module?" — the intent index and the module
  catalogue. Every agent that opened the file to check a contrast floor, a spacing
  step or the `chrome.*` rule paid for both.

  They are now one fetch. `DESIGN.md` is **3.7k** and carries only what does not
  belong anywhere else: the three non-negotiable rules, surface roles, the reach
  ladder, `must`/`must_not`, the page archetypes, the spine, the scales, contrast,
  and known gaps. It opens with a routing table that prices each next fetch, so an
  agent can decide what to spend before spending it:

  | you are                                | open                          | roughly |
  | -------------------------------------- | ----------------------------- | ------- |
  | finding a module, by intent or by name | `design/index.md`             | 9k      |
  | reaching for one module you can name   | `design/<module>.md`          | 2k      |
  | building a whole page                  | `design/pages/<archetype>.md` | 3k      |
  | picking a colour or a value            | `design/tokens.md`            | 7k      |

  That table also says the thing the split makes easy to forget: there are 102
  files here and together they are larger than the YAML they were generated from.
  The split buys a cheap answer to one question, not a cheap corpus.

  Also fixes a real bug in the generator's `prose()` helper. It wrapped bare HTML
  tags in backticks with a lookaround, which fired _inside_ existing code spans —
  `` `design/<module>.md` `` came out as `` `design/`<module>`.md` ``, broken code
  with a stray tag. It now splits on code spans and rewrites only what is outside
  them. A check across all 102 emitted files finds zero lines with unbalanced
  backticks.

- 355196b: docs: emit `DESIGN.md` and one Markdown file per module and per page template

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

- 1a282ec: feat(evals): generate candidates by handing an agent DESIGN.md and nothing else

  `npm run eval` scored candidates; every one was hand-written, so the loop
  measured the scorer rather than a model. `npm run eval:generate` closes it.

  **The agent gets `DESIGN.md` and one tool, not a context dump.** Pasting the
  tree into the prompt would measure whether a big pile of docs works and prove
  nothing about the split the tree exists for. `read_design_file` resolves nothing
  outside `DESIGN.md` and `design/` — no `machine/*.yaml`, no source, no gallery.
  That restriction is the experiment: it puts the model in the position of an
  agent in someone else's editor with a URL and no checkout, which is the reader
  `DESIGN.md` was built for and the one nothing had ever tested.

  **The retrieval trace is the finding.** Every path opened is recorded, so a run
  answers what no other gate here can: which files an agent reaches for and in
  what order, how many it needs before it can build a page (the routing table in
  `DESIGN.md` claims one or two), and which paths it tries that do not exist — a
  miss being the docs implying a file that was never generated. Each candidate
  lands beside a sidecar carrying model, effort, turns, token usage, a dollar
  estimate and the trace.

  Claude Opus 5 with adaptive thinking, streamed, with the stable prefix
  (`DESIGN.md` plus the tree listing) cached across cases and repeats. `--dry-run`
  prints the plan and the full prompt without calling anything; credentials come
  from the environment or an `ant auth login` profile and are never prompted for.

  Runs write to `evals/runs/<stamp>/`, which git ignores — never to
  `candidates/`, where a generated file would turn a finding about the model into
  a red build. Scoring a run takes `--measure`, which reports without enforcing
  the `bad-*` fixture convention a generated candidate makes no claim about.

  **Not yet run against a model.** This environment has no API key, so no
  candidate has been generated and no trace collected. What is tested is the part
  that can be: the path sandbox against traversal, symlinks and contract-file
  escapes; the fence stripper, because a fence in the output would hide every
  import from the scorer and read as a page that imported nothing; and the tool
  schema. The first real run is the first real measurement, and may well find the
  harness needs adjusting before the design system does.

- afa33f6: feat(evals): score a page an agent built against the contracts it was given

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
  the default rhythm, so it saw two tall bands on pages with none. `polarity`
  tested `/\blight\b/`, which matches inside `bg-brand-light` — the very utility
  that paints the light ground — so the check read the defect as its own fix and
  passed the fixture written to fail it.

  Still missing, and named in the README: nothing yet generates a candidate by
  handing an agent `DESIGN.md` and nothing else. This measures that the scorer
  works and that the contracts are expressible as checks. It does not yet measure
  a model.

- 06d7c8b: feat(evals): a `props_exist` check; enum values where the prop is read; leaner page templates

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

- ed69537: feat(evals): render candidates and measure contrast on real pixels; add an advisory judge

  **`npm run eval:render`.** Source checks read the file, and the defect this
  package keeps shipping is not in the file — text at 1.08:1 happens when a token
  resolves wrong against a ground three ancestors up. The candidate is now bundled
  against the real `dist/`, server-rendered, given a stylesheet Tailwind generates
  by scanning `dist/`, and loaded in Chromium. Every run of visible text is
  measured against the floors in `machine/accessibility.yaml`, in both themes,
  because `chrome.*` and `themed` share their dark values and diverge only in
  light.

  It found the defect on its first full run: `bad-light-without-class`, written to
  trip the _source_ check, measures **1.07:1**. A source check and a pixel check
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

- dda6c34: assets: ship `skene-tui.gif`, the one design asset that lived in neither repository

  571 KB, the terminal UI running. It was under the marketing repo's
  `.webanatomy/build-page/_shared/assets/` — wireframe scaffolding, not a served
  directory — so the page drawn around it could not reach it. `/developers`'
  cream band shipped a `TerminalBlock` of static text instead, with a comment
  recording that the asset "lives only under `.webanatomy/_shared` and is not in
  `public/`".

  That is the cost of an asset stranded outside both repositories: not untidiness,
  a visible downgrade on a live page that nobody could fix from either side. The
  same consumer also carries eleven files under that directory which are
  byte-identical to `assets/` here, kept because the wireframes are static HTML
  served by `python -m http.server` and cannot resolve `node_modules`. Shipping
  this one closes the gap that had no workaround; the other eleven have one.

### Patch Changes

- 5cfae68: docs: the cluster count was twenty in seven places and ten in the registry

  "Twenty measured clusters where the same visual object was drawn twice" was
  quoted in `README.md`, `AGENTS.md`, both halves of the component skill, a test
  comment, `machine/compositions.yaml` and `scripts/build-context.mjs`. Nothing
  backed it. `inventory.json` holds **ten** adjudicated decisions, and `README.md`
  called them "the ten resolved design decisions" two rows above saying twenty.
  `docs/sections.md` — the file `AGENTS.md` says carries "every measured overlap
  with a verdict" — documents three.

  All seven now say ten and point at the registry. `compositions.yaml`'s
  "twenty-first duplicate cluster" becomes "an eleventh", which is the claim it
  was making: this is the next one, not one of the documented set.

  Gated in `__tests__/agent-entry-point.test.ts`, which reads the count out of
  `inventory.json` and refuses any of the six surfaces quoting another. The gate's
  own first cut failed open twice, and both were found by mutating each file in
  turn rather than trusting it:

  - it matched a single line, so it was blind to `ten adjudicated\n * clusters` —
    two of the six files wrap the claim mid-phrase behind a comment prefix. It now
    flattens comment markers and whitespace before matching.
  - it dropped ordinals as unparseable, so `the twenty-first duplicate cluster`
    passed silently. An ordinal is a different claim — it must equal the registry
    count plus one — and is now checked as one.

  Left alone: every other "twenty" in the repository is a real route or page
  count — the twenty competitor-comparison pages, the twenty routes of the
  largest archetype, the twenty pages the band grammar was measured on.

- 6c0097a: fix(inventory): `client` missed 21 of 28 client modules, and four quoted counts were wrong

  `build-inventory.mjs` tested `src.trimStart().startsWith("'use client'")` —
  single quotes only. 21 of the 29 directives in `src` are written
  `"use client";`, so `inventory.json` reported **7** client modules where
  `machine/context.yaml` reported 28. That file ships as
  `@skene/design-system/inventory.json` and is what `seen:` points at, so an agent
  reading it to decide whether a deep import keeps its server boundary got the
  wrong answer for 21 of 89 modules, silently. `package-contract.test.ts` matched
  the double-quoted form all along and never compared the two.

  Three documents had drifted off the same fact or off their own sources:

  - `AGENTS.md` said "only the 8 modules that need it carry the directive". 28 do.
    The 8 traces back to the inventory bug above.
  - `llms.txt` said 331 token values; `design-tokens.json` has 241. It also said
    the pages skill tabulates "eight archetypes" when the skill says ten and
    `compositions.yaml` carries ten — the index was wrong about the file it
    indexes.
  - `README.md`'s gallery paragraph said "79 of the 89 modules as 85 cases" and
    "the ten that gained no case"; the real figures are 88, 97 and one. That
    paragraph was itself written to correct an earlier staleness, and explains at
    length how the previous number rotted.

  All four are now gated in `__tests__/agent-entry-point.test.ts`, which reads
  each figure out of the generated source rather than trusting the prose. Before
  this the only gated count was "89 modules", in two of the three entry points —
  and its comment cited "the 8 modules that need `use client`" as its example of
  another count that was true.

  Reported, then fixed in a follow-up: "twenty measured clusters" was quoted in
  seven places — `README.md`, `AGENTS.md`, both halves of the component skill, a
  test comment, `machine/compositions.yaml` and `scripts/build-context.mjs` —
  with nothing behind it, while `README.md` said "the ten resolved design
  decisions" two rows above saying twenty. The registry holds ten.

- 682d8fa: docs: name the origin the design tree is served from

  `design/` stopped shipping in the tarball last change, which left every document
  routing an agent to a tree without saying where it is. The origin is now
  recorded once, as `designDocs` in the manifest —
  `https://www.skene.ai/resources/docs` — and read from there by everything that
  names it: `DESIGN.md`'s routing table now gives absolute URLs, `docs-app` derives
  its `basePath` from the same field rather than a retyped copy, and `AGENTS.md`
  and `llms.txt` name it in full.

  Gated two ways. Every entry point must contain the origin, and none may contain
  a _different_ skene.ai docs path — two documents naming two addresses for one
  tree is the same defect as a count quoted twice, except a wrong origin fails as
  a 404 in someone else's editor where nobody here will see it. Moving the origin
  without regenerating fails both tests.

  `DESIGN.md` also now points at the served stylesheet, `styles.css`, with the
  reason: load it in the page, do not read it — the class names are documented and
  the CSS never needs to enter a model's context.

  **Not yet true, and stated here rather than discovered later.** `docs-app` has no
  deploy step in this repository — CI builds and tests it and nothing publishes it
  — and `www.skene.ai` is, by this repo's own source comments, the live marketing
  site, which is a different repository. The routes and the `basePath` are correct
  for `docs-app` being deployed behind that path. If the marketing site is to serve
  these files instead, the three route handlers need to move there and only the
  manifest field stays.

- bc8f164: docs: name the address that already works — the repository is public

  `design/` was being routed to `https://www.skene.ai/resources/docs/`, which is
  not deployed yet, so every document pointed an agent at a URL that 404s. A
  document naming an address that does not answer is worse than one naming none.

  The repository is public, and GitHub already serves every file in the tree over
  HTTPS with `access-control-allow-origin: *`. Verified, not assumed:

  ```
  200   15,512 bytes  DESIGN.md
  200   23,236 bytes  design/index.md
  200    8,768 bytes  design/sections/artifact-shell.md
  200   10,161 bytes  design/pages/product-page.md
  ```

  That is the whole of "reachable by an agent with no checkout" — no deploy, no
  routes, no infrastructure. `DESIGN.md` now names that base beside the canonical
  origin and says the paths are identical: swap the base, keep the path.

  Derived from `repository.url`, not typed, so it cannot drift from the repo it
  points at; a test asserts the emitted base matches the manifest. The three route
  handlers and the canonical origin stay — that is where this moves when the docs
  app is deployed, and nothing about it needs to change when it is.

- bfa60a6: docs: the module index carried 89 full paragraphs on the route that must be cheapest

  `design/index.md` was 8,895 tokens, of which **6,371 was one section**: "By
  namespace", listing all 89 modules with the whole of each `useFor`. The intent
  index above it already covers the same 89 modules in 2,126 tokens, so the file
  paid for a second and longer listing of one set — on the one route you take when
  you do _not_ know what you are looking for, which is exactly the route that has
  to be cheap.

  It now carries the lead sentence, capped, the way the page templates already do.
  The full prose is one fetch away in the module's own page, which is where an
  agent goes next anyway.

  - `design/index.md`: 8,895 → **5,809** tokens
  - finding a module (DESIGN.md + index): 12,645 → **9,560**
  - the tree: 147,406 → 144,320

  Nothing was lost that the index needed: the nine rows that came out under 28
  characters are terse because the module is (`ui/button` — "The action
  primitive."), and 23 rows hit the cap and end in an ellipsis that points at the
  module page.

  Left at full length deliberately: a page template's `load_bearing` table, which
  names one or two modules a page of that archetype must carry. Two paragraphs
  there is not a listing, it is the answer.

## 0.15.0

### Minor Changes

- 9dbcd31: Twenty colour tokens the marketing site could not stop hardcoding, because
  nothing here held the value.

  `skene-marketing-website`'s `(landing)` tree carried 232 hardcoded hex colours.
  159 of them had a token and have been replaced. The other 71 occurrences — 20
  distinct values — had nowhere to go: the package modelled the family they belong
  to and stopped one rung short of each. This adds the missing rungs. Every value
  is exactly what the consumer already renders, so tokenising a call site is a
  rename and not a repaint.

  All twenty are `$value`, not `$modes`, and that is a decision rather than an
  omission. They are two kinds of colour that have no light variant to declare:
  fixed values imitating a third party's dark UI, and fixed neutrals on the
  `chrome.*` ladder, which `machine/rules.yaml` defines as invariant-always-dark.
  Giving any of them a mode map would claim a designed light value exists. None
  does.

  **`terminalChrome` — the rest of GitHub's dark palette (7).** The package had
  `githubDarkBg`, `githubDarkSurface`, `githubBorder` and `githubText`, plus a
  complete Primer _light_ set. The dark set was missing everything a check run is
  drawn with, so the PR mockup hardcoded it: `githubDarkMuted` (#8b949e),
  `githubDarkRaised` (#21262d), `githubDarkAccentFg` (#58a6ff),
  `githubDarkSuccessFg` (#3fb950), `githubDarkSuccessEmphasis` (#238636),
  `githubDarkDangerFg` (#f85149), `githubDarkWarningFg` (#e3b341).

  The `Dark` infix is load-bearing. `githubSuccessFg` and `githubDangerFg` are
  Primer _light_ values under unprefixed names, so an unprefixed dark sibling
  would read as their pair and would not be one. Success also needs two tokens,
  not one: `githubDarkSuccessFg` is the green text is written in and
  `githubDarkSuccessEmphasis` is the green that sits under text. They are not
  interchangeable and the consumer already used both.

  **`chrome.surface` — eight neutral rungs (8).** `overlay` (#0f0f0f),
  `hoverSubtle` (#111111), `band` (#161616), `card` (#1c1c1c), `hairline`
  (#1f1f1f), `divider` (#232323), `row` (#252525), `hoverStrong` (#525252).
  Named for the role each was observed doing rather than for its position, because
  the existing ramp is already role-named (`deep`, `midGray`, `elevated`) and the
  numeric rungs 0–3 are not value-ordered against them. `hoverSubtle`/`hoverStrong`
  mirror `chrome.line.subtle`/`strong` — the same qualifier pair one group over.

  `hairline` and `divider` are rules living in a `surface` group. That is
  deliberate and written on both: `chrome.line.*` is alpha-only by design, because
  those rules stack on four different grounds, whereas a rule inside a panel has
  exactly one ground and does not need to composite.

  `hoverStrong` (#525252) has a trap on it worth reading. That hex is already in
  this file — as the **light** value of the mode-aware `color.text.muted`, which
  resolves #8c8c8c in dark. A consumer that treats the two as the same token gets
  a different colour than it drew, and the marketing site's tokenisation pass did
  exactly that before it was caught.

  **`chrome.text` — two greys (2).** `grayCool` (#9ca3af, Tailwind `gray-400`, the
  inactive label in a tab or step row) and `caption` (#737373, the 9px uppercase
  eyebrow ink).

  `caption` is measured and it does not clear AA: 4.18:1 on `surface.0`, 3.78:1 on
  `surface.1`, against a 4.5 body floor. Both numbers are on the token. It is
  tokenised anyway because the consumer already ships that colour at every eyebrow
  and a token is the only thing that can fix all of them at once; raising it is a
  design call, not a token call. It is not added to the contrast gate's `PAIRS` —
  the rest of `chrome.text` is not either — so the gate's coverage is unchanged
  and the number lives where someone choosing the colour will read it.

  **`brand` — three warm tones (3).** `peachLight` (#fdd4aa), `creamDim` (#ecdccf),
  `bronzeDeep` (#5a4532).

  Two carry a near-miss warning. `peachLight` is the exact value the shadcn
  arbitration _rejected_ for `--primary-hover` in favour of #ebdccf
  (`legacy.peachHover`) — it is being added as ink, not as a reinstatement of that
  decision, and the description says so. `creamDim` (#ecdccf) is one digit from
  `legacy.peachHover` (#ebdccf) and is not the same colour.

  **What this does not do.** The eight new `chrome.surface` rungs and the two
  `chrome.text` greys are chrome-only; the mode-aware `color.surface.*` and
  `color.text.*` ladders do not gain siblings, so the two key sets are no longer
  identical. Adding them there would require inventing a light value for each,
  which is the guess this change refuses to make. `__tests__/roles.test.ts` still
  holds the invariant that matters — every mode-aware `surface.*` shares its dark
  value with its `chrome` twin.

  Token source version 2.7.0 → 2.8.0. `machine/rules.yaml` and `AGENTS.md` both
  quoted a token figure in prose; the version reference is updated and the token
  count, which read 331 against an actual 221, now reads the generator's own 241.

## 0.14.0

### Minor Changes

- a3c9e83: Four corrections to the machine-readable contracts, all of them about the
  consumer this package could not see.

  - `machine/rules.yaml` recorded `skene-marketing-website` as
    `installs: false`, with an assertion of zero `@skene/design-system` matches
    in its package.json, its lockfile and its source. That was measured against
    that repo's `main`; the work was on a branch. It installs 0.12.0 and imports
    the package on 222 statements across 33 files — more reach than any other
    consumer. An agent reading the file before working on that site concluded the
    design system did not apply to it. Same correction in README.md.
  - `docs-app/app/decisions/inventory.json` now ships, exported as
    `@skene/design-system/inventory.json`. It was outside `files`, so every
    `seen:` in context.yaml was a pointer a consuming agent could not follow.
    Cost: +55KB packed.
  - `machine/context.yaml` gains `props` and `accepts` for the whole `ui/*`
    layer, derived from `dist/*.d.ts` by a new `dtsContractOf()` in
    `scripts/build-context.mjs`. 30 of 30 ui modules previously shipped with no
    usable prop signature, on the layer `rules.yaml` tells an agent to reach for
    first. `build` now runs `context` after `tsc`.
  - `machine/layouts.yaml` was dashboard-only and its own coverage pointer
    resolved to `present_here: false`. It gains a `marketing` block — band
    rhythm, ground alternation, the 5fr/7fr split, the cream inset, the gap
    constants — transcribed from the twenty pages that already obey it. The
    dashboard content moves under `dashboard:` unchanged.

- 3094d36: compositions.yaml: re-derive the corpus that dropped its two densest routes

  `machine/compositions.yaml` stated that `(site)/page.tsx` and
  `(site)/pricing/page.tsx` "import no design-system section at all" and recorded
  both under `not_covered`. Checked against the commit the file itself cites
  (`b96b935` on `skene-marketing-website@claude/calcom-style-wireframes-a64a8e`),
  that is false: the home route imports seventeen modules and the pricing route
  nine, including `sections/plan-card`, which the entry named as absent.

  So the archetypes were derived from 17 routes rather than 19 and every
  `in: N, of: M` denominator was short by two. Worse than the counts: six modules
  appear only on the two dropped routes and so appeared nowhere in the file —
  `patterns/dither`, `sections/evaluator-list`, `sections/feature-row`,
  `sections/final-cta`, `sections/plan-card`, `sections/question-grid`. Two of
  those are load-bearing. `sections/feature-row` is what
  `render_marketing_cards_as_feature_row` in `machine/rules.yaml` mandates for a
  marketing card, and `sections/final-cta` is the closing band. An agent
  following `skills/skene-design-system-pages` composed a page with neither.

  Re-derived rather than annotated. Both routes were read at `b96b935` and added
  as archetypes of their own — `home-page` and `pricing-page`, both `single`,
  because neither matches an existing shape and one instance generalises to
  nothing. The corpus is now 20 routes read, 19 composing, 40 modules seen; every
  spine denominator, archetype `instances` and `optional` count is re-counted;
  `not_covered` keeps only `(landing)/alternatives/*` and everything outside the
  site. `corpus.history` carries the whole record rather than dropping it.

  `__tests__/compositions.test.ts` is what makes this stick. It now recomputes
  every number in the file from the `routes:` maps beside it — corpus counts,
  spine `in`/`of`, per-archetype `instances` and `optional`, that a
  `load_bearing` module really does appear in every cited route, and that no
  module a cited route imports goes unnamed by its recipe. It also fails if a
  route is ever both cited by an archetype and recorded as `not_covered`, which
  is the shape the original defect took. The old assertion there was
  `toMatch(/pricing/)`, and it passed _because_ the false claim mentioned
  pricing.

  `skills/skene-design-system-pages`, `README.md` and the
  `skene-marketing-website` entry in `machine/rules.yaml` follow the same numbers.

- d11a293: Four additions asked for by `skene-marketing-website`, each replacing a
  workaround it writes at multiple call sites.

  - `Eyebrow` gains `onLight`. Its default border and ink are invariant
    `chrome.*` and do not follow a `light` ancestor, so on a cream panel the chip
    keeps its dark-page colours. Three modules in this package
    (`LightSectionCard`, `FaqBand`, `Bridge`) worked around that with the same
    two-utility `className` override, and the consumer writes it at fourteen more
    call sites. All three in-package sites now pass the prop; the rendering is
    identical.
  - `PillNavLink` gains `asChild`, the Slot pattern `ui/button` and `ui/card`
    already use, so a menu trigger or a `next/link` composes the bar's slot
    instead of copying its seven-utility class string. `href` becomes optional
    and is not forwarded under `asChild`; an item without one is skipped when
    `PillNav` builds the mobile drawer.
  - `TerminalBlockLine` gains `wrap`. The default still scrolls the line in
    place, which is right for a command a reader runs. `wrap` is for the line
    whose whole text is the point and cannot sit on one row at 390px: it cancels
    the nowrap, allows a break mid-token, and hangs the continuation under the
    command. The consumer writes those four utilities as a `display` override at
    three sites, which also puts markup between the reader and the paste for a
    reason that has nothing to do with what the line says.
  - `FeatureRow`'s `n` is now `aria-hidden`, unconditionally. It is a corner
    marker, the heading beside it carries the whole accessible name, and no prop
    reached it — so a consumer could not fix it either. Measured from the
    accessibility tree on the live site: two `FeatureRow` benefits exposed a bare
    "01" and "03" while a hand-rolled "02" between them was correctly silent.
    `NumberedStep`'s numeral has always done this.

### Patch Changes

- 72dff23: Five of the nine unproven modules get their first visual case, and one of them
  was broken

  `machine/context.yaml` marked nine modules `seen: []`, and its own header says
  an empty list means nothing in this repository has ever rendered the module, so
  treat its claims as unproven. None of the 201 committed baselines covered any of
  them. That is not a coverage statistic. It is the same hole `LogoRow` fell
  through: a module with no case has no baseline, the per-component suite compares
  nothing to nothing and reports green, and the defect is found later by measuring
  the rendered thing inside a consuming app — which is the one place a package's
  own gate should never be the second-best instrument.

  It happened again here, on the third of the five. `IntegrationsHighlight`
  rendered `CardAnimationIntegrations` at **0x0**. `LightSectionCard`'s visual
  column is `grid place-items-center`, so this module's wrapper was shrink-to-fit,
  and the animation is `aspect-square w-full` over two absolutely-positioned
  children and therefore has no intrinsic width at all. Measured in the gallery at
  a 469px visual column: the wrapper resolved to 51x51, its own 25.6px padding
  twice and nothing between, and the animation to 0x0. The band had shipped since
  0.10.0 as a cream card with an empty right half, and its only defence was that
  nothing had ever rendered it — the sole consumer calls
  `CardAnimationIntegrations` directly, inside a wrapper of its own. **Fixed**,
  with `w-full` on that wrapper, in the same commit as the case: a baseline of a
  blank panel is precisely the failure this exercise exists to prevent.

  The same case found a second defect, which is **not** fixed and is baselined
  known-wrong deliberately. Inside that band's `light`, three of the four
  animation cards render their title in invariant `chrome.text-primary`,
  rgb(250,241,233), against `bg-surface-1`, which is mode-aware and resolves to
  rgb(244,244,245) there — roughly 1.03:1, the trap `sections/code`'s own header
  documents one level down. The consumer repairs it at its call site with two `!`
  overrides mapping the chrome roles onto mode-aware ones. The fix belongs in
  `card-animation-integrations`, where it can be reviewed as its own change; until
  then the baseline holds a regression floor, not an endorsement.

  The five cases and what each baseline holds:

  - **`section-code`** — the biggest exposure on the list, at 7 of the 19
    composing routes in `machine/compositions.yaml`'s corpus, the fifth most-used
    module in the package and the only spine member with no baseline. The frame
    holds a MATCH, not a shape: every row is rendered twice, once under a dark
    ancestor and once under a cream one, and the two columns have to be identical
    pixels. `Code` is `polarity: applies-both` — each variant pins its own mode
    class so it resolves its own tokens wherever a caller drops it — and deleting
    either class moves exactly one column. The module header records the two
    readings that makes real: 4.30:1 for the default under `light`, and 1.00:1,
    the same colour, for `onLight` under `dark`. `PROSE_CODE` gets its own row,
    including inside the cream column, where a peach-on-near-black chip is what a
    caller actually gets.
  - **`pattern-pill-nav-frosted`** — two constants and no component, which is why
    it lasted longest: `scripts/build-inventory.mjs` filtered on `.tsx` and
    dropped the package's only `.ts` module outright. The frame holds the wash
    composited over a halftone: `chrome.surface-0` at 60%, `blur(8px)
saturate(180%)`, and a 14% `chrome.text-primary` hairline. Over a flat fill a
    blur radius is invisible and a saturate multiplier does nothing, so the
    artwork behind it is load-bearing. Both position constants render; sticky
    BEHAVIOUR is not held and no static frame can hold it.
  - **`section-surface-cards`** — the ways-in grid, second on the exposure list
    and on the consumer's home and integrations routes. Holds two structural
    arguments: two tracks and never `auto-fit` (four tracks in a ~640px band give
    each card 139px and every two-word title wraps), and the `light` on the
    featured cell against `dark` on the rest, without which `text.primary`
    resolves to #faf1e9 on a #faf1e9 fill. The four `code` chips are taken
    verbatim from `INTEGRATION_ANIMATION_DETAILS`, whose source records what each
    was corrected from.
  - **`section-team-card`** — three STATES of one entry, not three people: the
    module's claim is that the panel keeps one shape with a photo and without, and
    three different names would read as three people rather than as that. It also
    means nothing here fabricates a colleague. Holds the `--radius-lg` panel at
    24px, the square `--radius-md` media frame, the 17px name, the 11px mono role
    at 0.07em, and the underline-offset on an anchor passed through `children`,
    which the module styles and which had no other proof that it applies.
  - **`section-integrations-highlight`** — the composition, which is all this
    module is: the cream card's split at `md`, the 1350px cap, and the copy stack
    beside a square visual. Its copy is literals in the source rather than props,
    so an upstream wording change lands here as a reflow and nowhere else.

  Two of the five are GSAP-driven and could not hold a frame at all before this.
  `FREEZE_CSS` and Playwright's `animations: 'disabled'` cover CSS animations,
  transitions and the Web Animations API; they do not reach GSAP, which drives
  inline styles off its own ticker. `docs-app/app/components/islands.tsx` now
  ships `FrozenGsap`, which disables the ScrollTriggers without killing their
  animations, then seeks every timeline from 0 with events live so the
  `.call()`-driven active card actually resolves. Its header records why each of
  those three details is load-bearing, and why `gsap` is imported there without
  being declared as a docs-app dependency.

  The suite's floor moves 82 → 87. Four modules still have no case:
  `ui/sonner`, `patterns/pill-nav-mobile-menu`,
  `sections/card-animation-integrations` and `sections/journey-signal-scene`.
  `docs/sections.md` now says which of those is permanent — `sonner` is a toast
  host with no resting state, and writing a case for it to reach zero would
  capture an empty portal — and what the other three each still need.

- a5081e1: `LogoRow` rendered at 80% of its own documented size. The module was written on
  Tailwind's numeric spacing scale, and this package sets `--spacing: 0.2rem`, so
  `min-h-14` measured 44.8px where the comment beside it says the wireframe's
  56px is kept as the minimum. `gap-3.5` measured 11.2px against 14, and `mb-6` /
  `mt-3.5` were off by the same fifth.

  The four utilities become the literal px the wireframe draws — `min-h-[56px]`,
  `gap-[14px]`, `mb-[24px]`, `mt-[14px]` — which is the convention
  `artifact-shell`, `funnel` and `integration-rows` already document at length.
  **This changes rendering:** slots grow 44.8 → 56px and the row gaps grow 11.2 →
  14px. Visual baselines covering the proof strip need updating.

- 743583d: LogoRow gets the visual case that would have caught its geometry defect

  `grep -rn "logo-row\|LogoRow" docs-app/app` returned nothing. `LogoRow` had no
  `data-visual` case on `/components`, so none of the 199 committed baselines
  covered it, so it shipped every spacing value at 80% of the number its own
  comments claimed — a documented 56px slot floor rendering at 44.8px, a
  documented 14px gap rendering at 11.2px — and the per-component visual suite
  reported green throughout. The defect was found by measuring the rendered strip
  inside a consuming app, which is the one place this package's own gate should
  never be the second-best instrument.

  `section-logo-row` now exists and holds the geometry: the slot floor, the
  inter-slot gap, and the margins above and below the strip. It renders on both
  grounds in one frame, because this band declares none of its own and follows a
  `light` ancestor onto cream. No logo sits in a slot: the empty slot is the
  component's argument and the module header forbids a fabricated mark in a
  story, a demo or sample data, so a case that filled one to look better would be
  the first place that rule broke.

  The suite's floor moves 81 → 82. That is the third time it has been raised for
  this reason, so `docs/sections.md` now ranks the nine modules that still have no
  case by how much of the estate they expose rather than only listing them —
  `sections/code` first, at 7 of the 19 composing routes in
  `machine/compositions.yaml` and the only spine member with no baseline.

- c1967d5: `PillNavMobileMenu` gets a baseline, and the gallery gets its first iframe

  `patterns/pill-nav-mobile-menu` is the consuming site's mobile navigation, which
  every page of it carries, and it was `seen: []` — nothing in this repository had
  ever rendered it, so every claim its contract makes was unproven.

  It could not simply be added to `/components`. Every layer in the module carries
  `md:hidden`, which is a VIEWPORT media query, and the visual suite runs at
  1280x900: rendered inline, the toggle, the backdrop and the panel are all
  `display: none`, so a case there captures an element with no box. That is not a
  thin baseline, it is none. Nothing inside the page can change it either — a
  container cannot narrow a media query, and overriding `md:hidden` from the call
  site would hold geometry the component never produces, which is worse than
  holding nothing.

  A same-origin iframe has its own viewport. `docs-app/app/components/mobile-menu`
  renders the open sheet, and the case embeds it at 390x760, where the module's own
  breakpoint decides unchanged. That also settles the second half: the panel is
  `fixed inset-0`, so what it fills IS the viewport, and a 1280-wide capture would
  have been a baseline of a phone sheet stretched across a desktop.

  The frame holds the open sheet on #141414, measured off the render rather than
  read off the classes: the frosted bar over it at z-1050 against the panel and
  backdrop at z-1040, which is the shipped z-order and the thing most likely to
  break silently; the panel's top inset of 44.8px, which is `pt-14` at this
  package's `--spacing: 0.2rem` rather than the 56 the class name suggests, and
  which clears the frame's 43.69px bar by 1.1px; 19.2px of side padding; four link
  rows at 24px type on 12.8px of vertical padding with a 1px white/10 hairline
  between each and one under the last; the active link at rgb(254,192,137) against
  white/90 for the rest; and the actions row at 19.2px padding and a 6.4px gap. Both toggle states
  are in the bar, the same component twice at a 4px radius and 12px mono, because
  the closed one is otherwise unreachable — the panel it belongs to is what covers
  the screen.

  Three things are deliberately NOT held, and the case says so: the transition
  between states, because the module returns `null` when closed and there is no
  intermediate DOM; the `document.body.style.overflow` lock, which is a side effect
  with no pixels; and everything at 768 and up, where every layer is `display:
none` by design and correctly renders nothing.

  The open state is a literal `true` rather than state a click has to reach. The
  suite has no interaction step before its main capture, so a case that clicked its
  way open would be capturing the end of a transition rather than a declared state,
  and `onOpenChange` is a no-op because a link that closed the sheet mid-capture is
  a flake, not a feature. `dark` is written explicitly on the route: the drawer is
  invariant nav chrome with no light reading, so both mode sweeps produce identical
  files, and that is the assertion rather than an accident.

  Floor 87 → 88. Two unproven modules remain,
  `sections/card-animation-integrations` and `sections/journey-signal-scene`, both
  multi-state; `ui/sonner` stays uncovered on purpose.

- 765c7e5: The last two unproven modules get cases, and one of them reads 18 CSS custom
  properties this package does not define

  `sections/card-animation-integrations` and `sections/journey-signal-scene` were
  the last two modules marked `seen: []`, meaning nothing in this repository had
  ever rendered them, meaning every claim their contracts make was unproven. Both
  are multi-state, so one frame proves one state: each gets TWO cases, at two
  named states, with what is NOT held written into the case beside what is.

  **`sections/card-animation-integrations`**, at two playheads on its own cycling
  timeline. `ICON_STYLES` carries a `light` and a `dark` pair for each of four card
  variants and only the active card takes the light one, so a single frame proves
  one row of that table and cannot tell "card 0 is lit because the playhead is at
  2.5s" from "card 0 is always lit". `section-card-animation-integrations` holds
  t=2.5s (all four cards in and at rest, card 0 active, detail 0 in the panel, in
  the stable window 1.56 → 3.76) and `-last` holds t=9.5s (card 3 active, detail 3,
  inside the loop's final branch, which is written differently from the other three
  and has no other cover). Not held by either: the entry stagger, the three swap
  transitions, the closing fade, and details 1 and 2. A cycling timeline cannot be
  covered by frames, only sampled by them, and two samples is where the sampling
  starts proving the cycle moves.

  **`sections/journey-signal-scene`**, at WIDE + GTM and MEDIUM + Engineering. It
  picks one of three hand-placed layouts by measuring its own container and carries
  a view toggle, so four combinations matter; the two held are the one the module
  was designed against and the one where every filed defect shows. The two unheld
  corners are named in the case rather than left to be found, and so is COMPACT,
  which needs a container under 420 and therefore the iframe treatment
  `pattern-pill-nav-mobile-menu` uses. The view is pinned by clicking the toggle
  once on mount — the module's own documented handover, "for good the moment
  someone reaches for the toggle themselves" — because otherwise it auto-advances
  every 6s while on screen and the capture lands wherever the clock is.

  **The defect that case found is the largest of this sweep.** The module reads 24
  CSS custom properties and **18 of them are not defined anywhere in this
  package**: every `--color-terminalChrome-*` it uses, plus `--color-text`,
  `--color-text-dark`, `--color-text-light`, the three `--color-text-on-dark`
  variants, `--color-accent-muted`, `--color-background-darker`,
  `--color-border-on-dark`, `--color-chrome-accent` and `--color-chrome-muted`.
  None carries a `var()` fallback, so each resolves to
  invalid-at-computed-value-time: backgrounds go transparent, colours fall back to
  `inherit`. The GTM view survives on inherited ink and two literals. The
  Engineering view asks for `--color-terminalChrome-githubDarkBg` and
  `--color-terminalChrome-githubDarkSurface`, gets transparent, then paints
  `#ffffff` text on the white stage — measured as `background-color: rgba(0,0,0,0)`
  with `color: rgb(255,255,255)` on both the centre card and the PR panel.

  The two mode captures of that case are the proof and they DIFFER, which they
  must not: the scene sits under an explicit `light` wrapper, so the page's mode
  should reach nothing inside it. What reaches in is the fallback — `color` on an
  undefined property resolves to `inherit`, so the panels take the gallery case's
  own `text-foreground`, ink under the light sweep and near-white under the dark
  one, and the Engineering view is legible in one baseline and almost absent in the
  other. A component whose ink is decided by a page two levels up is the defect
  stated as a picture.

  The values exist in `design-tokens.json` under `terminalChrome` and reach
  `src/tokens/index.ts`; the CSS generator never emits them under those names. It
  survived because nothing was looking from either end: the module is a straight
  port, its header says so, and the tokens came across while the definitions did
  not — and the one app that renders this scene defines every missing name in its
  own `globals.css` while running a FORK rather than importing this module. The
  package's copy has no consumer, and `seen: []` meant this repository had not
  rendered it either.

  **Not fixed here, and deliberately so.** Eighteen undefined properties inside
  1,214 lines of styled-components is a token decision — whether the generator
  should emit `terminalChrome` or the module should move onto the roles that
  already exist — and it needs its own commit. So does ask 12, the three geometry
  defects the consuming site has filed against this module's MEDIUM layout
  (`WIDE_MIN = 720` at :888, `MEDIUM.left.w = 170` at :874, `MEDIUM.h = 640` at
  :871), all re-verified against v0.13.0 and all visible or measurable in the
  `-medium` frame: the Evidence rows ellipsise at 170, and the PR panel runs ~330
  of its 340 stage units, so the missing floor is real even though it has not
  clipped yet. Both are baselined as they are, for the same reason: a fix lands as
  a picture of what changed once a baseline exists, and as a list of names and a
  promise before one does. The `-medium` frame is a regression floor and a filed
  defect, not an endorsement, and it is expected to move twice.

  `FrozenGsap` grew per-case playheads to make the first pair possible, matched by
  selector rather than by a wrapper element so the cases that already have
  baselines keep their DOM. It also grew a 100ms interval that never stops, and
  that is not belt-and-braces: the first version watched for thirty frames and one
  slow `components — light` run lost `section-card-animation-integrations` with no
  actual image and no diff, which is what a live GSAP loop looks like from
  `toHaveScreenshot`. The animated modules sit behind their own chunks, so on a
  loaded worker they can build their timelines after the watcher has stopped
  watching, and a timeline created after the last frame escapes the freeze
  entirely. Two clean verify runs since.

  Two prose gates were widened rather than satisfied by ungrammatical prose:
  `__tests__/docs-counts.test.ts` now matches `modules?` and
  `__tests__/skills.test.ts` matches `modules? (are|is)`, because the gated count
  reached 1 and both patterns were written when it could only be plural. The number
  still has to be the real one in both places, which is the whole gate.

  Floor 88 → 92. `ui/sonner` is now the only module with no case, and it is meant
  to be one: a toast host renders nothing until something calls it, so a case for
  it would capture an empty portal.

- bf51032: skene-design-system-pages: stop routing marketing band spacing at the dashboard shell

  v0.13.0 promoted the dashboard page-shell gutters into `shipped_here` in
  `machine/layouts.yaml` as `page_gutters`, `gap-4 px-4 py-6 sm:px-6 lg:px-8`,
  `utilities_resolve_here: true`, described as "the shipped contract" with no
  surface scoping — and `skills/skene-design-system-pages` sent a page builder to
  that file for "Section order within one band, spacing and widths". Scoping the
  entry with `surface: dashboard` and a warning does not fix the routing; the
  skill still pointed an agent at a dashboard-first file without naming the block
  it should read.

  Measured in a browser against the package's own compiled stylesheet, at
  `--spacing: 0.2rem` and a 16px root: `py-6` resolves to **19.2px** of band
  padding and `gap-4` to **12.8px**, against a marketing band's
  `py-[96px] md:py-[128px]` and `gap-[32px] lg:gap-[64px]`. Five times and
  two-to-five times apart. Compose a marketing page on `page_gutters` and every
  band collapses to a dashboard row.

  The pages skill now carries the two numbers, sends band geometry to section 5
  `marketing` (`status: composed_here`), and sends the dashboard shell, the
  workspace templates and the T-codes to the blocks that own them.

## 0.13.0

### Minor Changes

- 4a48797: Make the package composable by an agent, not just callable.

  `machine/context.yaml` has always answered "what is FeatureRow for" — 89 modules
  with full prop signatures. It never answered the question an agent actually
  arrives with: "I have to build a features page, what goes in it and in what
  order?"

  - **`machine/compositions.yaml`** — page recipes derived from 19 routes that
    were really built (the cal.com-style wireframe branch of the marketing site),
    not from a taxonomy anyone liked the shape of. Eight archetypes, each citing
    its routes with their import lists inline, each splitting load-bearing (recurs
    in every instance) from optional (with counts). Two single-instance
    archetypes carry `observed` rather than `load_bearing`, because with n=1
    nothing can be shown to recur. Home and pricing are recorded in `not_covered`:
    both routes import no section from this package, so there is no observed
    recipe and inventing one would be the failure this file exists to prevent.

  - **`intent` on every module, from a closed 20-tag vocabulary** declared at the
    top of `context.yaml`. The reverse index: you know what you are trying to do,
    the tag takes you to the candidates. 89 of 89 tagged, cap of three — the
    fourth tag is always the one that is only sort-of true.

  - **`machine/layouts.yaml` restructured, nothing deleted.** Two different things
    had always lived in it and nothing in its structure said which was which: the
    layout scale this package ships, and skene-dashboard's contract, which it does
    not. Every block now carries a `status` — `shipped_here`, `unverified_here`,
    `depicts_here`, `dashboard_only` — so "can I build against this today?" is a
    field rather than something you infer from the header. The dashboard T-codes
    and their Figma anchors stay: the dashboard is going to consume this package.
    New `depicts_here` block names the modules that draw a dashboard-shaped
    surface for a marketing page, so "put a Skene dashboard visual on a landing
    page" resolves here instead of being reinvented.

  Gated by `__tests__/compositions.test.ts` and six new cases in
  `__tests__/context.test.ts`: every module a recipe names must exist in
  `context.yaml`, every archetype must cite page files, no `load_bearing` may be
  claimed from a single route, `not_covered` must be stated, every intent must be
  declared, and no declared intent may go unused.

  One correction to an earlier gate: `publishing.test.ts` asserted `.runlog/` did
  not exist on disk, which turned `npm run verify` red for the whole duration of
  any run that used one — guarding the work by breaking the check meant to guard
  it. It now asserts the directory is not committed, which is the actual failure.

- 4a48797: Add the agent entry point the contracts never had.

  `machine/` has shipped ~7,000 lines of machine-readable contracts since
  2026-08-13, pointed at only by README prose. That works for an agent reading
  top-down and does nothing for one that lands in the directory, looks for
  `AGENTS.md`, finds nothing and starts guessing. The contracts were readable and
  undiscoverable, which is most of the way to not existing.

  - `AGENTS.md` at the root, shipped in the tarball, with installation,
    configuration and usage — the three sections Vercel's agent-readability spec
    asks for at least two of. Configuration carries the Turbopack `@source` gap,
    because that one shipped a zero-height `LogoRow` with no error.
  - `llms.txt` as the machine-readable index.
  - `CLAUDE.md` as a symlink, not a copy: two files saying the same thing are two
    files that disagree by next quarter.
  - `__tests__/agent-entry-point.test.ts` gates all of it — every path named in
    either entry point must resolve, every contract in `machine/` must be named in
    both, `context.yaml` must be listed before the others (its siblings' headers
    say to read it first), and every code fence must carry a language.

  Two stale claims fixed while verifying, both in documents an agent is told to
  trust: the README said the package "has 79 modules" (89) and that the gallery
  renders "all 79 modules as 85 cases". The second was wrong in the way that
  matters — it claimed complete coverage when ten modules have no case at all,
  and those ten are exactly the ones `machine/context.yaml` marks `seen: []` and
  tells an agent to treat as unproven. Now gated too.

  The site half of that spec — sitemap.xml, sitemap.md, robots.txt, canonical
  links, JSON-LD, markdown mirrors, content negotiation — is about serving pages
  over HTTP and belongs to `docs-app`. Not attempted here.

- aa2b6de: Ship three Agent Skills, and add `skills/` to the tarball.

  `AGENTS.md` only helps an agent that already knows to look for it. A Skill is
  routed to by its `description`, on a trigger the agent never went looking for —
  which is the moment the contracts are worth reading and the moment they were
  being missed. The split is by moment, not by surface, because surface is the
  wrong axis here: dashboard visuals render _on_ marketing pages, so a
  marketing/product split would misroute every artifact section.

  - `skills/skene-design-system-setup` — first install, the stylesheet, the
    Tailwind `@source` line and the proof it took. That is the only one of the
    four steps that fails silently, so it is the only one carrying a proof.
  - `skills/skene-design-system` — before writing any component. The intent
    vocabulary is inlined rather than pointed at, since an agent that has to open
    `context.yaml` to learn the tags has already paid the cost the reverse index
    exists to avoid.
  - `skills/skene-design-system-pages` — composing a whole page: the spine, the
    eight archetypes read confidence-first, and what has no recipe at all.

  Each description carries a `Do NOT use for…` clause naming the other two, so
  three skills over one package do not fire over each other.

  `__tests__/skills.test.ts` gates it. The numbers a skill quotes are compared
  against their sources — the inlined intent vocabulary against the 20 tags
  `context.yaml` declares, the spine and archetype tables against
  `compositions.yaml`'s own counts and confidences — so drift fails rather than
  quietly teaching an agent something untrue. Every repo-relative path any skill
  names is resolved; consumer-tree paths are deliberately not, since resolving
  those against this repo is how a correct instruction gets "fixed" into a wrong
  one.

  `AGENTS.md` also gains a first-run section, for the agent that lands there
  directly rather than being routed.

- a314b12: Make the package publishable to a registry, so the product repos consolidating
  onto it stop installing it as a git dependency.

  - `publishConfig` names npmjs and stays `restricted`. npmjs rather than GitHub
    Packages because GitHub Packages requires the scope to equal the repository
    owner: the package would become `@skenetechnologies/design-system` and rewrite
    the import specifier in every file of every consumer, which is the churn this
    consolidation exists to remove. npmjs keeps `@skene`, so migrating a consumer
    is one line in its `package.json`.
  - `prepublishOnly` runs `npm run verify`, so a publish rebuilds rather than
    shipping whatever `dist` happened to be on disk. `prepare` stays absent: npm
    runs it for GIT dependencies, and consumers are on that path until they
    migrate.
  - `.github/workflows/publish.yml` publishes on a `v*` tag, authenticating from
    `secrets.NPM_TOKEN` through `actions/setup-node`. It refuses to publish when
    the tag disagrees with `package.json` — the version string in this repo has
    drifted from reality four times, and npm does not let you reuse a number.
  - `.npmrc` is gitignored. This repository is public, and `npm config set` run in
    the project directory writes the token there in plaintext.
  - README documents the registry install and where the token belongs; the git
    dependency stays documented as the legacy path until every consumer moves.
  - `__tests__/publishing.test.ts` gates all of it, including a scan for real npm
    token shapes that still allows the placeholder the README has to show.

  No component changes. `dist/` stays committed and the CI job that proves it is
  current stays with it, because git-dependency consumers still need both.

### Patch Changes

- 2811694: Three silent-drift gaps closed, the chip cluster settled and gated, and the
  build made incremental. No component renders differently: the only `src/` change
  is a doc comment, and `dist` is byte-identical apart from it.

  - `scripts/build-inventory.mjs` filtered on `.tsx`, so `patterns/pill-nav-frosted`
    — the package's only `.ts` module — was missing from
    `docs-app/app/decisions/inventory.json` entirely. The page whose premise is
    that it lists everything listed 88 of 89. It now takes both extensions, the
    way `build-context.mjs` always has. `counts` corrects to 89 modules, 266
    exports, patterns 7 → 8.

  - `sameAs` in `machine/context.yaml` is the near-duplicate warning, and four
    pairs declared it in one direction only — so it helped whichever side you
    happened to open. `feature-row → glyph-badge`, `chip → stat-chip`,
    `surface-tiles → surface-cards` and `terminal → traffic-lights` now name each
    other, and `__tests__/context.test.ts` fails on a one-way declaration.
    `chip → stat-chip` was the one that mattered: it is the unfinished half of
    the chip decision in `docs/sections.md` §2, invisible from `chip`.

  - `docs/sections.md` §2 settled. Point 2 (Badge stays product-side, Eyebrow
    stays the marketing kicker) was never pending work and is now gated rather
    than labelled. Point 3 resolved: `StatChip`/`MetaChip` keep the pill, because
    a token gets the rectangle and prose gets the pill — `MetaChip` already draws
    both treatments in one chip, and its state word is the half that is a token.
    The table also grew from the documented seven shapes to nine: `TagChip` and
    `CheckChip` are the same 11px mono tag written twice, recorded only in
    `evaluator-check.tsx`'s own header. Decided in favour of `TagChip`, which two
    of the three modules in that family already import; not applied, because it
    moves pixels and the baselines need the Playwright container.

  - `__tests__/chip-cluster.test.ts` makes that table a test: every chip's radius,
    size, voice and tracking pinned against source, and every chip-shaped class
    literal in `src` either registered or named as an exception. The cluster
    drifted twice in a column nobody was tabulating; it can now only grow in the
    open.

  - Three dependencies nothing used: `@radix-ui/react-label` (`ui/label.tsx` is a
    plain `<label>`), `@radix-ui/react-separator` (never had an importer), and
    `@types/styled-components@5` beside `styled-components@6`, which ships its own
    types. Gated in `package-contract`: every dependency must be imported from
    `src/` or named by a stylesheet, and every `@types/x` must match its target's
    major.

  - `tsc` runs incrementally, so `npm run verify` is 7.0s warm against 10.3s.
    Output is unaffected — `dist` is byte-identical either way.

  - Counts typed into prose are checked now, in `__tests__/docs-counts.test.ts`.
    `stories/README.md` claimed 74 of 74 modules and 318 stories against a real 81
    and 379; `docs/sections.md` claimed one module without a gallery case against
    a real ten. The README's `#semver:` range also documented `^0.11.0` resolving
    `v0.11.0` while the package was 0.12.0, which is the fourth time that line has
    gone stale and the reason `package-contract` was already red.

## 0.12.0

### Minor Changes

- ee7210e: Fourteen assets ported from skene-marketing-website, growing `assets/` from 12
  to 26 files: `hero-dither.png` (kept as PNG — a lossless WebP re-encode came
  out larger and lossy destroys the dots), the `agent-1/2/3.svg` illustration
  set, the brand videos `skene-hero.mp4` and `skene-demo.mp4` for
  `DitheredMedia`'s `video` prop, and eight third-party integration marks under
  `assets/integrations/` (bolt, cursor, github, resend, supabase, terminal, v0,
  windsurf), closing the README's "integration marks are not here yet" gap.

  `assetUrls` gains `heroDither`, `agentOne`/`agentTwo`/`agentThree`,
  `heroVideo`, and `demoVideo`. A new `integrationMarkUrls` map (with
  `IntegrationMarkName`) keeps the third-party brands in their own namespace:
  render at delivered proportions, never recolour.

  `assets/README.md`'s exclusion table is rewritten around what still stays out
  — product screenshots and blog images (content), press logos and event photos
  (site-specific), and files unreferenced even on the live site.

- 5c062af: `JourneySignalScene` — evidence, a traced journey step, and the PR review that
  catches it breaking, in one animated composition.

  Ported in from skene-marketing-website rather than authored fresh: it predates
  the package's Tailwind port, was once rebuilt on this package's own primitives
  (`MiniFunnel`, `AppPanel`, `DiffColumn`, `PrReview`), and the founder rejected
  that version on sight and restored the styled-components original. It keeps
  that original, documented as a deliberate exception to
  `styled_components_for_new_features` in the file's own leading comment and in
  `documentation/20260825_journey_signal_scene_design.md`.

  `gsap` and `styled-components` become package dependencies (`@types/styled-components`
  dev-only). Nothing else in the package uses either — the import is an island.

  No props: content lives in named consts near the top of the source file. Three
  responsive layouts switch on the container's own measured width, from a
  three-panel row down to a hero-column-width layout down to a stacked phone
  layout, all covered by the new Storybook stories.

- 9d19f41: The remaining upstream ledger from the marketing build pass, closed in one
  branch. Everything additive; no existing call site changes rendering.

  - `Chip` gains `tone="warn"`, the amber companion to 0.11.0's `danger`. The
    homepage and features page were both retinting `tone="neutral"` through a
    shared `WARN_CHIP` className — base amber ink on a 15% tint, the on-tint miss
    `danger`'s note documents. The new tone is the corrected recipe: amber
    on-tint ink over a 12% fill, per `src/lib/status.ts`. New `Warn` story; the
    `AllTones`/`OnLight` matrices now render six tones.

  - `EvaluatorPanel` gains `split?: boolean` and `activeIndex?: number` — the
    marketing wireframes' two-pane cut: the index in a dark left pane (the
    package's own `dark` subtree switch, nested inside the window's forced
    `light` the way the product nests its sidebar) with the open row picked out,
    the requirements in the cream right pane. The index renders name and
    confirmed count per row in this mode; the four-column table stays the
    stacked layout's. Stacks below `md`. New `Split` story; the default stacked
    rendering is untouched.

  - `scripts/build-context.mjs` and `scripts/build-inventory.mjs` no longer
    truncate SCREAMING_SNAKE export names at the first underscore.
    `machine/context.yaml` and `docs-app/app/decisions/inventory.json` now list
    `PILL_NAV_FROSTED_STYLE` and `PILL_NAV_POSITION` (the second had vanished
    entirely — both truncated to `PILL` and the Set deduped them),
    `INTEGRATION_ANIMATION_CARDS`, and `PROSE_CODE`.

  - Stories for the seven storyless patterns: dither, hero-backdrop, marketing,
    pill-nav, pill-nav-frosted, skene-mark, terminal. Every module in the
    package now has a story file.

  - README and `styles/index.css` document the Turbopack `@source` gap: the
    bundler never scans the package stylesheet's own `@source`, so utilities
    only the package uses were absent and `LogoRow` rendered zero-height until
    the consuming app added
    `@source "../../node_modules/@skene/design-system/dist";` itself. The exact
    line, and why it is safe to add unconditionally, are now in both places.

  - docs-app no longer quotes `skene audit`, a subcommand that does not exist:
    the three remaining spots (two SurfaceDetail cases, the terminal-block case)
    now carry the OSS CLI's real invocation, `uvx skene analyse-journey .`, and
    the terminal case's note states what the command actually reads and writes.
    Visual baselines rebaselined for the copy-bearing screens.

## 0.11.0

### Minor Changes

- 444d125: The marketing build pass's component-contract asks, all additive; no existing prop's behaviour or default changes.

  1. `JourneyTrack`: per-step `glyph` replaces the ring's 1-based number (✓ on a verified track); connectors keep deriving from the states.
  2. `Chip`: `danger` member on `ChipTone` — 12% error-red tint under the on-tint ink, mode-aware on both halves.
  3. `LightSectionCard`: `eyebrow` slot rendered through `Eyebrow` with the on-cream overrides applied inside the card.
  4. `KeyValueTable`: `headerless` renders the rows as a semantic `<dl>` (column flags unchanged) instead of a table with hidden headers.
  5. `ValueCard`: `neutral` member on `ValueTone` — a muted label, no cost/gain accent, for peer cards.
  6. `PlanCard`: `featuredTone="dark"` — the featured promotion for a cream ground (near-black, `dark`-pinned subtree, same lift and shadow).
  7. `HeroBackdrop`: the textured split header documented as a composition recipe (header comment + context.yaml), deliberately not an export.
  8. `TrustFact`: `tone="muted"` swaps the invariant on-light rule and disc for their theme-following pair; the cream default is untouched.
  9. `DiscoveryTable`: context.yaml `notFor` sharpened — three columns or fewer is `KeyValueTable`'s job; this is the fixed four-column discovery artifact.
  10. `FaqBand`: `actions` slot in the heading column, under the note.
  11. `INTEGRATION_ANIMATION_DETAILS`: the audit entry's dead `skene audit .` command and "instrumentation surface" phrase replaced with the real `uvx skene analyse-journey .` invocation and "tracking surface", matching the marketing homepage's now-unnecessary `AUDIT_DETAIL_FIX` override.

## 0.10.0

### Minor Changes

- fb566c6: Add LogoRow/LogoSlot (the proof strip whose slots are empty by design) and TeamCard/TeamGrid.

### Patch Changes

- cf0d9be: Correct the stale PR-surface claim to GitHub App in card-animation-integrations and integrations-highlight; add the first PillNavMobileMenu stories.
- 4b375c7: Correct the stale docs-app copy to the GitHub App claim, author machine context for the integrationsField asset, and rebaseline the visual suite.

## 0.9.24

### Patch Changes

- **`PillNav` gains a mobile drawer, and `PillNav` moves out of `patterns/marketing`.**

  `PillNav` hid its links below 1024px, which left a phone with the brand mark and
  the CTA and no navigation at all. That was deliberate when it landed: the bar
  overflowed every viewport below about 650px, hiding matched what
  skene-marketing-website's live site does, and it was recorded as a design
  decision rather than a bug. It is still a phone with no way to reach twenty-four
  routes.

  Below `md` (768px) the bar now carries a Menu toggle that opens a full-screen
  drawer: backdrop fade, a bordered list of the same links, and `actions` repeated
  in the drawer footer so the CTA survives the transition. `PillNav` collects the
  list from its own `PillNavLink` children, so a caller that already renders the
  desktop nav gets the mobile one with no second link array to keep in step. The
  toggle and the panel are wired through `aria-controls` and `aria-expanded`
  against an id from `useId`.

  **Two new props.** `PillNav` takes `position`, `'absolute' | 'sticky'`,
  defaulting to `absolute` so existing callers are unchanged. `absolute` is the
  overlay-the-hero behaviour the component has always had; `sticky` is for a
  surface with no hero media to sit over, and it is the shape a consumer had been
  reaching for with an `!important` className override. `PillNavLink` takes
  `active`, which marks the current route in both the bar and the drawer.

  **Where it lives.** `PillNav` and `PillNavLink` are now `patterns/pill-nav`,
  with the drawer layers in `patterns/pill-nav-mobile-menu` and the frosted wash
  and the two position class strings in `patterns/pill-nav-frosted`.
  `patterns/marketing` re-exports all three names, so
  `from '@skene/design-system/patterns/marketing'` keeps working and no consumer
  has to move an import. The split is because the nav is now a client component
  with state, and leaving it inside `marketing` would have pulled `Eyebrow`,
  `DisplayHeading` and `NumberedStep` across the client boundary with it.

## 0.9.23

### Patch Changes

Three API requests filed by skene-site against this package, applied as filed rather than worked around. All three are component mechanics; each landed as its own commit.

- **`NumberedStep` gains `titleAs`** (ask p). It hardcoded `<h3>`, which is right where the steps sit under a band `<h2>` and wrong where the steps ARE the band. skene-site's `/product/how-it-works` band 1 is three steps beside a decorative texture with no heading of its own, so that page's outline runs `h1` straight to `h3` — the only heading-level skip across its 24 routes, and not something a caller can reach: `className` cannot change a rendered element, and giving the band a heading it does not have would be writing copy to satisfy markup.

  Spelled and defaulted like `FeatureRow.titleAs` — same union, same `'h3'` default, so no existing caller moves. `PlanCard`'s is the second precedent and a deliberately different shape: `tierAs` wraps a `Chip` rather than a title and defaults to undefined, because a plan card renders no heading unless asked. The two that name a title now agree.

- **`Bridge`'s `title` is optional and takes `titleAs`** (ask q). It was required and rendered an unconditional `<h2>`, so a band placed inside a `FeatureRow` on `/developers` — where the row already carries the section `<h2>` — printed the same sentence twice and gave one `<section>` two `<h2>`s. An artifact with no title of its own has nothing to pass.

  **The spacing is the half that would have shipped broken.** The head block is a centred div holding three optional parts; drop the title and it is still there at zero height, still owning the card row's 56px top margin — an empty slot under the band's own 88px of padding, which reads exactly like a heading that failed to render. The head block, the row's top margin and the lede's own top margin are each conditional now.

- **`Finding`'s tag was ink on a tint of itself** (ask r). At 9px, `color: STATUS_TOKEN[status]` on `color-mix(in oklab, <that same colour> 18%, transparent)`. Measured off real pixels by the consumer, nine failures across three states against a 4.5:1 floor:

  | state  | ink               | ground             | was  | now  |
  | ------ | ----------------- | ------------------ | ---- | ---- |
  | danger | `rgb(196,66,57)`  | `rgb(244,221,219)` | 3.88 | 4.90 |
  | good   | `rgb(103,117,82)` | `rgb(228,230,224)` | 3.94 | 5.03 |
  | warn   | `rgb(136,106,47)` | `rgb(234,228,218)` | 4.00 | 4.90 |

  `StatPill` had this defect in 0.5.1 and this fix — the label takes a token derived against the ground it is actually on — but held the split privately, and `finding-card` then shipped the identical bug. The split is now `STATUS_TINT_TOKEN` in `src/lib/status.ts`, beside the map it is the counterpart to.

  **The ink swap alone is not enough, and that had to be measured.** At 18% the on-tint inks land 4.49 / 4.66 / 4.53 — danger misses by 0.01. Those values were derived against a 10% tint and re-derived in 0.5.2 against every ground observed up to `StatPill`'s 12% fill; 18% is a ground none of them saw, which is 0.5.2's own mistake arriving from the other side. So the fill returns to 12%, inside the band they cover.

  **One pair still does not clear and is recorded rather than waived.** On the dark card `danger` measures 4.06. `Finding`'s dark fill is `chrome.surface.2`; the dark on-tint values are the base tokens, derived on `surface.1` — one rung darker — where the same ink at 12% measures 4.55. Closing it needs a new dark on-tint value or a different surface role, both ask-first under `machine/rules.yaml`, so it is asserted at its measured value instead.

### The gate this needed, and why it is not `tokens:contrast`

`npm run tokens:contrast` scores declared token PAIRS. `Finding`'s tag has no pair: its background is computed at render time by `color-mix` from its foreground, so no row for it exists and adding one would mean that table evaluating `color-mix`. It surfaced only because a consumer rendered the component and measured pixels.

`__tests__/finding-tag-contrast.test.tsx` does that in the package. It renders the component, reads the two colours, the tint percentage, the card fill class and the type size back out of the emitted markup, evaluates the `color-mix` through oklab, composites over the fill and scores all six rendered pairs. Nothing in it transcribes the source, so a later edit changes what it measures rather than leaving it measuring the old thing. Its compositing agrees with the browser byte for byte: the new baseline PNG carries 526 / 660 / 575 pixels of the three computed grounds and none of the old ones.

Worth knowing separately, because it is the reason that test exists rather than a snapshot: **the visual suite did not drift on this repaint.** `section-finding-card` renders all six tags and compared clean. `toHaveScreenshot` counts a pixel as different only above a YIQ delta of 56, and the tint move from 18% to 12% is about 45 — so the tinted area is not counted at all, and what remains is a scatter of antialiased 9px glyph edges under the ratio budget. A colour change small enough to fail AA is also small enough to pass this gate.

## 0.9.17

### Minor-in-spirit, patch in fact

- `Code` and `PROSE_CODE` — the inline identifier chip, extracted from **seven** copies.

  Six route files in skene-site declared it byte-for-byte identically (verified by comparing the emitted class string, not by eye) and a seventh spelling existed as a descendant selector for prose the author cannot reach element by element. One mark, two mechanisms, seven copies, on a site where an event name appears in nearly every paragraph. The oldest open entry on that repository's gap list.

  `Chip`, `TagChip`, `Badge`, `TerminalBlock` and `McpBlock` were each checked and rejected for a stated reason before this was added; nothing in the 74 existing gallery modules rendered an inline `<code>`. `documentation/20260817_code_component_design.md` has the working.

  **Each variant pins its own mode class, and the contrast gate is what proved that necessary.** Measured across both modes: the default is 10.06:1 as rendered and 4.30:1 in the mode it is never meant to be in; `onLight` is 17.75:1 as rendered and **1.00:1** — the same colour, not merely low contrast — in the mode it is never meant to be in. "Never meant to" is a hope about where a caller puts it, not a guarantee, so `dark` and `light` are carried on the branches themselves. The measured number is now the rendered number wherever the chip lands.

  This is the inverse of the `brand.peachDeep` failure in 0.9.9: there an invariant token was assumed to adapt; here mode-aware tokens are made deterministic.

## 0.9.16

### Patch Changes

- `LightSectionCard` gains `titleScale`, closing the third and last section-heading scale.

  `display` is this card's own fluid `clamp(2rem, 3.2vw, 3.25rem)` and stays the default. `section` is a flat `--font-size-marketing-xl`, the same token `DisplayHeading size="section"` emits.

  `design-system-gaps.md` §2 named this before anyone measured it — "a tonal band's heading is not on the same scale as the section headings around it" — and closing `FeatureRow`'s scale in 0.9.15 is what left it alone on the page. Measured on two routes after that release: 32.77px at 1024, 42.66 at 1333, 46.08 at 1440, against a flat 32 on every band beside it. Three components were each answering "how big is a section heading" differently; now one token does.

## 0.9.15

### Patch Changes

- `FeatureRow` gains `titleScale`, and the defect it closes is not a constant offset.

  `row` is the fluid `clamp(1.75rem, 2.4vw, 2.55rem)` and stays the default, so the homepage does not move. `section` is a flat 32px — `--font-size-marketing-xl`, exactly what `DisplayHeading size="section"` emits — for the case where the row IS a section rather than one of three inside one.

  The two scales **cross at a 1333px viewport**. Above it a card heading is larger than the section headings beside it; below it smaller; at 1024 it is 28px against their 32. Ten of the nineteen adopting routes render both on one page, and one route renders only the card scale, which makes it internally consistent and inconsistent with the other eighteen. Measured at a single width this looks like 2.56px of nothing, which is why it survived a review: the measurement has to cross the breakpoint to show it inverting.

- `PlanCard` gains `tierAs`, so a plan's name can reach the document outline.

  Unset by default, and unset is right for the homepage preview, where three cards sit under a section heading that already names the row. `/pricing` is the case this exists for: there the three tier names ARE the page's structure — the prototype had them as `<h2>`s — and rendering them only as chips left that page's outline running `h1` straight to its section headings with nothing naming a single tier, on the page whose entire subject is the three tiers.

  It **wraps** the chip rather than replacing it, so nothing moves on screen. The heading carries `m-0`: a UA heading margin would re-centre the `items-center` chip row and shift the `flag` beside it.

## 0.9.14

### Patch Changes

- `FeatureRow`'s visual inset is 16px when the card is stacked, 34px when it is split. Split cards are unchanged, so the homepage does not move.

  The inset exists to separate the visual from the copy column beside it. Under `splitAt="never"` there is no column beside it — the copy is above — so 68px is spent on nothing, and it is spent on exactly the artifacts that chose `never` because they were too wide to sit beside anything.

  Measured on the widest one, a five-stage `LifecycleCanvas` at 1440: the card hands the artifact 1092px and the scrolling strip ends with 946 against the 998 it needs. The 146px between the two is this 68px plus `ArtFrame`'s 96 and `AppPanel`'s 48. Those two are the artifact's own material and its app chrome and are not available; this one is layout for an arrangement that is not in use.

  Not zero: the visual still has to read as sitting ON the card rather than as the card's own edge, and 16px is the smallest gap that survives the 24px radius without the corner clipping the frame. `SectionBackdrop` is unaffected — it owns its own inset and the padded wrapper is the fallback branch.

## 0.9.13

### Patch Changes

- `FaqBand` ships its answers. Radix mounts `Accordion.Content` only while a row is open, so a closed FAQ put its QUESTIONS in the document and none of its ANSWERS. Measured on the first adopter's `/pricing`: five questions in the DOM, five answers absent from it — the text existed in the RSC flight payload, a JSON-escaped blob inside a `<script>`, and nowhere in the rendered page. Anything reading the page as text got half the content.

  That is not a nicety for a company whose whole argument is that data can look present and not be. `forceMount` keeps the answer mounted and `data-[state=closed]:hidden` collapses it; hidden content is in the document and is indexed, which is the distinction that matters.

  The cost is the height animation, paid deliberately. A force-mounted node cannot both animate its height and rest at zero without JS sequencing the two, so the open/close transition is now the `+` rotating into `×` and nothing else. Five answers existing beats a 200ms ease on a panel nobody watches twice.

  Four assertions on the server render with every row closed, which is the state a crawler, an agent and a reader-mode extractor all see.

## 0.9.12

### Patch Changes

- `FeatureRow` gains `titleAs` and `eyebrow`, because its second adopter is shaped differently from its first.

  The homepage renders three rows under one band `<h2>`, so an `<h3>` title and no per-row eyebrow are exactly right there. skene-site's subpages render ONE row as the whole section: its title is that section's `<h2>` under the page `<h1>`, and its eyebrow labels that heading. Adopting the component unchanged would have demoted the section heading on nine routes — a change nothing on screen shows and every outline reader sees — and pushed each section's eyebrow outside the card, splitting the head across the card's edge.

  `titleAs` defaults to `h3`, so no existing caller moves. It is NOT derived from whether `eyebrow` is set: the two answer different questions, and a rule that guesses is one nobody can override when it guesses wrong.

  `eyebrow` is a slot rather than a string, so this component does not have to import `Eyebrow` and a caller can pass a chip or a link instead. Its 24px gap sits on a block wrapper and never on the slot, because `Eyebrow` is `inline-block` and its own bottom margin does not collapse — the defect that once put one page's section heads at 48px while its siblings sat at 24.

- `splitAt` gains `never`, and `title` becomes optional. Same adopter, same reason: a component written around one caller meeting a second one shaped differently.

  `never` is one column at every width — copy above the visual, inside the same card — and it exists because a visual too wide for a half track is a real category rather than an escape hatch. Measured: a five-stage `LifecycleCanvas` wants 998px, a `FlowDiagram` 812px, a four-column evaluator table about 1000px. The widest split this component offers hands the visual roughly 640–700px, so all three clip at every breakpoint, and they clip **silently** — the panels scroll inside `overflow-hidden` chrome with an overlay scrollbar, so nothing announces it and a column simply ends mid-word. `reverse` is inert under `never`; there is no second track to move to. Empty strings rather than an omitted key, so the `SPLIT` lookup stays total and the render path needs no branch.

  `title` is optional because a row is sometimes only its visual: the second adopter has four sections carrying an eyebrow and no heading, and one carrying no text at all. Requiring a string would mean writing marketing copy to satisfy a type. With no title the heading element is not rendered at all rather than rendered empty — an empty `h2` is a heading to every outline reader and to nothing else.

## 0.9.11

### Patch Changes

- `SiteFooter`'s column grid follows the number of link columns it is given. It was `lg:grid-cols-[1.7fr_repeat(3,1fr)]` — brand plus exactly three — so skene-site, which passes four (Product, Developers, Resources, Company), had its fourth column wrap onto a second row and sit left-aligned under the brand. It read as a broken footer rather than as a capacity limit, which is what it was.

  Nothing failed. A grid with fewer tracks than items is valid CSS, so typecheck, lint, build and every test in this package stayed green while the rendered page was wrong. The only case in `docs-app` passed three columns, which is why the hardcoded three survived: the gallery agreed with the component instead of testing it. There is now a four-column case beside it.

  The track list is a lookup table of whole class strings rather than a template literal, because Tailwind scans source text — an interpolated class name generates no rule and, like every class that generates nothing, does not warn. A test greps this file for the five literals instead of trusting the rendered string, since a rendered string is right in exactly the case the CSS is missing.

  Counted with `Children.toArray`, not `Children.count`: count includes `null`, so `{flag ? <FooterColumn/> : null}` would reserve a track for a column that is not there. Clamped at five, past which a column is narrower than the link text it holds.

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
