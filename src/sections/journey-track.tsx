import { STATUS_TOKEN, type Status } from '../lib/status.js'
import { cn } from '../lib/utils.js'

/**
 * The journey track: the numbered steps of a funnel laid out as one line, each
 * step carrying whether it is measured, unmeasured, or broken — plus
 * `MiniFunnel`, the small label/value/bar readout that usually sits beside it.
 *
 * ## The connector is a gradient BETWEEN the two states it joins
 *
 * This is the whole idea of the section, not a flourish. A neutral rule between
 * two nodes says the steps are merely adjacent; a rule that runs matcha → red
 * says the break happened *in the link*, and the eye finds it before it has read
 * a single label. Skene's argument is about the seams between steps — an event
 * that stops firing between checkout and confirmation — so the seam has to be
 * the thing that carries the state. That is why the connector is owned by
 * `JourneyTrack` and not by `JourneyStep`: a gradient is a property of the PAIR.
 * A step that drew its own trailing rule could not know the colour of the step
 * on its right, and the last step would draw a gradient into empty space.
 * Interleaving here means N steps always get N-1 connectors.
 *
 * A `warn` end fades to grey rather than contributing amber. "Unmeasured" is not
 * a third health claim about the link — it is the absence of one — and amber in
 * a 1px rule reads as a fault rather than as a gap. Fading to the mode-aware
 * `surface.border` grey is the muted variant: the link visibly stops asserting
 * anything at the end where the data stops.
 *
 * ## The label keeps primary text colour in EVERY state
 *
 * The ring carries the state; the label does not. Tinting a broken step's label
 * red drops it to whatever contrast the status colour happens to have and makes
 * it hardest to read at exactly the moment the reader most needs to read it —
 * the failure is the one row they will stop on. So state is spent on the ring
 * and the small note, both of which are short, and the label stays
 * `text.primary`. Colour is reinforcement, never the only carrier: the caller's
 * `note` should say in words what the ring says in colour, because a ring is not
 * announced and a colour is not readable.
 *
 * ## Tokens and polarity
 *
 * Status vocabulary is the fixed one — `good | warn | danger` bound to
 * `semantic.matcha / warningAmber / errorRed`, the same three `Finding` uses.
 * The captured demo's class names map onto it exactly: `is-good` → `good`,
 * `is-unknown` → `warn`, `is-broken` → `danger`. They are renames of the same
 * three states, so they are not a second vocabulary here and there is no fourth
 * colour.
 *
 * Nothing in this file uses `chrome.text.*`. This track renders on a dark band
 * and inside a light `ProductWindow` in the same page, and `chrome.*` is
 * invariant by definition — it cannot follow either ground, so on cream it is
 * cream on cream. Every colour here is either a mode-aware role (`text.*`,
 * `surface.*`, `semantic.*`, `brand.peach`) or derived from one. For the same
 * reason this section carries NO `light` / `dark` class of its own: it does not
 * own a ground, it inherits one. A caller putting it on a cream fill inside a
 * dark page puts `light` on that band, exactly as `Bridge` does.
 *
 * No `use client`: state arrives as props, so a track that advances composes by
 * re-rendering and this file stays server-renderable.
 */

/** The fixed status triple. See the file header for the captured-name mapping. */
export type JourneyStepState = Status

/**
 * The colour this step contributes to a connector touching it.
 *
 * `warn` fades to the mode-aware border grey instead of amber — see the file
 * header: an unmeasured step has no claim to make about the link.
 */
function connectorStop(state: JourneyStepState) {
  return state === 'warn' ? 'var(--color-surface-border)' : STATUS_TOKEN[state]
}

function ringStyle(state: JourneyStepState): React.CSSProperties {
  const color = STATUS_TOKEN[state]
  return {
    borderColor: `color-mix(in oklab, ${color} 55%, transparent)`,
    background: `color-mix(in oklab, ${color} 12%, transparent)`,
    color,
  }
}

export interface JourneyStepItem {
  /** The step's name — "Checkout", "Confirmation". Stays primary text always. */
  label: React.ReactNode
  /**
   * The one-line consequence under the label, tinted by `state`. Say the state
   * in words here: the ring's colour is not announced and not readable.
   */
  note?: React.ReactNode
  state: JourneyStepState
}

export interface JourneyStepProps extends JourneyStepItem {
  /**
   * What goes in the ring. `JourneyTrack` fills in the 1-based position; pass it
   * yourself when rendering steps directly, or pass a glyph instead.
   */
  index?: React.ReactNode
  className?: string
}

