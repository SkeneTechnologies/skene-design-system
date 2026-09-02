import * as React from 'react'

import { cn } from '../lib/utils.js'

/**
 * Long-form body copy: the container that styles the HTML inside it.
 *
 * The one module here that styles DESCENDANTS rather than rendering its own
 * markup, because its input is a document it did not author — MDX, a CMS body,
 * an array of sections rendered as plain tags. Every other section in this
 * package takes content as props; this one cannot, and pretending otherwise is
 * why consumers keep writing their own.
 *
 * ## Why this belongs here at all
 *
 * `skene-marketing-website` had TWO prose treatments for the same elements, in
 * two vocabularies that could not be compared without reading both:
 * `mdx-components.tsx` in Tailwind classes for docs and the blog, and
 * `core/ContentArea` in CSS custom properties for the glossary and series
 * pages. Nothing connected them and they disagreed. Typography is the most
 * shared thing a design system owns, and the type scale was already here; what
 * was missing was the object that applies it to a document.
 *
 * ## The scale is this package's, and the reconciliation is recorded
 *
 * The two local treatments agreed on three of four levels once mapped onto the
 * tokens: h1 at 30px (`--font-size-h1`), h3 at 18px, body at 14px. They
 * disagreed on h2, 24px against 20px, and the token settles it at 24
 * (`--font-size-h2`). A consumer adopting this moves that one level.
 *
 * ## No panel
 *
 * No border, no radius, no padding, no ground. The consumer this came from
 * welded its prose rules to a bordered card with a sidebar-docking variant, and
 * that is layout: where the column sits and what frames it are page decisions,
 * and the two pages using it framed it differently. This styles the words.
 */
export interface ProseProps extends React.ComponentProps<'div'> {
  /** Tightens the vertical rhythm for a dense column, e.g. a sidebar note. */
  density?: 'comfortable' | 'compact'
}

export function Prose({
  density = 'comfortable',
  className,
  children,
  ...props
}: ProseProps) {
  const roomy = density === 'comfortable'
  return (
    <div
      className={cn(
        // The first child never pushes the column down: a heading's top margin
        // is a separator between blocks, not a gap above the first one.
        '[&>*:first-child]:mt-0',
        // Headings. Sizes are tokens rather than utilities because the package's
        // marketing scale and Tailwind's `text-*` scale are different ladders,
        // and mixing them is how a document ends up with two h2 sizes.
        '[&_h1]:font-semibold [&_h1]:text-chrome-text-primary [&_h1]:[font-size:var(--font-size-h1)]',
        '[&_h2]:font-semibold [&_h2]:text-chrome-text-primary [&_h2]:[font-size:var(--font-size-h2)]',
        '[&_h3]:font-semibold [&_h3]:text-chrome-text-primary [&_h3]:[font-size:var(--font-size-stage-header)]',
        '[&_h4]:font-semibold [&_h4]:text-chrome-text-primary [&_h4]:[font-size:var(--font-size-stage-header)]',
        roomy
          ? '[&_h1]:mb-[16px] [&_h1]:mt-[48px] [&_h2]:mb-[16px] [&_h2]:mt-[48px] [&_h3]:mb-[8px] [&_h3]:mt-[32px] [&_h4]:mb-[8px] [&_h4]:mt-[24px]'
          : '[&_h1]:mb-[8px] [&_h1]:mt-[24px] [&_h2]:mb-[8px] [&_h2]:mt-[24px] [&_h3]:mb-[4px] [&_h3]:mt-[16px] [&_h4]:mb-[4px] [&_h4]:mt-[16px]',
        // Body.
        '[&_p]:text-chrome-text-muted-strong [&_p]:[font-size:var(--font-size-label)] [&_p]:[line-height:var(--font-line-height-relaxed)]',
        roomy ? '[&_p]:mb-[16px]' : '[&_p]:mb-[8px]',
        // Lists inherit the body treatment; the marker is the brand's.
        '[&_ul]:mb-[16px] [&_ul]:list-disc [&_ul]:ps-[20px] [&_ul]:marker:text-brand-peach',
        '[&_ol]:mb-[16px] [&_ol]:list-decimal [&_ol]:ps-[20px] [&_ol]:marker:text-chrome-text-muted',
        '[&_li]:text-chrome-text-muted-strong [&_li]:[font-size:var(--font-size-label)] [&_li]:mb-[4px]',
        // Inline code and links.
        '[&_code]:rounded-sm [&_code]:px-[4px] [&_code]:py-[2px] [&_code]:font-mono [&_code]:text-brand-peach [&_code]:[font-size:var(--font-size-body-sm)] [&_code]:[background:rgba(255,255,255,0.04)]',
        '[&_a]:text-brand-peach [&_a]:underline-offset-[3px] hover:[&_a]:underline',
        '[&_blockquote]:border-s [&_blockquote]:border-chrome-line-subtle [&_blockquote]:ps-[16px] [&_blockquote]:text-chrome-text-muted',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Prose
