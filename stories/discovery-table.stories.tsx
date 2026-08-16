import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { DiscoveryTable } from '@skene/design-system/sections/discovery-table'

/**
 * The discovery artifact: what Skene found, where, and whether it verified.
 *
 * `status` and `statusLabel` are separate props on purpose — the status is the
 * colour, the label is the word. A reader who cannot separate amber from red
 * gets the verdict from the label or not at all, which is why passing one
 * without the other is not supported.
 */
const meta = {
  title: 'Sections/DiscoveryTable',
  component: DiscoveryTable,
  parameters: { layout: 'fullscreen' },
  argTypes: { summaryStatus: { control: 'inline-radio', options: ['ok', 'warn', 'bad'] } },
} satisfies Meta<typeof DiscoveryTable>

export default meta
type Story = StoryObj<typeof meta>

const columns = { event: 'Event', type: 'Type', foundAt: 'Found at', status: 'Status' }

const rows = [
  {
    event: 'checkout_started',
    type: 'track',
    foundAt: 'app/(shop)/cart/page.tsx:142',
    status: 'ok' as const,
    statusLabel: 'verified',
  },
  {
    event: 'signup_started',
    type: 'track',
    foundAt: '—',
    status: 'bad' as const,
    statusLabel: 'missing',
  },
  {
    event: 'page_view',
    type: 'page',
    foundAt: 'app/layout.tsx:31',
    status: 'warn' as const,
    statusLabel: 'no properties',
  },
]

export const Mixed: Story = {
  args: {
    title: 'Discovery',
    source: 'skene_prod',
    columns,
    rows,
    summary: '1 of 3 verified',
    summaryStatus: 'warn',
  },
}

export const AllVerified: Story = {
  args: {
    ...Mixed.args,
    rows: rows.map((r) => ({ ...r, status: 'ok' as const, statusLabel: 'verified' })),
    summary: 'All verified',
    summaryStatus: 'ok',
  },
}

/** One row. Header weight against a single row is where the table looks wrong. */
export const SingleRow: Story = { args: { ...Mixed.args, rows: rows.slice(0, 1) } }

/** No header at all — title, source and summary are each optional. */
export const Bare: Story = { args: { columns, rows } }

/** A long path, which is the cell that decides the column widths. */
export const LongPath: Story = {
  args: {
    ...Mixed.args,
    rows: [
      {
        ...rows[0],
        foundAt: 'apps/dashboard/app/(workspace)/[slug]/journeys/[id]/edit/page.tsx:1284',
      },
    ],
  },
}
