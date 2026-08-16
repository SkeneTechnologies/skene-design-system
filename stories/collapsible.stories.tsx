import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@skene/design-system/ui/collapsible'
import { Button } from '@skene/design-system/ui/button'

/**
 * Show/hide for one region. Unlike `Accordion` there is no set and no exclusivity —
 * reach for this when a single block folds, and for `Accordion` when several do
 * and only one should be open.
 */
const meta = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

const body = (
  <CollapsibleContent className="mt-2 grid gap-2">
    <div className="rounded-md border border-border p-3 font-mono text-[12px]">page_view</div>
    <div className="rounded-md border border-border p-3 font-mono text-[12px]">signup_started</div>
    <div className="rounded-md border border-border p-3 font-mono text-[12px]">repo_connected</div>
  </CollapsibleContent>
)

export const Closed: Story = {
  args: {
    className: 'w-[380px]',
    children: (
      <>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm">
            3 bound events
          </Button>
        </CollapsibleTrigger>
        {body}
      </>
    ),
  },
}

export const OpenByDefault: Story = { args: { ...Closed.args, defaultOpen: true } }

export const DisabledClosed: Story = { args: { ...Closed.args, disabled: true } }
