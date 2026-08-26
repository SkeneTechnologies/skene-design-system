import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { EvaluatorPanel } from '@skene/design-system/sections/evaluator-panel'

/**
 * The two-pane evaluator: the index on one side, one evaluation's requirements
 * on the other. It composes `EvaluatorList` and `EvaluatorVerify`, so the
 * per-prop detail lives in their stories; what this one is for is the split.
 */
const meta = {
  title: 'Sections/EvaluatorPanel',
  component: EvaluatorPanel,
  parameters: { layout: 'fullscreen' },
  argTypes: { frame: { control: 'inline-radio', options: ['gh', 'db', 'jr', false] } },
} satisfies Meta<typeof EvaluatorPanel>

export default meta
type Story = StoryObj<typeof meta>

const list = {
  columns: { name: 'Evaluation', check: 'Check', metric: 'Metric', confirmed: 'Confirmed' },
  evaluations: [
    {
      name: 'Activation within 7 days',
      check: { status: 'ok' as const, label: 'passing' },
      metric: '31.4%',
      confirmed: '4 of 4',
    },
    {
      name: 'Checkout completion',
      check: { status: 'bad' as const, label: 'no data' },
      metric: '—',
      confirmed: '2 of 5',
    },
  ],
}

const detail = {
  title: 'Checkout completion',
  subtitle: 'What this evaluation needs',
  requirements: [
    {
      name: 'checkout_started',
      status: 'warn' as const,
      verdict: 'found, one field missing',
      fields: [{ name: 'cart_value', status: 'bad' as const, verdict: 'absent' }],
    },
    { name: 'purchase_completed', status: 'bad' as const, verdict: 'not found' },
  ],
}

export const Default: Story = {
  args: {
    crumb: 'Workspace / Evaluations',
    summary: { status: 'warn' as const, label: '1 of 2 passing' },
    list,
    detail,
    frame: 'db',
  },
}

export const Unframed: Story = { args: { ...Default.args, frame: false } }

export const WithNote: Story = {
  args: { ...Default.args, note: 'Selecting a row on the left changes the pane on the right.' },
}

/**
 * The marketing wireframes' two-pane cut: the index in a dark left pane with
 * the open row picked out (`activeIndex`), the requirements in the cream right
 * pane. The index renders at lower resolution here — name and confirmed count
 * per row — which is the prop's documented trade; the check pill and metric
 * live in the stacked table. Below `md` the panes stack back into the reading
 * order the stacked layout has.
 */
export const Split: Story = {
  args: { ...Default.args, split: true, activeIndex: 1 },
}
