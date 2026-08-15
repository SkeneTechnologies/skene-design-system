import { cn } from '../lib/utils.js'

/**
 * The rule-separated feature list with a peach check.
 *
 * The single highest-frequency thing on a Skene marketing page — six instances
 * on the homepage alone, across feature cards and every plan card — and it was
 * hand-written each time.
 *
 * Type uses the THEME-AWARE `text.*` role, not `chrome.text.*`. This list renders
 * on cream featured plan cards as well as dark ones, and `chrome.*` is invariant
 * by definition — cream text that can never invert, which on a cream card is
 * invisible. Only the mode-aware role follows a `light` ancestor.
 *
 * The separator is a top border per item rather than a divider element, so a
 * list of one still reads as part of the card rather than floating. The check is
 * a pseudo-element in the capture; here it is a real span, because a screen
 * reader announcing "tick" before every line is noise, and `aria-hidden` on a
 * `::before` is not expressible.
 */

export interface CheckListProps {
  /** `true` when the list sits on a cream/featured surface. */
  onLight?: boolean
  /** Tightens padding and type for dense contexts like a plan card. */
  dense?: boolean
  className?: string
  children: React.ReactNode
}

export function CheckList({ onLight = false, dense = false, className, children }: CheckListProps) {
  return (
    <ul
      className={cn(
        'm-0 w-full list-none p-0',
        dense ? 'mb-7' : 'mb-8',
        // The light case inherits from a `light` ancestor (PlanCard--featured,
        // ProductWindow tone=light), so the tokens resolve themselves. The flag
        // only switches which border token is correct.
        onLight ? '[--check-rule:var(--color-chrome-line-on-light)]' : '[--check-rule:var(--color-chrome-line-subtle)]',
        className,
      )}
    >
      {children}
    </ul>
  )
}

export interface CheckItemProps {
  dense?: boolean
  className?: string
  children: React.ReactNode
}

export function CheckItem({ dense = false, className, children }: CheckItemProps) {
  return (
    <li
      className={cn(
        'relative border-t text-text-muted-strong',
        dense ? 'py-[11px] pl-[25px] text-[13px]' : 'py-3 pl-[27px] text-[14px]',
        className,
      )}
      style={{ borderTopColor: 'var(--check-rule)' }}
    >
      <span aria-hidden className="absolute left-px top-3 text-brand-peach">
        ✓
      </span>
      {children}
    </li>
  )
}
