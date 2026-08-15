'use client'

import { cn } from '../lib/utils.js'

/**
 * Monthly / yearly switch. Its own module on purpose.
 *
 * It is the only interactive part of the pricing section, and `'use client'` in
 * plan-card.tsx would draw the boundary around PlanCard too — which is pure
 * markup and should stay server-rendered. The barrel makes the same point about
 * the ui/ primitives: the directive belongs in the one file that needs it.
 */

export interface BillingToggleProps {
  /** `false` = monthly, `true` = yearly. */
  yearly: boolean
  onChange: (yearly: boolean) => void
  monthlyLabel?: React.ReactNode
  yearlyLabel?: React.ReactNode
  className?: string
}

/**
 * Monthly / yearly switch.
 *
 * Both labels are clickable, not just the track. A 40px switch is a small target
 * and the words next to it are the obvious thing to press.
 */
export function BillingToggle({
  yearly,
  onChange,
  monthlyLabel = 'Billed monthly',
  yearlyLabel = 'Billed yearly',
  className,
}: BillingToggleProps) {
  return (
    <div className={cn('flex items-center gap-3 text-[13px]', className)}>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={cn(
          'transition-colors',
          yearly ? 'text-chrome-text-muted-warm' : 'text-chrome-text-primary',
        )}
      >
        {monthlyLabel}
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={yearly}
        aria-label="Bill yearly"
        onClick={() => onChange(!yearly)}
        className="relative h-6 w-11 shrink-0 rounded-full border border-chrome-line-strong bg-chrome-surface-2 transition-colors"
      >
        <span
          className={cn(
            'absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-brand-light transition-[left]',
            yearly ? 'left-[26px]' : 'left-1',
          )}
        />
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={cn(
          'transition-colors',
          yearly ? 'text-chrome-text-primary' : 'text-chrome-text-muted-warm',
        )}
      >
        {yearlyLabel}
      </button>
    </div>
  )
}
