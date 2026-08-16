import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { AnnotatedCurve } from '@skene/design-system/sections/annotated-curve'

/**
 * A narrative plotting frame, and the emphasis is on NARRATIVE.
 *
 * The split is the whole design: the SVG spline is `aria-hidden` decoration and
 * the callouts are an ordered list of real HTML, so the copy wraps, selects,
 * finds, and is read in array order. It is for an argument that has a SHAPE — a
 * rise, a dip, a recovery — where the copy is the payload and the curve is the
 * frame it hangs on.
 *
 * It is not a chart. The points are hand-authored 0–100 percentages, so do not
 * reach for this to show measured values; nothing here is to scale and nothing
 * validates that it is.
 */
const meta = {
  title: 'Sections/AnnotatedCurve',
  component: AnnotatedCurve,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    aspect: { control: { type: 'range', min: 1.2, max: 4, step: 0.1 } },
    offset: { control: { type: 'range', min: 0, max: 40, step: 2 } },
  },
} satisfies Meta<typeof AnnotatedCurve>

export default meta
type Story = StoryObj<typeof meta>

export const RiseAndDip: Story = {
  args: {
    points: [
      { x: 0, y: 20, label: 'You ship the instrumentation', place: 'above', align: 'start' },
      { x: 28, y: 72, label: 'Numbers look right' },
      { x: 55, y: 66 },
      { x: 72, y: 24, label: 'A rename lands, silently', place: 'below' },
      { x: 100, y: 18, label: 'The quarter closes on it', place: 'above', align: 'end' },
    ],
  },
}

/** Every placement, so the callout geometry is checkable at the edges. */
export const AllPlacements: Story = {
  args: {
    points: [
      { x: 0, y: 50, label: 'left', place: 'left' },
      { x: 33, y: 80, label: 'above', place: 'above' },
      { x: 66, y: 20, label: 'below', place: 'below' },
      { x: 100, y: 50, label: 'right', place: 'right' },
    ],
  },
}

/** No labels at all — the curve as pure frame. */
export const Unlabelled: Story = {
  args: {
    points: [
      { x: 0, y: 20 },
      { x: 30, y: 70 },
      { x: 60, y: 40 },
      { x: 100, y: 85 },
    ],
  },
}

/** Two points: a straight line, and the degenerate case the spline has to survive. */
export const TwoPoints: Story = {
  args: {
    points: [
      { x: 0, y: 20, label: 'Before' },
      { x: 100, y: 80, label: 'After', align: 'end' },
    ],
  },
}

/** A tall frame — `aspect` is the shape of the plot, not of the section. */
export const Tall: Story = { args: { ...RiseAndDip.args, aspect: 1.4 } }
