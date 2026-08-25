import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { TeamCard, TeamGrid } from '@skene/design-system/sections/team-card'

/**
 * `TeamCard` + `TeamGrid` — the about-page person card. Cards are `<li>`s and
 * the grid is the `<ul>`, so single-card stories still wrap one in the grid:
 * a free-floating `<li>` is the invalid nesting `stories:render` exists to
 * catch. The no-media state is first because the card is designed for it.
 */
const meta = {
  title: 'Sections/TeamCard',
  component: TeamCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TeamCard>

export default meta
type Story = StoryObj<typeof meta>

/** The card as designed: no photo, and finished without one. */
export const Default: Story = {
  args: {
    name: 'Teemu Kinos',
    role: 'Founder',
    children: <p>Runs the company and most of the pipeline behind it.</p>,
  },
  render: (args) => (
    <TeamGrid className="max-w-[320px] sm:grid-cols-1 lg:grid-cols-1">
      <TeamCard {...args} />
    </TeamGrid>
  ),
}

/** With a media slot. A neutral block stands in — no stock portrait. */
export const WithMedia: Story = {
  args: {
    name: 'Teemu Kinos',
    role: 'Founder',
    media: <div aria-hidden className="grid place-items-center text-[32px] text-text-muted">◆</div>,
    children: <p>Runs the company and most of the pipeline behind it.</p>,
  },
  render: (args) => (
    <TeamGrid className="max-w-[320px] sm:grid-cols-1 lg:grid-cols-1">
      <TeamCard {...args} />
    </TeamGrid>
  ),
}

/**
 * `TeamGrid` with mixed cards — some with media, some without, one with a
 * link row. The mix is the case that matters: the grid must hold its shape
 * when only some people have photos.
 */
export const Grid: Story = {
  args: { name: 'Teemu Kinos', role: 'Founder' },
  render: () => (
    <TeamGrid>
      <TeamCard
        name="Teemu Kinos"
        role="Founder"
        media={<div aria-hidden className="grid place-items-center text-[32px] text-text-muted">◆</div>}
      >
        <p>Runs the company and most of the pipeline behind it.</p>
      </TeamCard>
      <TeamCard name="Second Person" role="Engineering">
        <p>
          Owns the collection layer. <a href="#">GitHub</a>
        </p>
      </TeamCard>
      <TeamCard name="Third Person" role="Design" />
    </TeamGrid>
  ),
}

/**
 * On cream. `border`/`bg-card` and the `text.*` roles are all mode-aware, so
 * switch the theme toolbar and both grounds should stay legible.
 */
export const OnLight: Story = {
  args: { name: 'Teemu Kinos', role: 'Founder' },
  render: (args) => (
    <div className="light rounded-xl bg-brand-light p-8">
      <TeamGrid className="sm:grid-cols-2 lg:grid-cols-2">
        <TeamCard {...args}>
          <p>Runs the company and most of the pipeline behind it.</p>
        </TeamCard>
        <TeamCard name="Second Person" role="Engineering" />
      </TeamGrid>
    </div>
  ),
}
