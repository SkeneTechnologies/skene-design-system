import { Fragment } from 'react'

import { EvaluatorNote } from './evaluator-list.js'
import { TagChip } from './key-value-table.js'
import { cn } from '../lib/utils.js'
import {
  AppPanel,
  AppWindow,
  ArtFrame,
  StatPill,
  type ArtFrameKind,
  type StatPillStatus,
  PanelCaption,
} from './artifact-shell.js'

/**
 * The Evaluator's Verify tab: a list of the signals an evaluation needs, each
 * with a verdict.
 *
 * The product runs a verification and reports, requirement by requirement,
 * whether the signal was actually found in code or in runtime samples. That is
 * the whole argument of the surface — a plan is not launch-ready because someone
 * wrote it down; it is launch-ready when the signals it depends on exist — so the
 * component is a list of rows with a status held at the right, and nothing else.
 * There is no chart and no total, because a total lets the reader average away
 * the one missing property that silently drops an account off the list.
 *
 * ## One component, two cuts
 *
 * The prototype has two of these and they differ only in where they spend the
 * reader's attention: one expands a single event's five required fields and lets
 * the other events stand as one row each; the other lists three sibling events
 * and expands none of them. That is a content decision, not a layout one, which
 * is why `fields` hangs off a requirement rather than being a separate mode. A
 * caller chooses the cut by choosing which requirement gets fields.
 *
 * Fields NEST in the API and FLATTEN in the DOM. The prototype writes them as
 * sibling rows with an indent class, and keeping that flat would let a field row
 * exist with no event above it — a shape that means nothing, since a required
 * field is required *of* something. Nesting makes the relationship
 * unrepresentable-if-wrong; flattening on render keeps the single rule between
 * every pair of rows, and lets `last:border-b-0` drop the final rule for free
 * whether the list ends on an event or on one of its fields.
 *
 * ## Why the meta pills are not `Chip`
 *
 * "event" / "formula input" are drawn here rather than through `./chip.js`.
 * `Chip` is the marketing chip — 10px, 5px radius, three colour tones, and it is
 * browser-verified at that geometry on the plan cards and the window title bar.
 * This is the product's own meta pill: 11px mono, 6px radius, `bg-muted` inside
 * `border-border`, no tone vocabulary at all. Bending `Chip` to cover both would
 * have restyled two shipped surfaces to save a `<span>`. The same pill appears in
 * the Check tab, Lifecycle and MCP artifacts, so it probably wants to be one
 * exported component once those exist — that is a decision about the package's
 * public surface, not part of this port, so it stays local and unexported here.
 *
 * ## Two carried-over hazards
 *
 * Spacing is literal px throughout, for the reason `artifact-shell` documents at
 * length: `--spacing: 0.2rem` makes Tailwind's `p-3` 9.6px while the
 * `--spacing-3` this was ported from is 12px. Tidying `p-[12px]` into `p-3` is a
 * silent 20% shrink and nothing warns.
 *
 * `StatPill` renders on `AppWindow`'s forced-`light` ground, where `bad` and
 * `warn` are the two states with no light-mode value yet — see `rules.yaml`
 * `known_gaps: light_mode_brand_palette`. The prototype darkened them through
 * `--status-*-text`; this package has no such token and inventing one is
 * `ask_first_when: a_token_value_would_change`. Reported, not papered over.
 *
 * All content is props. Nothing here knows what a signal is called, which
 * repository it lives in, or why it is missing.
 */

/* ── the meta pill ────────────────────────────────────────────────────────── */

/**
 * Exported for `evaluator-panel.tsx` ONLY, which renders the same requirement
 * rows in its right-hand pane. It was unexported and copied there line-for-line
 * until 2026-08-13; two copies of a pill is two places for a padding value to
 * drift, and the copy is what this export removes.
 *
 * Not in the barrel and not a public part: a caller wanting a small tag reaches
 * for `TagChip`. See `docs/sections.md` §2 — this shape has five names already.
 *
 * `mt-[8px]` is the row's override of the pill's own margin, so a run of pills
 * clears the note above it and still wraps with a gap on both axes at 390px.
 */
export function MetaPill({ children }: { children: React.ReactNode }) {
  return <TagChip className="mt-[8px]">{children}</TagChip>
}

/* ── one row ──────────────────────────────────────────────────────────────── */

/** A required field of the event above it. Narrower than an event by design. */
export interface VerifyField {
  /** The field or property name. Monospace — the reader matches it against code. */
  name: React.ReactNode
  /** What the verification observed. One line. */
  note?: React.ReactNode
  status: StatPillStatus
  /** The pill's word — the verdict, not a count. */
  verdict: React.ReactNode
}

export interface VerifyRequirement extends VerifyField {
  /**
   * Meta pills: what kind of thing this is, and what role it plays in the
   * formula. Free-form — the package does not know the product's vocabulary.
   */
  tags?: React.ReactNode[]
  /**
   * The fields this event must carry. Rendered indented and a step quieter
   * underneath it. Expanding one requirement and not the others is how the
   * artifact says "this is the one to read".
   */
  fields?: VerifyField[]
}

