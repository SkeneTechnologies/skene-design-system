import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { JourneySignalScene } from '@skene/design-system/sections/journey-signal-scene'

/**
 * `JourneySignalScene` — evidence, a traced journey step, and the PR review
 * that catches it breaking, in one animated composition. No props: content
 * lives in the exported consts near the top of the source file.
 *
 * `light`, on the decorator, not optional: the scene's own tokens alias
 * several names straight to this package's `--color-text-primary` etc.,
 * which default to the DARK reading (near-white, for a dark page) without a
 * `light` ancestor. Every card in the scene has a white/cream background
 * regardless of page theme, so without `light` the ink text renders
 * near-invisible on it — the same trap `CheckList`'s `OnLight` story exists
 * to catch, one level up (an ancestor class here rather than a component prop).
 *
 * Three stories, not one, because the scene measures its OWN container width
 * and switches between three hand-placed layouts at 720px and 420px — a
 * single fixed-width story would only ever exercise one of them.
 */
const meta = {
  title: 'Sections/JourneySignalScene',
  component: JourneySignalScene,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof JourneySignalScene>

export default meta
type Story = StoryObj<typeof meta>

/** WIDE layout (≥720px container): the three-panel chain. */
export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="light w-[1100px] bg-brand-light p-8">
        <Story />
      </div>
    ),
  ],
}

/**
 * MEDIUM layout (420-720px container): evidence and the traced step stay
 * side by side, the densest panel (Flows / PR review) drops to its own row.
 * Sized for a hero's right column, which is the placement that motivated it.
 */
export const HeroColumnWidth: Story = {
  decorators: [
    (Story) => (
      <div className="light w-[600px] bg-brand-light p-8">
        <Story />
      </div>
    ),
  ],
}

/** COMPACT layout (<420px container): all three panels stacked full width. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="light w-[375px] bg-brand-light p-8">
        <Story />
      </div>
    ),
  ],
}
