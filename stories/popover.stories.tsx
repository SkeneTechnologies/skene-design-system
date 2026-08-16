import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@skene/design-system/ui/popover'
import { Button } from '@skene/design-system/ui/button'
import { Input } from '@skene/design-system/ui/input'
import { Label } from '@skene/design-system/ui/label'

/**
 * A floating panel anchored to a trigger. Unlike `Tooltip` it takes focus and
 * can hold controls, and unlike `Dialog` it does not trap it — so a popover is
 * for a small optional adjustment, not for a task that must be finished.
 *
 * Stories are `open` by default: a closed floating panel screenshots as its
 * trigger, which is not the thing under review.
 */
const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    children: (
      <>
        <PopoverTrigger asChild>
          <Button variant="outline">Filter</Button>
        </PopoverTrigger>
        <PopoverContent className="grid w-[280px] gap-3">
          <Label htmlFor="q">Event name contains</Label>
          <Input id="q" placeholder="checkout" />
          <Button size="sm">Apply</Button>
        </PopoverContent>
      </>
    ),
  },
}

export const Closed: Story = { args: { ...Default.args, open: false } }

export const TextOnly: Story = {
  args: {
    open: true,
    children: (
      <>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            What is a milestone?
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] text-muted-foreground">
          A named step in a journey. It is bound to one event, or to nothing — and
          "bound to nothing" is the state worth seeing.
        </PopoverContent>
      </>
    ),
  },
}
