import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@skene/design-system/ui/select'

/**
 * Radix select. It is not a native `<select>`, so it renders a listbox in a
 * portal — which is why the open stories below need room and why the closed
 * trigger is a separate story worth keeping.
 */
const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const items = (
  <SelectContent>
    <SelectItem value="main">main</SelectItem>
    <SelectItem value="release">release/184</SelectItem>
    <SelectItem value="next">next</SelectItem>
  </SelectContent>
)

export const Closed: Story = {
  args: {
    defaultValue: 'main',
    children: (
      <>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Branch" />
        </SelectTrigger>
        {items}
      </>
    ),
  },
}

export const Open: Story = { args: { ...Closed.args, open: true } }

export const Placeholder: Story = {
  args: {
    children: (
      <>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Pick a branch" />
        </SelectTrigger>
        {items}
      </>
    ),
  },
}

export const SmallTrigger: Story = {
  args: {
    defaultValue: 'main',
    children: (
      <>
        <SelectTrigger size="sm" className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        {items}
      </>
    ),
  },
}

export const Grouped: Story = {
  args: {
    open: true,
    defaultValue: 'main',
    children: (
      <>
        <SelectTrigger className="w-[240px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Long-lived</SelectLabel>
            <SelectItem value="main">main</SelectItem>
            <SelectItem value="next">next</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Releases</SelectLabel>
            <SelectItem value="release">release/184</SelectItem>
          </SelectGroup>
        </SelectContent>
      </>
    ),
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'main',
    children: (
      <>
        <SelectTrigger className="w-[240px]">
          <SelectValue />
        </SelectTrigger>
        {items}
      </>
    ),
  },
}
