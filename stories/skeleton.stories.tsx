import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Skeleton } from '@skene/design-system/ui/skeleton'

/**
 * A loading placeholder. It has no intrinsic size — it is a shape you give a
 * width and a height to, which is why every story here is a composition rather
 * than a prop change.
 */
const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Line: Story = { args: { className: 'h-4 w-[280px]' } }
export const Block: Story = { args: { className: 'h-[120px] w-[280px]' } }
export const Circle: Story = { args: { className: 'size-10 rounded-full' } }

/** A card's loading state — the shape it actually ships in. */
export const CardPlaceholder: Story = {
  render: () => (
    <div className="w-[320px] rounded-xl border border-border p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-[80px] w-full" />
    </div>
  ),
}
