import { cn } from '../lib/utils.js'

/**
 * The progress pipeline shown inside a product window while a long job runs.
 *
 * The connector is owned by the STEPPER, not by the step, and it is filled from
 * the state of the step on its LEFT. That is the whole reason `steps` is an
 * array prop rather than `children`: "filled" is a property of the pair, so a
 * step that drew its own trailing rule would have to know it is not last, and a
 * finished final step would draw a filled rule into empty space. Owning the
 * connectors here makes the row read as one track filling left to right instead
 * of as N independent dots that happen to be in a line.
 *
 * Emphasis runs opposite to the usual instinct: the ACTIVE step carries the
 * label weight and done steps recede. While a job is running the reader's
 * question is "what is it doing now", not "what has it already finished", and
 * bolding the completed steps answers the wrong one.
 *
 * Type uses the theme-aware `text.*` role. This lands inside a LIGHT
 * `ProductWindow` on a cream fill, and `chrome.text.*` is invariant cream by
 * definition — it cannot invert, so it would disappear here. Done uses
 * `semantic.matcha`, the same completion colour the findings use, and `active`
 * uses `brand.peach` so the moving part is the brand colour rather than a
 * second success state.
 *
 * The hairline is the one thing no mode-aware role covers: on cream the correct
 * token is `chrome.line.onLight`, on a dark ground `chrome.line.subtle`. Hence
 * `onLight`, which defaults to `true` because the light window is where this
 * renders.
 *
 * Below `sm` it stacks vertically. Three labelled steps sharing 390px leaves
 * under a third of the width each, which wraps every label to two or three
 * lines. Stacked, the connector rotates — a 1px column instead of a 1px row —
 * rather than being dropped, so the filled track still reads as progress.
 *
 * No `use client`: state arrives as props, so a version that advances over time
 * composes by re-rendering with new props and this file stays
 * server-renderable.
 */

export type PipelineStepState = 'done' | 'active' | 'pending'

export interface PipelineStepItem {
  label: React.ReactNode
  state: PipelineStepState
  /** Glyph or icon element inside the ring. Falls back to a check / a dot. */
  icon?: React.ReactNode
}

function hairline(onLight: boolean) {
  return onLight ? 'var(--color-chrome-line-on-light)' : 'var(--color-chrome-line-subtle)'
}

function ringStyle(state: PipelineStepState, onLight: boolean): React.CSSProperties {
  if (state === 'done') {
    return {
      borderColor: 'color-mix(in oklab, var(--color-semantic-matcha) 55%, transparent)',
      background: 'color-mix(in oklab, var(--color-semantic-matcha) 12%, transparent)',
      color: 'var(--color-semantic-matcha)',
    }
  }
  if (state === 'active') {
    return {
      borderColor: 'var(--color-brand-peach)',
      background: 'color-mix(in oklab, var(--color-brand-peach) 14%, transparent)',
      color: 'var(--color-brand-peach)',
      // A halo rather than a thicker border: a 2px ring on the active step
      // alone would shift its label a pixel out of line with the others.
      boxShadow: '0 0 0 4px color-mix(in oklab, var(--color-brand-peach) 12%, transparent)',
    }
  }
  return { borderColor: hairline(onLight), background: 'transparent' }
}

export interface PipelineStepProps extends PipelineStepItem {
  /** `true` (default) renders on the cream fill of a light ProductWindow. */
  onLight?: boolean
  className?: string
}

export function PipelineStep({ label, state, icon, onLight = true, className }: PipelineStepProps) {
  return (
    <li
      // `aria-current="step"` is the only state exposed to assistive tech. The
      // ring and the glyph are decoration for it, so they stay hidden — a
      // reader announcing "tick, circle, circle" ahead of every label is noise.
      aria-current={state === 'active' ? 'step' : undefined}
      className={cn(
        'flex min-w-0 items-center gap-3 sm:flex-col sm:gap-2.5 sm:text-center',
        'sm:max-w-[160px] sm:flex-none',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border text-[13px] leading-none',
          state === 'pending' && 'text-text-muted',
        )}
        style={ringStyle(state, onLight)}
      >
        {icon ??
          (state === 'done' ? '✓' : <span className="h-1.5 w-1.5 rounded-full bg-current" />)}
      </span>
      <span
        className={cn(
          'text-[13px] leading-snug',
          state === 'active'
            ? 'font-medium text-text-primary'
            : state === 'done'
              ? 'text-text-muted-strong'
              : 'text-text-muted',
        )}
      >
        {label}
      </span>
    </li>
  )
}

function PipelineConnector({ filled, onLight }: { filled: boolean; onLight: boolean }) {
  return (
    <li
      aria-hidden
      className={cn(
        // Vertically: a 1px column indented to the centre of the 38px ring.
        'ml-[18px] h-4 w-px shrink-0',
        // Horizontally: a 1px row pinned to that same centre, taking whatever
        // width is left between two steps.
        'sm:ml-0 sm:mt-[18px] sm:h-px sm:w-auto sm:min-w-[24px] sm:flex-1 sm:self-start',
      )}
      style={{ background: filled ? 'var(--color-semantic-matcha)' : hairline(onLight) }}
    />
  )
}

export interface PipelineStepperProps {
  /** Left to right; the connector after a `done` step renders filled. */
  steps: PipelineStepItem[]
  /** What the job is, e.g. the line the product prints when it starts. */
  title?: React.ReactNode
  /** One quieter line under the title. */
  subtitle?: React.ReactNode
  /** `true` (default) renders on the cream fill of a light ProductWindow. */
  onLight?: boolean
  className?: string
}

export function PipelineStepper({
  steps,
  title,
  subtitle,
  onLight = true,
  className,
}: PipelineStepperProps) {
  const rows: React.ReactNode[] = []
  steps.forEach((step, i) => {
    rows.push(<PipelineStep key={`step-${i}`} {...step} onLight={onLight} />)
    if (i < steps.length - 1) {
      rows.push(
        <PipelineConnector key={`link-${i}`} filled={step.state === 'done'} onLight={onLight} />,
      )
    }
  })

  return (
    <div className={cn('p-[22px]', className)}>
      {title ? <p className="text-[14px] text-text-primary">{title}</p> : null}
      {subtitle ? <p className="mt-1 text-[12px] text-text-muted">{subtitle}</p> : null}
      <ol
        className={cn(
          'm-0 flex list-none flex-col items-stretch p-0 sm:flex-row sm:items-start sm:justify-between',
          title || subtitle ? 'mt-5' : '',
        )}
      >
        {rows}
      </ol>
    </div>
  )
}
