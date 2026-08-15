import { cn } from '../lib/utils.js'

export interface TerminalProps {
  /** Shown in the title bar next to the traffic lights. */
  title?: string
  className?: string
  children: React.ReactNode
}

/**
 * A terminal / code frame.
 *
 * Skene's product is a CLI and a GitHub check, so a terminal frame appears on
 * product pages, docs and onboarding across both apps. Having one here stops
 * each surface hand-rolling its own traffic lights.
 *
 * Colours come from `color.terminal.*` and `color.terminal-chrome.*`, which are
 * mode-invariant on purpose: a terminal that turns white in light mode stops
 * reading as a terminal. The chrome styling lives in styles/effects.css as
 * `.skene-terminal`, so the same frame is available to consumers who want the
 * look without importing a component.
 */
export function Terminal({ title, className, children }: TerminalProps) {
  return (
    <div className={cn('skene-terminal font-mono text-[12px]', className)}>
      <div className="skene-terminal-bar">
        {title ? (
          <span className="text-[11px] text-[var(--color-terminal-muted)]">{title}</span>
        ) : null}
      </div>
      <div className="p-3 leading-relaxed">{children}</div>
    </div>
  )
}

export interface TerminalLineProps {
  /** Renders the `$` prompt. Output lines omit it. */
  prompt?: boolean
  className?: string
  children: React.ReactNode
}

export function TerminalLine({ prompt, className, children }: TerminalLineProps) {
  return (
    <div className={cn('whitespace-pre-wrap', className)}>
      {prompt ? (
        <span aria-hidden="true" className="mr-2 text-[var(--color-brand-peach)]">
          $
        </span>
      ) : null}
      {children}
    </div>
  )
}
