// No `cn` import: every class list here is static and the one mergeable
// `className` is forwarded to `AppWindow`, which merges it. Same as
// `DiscoveryTable`.
import { artifactHeader, AppWindow, StatPill, type StatPillStatus } from './artifact-shell.js'
import { TagChip } from './key-value-table.js'

/**
 * The Lifecycle artifact: Skene Cloud's journey canvas, drawn rather than
 * screenshotted.
 *
 * Five stages read left to right, each one a labelled header over the
 * milestones that belong to it, each milestone naming the database rows that
 * prove it happened. That last part is the claim: a lifecycle stage in Skene is
 * not a slide, it is a milestone bound to a table and an operation, and the
 * bindings are on the card for exactly that reason.
 *
 * ## This is not `JourneyTrack`, and they should not be merged
 *
 * The overlap is real enough to be worth stating. Both lay out an ordered
 * sequence of steps about a customer journey. They are different objects:
 *
 *   - `JourneyTrack` is the marketing argument. Its subject is measurement
 *     health, so every node carries `good | warn | danger`, the connector
 *     between two nodes is a gradient because the break lives in the seam, and
 *     it renders on the dark page ground using `text.*` / `surface.*`.
 *   - This is a depiction of the product. Its subject is the definition, not the
 *     health: there is no status vocabulary anywhere below and no connector,
 *     because the canvas makes no claim about whether a stage is instrumented.
 *     It renders inside `AppWindow`, in the light app register, on the themed
 *     product roles (`muted`, `card`, `border`, `foreground`).
 *
 * A component that was both would need a status triple that is optional on half
 * its call sites and a connector that disappears on the other half, which is two
 * components wearing one name. If a future section wants the canvas annotated
 * with health, that is a `state` prop added here on purpose, not a merge.
 *
 * ## It scrolls sideways; it does not wrap
 *
 * `artifacts.css` carries a comment saying this is "a grid that wraps rather
 * than a viewport that scrolls" and then ships `grid-auto-flow: column` with
 * `overflow-x: auto`, which is a strip that scrolls. The shipped rule is what
 * was verified in the browser at 390/768/1440, so the shipped rule is what is
 * ported, and the discrepancy is recorded here rather than quietly resolved in
 * either direction.
 *
 * What matters for the overflow gate is that the scroll is CONTAINED: the
 * `overflow-x-auto` sits on the strip and every column is `min-w-0`, so five
 * 190px tracks at a 310px content width scroll inside the artifact instead of
 * widening the page. The 190px floor is the smallest a stage can be and still
 * hold a table name; below it the bindings are what break the track, which is
 * why they are `max-w-full` with `overflow-wrap: anywhere` — an identifier like
 * `public.customers` has nowhere to break on its own.
 *
 * ## The frame is not included; the window is
 *
 * Same split `DiscoveryTable` documents: `ArtFrame` is a placement decision the
 * caller makes (`<ArtFrame kind="jr"><LifecycleCanvas … /></ArtFrame>`), while
 * the app chrome is part of what the artifact IS — this is a picture of a
 * product surface, and a bare grid of cards is not that surface.
 *
 * Note the consequence of `AppWindow` forcing `light`: the one status colour in
 * the whole artifact is the summary pill in the bar, and on a cream card matcha
 * measures 1.16:1 (`rules.yaml known_gaps: light_mode_brand_palette`). Nothing
 * else here is at risk, because nothing else here is coloured — the canvas is
 * deliberately monochrome and says everything in words.
 *
 * ## Spacing is literal px on purpose
 *
 * `--spacing: 0.2rem` makes Tailwind's `p-3` 9.6px while `--spacing-3` is 12px.
 * Every padding, gap and margin below was ported from a `--spacing-N` token and
 * is written as the px that token carries, so it diffs against `artifacts.css`
 * line for line. Tidying them into the numerically-similar Tailwind step is a
 * silent 20-25% shrink. See the header of `artifact-shell.tsx`.
 *
 * The one size that is NOT in the source is the stage name's 16px: the prototype
 * lets it inherit the document's body size, which a package cannot do, because
 * the consumer's body size is not ours to assume. It is pinned to the value the
 * prototype computes so the artifact renders the same wherever it is dropped.
 *
 * All content is props. Nothing here knows what a Skene stage is called or which
 * table a milestone is bound to.
 */

/* ── the binding tag ──────────────────────────────────────────────────────── */

/**
 * The prototype's `.chip`, rendered locally and deliberately NOT exported.
 *
 * This 11px mono muted tag appears in five artifacts, and porting them
 * concurrently has already produced `EvaluatorTag`, `TagChip` and `CheckChip` —
 * three names for one span, and this file would have made a fourth in the
 * barrel. It belongs in `artifact-shell` as one export; adding a competing
 * fourth public name while that consolidation is pending would make the cleanup
 * harder, not easier. So the class string is duplicated (deliberately identical
 * to `TagChip`'s outline variant) and the duplication is reported.
 *
 * It is also NOT the package's `Chip`: that one is a 10px uppercase tracked
 * identity marker for the marketing page. Uppercasing `public.customers` would
 * be a lie about what the reader should type.
 */
const BindingTag = TagChip

/* ── data ─────────────────────────────────────────────────────────────────── */

