import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@skene/design-system/ui/accordion'

/**
 * Radix disclosure list. `type="single"` collapses siblings; `type="multiple"`
 * leaves them open. `collapsible` is what allows the open item to close again —
 * without it a single-type accordion can never return to all-closed.
 */
const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  ['Does Skene need an SDK swap?', 'No. It reads the collection layer where it is written.'],
  ['What does the free plan scan?', 'One repository, in full.'],
  ['Where do findings live?', 'In the workspace, referenced by file and line.'],
]

const rows = items.map(([q, a], i) => (
  <AccordionItem key={q} value={`i${i}`}>
    <AccordionTrigger>{q}</AccordionTrigger>
    <AccordionContent>{a}</AccordionContent>
  </AccordionItem>
))

export const Single: Story = {
  args: { type: 'single', collapsible: true, className: 'w-[420px]', children: rows },
}

/** Not collapsible: once one is open, something is always open. */
export const SingleNotCollapsible: Story = {
  args: { type: 'single', defaultValue: 'i0', className: 'w-[420px]', children: rows },
}

export const Multiple: Story = {
  args: { type: 'multiple', className: 'w-[420px]', children: rows },
}

export const DefaultOpen: Story = {
  args: { type: 'single', collapsible: true, defaultValue: 'i1', className: 'w-[420px]', children: rows },
}
