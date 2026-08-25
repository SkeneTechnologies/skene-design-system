import { cn } from '../lib/utils.js'

/**
 * The person card for the about page: a name, a role, and optionally a
 * paragraph and a media slot.
 *
 * The media slot is optional and the card is designed for its absence, in the
 * same spirit as `LogoRow`'s empty slots: a small company's about page should
 * not need a photographer before it can name its people, and a card whose
 * layout collapses without an image forces the stock-photo placeholder this
 * package keeps refusing. With no `media`, the card is type on a bordered
 * panel and looks finished; with one, the media sits above the name in a
 * square frame that scales with the card, so a stack keeps one shape whether
 * every person has a photo or none do — and the frame only exists when the
 * media does, so an all-text grid carries no empty picture boxes.
 *
 * ## Semantics
 *
 * The card is an `<li>`, following `TrustFact`: the people on a team page are
 * a stack of peers, list semantics are what give a screen reader "3 of 5",
 * and `TeamGrid` is the `<ul>` around them. Inside it the name is a heading,
 * because a team page is scanned by name and that is what reaches the
 * outline; the level is a prop (`as`, default `h3`) on the assumption the
 * section above the grid owns the `h2`. The role is a plain block, not part
 * of the heading — "Teemu Kinos, founder" is two facts, and stuffing both
 * into the `<h3>` makes the outline read like a byline.
 *
 * ## Grounds
 *
 * `border`/`bg-card` and the theme-aware `text.*` roles throughout, so the
 * card follows a `light` ancestor onto cream with no `onLight` prop. Nothing
 * invariant: like `LogoRow`, this band has no fixed ground of its own.
 *
 * All content is props: no name, no role, no bio lives in here.
 * No `use client` — everything is props in, markup out.
 */

export interface TeamCardProps {
  /** The person's name. Rendered as a heading — see the file header. */
  name: React.ReactNode
  /** What they do, stated flat — "Founder", "Engineering". */
  role: React.ReactNode
  /**
   * Optional media — usually an `<img>`, but a slot rather than a `src`
   * because the caller owns the image component (Next's, a plain tag, an
   * illustration). Rendered in a square frame above the name; omitted, the
   * frame is omitted with it, and the card is deliberately complete without
   * one. `alt` is the caller's job: a portrait beside the printed name is
   * usually `alt=""`.
   */
  media?: React.ReactNode
  /**
   * The heading element for the name. `h3` by default — the grid usually
   * sits under a section `h2`. Pass `h2` when the card stack IS the section.
   */
  as?: 'h2' | 'h3' | 'h4'
  /**
   * Body and links: a short bio paragraph, an anchor row, or both. Anchors
   * inside are styled here (underlined, brightening on hover) so a bare
   * `<a>` passed in is visible without call-site classes.
   */
  children?: React.ReactNode
  className?: string
}

export function TeamCard({ name, role, media, as: Heading = 'h3', children, className }: TeamCardProps) {
  return (
    // An `<li>`, not an `<article>` — see the file header. Its parent in
    // `TeamGrid` is the `<ul>`.
    <li
      className={cn(
        'flex flex-col rounded-[var(--radius-lg)] border border-border bg-card p-6',
        className,
      )}
    >
      {media ? (
        // aspect-square, not a fixed height: the card's width is the grid's
        // to decide, and a frame that scales with it keeps every portrait in
        // a stack the same shape. The sizing rules on the child mean any
        // media the caller passes fills the frame without call-site styling.
        <div className="mb-5 aspect-square overflow-hidden rounded-[var(--radius-md)] bg-muted [&>*]:h-full [&>*]:w-full [&>img]:object-cover">
          {media}
        </div>
      ) : null}

      <Heading className="text-[17px] font-medium leading-snug tracking-[-0.01em] text-text-primary">
        {name}
      </Heading>

      {/* The role in the small-caps monospace register the package uses for
          markers. A styled block, not a `Chip`: it has no fill to earn, and a
          grid with a pill on every card reads as UI rather than people. */}
      <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.07em] text-text-muted-strong">
        {role}
      </span>

      {children ? (
        <div className="mt-3.5 text-[13.5px] leading-relaxed text-text-muted [&_a:hover]:text-text-primary [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>
      ) : null}
    </li>
  )
}

export interface TeamGridProps {
  /**
   * `TeamCard`s, in order. They are `<li>`s — this slot renders inside a
   * `<ul>`, so pass cards, not arbitrary markup. Same contract as
   * `TrustPanel`'s facts slot.
   */
  children: React.ReactNode
  className?: string
}

export function TeamGrid({ children, className }: TeamGridProps) {
  // A `<ul>` for the reason `TrustPanel` gives: the element itself, not a
  // wrapper inside it, so the list is not broken by `display: contents`.
  return (
    <ul className={cn('grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {children}
    </ul>
  )
}
