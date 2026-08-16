import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Bridge, BridgeNode } from '@skene/design-system/sections/bridge'

/**
 * `Bridge` — the "your stack, then Skene, then what you get" band.
 *
 * `BridgeNode` sets `dark` on itself deliberately. That is not redundancy on a
 * dark page: the node's fill is near-black regardless of mode, so on a cream
 * page every mode-aware token in its subtree would otherwise keep its LIGHT
 * value and render dark-on-dark. Setting the class pins the subtree to the
 * palette the fill actually is. The same pattern appears anywhere a component
 * paints its own always-ink ground.
 */
const meta = {
  title: 'Sections/Bridge',
  component: Bridge,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Bridge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    eyebrow: 'How it fits',
    title: 'Between the code you ship and the numbers you trust.',
    lede: 'Skene reads the collection layer where it is written, not where it lands.',
    caption: 'No SDK swap, no tag manager, no second source of truth.',
    children: (
      <>
        <BridgeNode
          label="Your stack"
          title="Where events are written"
          items={['Next.js routes', 'API handlers', 'Client components']}
        />
        <BridgeNode label="Skene" title="Reads and checks" featured items={['Scan', 'Diff', 'Report']} />
        <BridgeNode
          label="What you get"
          title="A map you can act on"
          items={['Missing steps', 'Broken payloads', 'Owners and lines']}
        />
      </>
    ),
  },
}

/** The featured node alone, so its treatment is checkable in isolation. */
export const FeaturedNodeOnly: Story = {
  args: {
    title: 'One node.',
    children: <BridgeNode label="Skene" title="Reads and checks" featured items={['Scan', 'Diff']} />,
  },
}

/** No items — the node is a label and a title. */
export const NodesWithoutItems: Story = {
  args: {
    title: 'Three labels.',
    children: (
      <>
        <BridgeNode label="Your stack" title="Where events are written" />
        <BridgeNode label="Skene" title="Reads and checks" featured />
        <BridgeNode label="What you get" title="A map you can act on" />
      </>
    ),
  },
}
