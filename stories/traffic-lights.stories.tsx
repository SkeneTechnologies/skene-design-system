import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { TrafficLights } from '@skene/design-system/sections/traffic-lights'

/**
 * The three window dots. Purely decorative — it has no props but `className`,
 * takes no state, and carries no accessible name, because "the macOS window
 * buttons" is a picture of a window rather than a control anyone can press.
 */
const meta = {
  title: 'Sections/TrafficLights',
  component: TrafficLights,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TrafficLights>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** In the chrome bar it was drawn for. */
export const InAWindowBar: Story = {
  render: () => (
    <div className="w-[420px] overflow-hidden rounded-xl border border-chrome-surface-border">
      <div className="flex items-center gap-3 border-b border-chrome-surface-border bg-chrome-surface-1 px-3 py-2">
        <TrafficLights />
        <span className="font-mono text-[11px] text-chrome-text-muted">skene — zsh</span>
      </div>
      <div className="bg-chrome-surface-deep p-4 font-mono text-[12px] text-chrome-text-muted">
        $ skene analyze
      </div>
    </div>
  ),
}
