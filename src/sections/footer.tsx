import { Children } from 'react'

import { cn } from '../lib/utils.js'

/**
 * Site footer: a brand column, link columns, a bottom bar, and the oversized
 * wordmark bleeding off the base of the page.
 *
 * The wordmark is the part worth keeping. It is 29vw at 1.7% opacity, clipped by
 * the footer's own overflow — close to invisible, which is the intent: it reads
 * as texture at a glance and only resolves into a word if you look. Rendering it
 * at a "sensible" size or opacity is the obvious change and it is wrong every
 * time.
 */

export interface SiteFooterProps {
  /** Left column: logo, a line of copy, social links. */
  brand?: React.ReactNode
  /** Oversized watermark. Usually the company name. */
  wordmark?: React.ReactNode
  /** Bottom-left, e.g. "© 2026 Skene. All rights reserved." */
  copyright?: React.ReactNode
  /** Bottom-right, e.g. privacy/terms links. */
  legal?: React.ReactNode
  className?: string
  /** The `<FooterColumn>`s. */
  children: React.ReactNode
}

/**
 * The `lg` track list, keyed by how many link columns were passed.
 *
 * Whole class strings, never interpolated: Tailwind scans this file's source
 * text, so building the track list with a template literal would emit a class
 * name that no stylesheet contains, and — as always with a class that generates
 * nothing — would not warn. The footer would fall back to one column and look
 * like a different bug. `footer-columns.test.tsx` greps this file for the five
 * literals rather than trusting the rendered string, for exactly that reason.
 *
 * The brand keeps 1.7fr at every count. At four columns on the 1280px shell
 * that leaves it ~310px, which still holds the logo, its line of copy and the
 * social row; below that the `md` two-column layout has already taken over.
 */
const COLUMNS: Record<number, string> = {
  1: 'lg:grid-cols-[1.7fr_repeat(1,1fr)]',
  2: 'lg:grid-cols-[1.7fr_repeat(2,1fr)]',
  3: 'lg:grid-cols-[1.7fr_repeat(3,1fr)]',
  4: 'lg:grid-cols-[1.7fr_repeat(4,1fr)]',
  5: 'lg:grid-cols-[1.7fr_repeat(5,1fr)]',
}

/** Past five, the columns are narrower than their own link text. */
const MAX_COLUMNS = 5

export function SiteFooter({
  brand,
  wordmark,
  copyright,
  legal,
  className,
  children,
}: SiteFooterProps) {
  // `Children.toArray` and not `Children.count`: count includes `null`, so a
  // consumer rendering `{flag ? <FooterColumn/> : null}` would reserve a track
  // for a column that is not there. toArray drops null, undefined and booleans.
  const linkColumns = Math.min(Children.toArray(children).length, MAX_COLUMNS)

  return (
    <footer
      className={cn(
        'relative overflow-hidden border-t border-chrome-line-subtle bg-chrome-surface-deep-2 px-6 pb-8 pt-[68px] md:pt-[90px]',
        className,
      )}
    >
      <div className="relative z-10 mx-auto max-w-[1280px]">
        {/*
          The column count follows the children. It used to be
          `lg:grid-cols-[1.7fr_repeat(3,1fr)]` — brand plus exactly THREE — and a
          consumer passing four link columns had its fourth wrap onto a second
          row, left-aligned under the brand, which reads as a layout bug rather
          than as a capacity limit. skene-site ships four (Product, Developers,
          Resources, Company) and looked broken for it.
          The child count is the honest input: the grid should describe what it
          was given, not what it was designed around.
        */}
        <div className={cn('grid gap-8 md:grid-cols-2 lg:gap-[60px]', COLUMNS[linkColumns])}>
          {brand ? <div className="col-span-full lg:col-span-1">{brand}</div> : null}
          {children}
        </div>

        {(copyright || legal) && (
          <div className="mt-[54px] flex flex-col justify-between gap-2 border-t border-chrome-line-subtle pt-[22px] text-[12px] text-chrome-text-muted-warm sm:flex-row md:mt-[82px]">
            <span>{copyright}</span>
            <span>{legal}</span>
          </div>
        )}
      </div>

      {wordmark ? (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[-6vw] left-1/2 z-0 -translate-x-1/2 text-[29vw] font-semibold leading-[0.76] tracking-[-0.09em]"
          style={{ color: 'rgba(255, 255, 255, 0.017)' }}
        >
          {wordmark}
        </span>
      ) : null}
    </footer>
  )
}

export interface FooterColumnProps {
  title: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function FooterColumn({ title, className, children }: FooterColumnProps) {
  return (
    <nav className={cn('grid content-start gap-2.5', className)} aria-label={String(title)}>
      {/* h2 in the capture. Kept as a heading so the columns are navigable, but
          sized as a label — it is a column header, not a section title. */}
      <h2 className="mb-3 text-[12px] font-semibold text-chrome-text-primary">{title}</h2>
      {children}
    </nav>
  )
}

export function FooterLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={cn(
        'text-[14px] text-chrome-text-muted-warm transition-colors hover:text-brand-peach',
        className,
      )}
    >
      {children}
    </a>
  )
}

/** Circular icon links. Pass an svg or an icon component per child. */
export function SocialLinks({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('mt-6 flex gap-2.5', className)}>{children}</div>
}

export function SocialLink({
  href,
  label,
  className,
  children,
}: {
  href: string
  /** Required: the child is an icon, so the link has no accessible name without it. */
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        'grid size-9 place-items-center rounded-full border border-chrome-line-strong text-chrome-text-muted-warm-strong transition-colors hover:text-brand-peach',
        className,
      )}
    >
      {children}
    </a>
  )
}
