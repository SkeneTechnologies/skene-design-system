import { Children } from 'react'

import { Eyebrow } from '../patterns/marketing.js'
import { cn } from '../lib/utils.js'

/**
 * The bridge: GTM ↔ Skene ↔ Engineering. A cream band carrying three cards in a
 * row, connected by arrows, with the MIDDLE one dark.
 *
 * The middle card being dark is the argument, not a style. Skene sits between
 * two teams, so it has to read as the subject and the outer two as the context
 * it sits between. Three cards in one tone read as three peers and the section
 * says nothing.
 *
 * ## The nested inversion — the trap this file carries
 *
 * The band is a LIGHT surface on a dark page, so its root carries `light` for
 * the same reason `LightSectionCard`, `ProductWindow tone="light"` and the
 * featured `PlanCard` do: without it every mode-aware token in the subtree keeps
 * its DARK value against a cream fill — `text.primary` resolves to #faf1e9 on
 * #faf1e9, which is not dim, it is absent.
 *
 * The middle card then inverts BACK, and it must say so: it carries `dark`
 * explicitly. Inheriting the band's `light` would leave every token inside it at
 * its light value on a near-black fill and produce the identical failure one
 * level deeper. `.light` and `.dark` are both explicit subtree switches for
 * exactly this — they nest in either direction — so the fix is one class, not a
 * per-element override on every child.
 *
 * Which is also why nothing here uses `chrome.text.*`. Those are invariant by
 * definition; they cannot follow either class, so they are correct only on a
 * surface that is always dark, and this band never is. Everything legible uses
 * the theme-aware `text.*` role. The hairlines are the deliberate exception:
 * `chrome.line.onLight` is the dark rule designed for a cream fill and
 * `chrome.line.subtle` the light rule designed for a dark one, and no mode-aware
 * role covers that pair — hence the `featured` switch in `hairline`.
 *
 * The featured card's FILL is an invariant `chrome.surface.*` on purpose: that
 * card is dark in every context, so it should not be able to follow a mode at
 * all. `dark` is there for the type inside it, not for the fill.
 *
 * ## Why the kicker is not `<Eyebrow>`
 *
 * `Eyebrow` is built from `chrome.surface.border` and `chrome.text.muted`, so it
 * is a dark-page component by construction and would render near-invisible here.
 * This band renders an Eyebrow-shaped chip from the theme-aware role instead.
 * `<Accent>` inside `title`, by contrast, composes fine — `brand.peach` is
 * mode-aware and lands on its designed light value (#89684a) inside the band.
 *
 * ## Why the arrows are owned by `Bridge`
 *
 * Same reason `PipelineStepper` owns its connectors: an arrow is a property of
 * the PAIR, so a node that drew its own trailing arrow would have to know it is
 * not last, and the final node would point into empty space. `Bridge` interleaves
 * them between the children it is given, so N nodes always get N-1 arrows.
 *
 * Below `md` the row stacks and each arrow rotates a quarter turn to point down
 * the stack rather than being dropped — a right-pointing glyph in a vertical
 * column reads as a broken layout. They are decoration for a relationship the
 * copy already states, so they are `aria-hidden` in both orientations.
 *
 * No `use client`: everything here is props in, markup out.
 */

/** No mode-aware role covers a hairline; the two grounds need the two rules. */
function hairline(featured: boolean) {
  return featured ? 'var(--color-chrome-line-subtle)' : 'var(--color-chrome-line-on-light)'
}

export interface BridgeNodeProps {
  /** Whose column this is — "GTM", "SKENE", "ENGINEERING". */
  label?: React.ReactNode
  /**
   * The card's one line. On the outer cards this is the question that team is
   * actually asking, and it sets italic; on the `featured` card it is the answer
   * and sets upright. Punctuation and quote marks are content, so they come from
   * the caller — the component never adds them.
   */
  title?: React.ReactNode
  /** Short lines under the rule. Fragments, not sentences — three is the shape. */
  items?: string[]
  /** Glyph above the label. On the live section only the middle card carries one. */
  icon?: React.ReactNode
  /** The dark, raised middle card. See the file header: this is the argument. */
  featured?: boolean
  className?: string
}

