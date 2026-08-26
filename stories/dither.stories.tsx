import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { assetUrls } from '@skene/design-system/asset-urls'
import { DitheredMedia } from '@skene/design-system/patterns/dither'

/**
 * The dithered hero ground: media, dither, scrim, gradient fade, content — the
 * four-layer stack the homepage actually runs, composed so the order and the
 * blend mode cannot be reassembled wrong by eye.
 *
 * The package ships no video, so these stories use the one texture it does
 * ship as both the media layer and the dither — which is exactly the shape a
 * consumer with no footage starts from. The scrim's 0.56 default is a measured
 * value (see the `scrim` prop's own comment); a story overriding it would be a
 * story teaching the unmeasured number.
 */
const meta = {
  title: 'Patterns/Dither',
  component: DitheredMedia,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DitheredMedia>

export default meta
type Story = StoryObj<typeof meta>

const copy = (
  <div className="flex min-h-[420px] flex-col items-start justify-end gap-3 p-10">
    <h2 className="text-3xl font-normal text-chrome-text-primary">
      The page reads as Skene before a word is read.
    </h2>
    <p className="max-w-md text-sm text-chrome-text-muted">
      Halftone over media, under a measured scrim, fading into the page ground.
    </p>
  </div>
)

/** Image media under the dither, at the defaults the live site verified. */
export const Default: Story = {
  args: {
    image: assetUrls.pixelField,
    dither: assetUrls.subpageDither,
    children: copy,
  },
}

/**
 * No media and no dither: the scrim and gradient alone. This is the documented
 * degraded state — "the gradient alone still reads as an intentional dark
 * section rather than a broken one" — and a baseline for it is what proves the
 * claim.
 */
export const GradientOnly: Story = {
  args: { children: copy },
}
