import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { RecommendationCard } from '@skene/design-system/sections/recommendation-card'

/** A single suggested action, with an optional eyebrow and a meta line under it. */
const meta = {
  title: 'Sections/RecommendationCard',
  component: RecommendationCard,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RecommendationCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    eyebrow: 'Recommended',
    title: 'Bind signup_started before the next release.',
    children:
      'Four funnels start at this step and all four are missing their second point, so every activation number below it is understated.',
    meta: 'app/(auth)/signup/page.tsx:88',
    className: 'w-[460px]',
  },
}

export const NoEyebrow: Story = { args: { ...Default.args, eyebrow: undefined } }
export const NoMeta: Story = { args: { ...Default.args, meta: undefined } }

/** Title only. Everything else is optional and the padding has to survive it. */
export const TitleOnly: Story = {
  args: { title: 'Bind signup_started before the next release.', className: 'w-[460px]' },
}