export function BridgeNode({
  label,
  title,
  items,
  icon,
  featured = false,
  className,
}: BridgeNodeProps) {
  return (
    <article
      className={cn(
        'flex h-full w-full flex-col rounded-2xl border p-7',
        featured
          ? // See the file header: `dark` is load-bearing. This card is dark
            // inside a `light` band, and without the class every token in it
            // stays at its light value on a near-black fill.
            'dark border-chrome-line-subtle bg-chrome-surface-1 md:-translate-y-3'
          : 'border-chrome-line-on-light bg-surface-0',
        className,
      )}
      style={featured ? { boxShadow: 'var(--shadow-modal)' } : undefined}
    >
      {icon ? (
        <div className="mb-5 flex text-brand-peach" aria-hidden>
          {icon}
        </div>
      ) : null}

      {label ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted">
          {label}
        </span>
      ) : null}

      {title ? (
        <p
          // SIZE FIRST, so twMerge does not eat `leading-snug`: font-size and
          // line-height share a conflict group there, and a later `text-*`
          // wins the whole group. See the same note on `FeatureRow`'s title.
          className={cn(
            featured
              ? 'text-[19px] font-medium text-text-primary'
              : 'text-[17px] italic text-text-muted-strong',
            'mt-3 leading-snug',
          )}
        >
          {title}
        </p>
      ) : null}

      {items && items.length > 0 ? (
        // `mt-auto` rather than a fixed gap: the three cards share a row height,
        // so pushing the block down aligns all three rules on one line instead of
        // letting a longer question shove one card's rule out of step.
        // A top border on the list, not a divider element, so the rule can never
        // render with nothing under it.
        <ul
          className="m-0 mt-auto grid list-none gap-2.5 border-t p-0 pt-5 text-[13px] leading-relaxed text-text-muted"
          style={{ borderTopColor: hairline(featured) }}
        >
          {items.map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span aria-hidden className="mt-[9px] h-px w-2.5 shrink-0 bg-current opacity-60" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

function BridgeArrow() {
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center self-center text-text-muted-weak',
        // Stacked, it points down the column; from `md` up it points along the
        // row. One glyph, rotated — not two glyphs toggled by breakpoint.
        'my-1 rotate-90 md:my-0 md:rotate-0',
      )}
    >
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none" focusable="false">
        <path
          d="M0 6h23M18.5 1.5 23 6l-4.5 4.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export interface BridgeProps {
  /** The kicker above the heading, e.g. "THE PRODUCT". */
  eyebrow?: React.ReactNode
  /** Section heading. `<Accent>` composes here — peach inverts correctly. */
  title: React.ReactNode
  /** One centred paragraph under the heading. */
  lede?: React.ReactNode
  /** The line under the cards. */
  caption?: React.ReactNode
  /** `BridgeNode`s, in order. Arrows are inserted between them. */
  children: React.ReactNode
  className?: string
}

export function Bridge({ eyebrow, title, lede, caption, children, className }: BridgeProps) {
  // toArray drops nulls and falses, so a conditionally rendered node cannot
  // leave an arrow pointing at a gap.
  const nodes = Children.toArray(children)
  const row: React.ReactNode[] = []
  nodes.forEach((node, i) => {
    // Each node gets an equal track of its own; the card fills it. Wrapping is
    // what lets the caller pass plain `<BridgeNode>`s without this component
    // having to clone them to add layout classes.
    row.push(
      <div key={`node-${i}`} className="flex min-w-0 flex-1 basis-0">
        {node}
      </div>,
    )
    if (i < nodes.length - 1) row.push(<BridgeArrow key={`arrow-${i}`} />)
  })

  return (
    <section
      className={cn(
        // `light` first, and never conditional — see the file header.
        'light bg-brand-light px-6 py-[88px] md:py-[112px]',
        className,
      )}
    >
      <div className="mx-auto max-w-[1140px]">
        <div className="text-center">
          {eyebrow ? (
            // `<Eyebrow>` with its two colour tokens swapped for the theme-aware
            // pair. It used to be a hand-rolled copy of the same span — same
            // geometry, same two inline styles — because Eyebrow's own colours
            // are invariant `chrome.*` and render near-invisible on this band's
            // cream. Overriding them through className is the same fix without
            // the copy: twMerge replaces the border and text utilities, the
            // 11px/0.16em inline styles come from the component, and the
            // rendering is unchanged.
            <Eyebrow className="border-chrome-line-on-light text-text-muted">
              {eyebrow}
            </Eyebrow>
          ) : null}

          <h2
            className={cn(
              'mx-auto max-w-[880px] text-[clamp(2rem,3.4vw,3.4rem)] font-normal leading-[1.08] tracking-[-0.02em] text-text-primary',
              eyebrow && 'mt-6',
            )}
          >
            {title}
          </h2>

          {lede ? (
            <p className="mx-auto mt-5 max-w-[660px] text-[16px] leading-relaxed text-text-muted">
              {lede}
            </p>
          ) : null}
        </div>

        {/* items-stretch, so the three cards share one height and the middle
            card's lift reads as a lift rather than as a taller card. The arrows
            centre themselves against that shared height. */}
        <div className="mt-14 flex flex-col items-stretch gap-4 md:flex-row md:gap-3">{row}</div>

        {caption ? (
          <p className="mx-auto mt-10 max-w-[720px] text-center text-[13px] text-text-muted">
            {caption}
          </p>
        ) : null}
      </div>
    </section>
  )
}
