import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { EvaluatorList, EvaluatorNote } from '@skene/design-system/sections/evaluator-list'

/**
 * The evaluator index: every evaluation in a workspace, and whether the signals
 * it depends on were found.
 *
 * `frame` decides whether the artifact sits on a textured field or bare.
 * `frame={false}` is the one to use inside a panel that already has its own
 * ground — nesting two fields reads as a rendering fault rather than as depth.
 */
const meta = {
  title: 'Sections/EvaluatorList',
  component: EvaluatorList,
  parameters: { layout: 'fullscreen' },
  argTypes: { frame: { control: 'inline-radio', options: ['gh', 'db', 'jr', false] } },
} satisfies Meta<typeof EvaluatorList>

export default meta
type Story = StoryObj<typeof meta>

const columns = { name: 'Evaluation', check: 'Check', metric: 'Metric', confirmed: 'Confirmed' }

const evaluations = [
  {
    name: 'Activation within 7 days',
    check: { status: 'ok' as const, label: 'passing' },
    metric: '31.4%',
    confirmed: '4 of 4 signals',
  },
  {
    name: 'Checkout completion',
    check: { status: 'bad' as const, label: 'no data' },
    metric: '—',
    confirmed: '2 of 5 signals',
  },
  {
    name: 'Weekly return',
    check: { status: 'warn' as const, label: 'partial' },
    metric: '18.9%',
    confirmed: '3 of 4 signals',
  },
]

export const Default: Story = {
  args: {
    crumb: 'Workspace / Evaluations',
    summary: { status: 'warn' as const, label: '1 of 3 passing' },
    columns,
    evaluations,
    frame: 'db',
  },
}

export const Unframed: Story = { args: { ...Default.args, frame: false } }

export const AllPassing: Story = {
  args: {
    ...Default.args,
    summary: { status: 'ok' as const, label: 'All passing' },
    evaluations: evaluations.map((e) => ({
      ...e,
      check: { status: 'ok' as const, label: 'passing' },
    })),
  },
}

/** One evaluation, and a note under it. */
export const SingleWithNote: Story = {
  args: { ...Default.args, evaluations: evaluations.slice(0, 1) },
  render: (args) => (
    <div className="grid gap-3">
      <EvaluatorList {...args} />
      <EvaluatorNote>An evaluation with missing signals reports no number, not a zero.</EvaluatorNote>
    </div>
  ),
}
