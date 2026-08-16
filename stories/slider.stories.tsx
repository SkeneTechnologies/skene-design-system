import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Slider } from '@skene/design-system/ui/slider'

/**
 * Radix range control. `defaultValue` is an ARRAY — one entry per thumb — which
 * is the API detail that trips up a first use: a number renders no thumb at all.
 */
const meta = {
  title: 'UI/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    step: { control: { type: 'number' } },
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
  },
  args: { className: 'w-[320px]', min: 0, max: 100 },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = { args: { defaultValue: [40] } }
export const Range: Story = { args: { defaultValue: [25, 75] } }
export const Stepped: Story = { args: { defaultValue: [50], step: 25 } }
export const Disabled: Story = { args: { defaultValue: [40], disabled: true } }
