import * as React from 'react'
import { cn } from '../lib/utils.js'

/**
 * The hub grid: a set of cards, each of which is a whole link into a section of
 * the site.
 *
 * Extracted from `skene-marketing-website`, where it existed TWICE under two
 * names that had no idea about each other. `core/ResourceCard` drew the five
 * cards on /resources; `core/PLGHub`'s `TopicCard` drew the cards on
 * /resources/playbooks and /product-led-growth. Their grounds are byte-identical
 * — same 1px hairline, same radius, same 24px padding, the same
 * `rgba(20,20,20,0.6)` fill lifting to 0.8 on hover with the border going to
 * peach — because one was copied from the other and neither knew.
 *
 * The copies had drifted in exactly one place, and it is the reason this is
 * worth having as a component rather than a convention: `TopicIcon` took its
 * colour as a prop, and the single call site passed the literal `#fac089`.
 * The brand peach is `#fec089`. One character, shipped, invisible to every gate
 * in that repository because a raw hex inside a styled-components prop is not a
 * Tailwind arbitrary value. The icon here takes no colour prop. There was one
 * colour in use and it was meant to be the brand's.
 *
 * ## Why the whole card is the link
 *
 * Both originals made the root an anchor rather than putting a link in the
 * footer, so the target is the card and not the six words at the bottom of it.
 * That is kept, and it is why the root is `linkAs` rather than the `asChild`
 * every other linkable part of this package uses. `asChild` merges props into
 * the caller's single child, and this component renders three of its own —
 * header, body, call to action — so `Slot` has nothing to merge into and throws
 * `React.Children.only`. That is not theoretical: the first cut of this
 * component shipped `asChild`, and the consumer's build failed prerendering
 * /resources on exactly it.
 *
 * `linkAs` inverts the relationship. The caller names the component that should
 * be the root — `next/link`, a router link, or nothing for a bare anchor — and
 * this component keeps ownership of what goes inside it. Without a root the
 * caller can name, they nest an anchor inside an anchor, which is invalid and
 * which no typechecker will tell them about.
 *
 * ## Translucent, like `NoticeBar`
 *
 * `rgba(20,20,20,0.6)` is transcribed and has no token. It is a near-black wash
 * that lets a textured page ground read through the card, and the package ships
 * no mode-aware surface token for "mostly opaque over whatever is behind me".
 * `--color-chrome-surface-*` is the opaque family and would flatten the dither
 * every page that uses this paints behind it.
 */
export interface HubCardsProps {
  children: React.ReactNode
  className?: string
}

export function HubCards({ children, className }: HubCardsProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface HubCardProps
  extends Omit<React.ComponentProps<'a'>, 'title' | 'children'> {
  /** The mark in the corner. A lucide icon at 20px in both originals. */
  icon?: React.ReactNode
  /** The card's heading. */
  title: React.ReactNode
  /** One line under the heading. */
  description?: React.ReactNode
  /**
   * The supporting lines between the description and the call to action.
   *
   * A slot rather than a `details: string[]`, because the two originals filled
   * this space differently: /resources listed three bullets, and the playbook
   * cards wrote a labelled line. An array prop would have served one and forced
   * the other back into a local copy, which is how there came to be two.
   */
  children?: React.ReactNode
  /** The call to action. The arrow after it is the component's. */
  cta?: React.ReactNode
  /**
   * The element or component to render as the card's root. `a` by default;
   * pass `next/link` in a Next app so the whole card is a client-side link.
   */
  linkAs?: React.ElementType
}

export function HubCard({
  icon,
  title,
  description,
  children,
  cta,
  linkAs: Root = 'a',
  className,
  ...props
}: HubCardProps) {
  return (
    <Root
      className={cn(
        'group flex flex-col gap-4 rounded-sm border border-chrome-line-subtle p-6 no-underline',
        '[background:rgba(20,20,20,0.6)]',
        'transition-colors duration-300 ease-in-out',
        'hover:border-brand-peach hover:[background:rgba(20,20,20,0.8)]',
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-4">
        {icon ? (
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-sm text-brand-peach [background:rgba(212,165,116,0.15)]"
          >
            {icon}
          </span>
        ) : null}
        <span className="block">
          <span className="block text-[18px] font-medium text-chrome-text-primary">
            {title}
          </span>
          {description ? (
            <span className="mt-1 block text-sm text-chrome-text-muted-strong">
              {description}
            </span>
          ) : null}
        </span>
      </div>
      {children ? <div className="text-sm text-chrome-text-muted-strong">{children}</div> : null}
      {cta ? (
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-brand-peach">
          {cta}
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : null}
    </Root>
  )
}
