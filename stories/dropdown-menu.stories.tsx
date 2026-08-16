import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@skene/design-system/ui/dropdown-menu'
import { Button } from '@skene/design-system/ui/button'

/**
 * A menu hung off a trigger. Every item kind has a story because they are not
 * interchangeable: `Item` acts, `CheckboxItem` toggles independently,
 * `RadioItem` picks one of a set, and mixing them without labels leaves a reader
 * guessing which is which.
 */
const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

const trigger = (
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Workspace</Button>
  </DropdownMenuTrigger>
)

export const Actions: Story = {
  args: {
    open: true,
    children: (
      <>
        {trigger}
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>skene_prod</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Rescan<DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          {/* No `variant` prop on this package's DropdownMenuItem — upstream
              shadcn has one, this build does not. A destructive item styles
              itself at the call site. */}
          <DropdownMenuItem className="text-destructive">Remove workspace</DropdownMenuItem>
        </DropdownMenuContent>
      </>
    ),
  },
}

export const Checkboxes: Story = {
  args: {
    open: true,
    children: (
      <>
        {trigger}
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Show</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Verified events</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Missing milestones</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Skipped routes</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </>
    ),
  },
}

export const RadioGroup: Story = {
  args: {
    open: true,
    children: (
      <>
        {trigger}
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Branch</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="main">
            <DropdownMenuRadioItem value="main">main</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="next">next</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </>
    ),
  },
}

export const WithSubmenu: Story = {
  args: {
    open: true,
    children: (
      <>
        {trigger}
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Rescan</DropdownMenuItem>
          <DropdownMenuSub open>
            <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>JSON</DropdownMenuItem>
              <DropdownMenuItem>CSV</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </>
    ),
  },
}

export const Closed: Story = { args: { open: false, children: <>{trigger}</> } }
