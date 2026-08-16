import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { OverviewTile, OverviewTiles } from '@skene/design-system/sections/overview-tiles'

/** A row of label/value tiles. `note` is the qualifier under the number. */
const meta = {
  title: 'Sections/OverviewTiles',
  component: OverviewTiles,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof OverviewTiles>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <OverviewTile label="Events found" value="14" note="across 6 routes" />
        <OverviewTile label="Milestones bound" value="2 of 6" note="4 have nothing behind them" />
        <OverviewTile label="Last scan" value="12m ago" note="commit 4a58a52" />
      </>
    ),
  },
}

/** No notes — the tiles have to keep their baseline without them. */
export const WithoutNotes: Story = {
  args: {
    children: (
      <>
        <OverviewTile label="Events found" value="14" />
        <OverviewTile label="Milestones bound" value="2 of 6" />
        <OverviewTile label="Last scan" value="12m ago" />
      </>
    ),
  },
}

/** Two tiles, and one long value — the case where the row stops being even. */
export const TwoAndALongValue: Story = {
  args: {
    children: (
      <>
        <OverviewTile label="Workspace" value="skene_prod" note="us-east" />
        <OverviewTile label="Repository" value="SkeneTechnologies/skene-dashboard" />
      </>
    ),
  },
}
