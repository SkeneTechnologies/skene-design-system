import type { Meta, StoryObj } from '@storybook/react-vite'

import { CardAnimationIntegrations } from '@skene/design-system/sections/card-animation-integrations'

/** Four integration cards cycling detail copy on a textured field. */
const meta = {
  title: 'Sections/CardAnimationIntegrations',
  component: CardAnimationIntegrations,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CardAnimationIntegrations>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-[520px]">
      <CardAnimationIntegrations {...args} />
    </div>
  ),
}

export const Narrow: Story = {
  render: (args) => (
    <div className="w-[320px]">
      <CardAnimationIntegrations {...args} />
    </div>
  ),
}