export function JourneyStep({ label, note, state, index, className }: JourneyStepProps) {
  return (
    <li
      className={cn(
        // [34px 1fr] with the ring spanning both rows, so the label and its note
        // share one left edge and the ring hangs beside the pair rather than
        // sitting on the label's baseline.
        'grid min-w-0 grid-cols-[34px_1fr] items-start gap-x-3 gap-y-1',
        className,
      )}
    >
      <span
        aria-hidden
        className="row-span-2 flex h-[34px] w-[34px] shrink-0 items-center justify-center self-start rounded-full border font-mono text-[12px] leading-none"
        style={ringStyle(state)}
      >
        {index}
      </span>

      {/* text.primary in every state. See the file header — this is the rule the
          section exists to keep, not an oversight. */}
      <strong className="min-w-0 text-[14px] font-medium leading-snug text-text-primary">
        {label}
      </strong>

      {note ? (
        <small
          className="col-start-2 text-[11px] leading-snug"
          style={{ color: STATUS_TOKEN[state] }}
        >
          {note}
        </small>
      ) : null}
    </li>
  )
}

function JourneyConnector({ from, to }: { from: JourneyStepState; to: JourneyStepState }) {
  return (
    <li
      aria-hidden
      className={cn(
        // The angle rides a custom property because a gradient's direction has to
        // change at the breakpoint and an inline style cannot hold a media query.
        // Stacked it runs top-to-bottom; from `md` up, left-to-right.
        '[--journey-connector-angle:180deg] md:[--journey-connector-angle:90deg]',
        // Stacked: a 1px column, indented to the centre of the 34px ring.
        'ml-[17px] h-[22px] w-px shrink-0',
        // Row: a 1px rule pinned to that same centre, shrinking from 86px.
        'md:ml-0 md:mt-[17px] md:h-px md:w-auto md:min-w-[24px] md:flex-[0_1_86px] md:self-start',
      )}
      style={{
        background: `linear-gradient(var(--journey-connector-angle, 180deg), ${connectorStop(from)}, ${connectorStop(to)})`,
      }}
    />
  )
}

export interface JourneyTrackProps {
  /** Left to right. Connectors are inserted between them; rings are numbered 1..n. */
  steps: JourneyStepItem[]
  /** Optional line above the track, e.g. which journey this is. */
  title?: React.ReactNode
  /** One quieter line under the title. */
  subtitle?: React.ReactNode
  className?: string
}

export function JourneyTrack({ steps, title, subtitle, className }: JourneyTrackProps) {
  const row: React.ReactNode[] = []
  steps.forEach((step, i) => {
    row.push(<JourneyStep key={`step-${i}`} {...step} index={i + 1} />)
    if (i < steps.length - 1) {
      row.push(
        <JourneyConnector key={`link-${i}`} from={step.state} to={steps[i + 1]!.state} />,
      )
    }
  })

  return (
    <div className={cn('p-7', className)}>
      {title ? <p className="text-[14px] text-text-primary">{title}</p> : null}
      {subtitle ? <p className="mt-1 text-[12px] text-text-muted">{subtitle}</p> : null}
      <ol
        className={cn(
          'm-0 flex list-none flex-col items-stretch p-0',
          'md:flex-row md:items-start md:justify-between',
          title || subtitle ? 'mt-5' : '',
        )}
      >
        {row}
      </ol>
    </div>
  )
}

export interface MiniFunnelRowItem {
  label: React.ReactNode
  /** The figure, right of the label — "12,480", "38%". */
  value: React.ReactNode
  /** Bar width as a percentage, 0-100. */
  fill: number
}

export interface MiniFunnelProps {
  rows: MiniFunnelRowItem[]
  className?: string
}

/**
 * The small stacked readout that sits beside a `JourneyTrack`: label, figure,
 * and a track bar under each pair.
 *
 * Not a chart — no axis, no scale, and the widths are authored rather than
 * measured. It exists to make a drop-off legible at a glance, which is why the
 * bars are the only comparison offered and why they are `aria-hidden`: the
 * numbers are already in the row, so a reader announcing the bar would hear the
 * same fact twice with less precision.
 *
 * The fill width comes from a CSS variable rather than being set on `width`
 * directly. That is the seam: the figure is authored in one place, and a wrapper
 * can transition or override it — a bar that grows on scroll, a stage that
 * animates in — without this component owning any animation or any state.
 *
 * The fill is `brand.peach`, the same colour the sparkline's called-out bar
 * uses. These are quantities, not health, so they must not borrow the status
 * triple: a green bar next to a red one would read as a verdict the numbers are
 * not making.
 */
export function MiniFunnel({ rows, className }: MiniFunnelProps) {
  return (
    <ul className={cn('m-0 grid list-none gap-3.5 p-0', className)}>
      {rows.map((row, i) => (
        <li key={i} className="grid gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 text-[12px] text-text-muted">{row.label}</span>
            <strong className="shrink-0 font-mono text-[12px] font-medium text-text-primary">
              {row.value}
            </strong>
          </div>
          <div
            aria-hidden
            className="h-[5px] w-full overflow-hidden rounded-full bg-surface-2"
            style={{ '--mini-funnel-fill': `${Math.max(0, Math.min(100, row.fill))}%` } as React.CSSProperties}
          >
            <i
              className="block h-full rounded-full bg-brand-peach"
              style={{ width: 'var(--mini-funnel-fill, 0%)' }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
