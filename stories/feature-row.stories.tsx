import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { CheckItem, CheckList } from '@skene/design-system/sections/check-list'
import { FeatureRow } from '@skene/design-system/sections/feature-row'
import { Button } from '@skene/design-system/ui/button'

/**
 * `FeatureRow` — copy on one side, a visual on the other.
 *
 * Every prop is a control. That is the point of this file rather than a second
 * copy of `docs-app`: the states below include ones no page currently renders,
 * and two of them are states that shipped defects to production.
 */
const meta = {
  title: 'Sections/FeatureRow',
  component: FeatureRow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The alternating feature row. `splitAt` and `sheen` both exist because a consumer hit a defect that could not be fixed from the call site — see the over-wide visual and sheen stories.',
      },
    },
  },
  argTypes: {
    splitAt: {
      control: 'inline-radio',
      options: ['md', 'lg', 'xl'],
      description:
        'Which named breakpoint the row splits at. Named only — an arbitrary value cannot work, because Tailwind scans source text and an interpolated variant emits no class at all.',
    },
    sheen: {
      control: 'boolean',
      description:
        'The 10% white wash over the visual. Turn it off when the visual carries a light-on-dark status mark; it raises the ground under one.',
    },
    reverse: { control: 'boolean' },
    texture: { control: 'inline-radio', options: [undefined, 'journey', 'github', 'schema'] },
    titleAs: { control: 'inline-radio', options: ['h2', 'h3'] },
  },
} satisfies Meta<typeof FeatureRow>

export default meta
type Story = StoryObj<typeof meta>

const copy = {
  n: '01',
  title: 'See what you measure, and what you don’t.',
  lede: 'Skene scans the collection layer and maps what is broken, incomplete and missing.',
  children: (
    <CheckList>
      <CheckItem>Inventories the signals you already collect</CheckItem>
      <CheckItem>Flags missing steps, broken payloads and silent gaps</CheckItem>
    </CheckList>
  ),
  actions: <Button variant="outline">See what you get free</Button>,
}

/** A panel of a plausible width — the case that has always worked. */
export const Default: Story = {
  args: {
    ...copy,
    texture: 'journey',
    visual: <Placeholder width={520} label="A visual that fits its track" />,
  },
}

export const Reversed: Story = {
  args: { ...Default.args, reverse: true, n: '02' },
}

/**
 * THE REGRESSION GUARD, for the family of defects that produced two paragraphs
 * at 1.00:1 — cream type on a cream panel, invisible — on a production page.
 *
 * Read what this story does and does not claim, because the difference is the
 * whole value of it.
 *
 * **What it renders.** A visual wider than the track it is given: 998px in a
 * ~570px column. That number is not arbitrary — `LifecycleCanvas`'s rail is
 * `auto-cols-[minmax(190px,1fr)]` with a 12px gap, so five stages want
 * 5 × 190 + 4 × 12 = 998px before they compress at all, and that canvas was the
 * visual in the composition that failed.
 *
 * **What the component does with it today.** Nothing bad. The row is
 * `overflow-hidden` and the visual cell is `grid w-full place-items-center`, so
 * an over-wide artifact is clipped at the row's edge and cannot reach the copy
 * column. Verified by rendering this story at 1440. **So this story does not
 * reproduce the bug — it pins the fix.**
 *
 * **Why it is worth a baseline anyway.** The three utilities holding it are
 * `overflow-hidden`, `w-full`, and `place-items-center`, and losing any one of
 * them re-opens the failure: `place-items-center` alone sizes the cell to
 * fit-content, so without `w-full` the visual takes its 998px CONTENT width,
 * and without `overflow-hidden` a forced-light panel inside it spreads under
 * the copy. That class of change is invisible to every gate that reads CSS —
 * an ancestor walk resolves the card's own dark ground correctly and cannot see
 * a sibling painting over it. Only rendered pixels catch it, and only a story
 * at this composition puts those pixels in front of a diff.
 *
 * If this story ever renders with the panel reaching left under the heading,
 * that is the defect returning, and Chromatic should be the thing that says so.
 */
export const ClippedByAnOverWideVisual: Story = {
  name: 'Over-wide visual (clipping guard)',
  args: {
    ...copy,
    texture: 'journey',
    visual: <Placeholder width={998} label="998px of rail in a ~570px track" light />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The light panel must stop at the row edge. If it reaches under the copy column, the containment that prevents 1.00:1 text has been lost.',
      },
    },
  },
}

/**
 * The second production defect, and the reason `sheen` is a prop.
 *
 * The component's 10% white wash sits over the visual. Where the visual carries
 * a light-on-dark status mark — `PrReview`'s "changes requested" pill, red on
 * the GitHub window chrome — that wash raises the ground under the glyphs and
 * took the pill from 4.510:1 to 3.801 at 390px, against a 4.5 floor. Sixteen
 * below-floor readings, created by adopting the component and by nothing else.
 *
 * Toggle `sheen` in the controls with the a11y panel open.
 */
export const SheenOverAStatusPill: Story = {
  name: 'Sheen over a status pill',
  args: {
    ...copy,
    n: '02',
    texture: 'github',
    visual: <StatusPillPanel />,
    sheen: true,
  },
}

/** Prose only. The template's `splitAt: 'never'` case is this shape. */
export const NoVisual: Story = {
  args: { ...copy, visual: undefined, texture: undefined },
}

function Placeholder({
  width,
  label,
  light = false,
}: {
  width: number
  label: string
  light?: boolean
}) {
  return (
    <div
      style={{ width }}
      className={
        light
          ? 'light rounded-xl border border-chrome-line-on-light bg-surface-1 p-6 text-text-primary'
          : 'dark rounded-xl border border-chrome-surface-border bg-chrome-surface-1 p-6 text-chrome-text-primary'
      }
    >
      {label}
    </div>
  )
}

function StatusPillPanel() {
  return (
    <div className="dark w-[420px] rounded-xl border border-chrome-surface-border bg-chrome-surface-1">
      <div
        className="flex items-center justify-between gap-3 border-b border-chrome-surface-border px-4 py-3"
        style={{ background: 'rgb(22, 27, 34)' }}
      >
        <span className="font-mono text-[11px] text-chrome-text-muted">
          SkeneTechnologies/skene-dashboard #259
        </span>
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[11px] text-semantic-error-red"
          style={{ background: 'color-mix(in oklab, var(--color-semantic-error-red) 10%, transparent)' }}
        >
          changes requested
        </span>
      </div>
      <p className="px-4 py-6 text-[13px] text-chrome-text-muted">
        The pill above is the sample that failed. Its ground is set by this panel, not by the
        caller.
      </p>
    </div>
  )
}
