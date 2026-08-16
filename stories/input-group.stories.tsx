import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@skene/design-system/ui/input-group'

/**
 * An input with addons welded to it. `InputGroupAddon`'s `align` decides which
 * side, and `inline-*` places the addon INSIDE the field's border rather than
 * butted against it — the difference between a prefix and a trailing button.
 */
const meta = {
  title: 'UI/InputGroup',
  component: InputGroup,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Prefix: Story = {
  args: {
    className: 'w-[360px]',
    children: (
      <>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </>
    ),
  },
}

export const TrailingButton: Story = {
  args: {
    className: 'w-[360px]',
    children: (
      <>
        <InputGroupInput placeholder="Search events" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm">Search</InputGroupButton>
        </InputGroupAddon>
      </>
    ),
  },
}

export const BothSides: Story = {
  args: {
    className: 'w-[360px]',
    children: (
      <>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="249" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>/mo</InputGroupText>
        </InputGroupAddon>
      </>
    ),
  },
}

export const WithTextarea: Story = {
  args: {
    className: 'w-[360px]',
    children: (
      <>
        <InputGroupTextarea placeholder="Why should this check exist?" />
        <InputGroupAddon align="block-end">
          <InputGroupButton size="sm">Save</InputGroupButton>
        </InputGroupAddon>
      </>
    ),
  },
}
