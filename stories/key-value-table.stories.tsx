import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  KeyValueTable,
  MaskedValue,
  TableNote,
  TagChip,
} from '@skene/design-system/sections/key-value-table'

/**
 * A generic two-or-more column table with per-column formatting.
 *
 * `density` is the axis: `reference` is for documentation, where rows are read;
 * `data` is for a product screen, where rows are scanned. They are not
 * interchangeable spacing values — picking the wrong one makes a docs table feel
 * like a dashboard.
 *
 * `MaskedValue` renders a secret's shape without its value. It is a display
 * component and not a security control: never pass it a real secret and rely on
 * the mask.
 */
const meta = {
  title: 'Sections/KeyValueTable',
  component: KeyValueTable,
  parameters: { layout: 'fullscreen' },
  argTypes: { density: { control: 'inline-radio', options: ['reference', 'data'] } },
} satisfies Meta<typeof KeyValueTable>

export default meta
type Story = StoryObj<typeof meta>

const columns = [
  { header: 'Property', mono: true },
  { header: 'Type', muted: true, nowrap: true },
  { header: 'Required', nowrap: true },
]

const rows = [
  { id: 'a', cells: ['cart_value', 'number', 'yes'] },
  { id: 'b', cells: ['item_count', 'number', 'yes'] },
  { id: 'c', cells: ['coupon_code', 'string', 'no'] },
]

export const Reference: Story = { args: { columns, rows, density: 'reference' } }
export const Data: Story = { args: { columns, rows, density: 'data' } }

export const WithChipsAndMask: Story = {
  args: {
    density: 'data',
    columns: [{ header: 'Key', mono: true }, { header: 'Value' }, { header: 'Scope' }],
    rows: [
      {
        id: 'k1',
        cells: [
          'SKENE_API_KEY',
          <MaskedValue prefix="sk_live_" length={24} />,
          <TagChip>api:full</TagChip>,
        ],
      },
      {
        id: 'k2',
        cells: [
          'SKENE_READ_KEY',
          <MaskedValue prefix="sk_read_" length={24} />,
          <TagChip variant="solid">read</TagChip>,
        ],
      },
    ],
  },
}

/** With a note under it. */
export const WithNote: Story = {
  render: () => (
    <div className="grid gap-3">
      <KeyValueTable columns={columns} rows={rows} density="reference" />
      <TableNote>Properties marked required fail the check when absent, not when zero.</TableNote>
    </div>
  ),
  args: { columns, rows },
}

/**
 * `headerless`: the settings readout as a semantic `<dl>` — term, then value —
 * with no header row. Column flags still apply (the first column is mono and
 * strong here); the `header` strings are authored but unrendered.
 */
export const Headerless: Story = {
  args: {
    headerless: true,
    columns: [{ header: 'Setting', strong: true }, { header: 'Value' }],
    rows: [
      { id: 'cadence', cells: ['Cadence', 'Hourly'] },
      { id: 'window', cells: ['Window', "Plan's own, else 30 days"] },
      { id: 'shape', cells: ['Query shape', 'One bounded aggregate'] },
      { id: 'sql', cells: ['SQL accepted', 'None'] },
    ],
  },
}

/** Two columns, one row — the smallest table. */
export const Minimal: Story = {
  args: {
    columns: [{ header: 'Property', mono: true }, { header: 'Type' }],
    rows: [{ id: 'x', cells: ['cart_value', 'number'] }],
  },
}
