import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { ScoreRing } from '@skene/design-system/sections/score-ring'

/**
 * A value drawn as an arc. `label` is a required STRING rather than a node,
 * because it becomes the accessible name — the ring itself is SVG a screen
 * reader gets nothing from, so a missing label makes the number unreadable
 * rather than merely unlabelled.
 *
 * `status` is the colour and is a separate decision from the value: a low number
 * is not automatically bad, and the component does not guess.
 */
const meta = {
  title: 'Sections/ScoreRing',
  component: ScoreRing,
  parameters: { layout: 'centered' },
  argTypes: {
    status: { control: 'inline-radio', options: ['good', 'warn', 'danger'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: { type: 'range', min: 48, max: 200, step: 8 } },
  },
  args: { label: 'Coverage', value: 68, max: 100 },
} satisfies Meta<typeof ScoreRing>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Full: Story = { args: { value: 100, status: 'good' } }
export const Empty: Story = { args: { value: 0, status: 'danger' } }
export const Large: Story = { args: { size: 160 } }

/** Every status at one value, so the colours are comparable rather than confounded. */
export const Statuses: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(['good', 'warn', 'danger'] as const).map((s) => (
        <div key={s} className="grid justify-items-center gap-2">
          <ScoreRing value={68} label={`Coverage ${s}`} status={s} />
          <span className="font-mono text-[11px] text-chrome-text-muted">{s}</span>
        </div>
      ))}
    </div>
  ),
}

/** A scale other than 0-100 — `max` is why `value` is not a percentage. */
export const OutOfSix: Story = { args: { value: 2, max: 6, label: 'Milestones bound', status: 'warn' } }
