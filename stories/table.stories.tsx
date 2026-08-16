import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@skene/design-system/ui/table'

/**
 * The semantic product table — a real `<table>`, unlike `DataTable` in
 * `artifact-shell`, which is a drawn artifact and not tabular data.
 *
 * `TableCaption` is worth using rather than a heading above the table: it is
 * announced as the table's own name, so a screen reader landing mid-page knows
 * what it is inside.
 */
const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  ['checkout_started', 'app/(shop)/cart/page.tsx', 'Verified'],
  ['signup_started', 'app/(auth)/signup/page.tsx', 'Missing'],
  ['repo_connected', 'app/api/github/route.ts', 'Verified'],
]

export const Default: Story = {
  args: {
    className: 'w-[620px]',
    children: (
      <>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Found at</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([e, f, s]) => (
            <TableRow key={e}>
              <TableCell className="font-mono">{e}</TableCell>
              <TableCell className="text-muted-foreground">{f}</TableCell>
              <TableCell className="text-right">{s}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    ),
  },
}

export const WithCaptionAndFooter: Story = {
  args: {
    className: 'w-[620px]',
    children: (
      <>
        <TableCaption>Events found in the last scan.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Found at</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([e, f, s]) => (
            <TableRow key={e}>
              <TableCell className="font-mono">{e}</TableCell>
              <TableCell className="text-muted-foreground">{f}</TableCell>
              <TableCell className="text-right">{s}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">3</TableCell>
          </TableRow>
        </TableFooter>
      </>
    ),
  },
}

/** One row. Header and body spacing has to hold at the smallest size. */
export const SingleRow: Story = {
  args: {
    className: 'w-[620px]',
    children: (
      <>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-mono">checkout_started</TableCell>
            <TableCell className="text-right">Verified</TableCell>
          </TableRow>
        </TableBody>
      </>
    ),
  },
}
