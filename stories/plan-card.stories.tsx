import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { PlanCard, PlanGrid } from '@skene/design-system/sections/plan-card'
import { Button } from '@skene/design-system/ui/button'

/**
 * `PlanCard` — one pricing tier. `PlanGrid` lays a row of them out.
 *
 * Prices here are the real ones and are canon-governed: Free $0, Pro $249,
 * Enterprise "Contact us" (`company/gtm.md`). A story is a place a wrong price
 * gets copied from, so it carries the right ones.
 */
const meta = {
  title: 'Sections/PlanCard',
  component: PlanCard,
  parameters: { layout: 'centered' },
  argTypes: { featured: { control: 'boolean' } },
} satisfies Meta<typeof PlanCard>

export default meta
type Story = StoryObj<typeof meta>

const bullets = (items: string[]) => (
  <ul className="m-0 grid list-none gap-[8px] p-0">
    {items.map((t) => (
      <li key={t} className="grid grid-cols-[auto_1fr] gap-[8px]">
        <span aria-hidden className="text-brand-peach">
          ✓
        </span>
        <span>{t}</span>
      </li>
    ))}
  </ul>
)

export const Free: Story = {
  args: {
    tier: 'Free',
    price: '$0',
    unit: 'forever',
    summary: 'Scan one repository and see what your collection layer is missing.',
    features: bullets(['One workspace', 'Full scan of one repository', 'Findings you can export']),
    action: (
      <Button variant="outline" className="w-full">
        Start free
      </Button>
    ),
  },
}

export const ProFeatured: Story = {
  args: {
    tier: 'Pro',
    flag: 'Most teams',
    price: '$249',
    unit: 'per month',
    summary: 'Continuous checks across every repository the product ships from.',
    features: bullets([
      'Unlimited repositories',
      'Checks on every pull request',
      'MCP server and CLI',
      'Journey and milestone tracking',
    ]),
    bestFor: { label: 'Best for', value: 'Teams shipping weekly' },
    action: <Button className="w-full">Start Pro</Button>,
    featured: true,
  },
}

export const Enterprise: Story = {
  args: {
    tier: 'Enterprise',
    price: 'Contact us',
    summary: 'Single sign-on, data residency and a named contact.',
    features: bullets(['Everything in Pro', 'SSO and SCIM', 'Data residency', 'Named contact']),
    action: (
      <Button variant="outline" className="w-full">
        Talk to us
      </Button>
    ),
    footnote: 'Priced per workspace.',
  },
}

/**
 * The row, which is how it actually ships — middle card featured.
 */
export const Grid: Story = {
  render: () => (
    <PlanGrid>
      <PlanCard {...(Free.args as React.ComponentProps<typeof PlanCard>)} />
      <PlanCard {...(ProFeatured.args as React.ComponentProps<typeof PlanCard>)} />
      <PlanCard {...(Enterprise.args as React.ComponentProps<typeof PlanCard>)} />
    </PlanGrid>
  ),
  args: Free.args,
  parameters: { layout: 'fullscreen' },
}

/**
 * The defect story. `features` given as a bare string instead of an element.
 *
 * This scored 1.13:1 in production. The mechanism is worth knowing because it
 * generalises to every slot in this library: a bare text node has no element of
 * its own, so it inherits the CARD's colour rather than the features block's,
 * and a pixel harness attributes the reading to the whole card. It rendered
 * near-invisible and the fix was one `<p>`.
 *
 * Every `React.ReactNode` slot in this package has this failure mode. Pass an
 * element.
 */
export const FeaturesAsBareText: Story = {
  name: 'features as bare text (defect)',
  args: {
    ...ProFeatured.args,
    features: 'Unlimited repositories, checks on every pull request, MCP server and CLI.',
  },
}
