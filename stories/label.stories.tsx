import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Input } from '@skene/design-system/ui/input'
import { Label } from '@skene/design-system/ui/label'
import { Checkbox } from '@skene/design-system/ui/checkbox'

/**
 * The form label. `htmlFor` is not decoration on this one: several controls in
 * this package are Radix primitives rather than real inputs, and the `id` pairing
 * is the only thing giving them an accessible name.
 */
const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: { layout: 'centered' },
  args: { children: 'Event name' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithInput: Story = {
  render: () => (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="a">Event name</Label>
      <Input id="a" placeholder="events_tracked" />
    </div>
  ),
}

/** Beside a Radix control, where the pairing is load-bearing. */
export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="b" />
      <Label htmlFor="b">Block the merge on a failing check</Label>
    </div>
  ),
}

/** Inside a disabled group — the label dims with its control. */
export const Disabled: Story = {
  render: () => (
    <div className="group grid w-[320px] gap-2" data-disabled>
      <Label htmlFor="c">Workspace</Label>
      <Input id="c" disabled defaultValue="skene_prod" />
    </div>
  ),
}
