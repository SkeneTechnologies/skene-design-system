import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Button } from '@skene/design-system/ui/button'

/**
 * `Button` — shadcn's, with this estate's tokens.
 *
 * ## What the matrix below is actually for
 *
 * A rendered-pixel contrast harness in the consumer repo reported the primary
 * button below the 4.5 floor, repeatedly, at readings that did not agree with
 * each other: 3.17 on macOS, then 1.24 and 1.57 in a pinned Linux container on
 * different routes and widths.
 *
 * The button is not the defect. `text-brand-peach-text` is `#3b2402` on
 * `bg-brand-peach` `#fec089` — **9.11:1**, computed, nowhere near the floor.
 * What the spread of readings identifies is WHICH ground each sample hit:
 *
 *   - `#3b2402` on the page ground `#060606` is **1.39:1** — the band the
 *     container produced. That is the button's ink with its fill not yet
 *     painted.
 *   - `#3b2402` on that peach at ~58% over the same ground is **3.35:1** — the
 *     band macOS produced. That is a pixel on the rounded edge.
 *
 * Both are the sampler reading a ground the glyph does not sit on, and neither
 * survives re-measurement: the container's harness rejected all four of its own
 * suspects on a second sample. A defect that vanishes when you look again is a
 * settle problem in the instrument.
 *
 * (An earlier note here blamed antialiasing alone. It explains the 3.35 band
 * and not the 1.39 one, and an antialiased edge is a stable geometric fact that
 * would land in the same place every run. Timing covers both; edge geometry
 * covers one.)
 *
 * Nothing about the button changed and nothing should — relaxing a gate around
 * a control already at 9.11:1 would be adjusting the instrument to fit the
 * reading.
 *
 * What Storybook adds is a check with no timing in it: every variant at every
 * size, on both grounds, in one frame, where a human and a visual diff see the
 * rendered colours rather than one sampled pixel.
 */
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: { control: 'inline-radio', options: ['default', 'sm', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Start free' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: 'default' } }
export const Outline: Story = { args: { variant: 'outline' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Link: Story = { args: { variant: 'link', children: 'Compare plans' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Remove workspace' } }
export const Disabled: Story = { args: { disabled: true } }

const VARIANTS = ['default', 'outline', 'secondary', 'ghost', 'link', 'destructive'] as const
const SIZES = ['sm', 'default', 'lg'] as const

/** Every variant × every size. The frame a visual diff should watch. */
export const Matrix: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="grid gap-6">
      {SIZES.map((size) => (
        <div key={size} className="grid gap-2">
          <span className="font-mono text-[11px] tracking-[0.08em] text-chrome-text-muted">
            {size.toUpperCase()}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} size={size}>
                {variant}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

/**
 * The same matrix on cream. `outline` and `ghost` are the two that depend
 * entirely on mode-aware tokens, so they are the two to look at here.
 */
export const MatrixOnLight: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="light rounded-xl bg-brand-light p-8">
      <div className="flex flex-wrap items-center gap-3">
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>
    </div>
  ),
}
