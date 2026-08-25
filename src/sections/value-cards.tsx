import { cn } from '../lib/utils.js'

/**
 * The value band: a row of cards that argues by CONTRAST. A stack of cards
 * naming what the current situation COSTS, then one naming what it becomes.
 *
 * ## Why the pair exists
 *
 * Both polarities are the same card — 28px, one hairline, a mono label, a title
 * and a line of body. The only thing that differs is what the label is
 * *claiming*, and that difference is the whole section. Read on its own, a cost
 * card is a complaint and a gain card is a boast; read in sequence, the costs
 * accumulate into a problem and the last card answers it. A single neutral card
 * repeated N times cannot make that argument — every card would carry equal
 * weight, the reader would find no turn, and the band would degrade into a
 * feature list. This is the same reasoning that makes `Bridge`'s middle card
 * dark: the tone difference IS the content.
 *
 * `tone` is `'cost' | 'gain'` rather than a `positive` boolean, because the
 * captured demo's `.value-card--positive` modifier is already a two-state axis
 * wearing a one-state name. The moment a third reading appears (a neutral
 * context-setter, say) a boolean forces a second boolean and two flags that can
 * both be true describe a state that does not exist. A union adds a member.
 *
 * ## Why `gain` is peach and not a green
 *
 * The status vocabulary is fixed and reserved: `good | warn | danger` bind to
 * `semantic.matcha / warningAmber / errorRed` and they mean a MEASURED state, as
 * in `Finding`. `cost` borrows `errorRed` legitimately — it names a real defect
 * the audit found. `gain` is not a measurement, it is the brand's claim about
 * itself, so it takes `brand.peach`. Inventing a marketing green here would
 * teach the reader that matcha means "good marketing copy" in one place and
 * "this journey step is instrumented" in another.
 *
 * ## Colour, and why the fill and hairline are derived
 *
 * Nothing here is `chrome.*`. These cards sit in whichever band the page puts
 * them in, so every legible thing uses the theme-aware `text.*` role —
 * `chrome.text.*` is invariant, cannot follow `light`/`dark`, and would render
 * cream on cream the first time this band is used on a cream surface.
 *
 * The captured fill is `rgba(255,255,255,0.018)`: a white wash that only reads
 * as a lift because the page behind it is near-black. There is no mode-aware
 * surface or hairline token for "barely distinct from whatever is behind me", so
 * both are mixed from `text.primary`, which IS mode-aware — cream at 1.8% on a
 * dark page (the captured value, reproduced), near-black at 1.8% on a cream one.
 * Same intent, both polarities, no per-band override. `Bridge` reaches for the
 * two invariant hairlines instead because it knows its own polarity; this
 * component deliberately does not.
 *
 * `ValueCards` carries no `light`/`dark` class of its own for the same reason:
 * it is not a surface, it inherits one. A caller placing this band on a cream
 * panel inside a dark page still owes that panel its `light` class.
 *
 * Content is props; no `use client` — props in, markup out.
 */

export type ValueTone = 'cost' | 'gain' | 'neutral'

/**
 * The label colour is the only token that moves with `tone`. All are mode-aware
 * roles, so each lands on its designed value in either polarity.
 *
 * `neutral` is the third reading the file header predicted — a peer card that
 * claims neither a defect nor a payoff. Its label is `text.muted`: quieter than
 * the title, no hue, no verdict. Everything else stays the base card — the 14%
 * hairline and the 1.8% wash — so a row of neutrals is a row of flat peers, and
 * mixing one `gain` back in restores the turn. Before it existed the only route
 * to a labelled flat card was `tone="cost"` with the label's inline red beaten
 * by a child span's own class, which is a workaround wearing a bug's clothes.
 */
const TONE_ACCENT: Record<ValueTone, string> = {
  cost: 'var(--color-semantic-error-red)',
  gain: 'var(--color-brand-peach)',
  neutral: 'var(--color-text-muted)',
}

export interface ValueCardsProps {
  /** `ValueCard`s, in argument order — the costs, then the gain. */
  children: React.ReactNode
  className?: string
}

export function ValueCards({ children, className }: ValueCardsProps) {
  return (
    // auto-fit, not a fixed column count: the argument is "N costs then one
    // gain" and N is the caller's, so the grid must not encode it. Stacked below
    // `md` so the sequence reads top to bottom, which is the order the contrast
    // depends on.
    <div
      className={cn(
        'grid gap-4 md:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface ValueCardProps {
  /** The mono kicker — what this card is claiming, e.g. "COST" or "RESULT". */
  label?: React.ReactNode
  /** The card's one line. */
  title: React.ReactNode
  /**
   * `cost` states a problem (danger label); `gain` states the payoff (peach);
   * `neutral` states neither — a flat peer with a muted label.
   */
  tone?: ValueTone
  /** The body line under the title — the consequence, or the mechanism. */
  children?: React.ReactNode
  className?: string
}

export function ValueCard({ label, title, tone = 'cost', children, className }: ValueCardProps) {
  const accent = TONE_ACCENT[tone]
  const gain = tone === 'gain'

  return (
    <article
      className={cn('h-full rounded-[14px] border p-7', className)}
      style={{
        // See the file header: mixed from the mode-aware text role, so the wash
        // and the rule stay near-invisible on a dark page AND on a cream one.
        borderColor: gain
          ? `color-mix(in oklab, ${accent} 34%, transparent)`
          : 'color-mix(in oklab, var(--color-text-primary) 14%, transparent)',
        backgroundColor: 'color-mix(in oklab, var(--color-text-primary) 1.8%, transparent)',
        // The gain's wash is directional on purpose — it enters from the left
        // edge and fades out, so the last card reads as arriving rather than as
        // one more tile. Layered over the base fill, not replacing it.
        backgroundImage: gain
          ? `linear-gradient(90deg, color-mix(in oklab, ${accent} 12%, transparent), transparent 62%)`
          : undefined,
      }}
    >
      {label ? (
        <span
          className="block font-mono text-[11px] uppercase tracking-[0.08em]"
          style={{ color: accent }}
        >
          {label}
        </span>
      ) : null}

      <strong
        className={cn(
          'block text-[1.25rem] font-normal leading-snug tracking-[-0.01em] text-text-primary',
          label && 'mt-3',
        )}
      >
        {title}
      </strong>

      {children ? (
        <p className="mt-2.5 text-[0.86rem] leading-relaxed text-text-muted">{children}</p>
      ) : null}
    </article>
  )
}
