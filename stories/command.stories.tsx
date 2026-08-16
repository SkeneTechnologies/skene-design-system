import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@skene/design-system/ui/command'

/**
 * cmdk palette: a searchable list with groups and shortcuts. It filters on the
 * items' text content, so an item whose label is an icon and nothing else is
 * unfindable — give every item words.
 */
const meta = {
  title: 'UI/Command',
  component: Command,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: 'w-[420px] rounded-md border',
    children: (
      <>
        <CommandInput placeholder="Search events…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Events">
            <CommandItem>
              events_tracked
              <CommandShortcut>⌘1</CommandShortcut>
            </CommandItem>
            <CommandItem>checkout_started</CommandItem>
            <CommandItem>signup_started</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem>Rescan this repository</CommandItem>
            <CommandItem>Open the journey map</CommandItem>
          </CommandGroup>
        </CommandList>
      </>
    ),
  },
}

/** The empty state, which is otherwise only reachable by typing. */
export const NoResults: Story = {
  args: {
    className: 'w-[420px] rounded-md border',
    children: (
      <>
        <CommandInput placeholder="Search events…" value="zzz" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Events">
            <CommandItem>checkout_started</CommandItem>
          </CommandGroup>
        </CommandList>
      </>
    ),
  },
}

/** One group, no shortcuts — the smallest useful palette. */
export const Minimal: Story = {
  args: {
    className: 'w-[420px] rounded-md border',
    children: (
      <>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup>
            <CommandItem>Rescan</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </>
    ),
  },
}
