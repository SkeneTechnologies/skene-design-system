import { cn } from '../lib/utils.js'

/**
 * The question grid: a row of cards, each one a category tag over a question the
 * reader is already asking. Used as the "what you'll actually be able to answer"
 * band — the copy does the work, so the card is deliberately almost nothing.
 *
 * ## Why the card has no fill
 *
 * The captured card is a border, a radius and a corner glow. No opaque
 * background, on purpose, and that is worth protecting: a card with no fill
 * cannot change polarity relative to the band it sits in, so it needs neither
 * the `light` nor the `dark` class and cannot fall into the nested-inversion
 * trap that `Bridge` and `PlanCard` have to spend a paragraph on. Drop a flat
 * fill in here and the card acquires its own ground — at which point it DOES
 * need a polarity class, and every token inside it needs re-checking.
 *
 * Everything legible is therefore the theme-aware `text.*` role, never
 * `chrome.text.*`. The chrome roles are invariant and cannot follow a mode, so
 * they are correct only on a surface that is always dark; this card is whatever
 * the band under it is. The hairline is `surface.border` for the same reason —
 * it is mode-aware, where `chrome.line.subtle` (white at 12%) would be a
 * near-invisible smear on a cream band.
 *
 * ## The corner glow
 *
 * A RADIAL gradient anchored at the top-right corner, peach at ~9%, falling to
 * transparent about two-thirds of the way across. It is a glow off the corner,
 * not a tint of the card: run the stop out to 100% and it reads as a flat peach
 * wash, which is a different and much louder object. `brand.peach` is mode-aware
 * (#fec089 dark, #89684a light), so the same `color-mix` lands correctly on both
 * grounds without a per-mode override.
 *
 * ## The 58px under the tag
 *
 * That gap is the design, not slack. It pushes the question down the card so the
 * tag reads as a category label sitting at the TOP OF THE CARD rather than as a
 * kicker glued to the heading. Close it up and the tag stops labelling the card
 * and starts modifying the sentence — the same two elements, saying something
 * else. It is a fixed margin rather than `mt-auto` on the body because the cards
 * share a row height and an auto gap would let a two-line question in one card
 * shove that card's tag out of line with its neighbours'.
 *
 * The 14px radius is off the radius scale (`--radius-xl` is 12, `--radius-2xl`
 * is 16). It is carried literally from the capture rather than snapped, because
 * the value is on screen and signed off; reconciling it is a token decision, not
 * a decision for this file.
 *
 * No `use client`: props in, markup out.
 */

/**
 * Tailwind cannot see an interpolated class name, so the column counts are a
 * static map rather than `md:grid-cols-${columns}`. One column below `md`
 * (768px) in every case — three 270px cards side by side on a phone are three
 * unreadable slivers.
 */
const COLUMN_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
} as const

export interface QuestionGridProps {
  /** Cards per row from `md` up. Defaults to 3, the captured layout. */
  columns?: keyof typeof COLUMN_CLASS
  className?: string
  /** `QuestionCard`s. */
  children: React.ReactNode
}

export function QuestionGrid({ columns = 3, className, children }: QuestionGridProps) {
  return (
    // items-stretch is the grid default and is load-bearing here: the cards
    // share a row height, which is what lets the fixed 58px gap line every tag
    // up on one baseline across the row.
    <div className={cn('grid gap-4', COLUMN_CLASS[columns], className)}>{children}</div>
  )
}

export interface QuestionCardProps {
  /** Category label at the top of the card, e.g. "ATTRIBUTION". Rendered mono/uppercase. */
  tag?: React.ReactNode
  /** The question itself — one line, and the reason the card exists. */
  title: React.ReactNode
  /** The answer, or how Skene gets to it. A sentence or two. */
  children?: React.ReactNode
  className?: string
}

export function QuestionCard({ tag, title, children, className }: QuestionCardProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-[14px] border border-surface-border p-7',
        // Shorter on narrow screens: the min-height exists to keep the tag and
        // the question apart, and stacked cards have the page height to spare.
        'min-h-[230px] md:min-h-[270px]',
        className,
      )}
      style={{
        // See the file header: a corner glow, not a wash. The stop reaches
        // transparent well before the far corner.
        backgroundImage:
          'radial-gradient(78% 72% at 100% 0%, color-mix(in oklab, var(--color-brand-peach) 9%, transparent) 0%, transparent 66%)',
      }}
    >
      {tag ? (
        // The 58px is the point of the card. See the file header.
        <span
          className="mb-[58px] font-mono uppercase text-brand-peach"
          style={{
            fontSize: 'var(--font-size-pill)',
            letterSpacing: 'var(--font-tracking-eyebrow)',
          }}
        >
          {tag}
        </span>
      ) : null}

      <h3 className="text-[1.45rem] font-normal leading-[1.2] tracking-[-0.02em] text-text-primary">
        {title}
      </h3>

      {children ? (
        <p className="mt-3.5 text-[0.9rem] leading-relaxed text-text-muted">{children}</p>
      ) : null}
    </article>
  )
}
