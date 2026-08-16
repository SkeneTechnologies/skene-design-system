import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { IntegrationRows } from '@skene/design-system/sections/integration-rows'

/** One row per connected surface, with a status and an optional aside. */
const meta = {
  title: 'Sections/IntegrationRows',
  component: IntegrationRows,
  parameters: { layout: 'fullscreen' },
  argTypes: { summaryStatus: { control: 'inline-radio', options: ['ok', 'warn', 'bad'] } },
} satisfies Meta<typeof IntegrationRows>

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  { id: 'gh', name: 'GitHub App', note: 'SkeneTechnologies/skene-dashboard', status: 'ok' as const, statusLabel: 'connected' },
  { id: 'mcp', name: 'MCP server', note: 'POST /api/mcp', status: 'ok' as const, statusLabel: 'authenticated' },
  { id: 'cli', name: 'Command line', note: 'npx skene analyze', status: 'warn' as const, statusLabel: 'never run' },
]

export const Default: Story = {
  args: {
    title: 'Surfaces',
    source: 'skene_prod',
    rows,
    summary: '2 of 3 active',
    summaryStatus: 'warn',
  },
}

export const AllConnected: Story = {
  args: {
    ...Default.args,
    rows: rows.map((r) => ({ ...r, status: 'ok' as const, statusLabel: 'connected' })),
    summary: 'All connected',
    summaryStatus: 'ok',
  },
}

/** With asides — the right-hand slot each row can carry. */
export const WithAsides: Story = {
  args: {
    ...Default.args,
    rows: rows.map((r) => ({ ...r, aside: <span className="font-mono text-[11px]">12m ago</span> })),
  },
}

/** No notes and no statuses — names only. */
export const NamesOnly: Story = {
  args: { rows: rows.map(({ id, name }) => ({ id, name })) },
}
