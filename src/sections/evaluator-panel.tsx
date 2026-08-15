import { Fragment } from 'react'

import { cn } from '../lib/utils.js'
import {
  AppPanel,
  AppWindow,
  ArtFrame,
  DataCell,
  DataRow,
  DataTable,
  StatPill,
  type ArtFrameKind,
  type StatPillStatus,
  PanelCaption,
} from './artifact-shell.js'
import {
  EvaluatorNote,
  type EvaluationEntry,
  type EvaluatorListColumns,
} from './evaluator-list.js'
import {
  MetaPill,
  VerifyRow,
  type VerifyRequirement,
} from './evaluator-verify.js'

/**
 * The whole Evaluator surface in one window: the index of evaluations, and one
 * of them opened underneath it.
 *
 * The two halves are the same argument told twice at different resolutions. The
 * table says three plans exist and none of them has its signals; the panel below
 * takes one of those rows and shows what "none of them" actually means — an event
 * that was never found in code, and the five properties under it that were never
 * observed either. A reader who only sees the index can believe the counts are a
 * progress bar. A reader who only sees the detail does not know it is one of
 * three. Putting them in one frame is the point.
 *
 * ## Why this is not `<EvaluatorList/>` stacked on `<EvaluatorVerify/>`
 *
 * It was the first thing tried, and it produces the wrong picture.
 *
 * Each of those siblings is a COMPLETE artifact: its own `ArtFrame`, its own
 * `AppWindow`, its own chrome bar, its own summary pill. Stacked, they render two
 * bordered windows with two breadcrumbs reading the same thing and two pills
 * disagreeing with each other — two screenshots of two visits, not one screen.
 * The prototype's `EVALUATOR` is a single window whose single pill totals both
 * panels (the workspace's 38, which is 10 + 13 + 15 across the three rows), and
 * that containment is load-bearing: the detail is one of the rows above it,
 * opened, and a second border between them says otherwise.
 *
 * So this is a third layout rather than a composition of the other two, and it
 * composes at the level where composition is honest — `AppWindow`, `AppPanel`,
 * `DataTable`, `StatPill` from `artifact-shell`, `EvaluatorNote` from
 * `evaluator-list`, and the siblings' own content types so that a row here and a
 * row there cannot drift apart in shape without a type error.
 *
 * ## The margin that nets to nothing everywhere except here
 *
 * `artifacts.css` gives `.evl` a 12px top margin and then cancels it again with
 * `.app__body > .evl:first-child`. Both siblings noted the pair as two rules that
 * cancel, because a standalone evaluation panel is always the body's first child.
 * This is the artifact those rules were written for: the verify panel follows the
 * index, so the margin applies and is carried here as `mt-[12px]`.
 *
 * ## The duplicate is gone
 *
 * `VerifyRow` and `MetaPill` were line-for-line the ones in
 * `evaluator-verify.tsx` — duplicated because the two files were written in
 * parallel, each owning exactly one file. Merged 2026-08-13: that file exports
 * both and the copies here are deleted, which is what this comment used to ask
 * for and the shape `EvaluatorNote` was already in.
 *
 * ## Two carried-over hazards
 *
 * Spacing is literal px throughout, for the reason `artifact-shell` documents at
 * length: `--spacing: 0.2rem` makes Tailwind's `p-3` 9.6px while the `--spacing-3`
 * this was ported from is 12px. Tidying `p-[12px]` into `p-3` is a silent 20%
 * shrink and nothing warns.
 *
 * `StatPill` renders on `AppWindow`'s forced-`light` ground, where `bad` and
 * `warn` have no light-mode value yet — see `rules.yaml`
 * `known_gaps: light_mode_brand_palette`. The prototype darkened them through
 * `--status-*-text`; this package has no such token and inventing one is
 * `ask_first_when: a_token_value_would_change`. Reported, not papered over. This
 * artifact is the worst case for it: eight `bad` pills and three `warn` pills on
 * one light panel.
 *
 * All content is props. Nothing here knows what an evaluation is called, which
 * repository it belongs to, or which signal is missing.
 */

/* ── the two halves ───────────────────────────────────────────────────────── */

export interface EvaluatorPanelList {
  /**
   * The four column headings. An object of named slots rather than an array, for
   * the reason `EvaluatorList` documents: the column SET is structure — this
   * depicts one real screen — while every word in it is copy. A positional tuple
   * would let a caller ship "Metric" over the confirmed counts and nothing would
   * catch it.
   */
  columns: EvaluatorListColumns
  /** The rows. Same entry shape as the standalone index, imported, not restated. */
  evaluations: EvaluationEntry[]
}

