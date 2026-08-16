import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Badge } from '@skene/design-system/ui/badge'

/** The product surface's status marker. Four variants, no sizes. */
const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
  args: { children: 'Verified' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Secondary: Story = { args: { variant: 'secondary', children: 'Draft' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Failing' } }
export const Outline: Story = { args: { variant: 'outline', children: 'Unbound' } }

const VARIANTS = ['default', 'secondary', 'destructive', 'outline'] as const

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {VARIANTS.map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
}

/** On cream. `outline` is the one that depends on a mode-aware border. */
export const OnLight: Story = {
  render: () => (
    <div className="light rounded-xl bg-brand-light p-6">
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </div>
    </div>
  ),
}
