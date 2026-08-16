import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@skene/design-system/ui/hover-card'

/**
 * Preview on hover, no click. Hover-only means touch cannot reach it, so
 * everything in here must be a preview of something also available another way.
 */
const meta = {
  title: 'UI/HoverCard',
  component: HoverCard,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    children: (
      <>
        <HoverCardTrigger asChild>
          <a href="#" className="font-mono underline underline-offset-4">
            checkout_started
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-[300px]">
          <p className="font-mono text-[12px]">app/(shop)/cart/page.tsx:142</p>
          <p className="mt-2 text-muted-foreground">
            Fires on submit. Carries <code>cart_value</code> and <code>item_count</code>.
          </p>
        </HoverCardContent>
      </>
    ),
  },
}

export const Closed: Story = { args: { ...Default.args, open: false } }
