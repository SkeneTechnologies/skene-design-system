import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Input } from '@skene/design-system/ui/input'
import { Label } from '@skene/design-system/ui/label'

/** The single-line text field. */
const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    type: { control: 'inline-radio', options: ['text', 'email', 'password', 'search', 'file'] },
  },
  args: { placeholder: 'events_tracked', className: 'w-[320px]' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 'checkout_started' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Locked' } }
export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: 'not an event name' } }
export const TypeFile: Story = { args: { type: 'file' } }

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="event">Event name</Label>
      <Input id="event" placeholder="events_tracked" />
    </div>
  ),
}
