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

/**
 * No title, no eyebrow, no lede — the band as an ARTIFACT rather than a
 * section.
 *
 * The case ask q filed: inside a `FeatureRow` the row already carries the
 * section `<h2>`, so a band that also renders one gives that `<section>` two,
 * and a band with nothing of its own to say has nothing to pass. Nothing
 * heading-shaped renders here, and the cards must sit directly under the
 * band's own padding — no empty centred div, no 56px slot where a heading was
 * not.
 */
export const NoTitle: Story = {
  args: {
    children: (
      <>
        <BridgeNode
          label="Your stack"
          title="Where events are written"
          items={['Next.js routes', 'API handlers']}
        />
        <BridgeNode label="Skene" title="Reads and checks" featured items={['Scan', 'Diff']} />
        <BridgeNode
          label="What you get"
          title="A map you can act on"
          items={['Missing steps', 'Owners and lines']}
        />
      </>
    ),
  },
}

/** `h3`, for a band nested under a heading it does not own. */
export const TitleAsH3: Story = {
  args: {
    ...Default.args,
    titleAs: 'h3',
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
