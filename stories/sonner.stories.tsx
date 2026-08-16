import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Toaster } from '@skene/design-system/ui/sonner'
import { Button } from '@skene/design-system/ui/button'
import { toast } from 'sonner'

/**
 * The toast host. Mount it ONCE near the root — a second `Toaster` renders every
 * toast twice, which presents as "the app is firing duplicates" rather than as a
 * mounting mistake.
 *
 * This is the only component here whose interesting state cannot be rendered
 * from props: a toast is imperative. The stories fire one so there is something
 * to look at, which also means a visual diff of this file is not stable — that
 * is a property of the component, not of the story.
 */
const meta = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: { layout: 'centered' },
  argTypes: {
    position: {
      control: 'inline-radio',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    },
    richColors: { control: 'boolean' },
  },
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <Toaster {...args} />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => toast('Scan queued')}>
          Plain
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.success('14 events verified')}>
          Success
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.error('Repository unreachable')}>
          Error
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast('Merge blocked', { description: 'checkout_started lost cart_value' })}
        >
          With description
        </Button>
      </div>
    </>
  ),
}

export const RichColors: Story = { ...Default, args: { richColors: true } }
export const TopRight: Story = { ...Default, args: { position: 'top-right' } }
