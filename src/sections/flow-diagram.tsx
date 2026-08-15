import { ArrowRight } from 'lucide-react'

import { cn } from '../lib/utils.js'

/**
 * The flows path: the dominant route through a product, drawn as a line of
 * nodes and the links between them, with the branches stated underneath.
 *
 * The surface this depicts is a pannable node graph — a real one, with side
 * paths and loops and a viewport you drag. A marketing page cannot afford that
 * and does not want it: the reader has one line of attention, and the argument
 * is "here is the path most people take and here is what it costs them", not
 * "here is a graph you may explore". So the main chain is drawn and everything
 * that leaves it is written in prose below. That is the whole shape of this
 * component, and it is why `note` is a first-class prop rather than an
 * afterthought — without it the diagram is a claim that no one branches.
 *
 * ## The rail scrolls; the nodes never shrink
 *
 * Every node is `flex-none`. A six-step path is wider than 390px and there is
 * no arrangement of it that is not, so the choice is between a rail that
 * scrolls and nodes that compress until "Onboarding /onboarding" is three
 * letters and an ellipsis. The rail scrolls. `overflow-x-auto` on the rail
 * itself — not on an ancestor — is what keeps that scroll inside the artifact
 * instead of on the page body; the site is verified at 390, 768 and 1440 with
 * zero horizontal overflow and this is one of the places that is won or lost.
 * The `pb-[8px]` is not decoration either: it is the gutter an overlay
 * scrollbar sits in, and without it the bar is drawn across the bottom border
 * of every node.
 *
 * Deliberately no wrap and no stacked breakpoint. A wrapped path reads as two
 * paths — the last node of row one and the first of row two are adjacent on
 * screen and unrelated in the data — and a vertical stack loses the one thing
 * a flow diagram is for, which is that the whole route is a single left-to-
 * right gesture.
 *
 * ## Why the edge is a real element with a real icon
 *
 * The captured CSS draws the arrow as `::before { content: "\2192" }`. Two
 * reasons that does not survive the port: the package's rule is lucide for
 * icons, and a pseudo-element glyph is invisible to the pixel-contrast harness
 * — it counts as a glyph pixel and quietly skews the measurement of every
 * artifact containing a path. This is the same call, for the same reason, that
 * `StatPill` makes about its dot. `ArrowRight` at 14px is the closest optical
 * match to the 13px glyph, and it is `aria-hidden` because the rail already
 * reads in order.
 *
 * The edge is `self-center` against a rail that is otherwise `items-stretch`.
 * The nodes are two lines tall and equal-height by stretch so a node with no
 * second line still squares up with its neighbours; an edge that stretched with
 * them would put its arrow on the label's baseline, pointing at a word rather
 * than at the node.
 *
 * ## Roles and spacing
 *
 * Everything here is THEMED — `foreground`, `muted-foreground`, `card`,
 * `border`. This depicts Skene Cloud, and Skene Cloud is light; it arrives
 * inside `AppWindow`, which forces `light` for exactly that reason. Do not
 * reach for `chrome.*` here: the two sets agree in dark and diverge in light,
 * so the mistake looks correct until someone opens light mode. The one
 * invariant colour is the arrow's `brand.bronze`, which is 4.86:1 on the light
 * card and is a graphic besides — the figure beside it carries the meaning.
 *
 * Padding is written as the literal px each `--spacing-N` token carries, for
 * the reason `artifact-shell.tsx` sets out at length: `--spacing: 0.2rem` makes
 * Tailwind's `p-2` 6.4px where `--spacing-2` is 8px. Tidying `px-[12px]
 * py-[8px]` into `px-3 py-2` is a silent 20% shrink. Radii do line up:
 * `--radius-sm` is `rounded-sm` at 6px in both files.
 *
 * No `use client`. There is no state and no handler; a diagram that highlights
 * a step composes by re-rendering with different props.
 *
 * All content is props. Nothing here knows what page a node stands for or what
 * fraction of a real audience takes the link.
 */

/* ── FlowDiagram ──────────────────────────────────────────────────────────── */

export interface FlowDiagramProps {
  /**
   * The path, left to right: `FlowNode`s with a `FlowEdge` between each pair.
   *
   * Children rather than a `nodes` array because the two are genuinely
   * different objects in an alternating sequence, and the edges carry authored
   * content — a rate, a median time — that cannot be derived from the nodes
   * they join. `JourneyTrack` takes an array precisely because its connectors
   * *are* derived; this one cannot borrow that.
   */
  children: React.ReactNode
  /**
   * The prose under the rail — the traffic that leaves the drawn path, and the
   * entries that join it partway. Wrap identifiers in `<code>`; the monospace
   * and the primary-text colour are applied here so a caller writes ordinary
   * markup.
   */
  note?: React.ReactNode
  className?: string
}

export function FlowDiagram({ children, note, className }: FlowDiagramProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <ol className="m-0 flex list-none items-stretch gap-[8px] overflow-x-auto p-0 pb-[8px]">
        {children}
      </ol>
      {/* A <p>, deliberately, where `EvaluatorNote` is a <div>: this is prose
          under a figure and the paragraph is the right element for it. The two
          are otherwise the same strip, minus `wrap-anywhere` — kept separate on
          2026-08-13 rather than merged into a div for tidiness. */}
      {note ? (
        <p className="mt-[12px] text-[12px] text-muted-foreground [&_code]:font-mono [&_code]:text-foreground">
          {note}
        </p>
      ) : null}
    </div>
  )
}

/* ── FlowNode ─────────────────────────────────────────────────────────────── */

export interface FlowNodeProps {
  /** The step's name, as a person would say it. */
  label: React.ReactNode
  /**
   * The monospace second line: the identifier the reader is meant to match
   * against their own product — a route, a screen name, an event.
   */
  detail?: React.ReactNode
  className?: string
}

/**
 * One stop on the path. A card, not a chip, because it carries two registers —
 * a human name and a machine identifier — and the second is the one that makes
 * the diagram checkable against the reader's own site.
 */
export function FlowNode({ label, detail, className }: FlowNodeProps) {
  return (
    <li
      className={cn(
        'min-w-0 flex-none rounded-sm border border-border bg-card px-[12px] py-[8px]',
        className,
      )}
    >
      <b className="block text-[13px] font-medium text-foreground">{label}</b>
      {detail ? (
        <span className="block font-mono text-[11px] text-muted-foreground">{detail}</span>
      ) : null}
    </li>
  )
}

/* ── FlowEdge ─────────────────────────────────────────────────────────────── */

export interface FlowEdgeProps {
  /**
   * The figure the link carries — what share of the previous node continues
   * here. Held at primary text weight because it is the number the reader is
   * scanning for.
   */
  value?: React.ReactNode
  /** The quieter line under it — typically how long the step takes. */
  meta?: React.ReactNode
  className?: string
}

/**
 * The link between two nodes: an arrow, a figure, and a quieter second line.
 *
 * `min-w-[54px]` is a floor, not a width. It keeps every arrow in a path the
 * same length regardless of whether its figure is "9%" or "100%", so the nodes
 * fall on an even rhythm and the eye reads the chain rather than the gaps.
 */
export function FlowEdge({ value, meta, className }: FlowEdgeProps) {
  return (
    <li
      className={cn(
        'flex min-w-[54px] flex-none flex-col items-center gap-px self-center font-mono text-[11px] text-muted-foreground',
        className,
      )}
    >
      <ArrowRight aria-hidden className="size-[14px] shrink-0 text-brand-bronze" />
      {value ? <b className="font-medium text-foreground">{value}</b> : null}
      {meta}
    </li>
  )
}
