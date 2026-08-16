import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { ProductWindow, WindowStatus } from '@skene/design-system/sections/product-window'
import { MetricCard, Sparkline } from '@skene/design-system/sections/finding-card'

/**
 * A drawn product screen. `tone` picks the chrome — `light` is the app as users
 * see it, `dark` is the same window on an ink page.
 *
 * The tone is a real palette switch, not a background swap, so a child built for
 * one ground will fail on the other. Both stories exist for that reason.
 */
const meta = {
  title: 'Sections/ProductWindow',
  component: ProductWindow,
  parameters: { layout: 'fullscreen' },
  argTypes: { tone: { control: 'inline-radio', options: ['light', 'dark'] } },
} satisfies Meta<typeof ProductWindow>

export default meta
type Story = StoryObj<typeof meta>

const body = (
  <MetricCard label="Trial activation" value="31.4%" delta="↓ 8.2%" trend="danger">
    <Sparkline bars={[74, 81, 77, 72, 55, 51, 47, 45]} highlight={4} />
  </MetricCard>
)

export const Light: Story = {
  args: {
    tone: 'light',
    title: 'Activation funnel · Last 28 days',
    status: <WindowStatus>Dashboard: healthy</WindowStatus>,
    children: body,
  },
}

export const Dark: Story = { args: { ...Light.args, tone: 'dark' } }

/** `live` rather than `healthy` — the second status tone. */
export const LiveStatus: Story = {
  args: { ...Light.args, status: <WindowStatus tone="live">Streaming</WindowStatus> },
}

/** No title and no status — the window chrome has to hold without either. */
export const Bare: Story = { args: { tone: 'light', children: body } }
