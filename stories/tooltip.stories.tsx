import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skene/design-system/ui/tooltip'
import { Button } from '@skene/design-system/ui/button'

/**
 * A one-line label on hover or focus. It is not a place to put information the
 * reader needs — touch devices have no hover, so anything only reachable this
 * way is unreachable for them.
 *
 * `TooltipProvider` shares the open/close timing across every tooltip under it;
 * mount it once near the root rather than per tooltip.
 */
const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    children: (
      <>
        <TooltipTrigger asChild>
          <Button variant="outline">Rescan</Button>
        </TooltipTrigger>
        <TooltipContent>Re-reads the repository at its current HEAD</TooltipContent>
      </>
    ),
  },
}

/** Closed, so the trigger's own resting state is checkable. */
export const Closed: Story = { args: { ...Default.args, open: false } }

export const OnAnIconButton: Story = {
  args: {
    open: true,
    children: (
      <>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Rescan">
            ↻
          </Button>
        </TooltipTrigger>
        <TooltipContent>Rescan</TooltipContent>
      </>
    ),
  },
}
