import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { MetaChip, StatChip } from '@skene/design-system/sections/stat-chip'

/**
 * Two chips that look alike and are not. `StatChip` is a single fact with an
 * optional glyph. `MetaChip` pairs a label with a `status` slot, so it is the
 * one to reach for when the chip has to say what something IS and how it is
 * doing at the same time.
 */
const meta = {
  title: 'Sections/StatChip',
  component: StatChip,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StatChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { children: '121 stars' } }
export const WithIcon: Story = { args: { icon: <span aria-hidden>★</span>, children: '121 stars' } }
export const LongLabel: Story = {
  args: { icon: <span aria-hidden>◷</span>, children: 'Turnkey dollar-revenue view' },
}

/** `MetaChip`: a label plus a `status` slot. Named `Paired` because a story
 *  called `Meta` would collide with Storybook's own `Meta` type import. */
export const Paired: Story = {
  args: { children: 'Revenue attribution' },
  render: () => (
    <MetaChip icon={<span aria-hidden>◆</span>} status="ROADMAP">
      Revenue attribution
    </MetaChip>
  ),
}

/** The row as it ships — mixed kinds, which is where alignment breaks. */
export const Row: Story = {
  args: { children: '121 stars' },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatChip icon={<span aria-hidden>★</span>}>121 stars</StatChip>
      <StatChip icon={<span aria-hidden>◷</span>}>Turnkey dollar-revenue view</StatChip>
      <MetaChip status="ROADMAP">Revenue attribution</MetaChip>
    </div>
  ),
}
