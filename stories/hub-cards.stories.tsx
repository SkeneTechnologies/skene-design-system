import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { BookOpen, Layers } from 'lucide-react'

import { HubCards, HubCard } from '@skene/design-system/sections/hub-cards'

/**
 * The hub grid, where every card is a whole link into a section of the site.
 *
 * Extracted from `skene-marketing-website`, where it existed twice under two
 * names that had no idea about each other: `ResourceCard` on /resources and
 * `PLGHub`'s `TopicCard` on /resources/playbooks and /product-led-growth. Their
 * grounds were byte-identical, because one was copied from the other.
 */
const meta = {
  title: 'Sections/HubCard',
  component: HubCard,
  parameters: { layout: 'centered' },
  args: {
    icon: <BookOpen className="size-5" />,
    title: 'Documentation',
    description: 'Install Skene and configure validation',
    cta: 'View documentation',
    href: '#',
  },
} satisfies Meta<typeof HubCard>

export default meta
type Story = StoryObj<typeof meta>

/** The full card: icon, heading, description, supporting lines, call to action. */
export const Full: Story = {
  args: {
    children: (
      <ul className="m-0 grid list-none gap-1 p-0">
        <li>Install: MCP server, GitHub Action, cloud API</li>
        <li>What Skene reads, and which libraries</li>
        <li>Configuration: allowlist, ignore patterns</li>
      </ul>
    ),
  },
}

/**
 * Everything but the title and the href is optional, which is how one grid
 * serves both a five-card index and a list of playbooks.
 */
export const TitleAndCtaOnly: Story = {
  args: { children: undefined, description: undefined },
}

/** No icon. The heading takes the full width when there is nothing to align to. */
export const WithoutIcon: Story = {
  args: { icon: undefined, children: undefined },
}

/** The grid, which is what a hub page actually renders. */
export const Grid: Story = {
  render: (args) => (
    <div className="w-[980px]">
      <HubCards>
        <HubCard {...args} />
        <HubCard
          {...args}
          icon={<Layers className="size-5" />}
          title="Playbooks"
          description="Audit, set up, validate, recover"
          cta="Browse playbooks"
        />
        <HubCard
          {...args}
          title="Glossary"
          description="Definitions for analytics instrumentation"
          cta="Explore glossary"
        />
      </HubCards>
    </div>
  ),
}
