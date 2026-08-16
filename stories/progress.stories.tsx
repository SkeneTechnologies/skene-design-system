import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Progress } from '@skene/design-system/ui/progress'

/** Determinate bar with the brand gradient indicator. */
const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: { layout: 'centered' },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100, step: 1 } } },
  args: { className: 'w-[320px]' },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { value: 0 } }
export const Partial: Story = { args: { value: 42 } }
export const Full: Story = { args: { value: 100 } }

/** The gradient only reads at width. Four values in one frame. */
export const Scale: Story = {
  render: () => (
    <div className="grid w-[320px] gap-3">
      {[8, 33, 67, 100].map((v) => (
        <div key={v} className="grid gap-1">
          <Progress value={v} />
          <span className="font-mono text-[11px] text-chrome-text-muted">{v}%</span>
        </div>
      ))}
    </div>
  ),
}
