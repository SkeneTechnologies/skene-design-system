import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  ComparisonRow,
  ComparisonTable,
  TableCheck,
  TableDash,
} from '@skene/design-system/sections/comparison-table'

/**
 * `ComparisonTable` — the plan matrix. Scrolls horizontally below the width
 * where three columns fit.
 *
 * `TableCheck` / `TableDash` are the cell markers. Each pairs a glyph with an
 * `sr-only` label, because a bare ✓ reads as nothing to a screen reader and as
 * nothing to an agent parsing the page.
 */
const meta = {
  title: 'Sections/ComparisonTable',
  component: ComparisonTable,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onLight: { control: 'boolean' },
    featuredIndex: { control: { type: 'number', min: 0, max: 2 } },
  },
} satisfies Meta<typeof ComparisonTable>

export default meta
type Story = StoryObj<typeof meta>

const rows = (
  <>
    <ComparisonRow header="Repositories" cells={['One', 'Unlimited', 'Unlimited']} />
    <ComparisonRow header="Scan on demand" cells={[<TableCheck />, <TableCheck />, <TableCheck />]} />
    <ComparisonRow header="Checks on every pull request" cells={[<TableDash />, <TableCheck />, <TableCheck />]} />
    <ComparisonRow header="MCP server" cells={[<TableDash />, <TableCheck />, <TableCheck />]} />
    <ComparisonRow header="SSO and SCIM" cells={[<TableDash />, <TableDash />, <TableCheck />]} />
    <ComparisonRow header="Data residency" cells={[<TableDash />, <TableDash />, <TableCheck />]} />
  </>
)

export const Default: Story = {
  args: {
    columns: ['Free', 'Pro', 'Enterprise'],
    featuredIndex: 1,
    caption: 'What each plan includes.',
    children: rows,
  },
}

export const OnLight: Story = {
  args: { ...Default.args, onLight: true },
  parameters: { docs: { description: { story: 'Inside a cream panel.' } } },
}

/**
 * Narrow. This is the width that produced a 320px sideways scroll of the whole
 * PAGE, not of the table.
 *
 * The cause was `TableCheck`'s `sr-only` span. `sr-only` is
 * `position:absolute`, so it resolves against the nearest POSITIONED ancestor —
 * and the scroll container had no `position`, so the label escaped it and
 * widened the document. The fix was `relative` on `ComparisonTable`, which
 * costs nothing and pins every marker label inside the scroller.
 *
 * The story is here because that bug is invisible in a screenshot of the table
 * alone; it only shows as document width, which is exactly what a narrow story
 * makes checkable.
 */
export const Narrow390: Story = {
  name: 'At 390 (overflow regression)',
  args: Default.args,
  globals: { viewport: { value: 'mobile1' } },
  decorators: [
    (Story) => (
      <div className="w-[390px] overflow-x-hidden border border-chrome-surface-border">
        <Story />
      </div>
    ),
  ],
}
