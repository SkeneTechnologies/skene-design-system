import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Checkbox } from '@skene/design-system/ui/checkbox'
import { Label } from '@skene/design-system/ui/label'

/**
 * Radix checkbox. It is not an `<input>`, so a bare `<label for>` will not bind
 * to it — pair it with `Label htmlFor` and an `id`, which is what Radix's own
 * accessible name relies on.
 */
const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  argTypes: { disabled: { control: 'boolean' }, checked: { control: 'boolean' } },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = { args: {} }
export const Checked: Story = { args: { defaultChecked: true } }
export const Indeterminate: Story = { args: { checked: 'indeterminate' } }
export const Disabled: Story = { args: { disabled: true } }
export const DisabledChecked: Story = { args: { disabled: true, checked: true } }

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="pr-comment" defaultChecked />
      <Label htmlFor="pr-comment">Comment on every pull request</Label>
    </div>
  ),
}