export interface EvaluatorPanelDetail {
  /**
   * The evaluation that is open. Usually the same words as one of the rows above
   * — nothing enforces that, because enforcing it would mean matching on a
   * `ReactNode`, but an artifact where they differ is depicting two screens.
   */
  title: React.ReactNode
  /** The right-hand half of the panel header: which tab, and how far it got. */
  subtitle?: React.ReactNode
  /** The signals the open evaluation needs, each with a verdict. */
  requirements: VerifyRequirement[]
}

/* ── the artifact ─────────────────────────────────────────────────────────── */

export interface EvaluatorPanelProps {
  /**
   * The breadcrumb. Passed straight to `AppWindow`, which styles `<b>` as the
   * current surface and everything else as its parent — so a caller writes
   * `<><b>Surface</b><span>/</span><span>repo</span></>` and gets the product's
   * own weights. Omitting both this and `summary` drops the bar entirely.
   */
  crumb?: React.ReactNode
  /**
   * The header pill. Here it belongs to the WHOLE window, not to either panel:
   * it is what the index adds up to, which is why this artifact reads as one
   * screen rather than two. Both halves together or neither — a default status
   * would let a caller who supplied only the words ship a green pill reading
   * "38 signals missing", and that failure is invisible in a diff.
   */
  summary?: { status: StatPillStatus; label: React.ReactNode }
  /** The index, on top. */
  list: EvaluatorPanelList
  /**
   * The opened evaluation, underneath. Required: this component exists to show
   * the two together, and an evaluator panel with no detail is `EvaluatorList`.
   */
  detail: EvaluatorPanelDetail
  /**
   * The paragraph under the panels that says what the reader is looking at. A
   * `<code>` inside it is picked up and set in mono against `--foreground`.
   */
  note?: React.ReactNode
  /**
   * Which texture backs the frame, or `false` for none.
   *
   * `jr` is the default because measurement artifacts sit on card1 across the
   * live site, and it is what the prototype frames this one with. `false` exists
   * because framing is a page-composition decision and one artifact already opts
   * out — the funnel, whose wide three-row shape fights a texture drawn for a
   * square card. Do not guess a width threshold for that; it was decided by
   * looking.
   */
  frame?: ArtFrameKind | false
  /** Lands on the outermost element — the frame, or the window when unframed. */
  className?: string
}

export function EvaluatorPanel({
  crumb,
  summary,
  list,
  detail,
  note,
  frame = 'jr',
  className,
}: EvaluatorPanelProps) {
  const artifact = (
    <AppWindow
      crumb={crumb}
      actions={summary ? <StatPill status={summary.status}>{summary.label}</StatPill> : undefined}
      className={frame === false ? className : undefined}
    >
      {/*
        `AppPanel` is what clips and scrolls: the table inside it has no
        `min-width`, so at 390px the text columns fold to their longest word and
        the artifact stays off the page's own horizontal scrollbar. Do not add one
        to make the columns "look right" on a phone — that moves the scrollbar
        from the panel to the page, which is the gate this artifact set is
        verified against.
      */}
      <AppPanel>
        <DataTable
          columns={[
            list.columns.name,
            list.columns.check,
            list.columns.metric,
            list.columns.confirmed,
          ]}
        >
          {list.evaluations.map((evaluation, i) => (
            <DataRow key={i}>
              <DataCell>{evaluation.name}</DataCell>
              <DataCell>
                <StatPill status={evaluation.check.status}>{evaluation.check.label}</StatPill>
              </DataCell>
              <DataCell>{evaluation.metric}</DataCell>
              <DataCell mono muted>
                {evaluation.confirmed}
              </DataCell>
            </DataRow>
          ))}
        </DataTable>
      </AppPanel>

      {/* The 12px is `.evl`'s own top margin, which applies here and only here.
          See the file header. It is the whole gap between the two panels — the
          body sets none — so removing it butts a bordered card straight onto
          another one. */}
      <AppPanel className="mt-[12px]">
        <PanelCaption>
          <span>{detail.title}</span>
          {detail.subtitle ? (
            <span className="text-[11px] text-muted-foreground">{detail.subtitle}</span>
          ) : null}
        </PanelCaption>
        {/*
          A `Fragment`, not a wrapper element. Every row has to be a direct child
          of the panel or `last:border-b-0` matches the last field of EVERY group
          — `display: contents` hides a box from layout but not from
          `:last-child`, which is exactly the kind of bug that only shows up as
          one stray missing hairline three rows up.
        */}
        {detail.requirements.map((requirement, i) => (
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
