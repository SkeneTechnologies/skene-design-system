import { cn } from '../lib/utils.js'
import { Chip } from './chip.js'

/**
 * Pricing: the grid and the tier card. The monthly/yearly switch is the only
 * interactive part and lives in `billing-toggle.tsx` so this file stays
 * server-renderable.
 *
 * `featured` inverts the card to cream on a dark page, and applies the `light`
 * class for the same reason `ProductWindow tone="light"` does — every mode-aware
 * token inside would otherwise resolve to its dark value against cream.
 *
 * Everything that must stay legible on BOTH card variants uses the theme-aware
 * `text.*` role. `chrome.text.*` is invariant — it cannot invert — so using it
 * here renders cream on cream and the label simply disappears.
 *
 * The captured demo proves the point by hand: its featured card overrides the
 * check mark to `#a86636`, a darker peach nobody would pick on a dark surface.
 * That override IS `brand.peach`'s light value (`#89684a`), discovered
 * empirically and pasted in one place. With the class, every token in the
 * subtree gets it and no per-element override is needed.
 */

export interface PlanGridProps {
  className?: string
  children: React.ReactNode
}

export function PlanGrid({ className, children }: PlanGridProps) {
  // items-stretch (the grid default, stated for the reader) rather than
  // items-start. This was items-start on the reasoning that a stretched row
  // would "fight" the featured card's translate. It does not: a translate is a
  // paint-time transform and never feeds back into layout, so the only thing
  // items-start bought was cards of unequal height whose tier chips, prices and
  // CTAs all landed on different lines — which is what the captured demo does
  // NOT do. There the two outer cards are exactly equal and the featured one
  // hangs past them at both ends, which is what a lift on an equal-height card
  // looks like.
  return (
    <div className={cn('mt-14 grid items-stretch gap-5 md:grid-cols-3', className)}>{children}</div>
  )
}

export interface PlanCardProps {
  /** Tier marker — PRO, SCALE, ULTRA. */
  tier: React.ReactNode
  /**
   * Wrap the tier chip in a heading, so the card's name reaches the outline.
   *
   * Unset by default and unset is what the homepage renders: there the three
   * plan cards sit under a section heading that already names the row, and a
   * chip is the right weight for a preview.
   *
   * `/pricing` is the case this exists for. There the three tier names ARE the
   * page's structure — the prototype had them as `<h2>`s — and rendering them
   * as chips alone left that page's outline running `h1` straight to the
   * section headings with no heading naming a single tier. The chip is not the
   * problem: it is the right mark, it was just the ONLY mark. This wraps it
   * rather than replacing it, so nothing moves on screen and the outline gains
   * three entries it should always have had.
   */
  tierAs?: 'h2' | 'h3'
  /** Right of the tier marker, e.g. "Popular". */
  flag?: React.ReactNode
  price: React.ReactNode
  /** Billing unit, e.g. "/mo". */
  unit?: React.ReactNode
  /** One line under the price. */
  summary?: React.ReactNode
  /** Usually a `<CheckList dense onLight={featured}>`. */
  features?: React.ReactNode
  /** Small labelled block pinned above the CTA. */
  bestFor?: { label: React.ReactNode; value: React.ReactNode }
  action?: React.ReactNode
  /** Fine print under the CTA. */
  footnote?: React.ReactNode
  featured?: boolean
  className?: string
}

export function PlanCard({
  tier,
  tierAs,
  flag,
  price,
  unit,
  summary,
  features,
  bestFor,
  action,
  footnote,
  featured = false,
  className,
}: PlanCardProps) {
  return (
    <div
      className={cn(
        'flex min-h-[420px] flex-col rounded-2xl border p-7',
        featured
          ? // See the file header: `light` is load-bearing, not a theme preference.
            'light border-brand-light bg-brand-light text-chrome-surface-1 md:-translate-y-3'
          : 'border-chrome-line-subtle bg-chrome-surface-1 text-text-primary',
        className,
      )}
      style={featured ? { boxShadow: 'var(--shadow-modal)' } : undefined}
    >
      <div className="flex min-h-[28px] items-center justify-between gap-3">
        {/* Near-black chip in both cases. On the featured cream card it is the
            one element that does NOT invert — it is the tier's identity, and
            flipping it to light would erase it against the card. */}
        {(() => {
          // `m-0` because a heading brings a UA margin that the chip row's
          // `items-center` would then centre around, moving the flag beside it.
          const chip = <Chip tone="neutral">{tier}</Chip>
          if (!tierAs) return chip
          const H = tierAs
          return <H className="m-0">{chip}</H>
        })()}
        {flag ? (
          <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-brand-peach">
            {flag}
          </span>
        ) : null}
      </div>

      <div className="mb-[18px] mt-7 flex items-baseline gap-1.5">
        <strong className="text-[clamp(2.55rem,4vw,4rem)] font-normal leading-none tracking-[-0.06em]">
          {price}
        </strong>
        {unit ? <span className="text-text-muted">{unit}</span> : null}
      </div>

      {summary ? (
        <p className="mb-7 text-[14px] text-text-muted">{summary}</p>
      ) : null}

      {features}

      {bestFor ? (
        <div
          className="mb-6 mt-auto grid gap-[3px] border-t pt-5"
          style={{
            borderTopColor: featured
              ? 'var(--color-chrome-line-on-light)'
              : 'var(--color-chrome-line-subtle)',
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.07em] text-text-muted">
            {bestFor.label}
          </span>
          <strong className="text-[13px] font-medium">{bestFor.value}</strong>
        </div>
      ) : null}

      <div className={cn(bestFor ? '' : 'mt-auto')}>{action}</div>
      {footnote ? (
        <small className="mt-3 text-center text-[11px] text-text-muted">
          {footnote}
        </small>
      ) : null}
    </div>
  )
}