export interface LifecycleMilestoneItem {
  /** The milestone's name, in the reader's own words — "First order received". */
  name: React.ReactNode
  /** One line on what the milestone means. Optional; most earn one. */
  description?: React.ReactNode
  /**
   * What the milestone is bound to — a table, an operation, a source. Rendered
   * as a wrapping run of monospace tags, verbatim: these are identifiers the
   * reader is meant to recognise in their own schema.
   */
  bindings?: React.ReactNode[]
}

export interface LifecycleStageItem {
  /**
   * The stage's machine name — the key the product stores it under. Monospace
   * and uppercased by CSS, because it is an identifier rather than a title.
   * Omit it and the caption line disappears.
   */
  key?: React.ReactNode
  /** The stage's display name — "Discovery", "Expansion". */
  name: React.ReactNode
  /** One line on what the stage covers. */
  description?: React.ReactNode
  /**
   * The milestones in this stage, in reading order. The prototype's capture has
   * exactly one per stage; the layout takes any number and shares the column's
   * remaining height between them, so a stage with three is not a special case.
   */
  milestones?: LifecycleMilestoneItem[]
}

export interface LifecycleCanvasProps {
  /** The stages, left to right. Order is meaningful — this renders as an `<ol>`. */
  stages: LifecycleStageItem[]
  /** The current surface, rendered bold as the leading breadcrumb segment. */
  title?: React.ReactNode
  /** What the lifecycle belongs to — a repository, workspace or project. */
  source?: React.ReactNode
  /**
   * Breadcrumb separator. A glyph rather than a word, but still a prop: a
   * right-to-left page wants a different one.
   */
  separator?: React.ReactNode
  /**
   * The headline count in the bar's pill — "5 stages". Omit it and the pill
   * disappears.
   */
  summary?: React.ReactNode
  /**
   * Colour of that pill. Defaults to `ok`: unlike the discovery scan, a
   * lifecycle that renders is a lifecycle that was defined, and there is nothing
   * here for it to be alarmed about.
   */
  summaryStatus?: StatPillStatus
  /** Anything further in the bar's right cluster — at most one button. */
  actions?: React.ReactNode
  className?: string
}

/* ── LifecycleCanvas ──────────────────────────────────────────────────────── */

export function LifecycleCanvas({
  stages,
  title,
  source,
  separator = '/',
  summary,
  summaryStatus = 'ok',
  actions,
  className,
}: LifecycleCanvasProps) {
  // Both computed as undefined-when-empty rather than as empty elements:
  // `AppWindow` drops the whole bar when neither is present, and an empty flex
  // row above the canvas reads as a rendering fault.
  // Both halves undefined-when-empty rather than empty elements: AppWindow
  // drops the whole bar when neither is present, and an empty flex row above
  // the panel reads as a rendering fault. See artifact-shell.
  const { crumb, bar } = artifactHeader({
    title,
    source,
    separator,
    summary,
    summaryStatus,
    actions,
  })

  return (
    <AppWindow crumb={crumb} actions={bar} className={className}>
      {/* The strip is the scroll container. `grid-flow-col` with a minmax floor
          rather than fixed columns: at 1440 five stages share the width evenly,
          at 390 they hold 190px each and the strip scrolls inside the artifact.
          Never put a width on this — see the file header. */}
      <ol className="m-0 grid list-none grid-flow-col auto-cols-[minmax(190px,1fr)] gap-[12px] overflow-x-auto p-0">
        {stages.map((stage, i) => (
          // min-w-0 is what makes the 190px floor hold: without it a long
          // binding sets the track's width and the floor stops meaning anything.
          <li key={i} className="flex min-w-0 flex-col gap-[8px]">
            <div className="rounded-sm border border-border bg-muted p-[12px]">
              {stage.key ? (
                <span className="mb-[4px] block font-mono text-[9px] uppercase tracking-[0.9px] text-muted-foreground [overflow-wrap:anywhere]">
                  {stage.key}
                </span>
              ) : null}
              {/* 16px is the prototype's inherited body size, pinned. See the
                  file header — inheritance is not available to a package. */}
              <strong className="block text-[16px] font-medium text-foreground">
                {stage.name}
              </strong>
              {stage.description ? (
                <small className="mt-[2px] block text-[12px] text-muted-foreground">
                  {stage.description}
                </small>
              ) : null}
            </div>

            {stage.milestones?.map((milestone, j) => (
              // flex-auto: the milestone takes the column's leftover height, so
              // a row of stages with headers of different depths still ends on
              // one line. With several milestones they share that leftover.
              <div key={j} className="flex-auto rounded-sm border border-border bg-card p-[12px]">
                <strong className="block text-[13px] font-medium text-foreground">
                  {milestone.name}
                </strong>
                {milestone.description ? (
                  <p className="mt-[4px] text-[12px] text-muted-foreground">
                    {milestone.description}
                  </p>
                ) : null}
                {milestone.bindings?.length ? (
                  // The 8px lives here rather than on the paragraph's bottom
                  // margin, so a milestone with bindings and no description is
                  // still spaced. Adjacent margins collapse, so the case the
                  // prototype actually renders is unchanged at 8px.
                  <div className="mt-[8px]">
                    {milestone.bindings.map((binding, k) => (
                      <BindingTag key={k}>{binding}</BindingTag>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </li>
        ))}
      </ol>
    </AppWindow>
  )
}
