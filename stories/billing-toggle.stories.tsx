import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { BillingToggle } from '@skene/design-system/sections/billing-toggle'

/**
 * The monthly/yearly switch, and the only `'use client'` file in the pricing
 * section.
 *
 * It is a separate module for a structural reason rather than a visual one:
 * putting the directive in `plan-card.tsx` would drag the whole pure-markup card
 * across the client boundary. The interactivity is quarantined here on purpose
 * (sections.md rule 4).
 *
 * Both word labels are clickable, not just the 40px track — the words are the
 * obvious target, and a switch whose label does nothing is a switch people miss.
 * It is fully controlled: `yearly` in, `onChange` out.
 */
const meta = {
  title: 'Sections/BillingToggle',
  component: BillingToggle,
  parameters: { layout: 'centered' },
  argTypes: { yearly: { control: 'boolean' } },
} satisfies Meta<typeof BillingToggle>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(props: Partial<React.ComponentProps<typeof BillingToggle>>) {
  const [yearly, setYearly] = React.useState(props.yearly ?? false)
  return <BillingToggle {...props} yearly={yearly} onChange={setYearly} />
}

export const Monthly: Story = {
  args: { yearly: false, onChange: () => {} },
  render: () => <Controlled yearly={false} />,
}

export const Yearly: Story = {
  args: { yearly: true, onChange: () => {} },
  render: () => <Controlled yearly />,
}

/** Custom labels — the yearly side usually carries the saving. */
export const WithSavingLabel: Story = {
  args: { yearly: false, onChange: () => {} },
  render: () => (
    <Controlled yearly={false} monthlyLabel="Monthly" yearlyLabel="Annual · save 20%" />
  ),
}

/** Both states side by side, static, so the track geometry is comparable. */
export const BothStates: Story = {
  args: { yearly: false, onChange: () => {} },
  render: () => (
    <div className="grid gap-4">
      <BillingToggle yearly={false} onChange={() => {}} />
      <BillingToggle yearly onChange={() => {}} />
    </div>
  ),
}

/** On cream, which is where the pricing band actually sits. */
export const OnLight: Story = {
  args: { yearly: false, onChange: () => {} },
  render: () => (
    <div className="light rounded-xl bg-brand-light p-8">
      <Controlled yearly={false} />
    </div>
  ),
}
