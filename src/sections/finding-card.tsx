import { STATUS_TINT_TOKEN, STATUS_TOKEN, type Status } from '../lib/status.js'
import { cn } from '../lib/utils.js'

/**
 * The audit primitives: a headline metric, its trend, and the per-step findings
 * that contradict it.
 *
 * These carry Skene's actual argument — a dashboard reports a healthy number
 * while individual journey steps are unmeasured or renamed — so the status
 * vocabulary is fixed rather than free-form. `good | warn | danger` binds to
 * `semantic.matcha / warningAmber / errorRed`, the same three the dashboard
 * uses. The captured demo had invented its own mint and salmon; snapping them
 * was the point of the token reconciliation, because a marketing page and a
 * product that disagree about what "broken" looks like teach the reader the
 * wrong colour.
 *
 * All content is props. Nothing here knows what a Skene finding says.
 */

export type FindingStatus = Status

export interface FindingProps {
  status: FindingStatus
  /** Short uppercase tag — the step number, or a state like "GAP". */
  tag: React.ReactNode
  title: React.ReactNode
  /** The consequence. Optional, but a finding without one rarely earns its row. */
  note?: React.ReactNode
  /** `true` renders for a light ProductWindow (the default frame). */
  onLight?: boolean
  className?: string
}

/**
 * Two colours per status and a lighter tint, which together are ask r.
 *
 * The tag rendered `color: STATUS_TOKEN[status]` on
 * `color-mix(in oklab, <that same colour> 18%, transparent)` — full-strength
 * ink on an 18% tint of its own hue — at 9px, which is small text under WCAG
 * 2.2 by any reading. skene-site measured it off real pixels on `/developers`
 * at 768 and 1440, nine failures across three states against a 4.5:1 floor:
 *
 *     danger  rgb(196,66,57)  on rgb(244,221,219)   3.88
 *     good    rgb(103,117,82) on rgb(228,230,224)   3.94
 *     warn    rgb(136,106,47) on rgb(234,228,218)   4.00
 *
 * It reverted its two uses rather than ship them. Not fixable from a call
 * site: `tag` is required and both colours are this component's.
 *
 * `StatPill` had exactly this defect in 0.5.1 and exactly this fix — the
 * label takes a token derived against the ground it is actually on, the rim
 * and fill keep the graphic colour. So the ink here is now `STATUS_TINT_TOKEN`
 * and the tint stays `STATUS_TOKEN`.
 *
 * THE INK SWAP ALONE IS NOT ENOUGH, and this is the part that has to be
 * measured rather than reasoned. At 18% the on-tint inks land 4.49 / 4.66 /
 * 4.53: danger misses by 0.01. The `*OnTint` values were derived against a 10%
 * tint and re-derived in 0.5.2 against every ground observed up to `StatPill`'s
 * 12% fill, and 18% is a ground none of them ever saw — the same
 * derived-against-one-ground mistake that release exists to close, arriving
 * from the other direction. So the fill comes back into the band those values
 * cover. At 12% the three states measure 4.90 / 5.03 / 4.90.
 *
 * `__tests__/finding-tag-contrast.test.ts` recomputes all six rendered pairs
 * from the tokens, because `npm run tokens:contrast` structurally cannot see
 * this one: it scores declared token PAIRS and this ground is computed at
 * render time by `color-mix` from the foreground, so no row for it exists.
 */
const TAG_TINT_PERCENT = 12

export function Finding({ status, tag, title, note, onLight = true, className }: FindingProps) {
  const graphic = STATUS_TOKEN[status]
  const ink = STATUS_TINT_TOKEN[status]
  return (
    <div
      className={cn(
        'grid grid-cols-[68px_1fr] items-start gap-x-3 rounded-[10px] border p-[13px]',
        onLight
          ? 'border-chrome-line-on-light bg-white text-chrome-surface-1'
          : 'border-chrome-line-subtle bg-chrome-surface-2 text-chrome-text-primary',
        className,
      )}
    >
      <span
        className="row-span-2 w-fit self-start rounded px-[5px] py-[3px] font-mono text-[9px] uppercase tracking-[0.04em]"
        style={{
          background: `color-mix(in oklab, ${graphic} ${TAG_TINT_PERCENT}%, transparent)`,
          color: ink,
        }}
      >
        {tag}
      </span>
      <strong className="text-[13px] font-medium">{title}</strong>
      {note ? (
        <small
          className={cn(
            'col-start-2 text-[11px]',
            onLight ? 'opacity-55' : 'text-chrome-text-muted-warm',
          )}
        >
          {note}
        </small>
      ) : null}
    </div>
  )
}

export interface MetricCardProps {
  label: React.ReactNode
  value: React.ReactNode
  /** Signed delta, e.g. "↓ 8.2%". Coloured by `trend`. */
  delta?: React.ReactNode
  trend?: FindingStatus
  className?: string
  children?: React.ReactNode
}

/**
 * The big number. Deliberately `font-weight: 400` at 2.6rem — the captured demo
 * sets display numerals light and tight, and bolding them makes the page read
 * like a dashboard rather than an argument about one.
 */
export function MetricCard({ label, value, delta, trend = 'danger', className, children }: MetricCardProps) {
  return (
    <div className={cn('p-[22px]', className)}>
      <span className="block text-[13px] opacity-70">{label}</span>
      <strong className="my-1.5 inline-block text-[2.6rem] font-normal leading-none tracking-[-0.05em]">
        {value}
      </strong>
      {delta ? (
        <span className="ml-2 text-[13px]" style={{ color: STATUS_TOKEN[trend] }}>
          {delta}
        </span>
      ) : null}
      {children}
    </div>
  )
}

export interface SparklineProps {
  /** Bar heights as percentages, 0-100. */
  bars: number[]
  /** Index of the bar to pick out in brand peach — usually where the drop starts. */
  highlight?: number
  className?: string
}

/**
 * A bar sparkline with one bar called out.
 *
 * Not a chart: there are no axes, no scale, and the values are authored rather
 * than measured. It exists to make a shape legible at a glance inside a section,
 * which is why `highlight` is an index and not a threshold — the copy decides
 * which bar matters, not the data.
 */
export function Sparkline({ bars, highlight, className }: SparklineProps) {
  return (
    <div className={cn('mt-6 flex h-[74px] items-end gap-[5px]', className)} aria-hidden>
      {bars.map((h, i) => (
        <i
          key={i}
          className="min-w-[6px] flex-1 rounded-t-[3px]"
          style={{
            height: `${Math.max(0, Math.min(100, h))}%`,
            background:
              i === highlight
                ? 'var(--color-brand-peach)'
                : 'color-mix(in oklab, var(--color-brand-peach) 32%, transparent)',
          }}
        />
      ))}
    </div>
  )
}