/**
 * Exported for `evaluator-panel.tsx` only, for the same reason `MetaPill` is.
 *
 * The grid is `minmax(0, 1fr) auto` rather than `1fr auto` so the left column can
 * actually shrink below its content — `1fr` floors at min-content, and an event
 * name like `quiet_customer_reactivated_within_30_days` is one unbreakable word.
 * With the floor removed, `[overflow-wrap:anywhere]` on the name does the rest,
 * which is what keeps this artifact off the page's horizontal scrollbar at 390px.
 *
 * The rule is 60% of `--border`, the same value `DataRow` uses: at this row
 * height a full-strength line turns a seven-row list into a grid and the header
 * rule above stops reading as the header rule.
 */
export function VerifyRow({
  name,
  note,
  tags,
  status,
  verdict,
  field,
}: VerifyRequirement & { field?: boolean }) {
  return (
    <div
      className={cn(
        'grid grid-cols-[minmax(0,1fr)_auto] items-start gap-[12px] border-b p-[12px] last:border-b-0',
        field && 'pl-[24px]',
      )}
      style={{ borderBottomColor: 'color-mix(in oklab, var(--border) 60%, transparent)' }}
    >
      <div className="min-w-0">
        <div
          className={cn(
            'font-mono text-[13px] text-foreground [overflow-wrap:anywhere]',
            field && 'text-[12px] text-muted-foreground',
          )}
        >
          {name}
        </div>
        {note ? (
          <small className="mt-[2px] block text-[12px] text-muted-foreground">{note}</small>
        ) : null}
        {tags?.map((tag, i) => <MetaPill key={i}>{tag}</MetaPill>)}
      </div>
      <StatPill status={status}>{verdict}</StatPill>
    </div>
  )
}

/* ── the artifact ─────────────────────────────────────────────────────────── */

export interface EvaluatorVerifyProps {
  /**
   * The breadcrumb. Passed straight to `AppWindow`, which styles `<b>` as the
   * current surface and everything else as its parent — so a caller writes
   * `<><b>Surface</b><span>/</span><span>repo</span></>` and gets the product's
   * own weights. Omitting both this and `summary` drops the bar entirely.
   */
  crumb?: React.ReactNode
  /**
   * The header pill: usually a count of what is missing. Both halves together or
   * neither — the same reason `fields` nests rather than sitting flat. A default
   * status here would let a caller who supplied only the words ship a red pill
   * reading "3 data ready", and that failure is invisible in a diff.
   */
  summary?: { status: StatPillStatus; label: React.ReactNode }
  /** The evaluation being verified. */
  title: React.ReactNode
  /** The right-hand half of the panel header: which tab, and how far it got. */
  subtitle?: React.ReactNode
  requirements: VerifyRequirement[]
  /**
   * The paragraph under the panel that says what the reader is looking at. A
   * `<code>` inside it is picked up and set in mono against `--foreground`.
   */
  note?: React.ReactNode
  /**
   * Which texture backs the frame, or `false` for none.
   *
   * `jr` is the default because measurement artifacts sit on card1 across the
   * live site. `false` exists because framing is a page-composition decision and
   * one artifact already opts out — the funnel, whose wide three-row shape fights
   * a texture drawn for a square card. Do not guess a width threshold for that;
   * it was decided by looking.
   */
  frame?: ArtFrameKind | false
  /** Lands on the outermost element — the frame, or the window when unframed. */
  className?: string
}

export function EvaluatorVerify({
  crumb,
  summary,
  title,
  subtitle,
  requirements,
  note,
  frame = 'jr',
  className,
}: EvaluatorVerifyProps) {
  const artifact = (
    <AppWindow
      crumb={crumb}
      actions={summary ? <StatPill status={summary.status}>{summary.label}</StatPill> : undefined}
      className={frame === false ? className : undefined}
    >
      {/*
        No top margin. The prototype's `.evl` carries one for the case where a
        second panel follows, and then removes it again for the first child of
        the body — which this always is, because an artifact shows one
        evaluation. Carrying the margin and then cancelling it would be two rules
        that net to nothing.
      */}
      <AppPanel>
        <PanelCaption>
          <span>{title}</span>
          {subtitle ? <span className="text-[11px] text-muted-foreground">{subtitle}</span> : null}
        </PanelCaption>
        {/*
          A `Fragment`, not a wrapper element. Every row has to be a direct child
          of the panel or `last:border-b-0` matches the last field of EVERY
          group — `display: contents` hides a box from layout but not from
          `:last-child`, which is exactly the kind of bug that only shows up as
          one stray missing hairline three rows up.
        */}
        {requirements.map((requirement, i) => (
          <Fragment key={i}>
            <VerifyRow {...requirement} />
            {requirement.fields?.map((f, j) => <VerifyRow key={j} {...f} field />)}
          </Fragment>
        ))}
      </AppPanel>
      {note ? <EvaluatorNote>{note}</EvaluatorNote> : null}
    </AppWindow>
  )

  if (frame === false) return artifact
  return (
    <ArtFrame kind={frame} className={className}>
      {artifact}
    </ArtFrame>
  )
}
