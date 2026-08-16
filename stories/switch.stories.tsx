import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Switch } from '@skene/design-system/ui/switch'
import { Label } from '@skene/design-system/ui/label'

/**
 * The instant on/off control. A switch takes effect immediately; if the change
 * needs a save step, it is a checkbox, not this.
 */
const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  argTypes: { disabled: { control: 'boolean' }, checked: { control: 'boolean' } },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Off: Story = { args: {} }
export const On: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }
export const DisabledOn: Story = { args: { disabled: true, checked: true } }

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="merge-block" defaultChecked />
      <Label htmlFor="merge-block">Block the merge on a failing check</Label>
    </div>
  ),
}
