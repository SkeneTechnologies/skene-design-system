import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { JourneyTrack, MiniFunnel } from '@skene/design-system/sections/journey-track'

/**
 * The horizontal step rail. `state` is `good | warn | danger` — the shared
 * `Status` union, the same one `Finding` and `ScoreRing` use, so a colour means
 * the same thing wherever it appears.
 */
const meta = {
  title: 'Sections/JourneyTrack',
  component: JourneyTrack,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof JourneyTrack>

export default meta
type Story = StoryObj<typeof meta>

const steps = [
  { label: 'Landing', note: 'page_view', state: 'good' as const },
  { label: 'Signup', note: 'nothing bound', state: 'danger' as const },
  { label: 'Connect', note: 'repo_connected', state: 'good' as const },
  { label: 'First scan', note: 'fires twice', state: 'warn' as const },
]

export const Default: Story = {
  args: { title: 'Activation', subtitle: 'skene_prod · last 28 days', steps },
}

export const AllGood: Story = {
  args: { ...Default.args, steps: steps.map((s) => ({ ...s, state: 'good' as const })) },
}

/** Two steps — the shortest track, where the connector geometry shows. */
export const TwoSteps: Story = { args: { ...Default.args, steps: steps.slice(0, 2) } }

/** Six steps, which is where the rail starts needing its scroller. */
export const SixSteps: Story = {
  args: {
    ...Default.args,
    steps: [
      ...steps,
      { label: 'Invite', note: 'nothing bound', state: 'danger' as const },
      { label: 'Upgrade', note: 'checkout_started', state: 'good' as const },
    ],
  },
}

/** No notes. The labels have to carry it alone. */
export const LabelsOnly: Story = {
  args: { ...Default.args, steps: steps.map(({ label, state }) => ({ label, state })) },
}

/**
 * Caller-supplied ring glyphs — the verified track. `glyph` is per step and
 * replaces only the number: the connectors still derive from the states, which
 * is why the last seam here runs matcha into red with no code at the call site.
 */
export const GlyphRings: Story = {
  args: {
    title: 'Verified journey',
    subtitle: 'Every step backed by a live event',
    steps: [
      { label: 'Landing', note: 'page_view', state: 'good' as const, glyph: '✓' },
      { label: 'Signup', note: 'signup_completed', state: 'good' as const, glyph: '✓' },
      { label: 'Connect', note: 'repo_connected', state: 'good' as const, glyph: '✓' },
      { label: 'Upgrade', note: 'nothing bound', state: 'danger' as const },
    ],
  },
}

export const Mini: Story = {
  args: { steps },
  render: () => (
    <div className="w-[320px]">
      <MiniFunnel
        rows={[
          { label: 'Landing', value: '12,481', fill: 100 },
          { label: 'Signup', value: '3,902', fill: 64 },
          { label: 'Connect', value: '1,204', fill: 31 },
        ]}
      />
    </div>
  ),
}
