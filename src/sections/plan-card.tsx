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
  /**
   * The headline figure. A plain string like `"$249"` or `"$0"` gets the
   * display treatment: the clamp scale and the tight `-0.06em` tracking that
   * a large numeral needs.
   *
   * ANYTHING WRAPPED IN AN ELEMENT OPTS OUT OF THE TRACKING, deliberately, and
   * a caller passing e.g. `<span className="text-[22px]">Contact us</span>`
   * gets normal spacing without asking for it. See the note on the `strong`
   * below for why that has to be the default rather than the caller's job.
   */
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
  /**
   * Which material the `featured` promotion uses. `light` — the default, and
   * what every existing caller renders — is the dark-page inversion: cream
   * fill, `light` class, lift and shadow. `dark` is the same promotion for a
   * CREAM ground: on a light panel the cream inversion is cream-on-cream, so
   * the card inverts the other way — the invariant near-black
   * `chrome.surface.1` fill with the `dark` class pinning every mode-aware
   * token in the subtree to its dark value, exactly the pinning the gallery
   * writes for a dark window inside a light card. Lift and `--shadow-modal`
   * are shared; only the material flips. Ignored when `featured` is off.
   *
   * When `featuredTone="dark"`, a nested `CheckList` wants its default (dark)
   * rendering, NOT `onLight` — the inverse of the cream card's requirement.
   */
  featuredTone?: 'light' | 'dark'
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
  featuredTone = 'light',
  className,
}: PlanCardProps) {
  return (
    <div
      className={cn(
        'flex min-h-[420px] flex-col rounded-2xl border p-7',
        featured
          ? featuredTone === 'dark'
            ? // The cream-ground promotion: the unfeatured card's own invariant
              // near-black fill, with `dark` pinning the subtree — see the prop.
              'dark border-chrome-line-subtle bg-chrome-surface-1 text-text-primary md:-translate-y-3'
            : // See the file header: `light` is load-bearing, not a theme preference.
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
        {/*
          `[&_*]:tracking-normal` is the load-bearing half of this line.

          `tracking-[-0.06em]` is sized for a large numeral, and at the clamp's
          57.6px it computes to -3.456px. Letter-spacing declared in `em`
          resolves against the element that DECLARES it and then inherits as
          that absolute length; it does not re-resolve against a child's own
          font-size. So a caller passing `<span className="text-[22px]">Contact
          us</span>` used to get -3.456px at 22px, which is -0.157em, and the
          word space closed up until it read as "Contactus". That shipped to
          production on skene-marketing-website's /pricing and was found in a
          screenshot pass rather than by any gate.

          Resetting tracking on descendants makes the split fall where the
          design already assumed it: the tight tracking applies to the bare
          string a caller passes for a price, and an element a caller wraps
          around something else is by definition not that numeral. The `unit`
          span is a SIBLING rather than a descendant, so it is unaffected.

          Fixing it here rather than at the call site because the call site
          cannot see the problem. The consuming repository had two copies of
          this card, one of which carried a hand-written `tracking-normal` and
          a comment explaining the trap, and the other of which did not. One
          component imposing a value on arbitrary children is the defect; a
          caller remembering to undo it is not a fix.
        */}
        <strong className="text-[clamp(2.55rem,4vw,4rem)] font-normal leading-none tracking-[-0.06em] [&_*]:tracking-normal">
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
            // The dark-toned promotion keeps the dark card's own rule: the
            // on-light rule is a dark line designed for cream and would vanish
            // against `chrome.surface.1`.
            borderTopColor:
              featured && featuredTone !== 'dark'
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
