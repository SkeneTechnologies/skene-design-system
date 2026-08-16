import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Button } from '@skene/design-system/ui/button'

/**
 * `Button` — shadcn's, with this estate's tokens.
 *
 * ## What the matrix below is actually for
 *
 * A rendered-pixel contrast harness reported the primary button at 3.17:1
 * against a 4.5 floor, and it was wrong. `text-brand-peach-text` is `#3b2402`
 * on `bg-brand-peach` `#fec089`: **9.11:1**, nowhere near the floor. The
 * reported `rgb(150,109,65)` is that peach at roughly 58% over the page's
 * `rgb(6,6,6)` — an antialiased pixel on the button's rounded EDGE, sampled as
 * if it were a ground.
 *
 * That is a documented false-reading mode of the harness, and it points at a
 * real limitation rather than a real defect: a diff-based sampler cannot tell a
 * glyph's ground from its neighbour's edge. Nothing about the button changed,
 * and nothing should — relaxing a gate around a control already at 9.11:1
 * would be adjusting the instrument to fit the reading.
 *
 * What Storybook adds is the check the harness cannot do: every variant at
 * every size, on both grounds, in one frame, where a human and a visual diff
 * both see the actual rendered colours instead of one sampled pixel.
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
