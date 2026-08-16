import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  CheckChip,
  CheckFigure,
  CheckOperand,
  CheckResult,
  EvaluatorCheck,
} from '@skene/design-system/sections/evaluator-check'

/**
 * The evaluator's Check tab: a metric, the formula under it, one row per operand,
 * and the results it produced.
 *
 * The formula is shown rather than hidden because an evaluation nobody can read
 * is an evaluation nobody trusts — a number with no visible derivation is the
 * thing this product exists to argue against.
 */
const meta = {
  title: 'Sections/EvaluatorCheck',
  component: EvaluatorCheck,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof EvaluatorCheck>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    crumb: 'Workspace / Evaluations / Activation',
    heading: 'Activation within 7 days',
    headingNote: 'Recomputed on every scan',
    metric: '31.4%',
    formula: 'activated / signed_up',
    qualifiers: (
      <>
        <CheckChip>last 28 days</CheckChip>
        <CheckChip role>first workspace only</CheckChip>
      </>
    ),
    children: (
      <>
        <CheckOperand
          name="signed_up"
          tone="ok"
          chips={<CheckChip>signup_started</CheckChip>}
          figures={<CheckFigure label="rows" value="3,902" />}
        />
        <CheckOperand
          name="activated"
          tone="warn"
          chips={<CheckChip>repo_connected</CheckChip>}
          figures={<CheckFigure label="rows" value="1,226" />}
        />
      </>
    ),
    results: (
      <>
        <CheckResult label="Activation" value="31.4%" />
        <CheckResult label="Change vs previous" value="↓ 8.2%" />
      </>
    ),
    note: 'An operand with no signal behind it reports nothing rather than zero.',
  },
}

/** An operand that cannot resolve — the failure this tab exists to surface. */
export const MissingOperand: Story = {
  args: {
    ...Default.args,
    metric: '—',
    children: (
      <>
        <CheckOperand
          name="signed_up"
          tone="bad"
          chips={<CheckChip>signup_started</CheckChip>}
          figures={<CheckFigure label="rows" value="—" />}
        />
        <CheckOperand
          name="activated"
          tone="ok"
          chips={<CheckChip>repo_connected</CheckChip>}
          figures={<CheckFigure label="rows" value="1,226" />}
        />
      </>
    ),
    results: <CheckResult label="Activation" value="no number" />,
  },
}

/** Heading and metric only — every other slot is optional. */
export const Minimal: Story = {
  args: { heading: 'Activation within 7 days', metric: '31.4%' },
}
