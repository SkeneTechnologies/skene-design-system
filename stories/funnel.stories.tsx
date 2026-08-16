import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Funnel, FunnelRow } from '@skene/design-system/sections/funnel'

/**
 * The funnel artifact. `state` is the point of it: `broken` draws a hatch rather
 * than a bar, because a step that is not measured is not a step with a low
 * number — it is a step with no number, and a short bar would be a lie.
 */
const meta = {
  title: 'Sections/Funnel',
  component: Funnel,
  parameters: { layout: 'centered' },
  argTypes: { status: { control: 'inline-radio', options: ['ok', 'broken', 'unknown'] } },
} satisfies Meta<typeof Funnel>

export default meta
type Story = StoryObj<typeof meta>

export const Broken: Story = {
  args: {
    className: 'w-[520px]',
    title: 'Activation',
    badge: 'Last 28 days',
    meta: 'skene_prod',
    status: 'broken',
    children: (
      <>
        <FunnelRow label="Landing viewed" value="12,481" state="ok" fill={100} />
        <FunnelRow label="Signup started" note="no event bound" state="broken" />
        <FunnelRow label="Repository connected" value="1,204" state="ok" fill={31} />
        <FunnelRow label="First scan" value="—" state="unknown" />
      </>
    ),
  },
}

export const Healthy: Story = {
  args: {
    ...Broken.args,
    status: 'ok',
    children: (
      <>
        <FunnelRow label="Landing viewed" value="12,481" state="ok" fill={100} />
        <FunnelRow label="Signup started" value="3,902" state="ok" fill={64} />
        <FunnelRow label="Repository connected" value="1,204" state="ok" fill={31} />
        <FunnelRow label="First scan" value="988" state="ok" fill={24} />
      </>
    ),
  },
}

/** Every state in one frame, which is how you check the hatch reads as absence. */
export const AllStates: Story = {
  args: {
    className: 'w-[520px]',
    title: 'States',
    children: (
      <>
        <FunnelRow label="ok" value="12,481" state="ok" fill={100} />
        <FunnelRow label="broken" note="no event bound" state="broken" />
        <FunnelRow label="unknown" value="—" state="unknown" />
      </>
    ),
  },
}

/** No rows. The header has to stand on its own. */
export const Empty: Story = {
  args: { className: 'w-[520px]', title: 'Activation', meta: 'nothing measured yet' },
}
