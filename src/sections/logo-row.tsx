import { cn } from '../lib/utils.js'

/**
 * The proof strip: a heading, a stat line, a row of logo slots, and a caption
 * that explains why the slots are empty.
 *
 * The empty slots are the point, not a placeholder for art that has not
 * arrived. The marketing wireframes ship this strip on roughly fifteen pages
 * with all five slots blank and the caption "These slots stay empty until an
 * account agrees to be named on-site." — the strip asserts that named proof is
 * a thing this company will only show with consent, and an outlined blank is
 * how that assertion looks. So a `LogoSlot` renders a child only when given
 * one, the default is nothing, and NO fabricated customer mark belongs in one,
 * ever — not in a story, not in a demo, not as "sample data". The customer
 * list lives in canon (`customers.md`); a slot gets a logo the day that file
 * gains the name.
 *
 * ## Why the slot row is `aria-hidden` only when empty
 *
 * The wireframes mark the whole `logo-row` `aria-hidden`, which is right for
 * the all-blank state: five empty outlined boxes say nothing a screen reader
 * should sit through, and the caption under them already tells the true story
 * in prose. But that attribute is correct BECAUSE the boxes are empty, so it
 * cannot be unconditional here — the day a slot holds a real logo, hiding the
 * row would hide the proof. The row therefore takes the wireframe's hint as a
 * prop, `decorative`, defaulting to true because empty is the shipping state;
 * a caller that fills a slot flips it and gives each filled slot a name.
 *
 * ## Grounds
 *
 * Every colour is a mode-aware role — `text.*` for type, `border`/`muted` for
 * the slot outline and fill, the same pair `GlyphBadge`'s `muted` tone uses —
 * so the strip follows a `light` ancestor onto cream without an `onLight`
 * prop. Nothing here touches invariant `chrome.*`: this band has no fixed
 * ground of its own, it sits on whatever the page gives it.
 *
 * ## Layout
 *
 * Five equal tracks by default, two below `sm` — the wireframe's breakpoint,
 * where five 1fr tracks on a 360px screen are slivers. `count` is a number
 * rather than "however many children", because the empty state has no
 * children and still needs its geometry; when children ARE passed they fill
 * slots left to right and the remainder stay blank, which keeps a
 * three-logo row honest about the two names it does not yet have.
 *
 * All content is props: no heading, no stat, no caption lives in here.
 * No `use client` — everything is props in, markup out.
 */

export interface LogoSlotProps {
  /**
   * The logo, when an account has agreed to be named. Optional, and the
   * default matters: an empty slot renders as an outlined blank, which is the
   * shipping state. Do not pass a placeholder mark to fill space — see the
   * file header.
   */
  children?: React.ReactNode
  /**
   * Accessible name for a FILLED slot — the account's name, since a logo is
   * an image and this package does not know what the caller renders inside.
   * Ignored while the slot is empty: a blank has nothing to announce.
   */
  label?: string
  className?: string
}

export function LogoSlot({ children, label, className }: LogoSlotProps) {
  return (
    <div
      aria-label={children ? label : undefined}
      // border/muted: the themed pair, so the outline survives both grounds —
      // the same choice GlyphBadge's `muted` tone documents. The wireframe's
      // 56px height is kept as the minimum rather than a fixed height so a
      // real logo with padding cannot overflow the box that was sized for
      // nothing.
      className={cn(
        'grid min-h-14 place-items-center rounded-[var(--radius-md)] border border-border bg-muted',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface LogoRowProps {
  /** The claim above the strip, as a heading. */
  title?: React.ReactNode
  /**
   * The stat line under the heading — the numbers that stand in for the
   * missing names ("10 paying teams", "$2,000 MRR"). A slot, not a string,
   * so the caller can bold the figures with `<strong>`.
   */
  stat?: React.ReactNode
  /**
   * How many slots the strip declares. Defaults to 5, the wireframes' count.
   * Independent of `children`: fewer children than `count` leaves the rest
   * blank, which is the honest rendering. It is also the column count, so
   * keep it equal to the number of tracks you want on one line.
   */
  count?: number
  /**
   * `LogoSlot`s for the accounts that have agreed to be named, in order.
   * Omit it — the default — and the strip renders `count` empty slots.
   */
  children?: React.ReactNode
  /**
   * The line under the slots that says why they are empty. On every
   * wireframe this is "These slots stay empty until an account agrees to be
   * named on-site." — it is the strip's real copy, so it is a prop rather
   * than baked in, but a strip without it is just a row of unexplained
   * boxes. Pass it.
   */
  caption?: React.ReactNode
  /**
   * Whether the slot row is decoration (`aria-hidden`). Defaults to true,
   * which is correct for the empty state — see the file header. A caller
   * that fills slots with real logos sets this false.
   */
  decorative?: boolean
  className?: string
}

export function LogoRow({
  title,
  stat,
  count = 5,
  children,
  caption,
  decorative = true,
  className,
}: LogoRowProps) {
  // Children fill slots left to right; the remainder render empty. The blanks
  // are appended here rather than asking callers to pad with them, because the
  // common case — no children at all — should be zero markup at the call site.
  const filled = Array.isArray(children) ? children.length : children != null ? 1 : 0
  const blanks = Math.max(0, count - filled)

  return (
    <section className={cn('mx-auto w-full', className)}>
      {title ? (
        <div className="mx-auto mb-6 max-w-[640px] text-center">
          <h2 className="text-[clamp(1.4rem,2.2vw,1.8rem)] font-medium tracking-[-0.01em] text-text-primary">
            {title}
          </h2>
        </div>
      ) : null}

      {stat ? (
        // The figures are the caller's <strong>s; the base ink is muted so
        // they read as the emphasis without this component styling them.
        <p className="mx-auto mb-6 max-w-[560px] text-center text-[14px] leading-relaxed text-text-muted-strong [&_strong]:font-medium [&_strong]:text-text-primary">
          {stat}
        </p>
      ) : null}

      <div
        aria-hidden={decorative || undefined}
        className="mx-auto grid max-w-[900px] grid-cols-2 gap-3.5 sm:grid-cols-[repeat(var(--logo-row-count),1fr)]"
        style={{ '--logo-row-count': count } as React.CSSProperties}
      >
        {children}
        {Array.from({ length: blanks }, (_, i) => (
          <LogoSlot key={i} />
        ))}
      </div>

      {caption ? (
        <p className="mx-auto mt-3.5 max-w-[480px] text-center text-[12.5px] leading-[1.6] text-text-muted">
          {caption}
        </p>
      ) : null}
    </section>
  )
}
