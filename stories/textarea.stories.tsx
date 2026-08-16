import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Textarea } from '@skene/design-system/ui/textarea'
import { Label } from '@skene/design-system/ui/label'

/** The multi-line field. */
const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  argTypes: { disabled: { control: 'boolean' }, rows: { control: { type: 'number' } } },
  args: { className: 'w-[380px]', placeholder: 'What should this check assert?' },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = {
  args: {
    defaultValue:
      'Assert that checkout_started carries a cart_value property, and fail the check when it is absent rather than when it is zero.',
  },
}
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Locked' } }
export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: 'too short' } }
export const Tall: Story = { args: { rows: 8 } }

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-[380px] gap-2">
      <Label htmlFor="assert">Assertion</Label>
      <Textarea id="assert" placeholder="What should this check assert?" />
    </div>
  ),
}
