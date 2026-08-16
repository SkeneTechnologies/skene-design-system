import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { PipelineStepper } from '@skene/design-system/sections/pipeline-stepper'

/**
 * Progress through a fixed sequence. Note the states are `done | active |
 * pending` — a pipeline position, not the `good | warn | danger` health union
 * every other artifact here uses. They look similar and mean different things.
 */
const meta = {
  title: 'Sections/PipelineStepper',
  component: PipelineStepper,
  parameters: { layout: 'fullscreen' },
  argTypes: { onLight: { control: 'boolean' } },
} satisfies Meta<typeof PipelineStepper>

export default meta
type Story = StoryObj<typeof meta>

const steps = [
  { label: 'Read the repository', state: 'done' as const },
  { label: 'Map the collection layer', state: 'done' as const },
  { label: 'Check every milestone', state: 'active' as const },
  { label: 'Write findings', state: 'pending' as const },
]

export const InProgress: Story = {
  args: { title: 'Scan', subtitle: 'commit 4a58a52', steps },
}

export const NotStarted: Story = {
  args: { ...InProgress.args, steps: steps.map((s) => ({ ...s, state: 'pending' as const })) },
}

export const Finished: Story = {
  args: { ...InProgress.args, steps: steps.map((s) => ({ ...s, state: 'done' as const })) },
}

/** On cream — `onLight` exists for the same invariant-token reason as elsewhere. */
export const OnLight: Story = {
  args: { ...InProgress.args, onLight: true },
  decorators: [
    (Story) => (
      <div className="light rounded-xl bg-brand-light p-6">
        <Story />
      </div>
    ),
  ],
}

/** With glyphs. */
export const WithIcons: Story = {
  args: {
    ...InProgress.args,
    steps: steps.map((s, i) => ({ ...s, icon: <span aria-hidden>{['◆', '◇', '◈', '◉'][i]}</span> })),
  },
}
