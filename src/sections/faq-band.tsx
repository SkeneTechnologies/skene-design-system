'use client'

import { useId } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'

import { Eyebrow } from '../patterns/marketing.js'
import { cn } from '../lib/utils.js'

/**
 * The FAQ band: a heading column that stays put, and the questions beside it.
 *
 * Every other band of the captured pricing page already ships as a section; this
 * one was still hand-assembly in the app, on top of `ui/accordion`. What was
 * being re-written each time is not the disclosure behaviour — Radix does that —
 * but the band: the cream ground, the two-column split, the hairline between
 * every row, and the round toggle at the right edge.
 *
 * ## Why it does not use `ui/accordion`
 *
 * That primitive bakes a `ChevronDown` into its trigger, and this band's mark is
 * a round +/× at the far right. Wrapping the primitive would mean rendering its
 * chevron and hiding it, which leaves a component whose markup disagrees with
 * what is on screen. Radix itself is the shared dependency, already in this
 * package for the primitive, so composing it directly costs nothing and keeps
 * the keyboard and ARIA behaviour identical.
 *
 * ## One client module, deliberately
 *
 * Disclosure is state, so this file is `'use client'` in full. Rule 3 from the
 * Stage 4 stock-take: a client directive in a file with server-renderable
 * siblings drags the boundary around them too — which is the mistake
 * `billing-toggle.tsx` exists to avoid.
 *
 * ## `light`, and the reason it is not conditional
 *
 * The band is cream on a dark page, so the root carries `light` exactly as
 * `LightSectionCard` does. Without it `text.primary` resolves to #faf1e9 against
 * a #faf1e9 fill: not dim, absent. This band ships in one tone on purpose — a
 * `tone="dark"` prop would have to flip the class, and every FAQ on both surfaces
 * is the cream one.
 *
 * ## `type="single"` and collapsible
 *
 * The capture shows every answer open at once, but that is the screenshot of an
 * expanded state, not the resting one. One-at-a-time is the resting behaviour of
 * the live band; `collapsible` means the open row can be closed again rather than
 * trapping the reader with one answer permanently on screen. A caller who wants
 * many open passes `type="multiple"`.
 */

export interface FaqBandProps {
  /** Mono kicker over the heading — "FAQ". */
  eyebrow?: React.ReactNode
  /** The heading, left column. */
  title: React.ReactNode
  /** One line under the heading. The live band puts its "talk to us" link here. */
  note?: React.ReactNode
  /**
   * CTA row under the note, in the heading column — the wireframes' head
   * button beside the questions. A slot rather than a label/href pair for the
   * reason `LightSectionCard` gives: this column is cream, so the caller
   * passes the button variant that survives the inversion (the near-black
   * primary, not the default peach). Renders under the title when `note` is
   * absent.
   */
  actions?: React.ReactNode
  /** `FaqRow`s, in order. */
  children: React.ReactNode
  /** Open many at once instead of one at a time. */
  multiple?: boolean
  className?: string
}

export function FaqBand({ eyebrow, title, note, actions, children, multiple, className }: FaqBandProps) {
  const rows = (
    <div className="border-b border-chrome-line-on-light">{children}</div>
  )

  return (
    <section
      className={cn(
        // `light` first, never conditional — see the file header.
        'light grid gap-10 rounded-3xl bg-brand-light px-8 py-14 md:grid-cols-[0.85fr_1.15fr] md:px-12',
        className,
      )}
    >
      <div>
        {eyebrow ? (
          // Was a hand-rolled copy that had DRIFTED: text-[10px] where
          // --font-size-pill is 11px, and px-2.5 where every other copy uses
          // px-2. Nothing could have caught it — three copies of one span, and
          // the token was only ever a default. This is the same override Bridge
          // uses, and it moves this chip by 1px of type and 1.6px of padding.
          <Eyebrow onLight>{eyebrow}</Eyebrow>
        ) : null}
        <h2
          className={cn(
            'max-w-[420px] text-[clamp(1.9rem,2.8vw,2.75rem)] leading-[1.1] tracking-[-0.02em] text-text-primary',
            eyebrow && 'mt-5',
          )}
        >
          {title}
        </h2>
        {note ? <p className="mt-4 max-w-[380px] text-[14px] text-text-muted">{note}</p> : null}
        {actions ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>

      {multiple ? (
        <AccordionPrimitive.Root type="multiple">{rows}</AccordionPrimitive.Root>
      ) : (
        <AccordionPrimitive.Root type="single" collapsible>
          {rows}
        </AccordionPrimitive.Root>
      )}
    </section>
  )
}

export interface FaqRowProps {
  /** The question. */
  question: React.ReactNode
  /** The answer. Prose — links compose. */
  children: React.ReactNode
  className?: string
}

export function FaqRow({ question, children, className }: FaqRowProps) {
  // Radix needs a stable value per item and the caller has no reason to invent
  // one. useId is stable across server and client render, which a counter or a
  // slug of the question text would not be.
  const value = useId()

  return (
    <AccordionPrimitive.Item
      value={value}
      className={cn('border-t border-chrome-line-on-light', className)}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-6 py-5 text-left text-[16px] font-medium text-text-primary outline-none focus-visible:underline">
          {question}
          <span
            aria-hidden
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-chrome-line-on-light text-[13px] leading-none text-text-muted transition-transform duration-200 group-data-[state=open]:rotate-45"
          >
            {/* One glyph, rotated: + becomes × at 45°. Two glyphs swapped on
                state would mean two nodes to keep in sync, and the rotation is
                what makes the transition readable. */}
            +
          </span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      {/*
        `forceMount`, and the reason is the whole point of this site rather than
        a preference.

        Without it Radix renders the answer only while the row is open, so a
        closed FAQ ships its QUESTIONS to the DOM and none of its ANSWERS. On
        `/pricing` that measured as five questions present and five answers
        absent: the text existed in the RSC flight payload, which is a
        JSON-escaped blob inside a `<script>`, and nowhere in the rendered
        document. Anything reading the page as text — a crawler, an agent, a
        reader-mode extractor — got the questions and nothing else.

        That is not acceptable on a marketing surface for a company whose whole
        argument is that data can look present and not be. `forceMount` keeps
        the answer mounted; `data-[state=closed]:hidden` collapses it. Hidden
        content is still in the document and still indexed, which is the
        distinction that matters here.

        THE COST IS THE HEIGHT ANIMATION, and it is paid deliberately. A
        force-mounted node cannot both animate its height and rest at zero
        without JS sequencing the two, so the open/close transition is now the
        `+` rotating into `×` and nothing else. Five answers existing beats a
        200ms ease on a panel nobody watches twice.
      */}
      <AccordionPrimitive.Content
        forceMount
        className="overflow-hidden data-[state=closed]:hidden"
      >
        <div className="max-w-[640px] pb-6 pr-12 text-[14px] leading-relaxed text-text-muted">
          {children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}
