'use client'

import { useId } from 'react'

import { cn } from '../lib/utils.js'
import { Chip } from './chip.js'

/**
 * The "ask us anything" prompt block — an attributed question, a box to answer
 * it in, and a small submit.
 *
 * Its own module because it is genuinely interactive: a controlled textarea and
 * a submit handler. Folding it into a file with server-renderable siblings
 * would pull `'use client'` around them too, which is the mistake
 * `billing-toggle.tsx` exists to avoid.
 *
 * The panel paints its OWN ground — invariant `chrome.surface.1` inside an
 * invariant border — rather than sitting transparent on whatever the page ground
 * happens to be. That is what makes `chrome.text.*` the correct role here and
 * not the trap it is elsewhere: `chrome.*` cannot invert, so it is only safe
 * when the surface under it cannot either. The moment this fill is swapped for a
 * flipping one, every text class in here has to move to the theme-aware `text.*`
 * role, and the peach submit already uses the mode-aware `brand.peach` /
 * `brand.peach-text` pair, which stays legible either way because both halves
 * move together.
 *
 * The submit is bottom-RIGHT and sized to its label, not full width. This is a
 * low-commitment probe — the reader is naming their tools, not buying anything —
 * and a full-bleed primary button asks for more resolve than the question does.
 * For the same reason the textarea is a quiet fill with no border: the heading is
 * the loud element, and a boxed input competing with it makes the block read as a
 * form rather than as a question.
 *
 * `showAiBadge` defaults to `true`. Disclosure that an answer is model-generated
 * is not a decoration to opt into; the flag exists for the case where the
 * surrounding section already says so and repeating it is noise.
 */

export interface AskWidgetProps {
  /** Usually an image or initials block; rendered inside a 32px circle. */
  avatar?: React.ReactNode
  /** Who is asking — sits next to the avatar. */
  name?: React.ReactNode
  /** The loud line. Also labels the textarea. */
  question: React.ReactNode
  /** One supporting line under the question. */
  lede?: React.ReactNode
  placeholder?: string
  submitLabel: React.ReactNode
  /** Controlled: the consumer owns the text. */
  value: string
  onValueChange: (value: string) => void
  /** Called on submit with the current value; the form never navigates. */
  onSubmit?: (value: string) => void
  /** Marks the answer as model-generated. On by default — see the file header. */
  showAiBadge?: boolean
  aiBadgeLabel?: React.ReactNode
  className?: string
}

export function AskWidget({
  avatar,
  name,
  question,
  lede,
  placeholder,
  submitLabel,
  value,
  onValueChange,
  onSubmit,
  showAiBadge = true,
  aiBadgeLabel = 'AI',
  className,
}: AskWidgetProps) {
  // The question IS the field's label, so it is wired up as one rather than
  // duplicated into an aria-label — `question` is a ReactNode and may not
  // flatten to a usable string.
  const questionId = useId()

  return (
    <div
      className={cn(
        'w-full rounded-3xl border border-chrome-line-subtle bg-chrome-surface-1 p-7',
        className,
      )}
    >
      <div className="flex min-h-[32px] items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {avatar ? (
            <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-chrome-surface-2 text-[12px] text-chrome-text-primary">
              {avatar}
            </span>
          ) : null}
          {name ? (
            <span className="text-[13px] font-medium text-chrome-text-primary">{name}</span>
          ) : null}
        </div>

        {showAiBadge ? (
          <Chip tone="outline">{aiBadgeLabel}</Chip>
        ) : null}
      </div>

      <h3
        id={questionId}
        className="mt-6 text-[clamp(1.6rem,2.6vw,2.35rem)] font-normal leading-[1.12] tracking-[-0.04em] text-chrome-text-primary"
      >
        {question}
      </h3>

      {lede ? (
        <p className="mt-3 max-w-[52ch] text-[14px] leading-[1.55] text-chrome-text-muted-warm">
          {lede}
        </p>
      ) : null}

      <form
        className="mt-6"
        onSubmit={(event) => {
          // Nothing here belongs in a URL and there is no server route to post
          // to — the value goes straight to the consumer's handler.
          event.preventDefault()
          onSubmit?.(value)
        }}
      >
        <textarea
          aria-labelledby={questionId}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onValueChange(event.target.value)}
          // resize-none, not for tidiness: a draggable corner on a box this
          // quiet is the most prominent affordance in the block, and it competes
          // with the submit.
          className="min-h-[104px] w-full resize-none rounded-2xl bg-chrome-surface-2 px-4 py-3.5 text-[14px] leading-[1.5] text-chrome-text-primary outline-none placeholder:text-chrome-text-muted focus-visible:ring-1 focus-visible:ring-chrome-line-strong"
        />

        <div className="mt-3.5 flex justify-end">
          <button
            type="submit"
            // Hover dims the whole pair rather than swapping the fill for
            // `primary-hover`: that token is a fixed cream, and against
            // `brand.peach-text`'s LIGHT value (also cream) the label would
            // disappear on hover in a light-mode page.
            className="rounded-full bg-brand-peach px-5 py-2.5 text-[13px] font-medium text-brand-peach-text transition-opacity duration-300 ease-in-out hover:opacity-90"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
