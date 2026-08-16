import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@skene/design-system/ui/sheet'
import { Button } from '@skene/design-system/ui/button'

/**
 * A panel that slides in from an edge. `side` is `"right"` (default) or
 * `"left"` — this package does not implement top or bottom, unlike upstream
 * shadcn, so a horizontal sheet is a package change rather than a prop.
 */
const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

const body = (side: 'right' | 'left') => (
  <>
    <SheetTrigger asChild>
      <Button variant="outline">Open {side}</Button>
    </SheetTrigger>
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle>Scan detail</SheetTitle>
      </SheetHeader>
      <div className="grid gap-2 p-4 text-muted-foreground">
        <p>14 events found, 3 milestones unbound.</p>
        <SheetClose asChild>
          <Button size="sm" variant="outline">
            Close
          </Button>
        </SheetClose>
      </div>
    </SheetContent>
  </>
)

export const Right: Story = { args: { open: true, children: body('right') } }
export const Left: Story = { args: { open: true, children: body('left') } }
export const Closed: Story = { args: { open: false, children: body('right') } }
