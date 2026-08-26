import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Chip } from '@skene/design-system/sections/chip'

/**
 * The 10px monospace uppercase rectangle.
 *
 * Extracted from two copies written independently — `PlanCard`'s tier span and
 * `ProductWindow`'s `WindowStatus` — which had already drifted apart on tracking
 * before anyone noticed. Its job is to hold the geometry still: `tone` carries
 * colour and nothing else, with tracking as the single declared exception. It
 * exists as much to stop a third inline copy being written as to render the two
 * that exist.
 */
const meta = {
  title: 'Sections/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'healthy', 'live', 'warn', 'danger', 'outline'] },
  },
  args: { children: 'PRO' },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = { args: { tone: 'neutral' } }
export const Healthy: Story = { args: { tone: 'healthy', children: 'HEALTHY' } }
export const Live: Story = { args: { tone: 'live', children: 'LIVE' } }
export const Outline: Story = { args: { tone: 'outline', children: 'BETA' } }

/**
 * The caution marker: present but degraded, deprecated, or waiting on a
 * decision. Same on-tint recipe as `danger` — amber on-tint ink over a 12%
 * amber tint — because the marketing pages' inline retint (`tone="neutral"`
 * with an amber `className`) shipped base amber as its own ink at 15%, which is
 * the measured-band miss the `TONES` row documents.
 */
export const Warn: Story = { args: { tone: 'warn', children: 'DEPRECATED' } }

/**
 * The breakage marker. Ink is the on-tint token over a 12% tint — see the
 * `TONES` row in the source for why it deviates from `healthy`'s recipe — and
 * both halves are mode-aware, so `OnLight` below is the other half of this
 * story's claim.
 */
export const Danger: Story = { args: { tone: 'danger', children: 'BREAKS AT THE SEAM' } }

const TONES = ['neutral', 'healthy', 'live', 'warn', 'danger', 'outline'] as const

/** All the tones together — the frame that catches geometry drifting between tones. */
export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {TONES.map((t) => (
        <Chip key={t} tone={t}>
          {t}
        </Chip>
      ))}
    </div>
  ),
}

export const OnLight: Story = {
  render: () => (
    <div className="light rounded-xl bg-brand-light p-6">
      <div className="flex flex-wrap items-center gap-2">
        {TONES.map((t) => (
          <Chip key={t} tone={t}>
            {t}
          </Chip>
        ))}
      </div>
    </div>
  ),
}
