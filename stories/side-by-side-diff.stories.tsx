import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { DiffColumn, SideBySideDiff } from '@skene/design-system/sections/side-by-side-diff'

/**
 * Before and after, side by side.
 *
 * `addedLabel` / `removedLabel` are not decoration: added and removed lines are
 * distinguished by a red/green wash, which is the single most common way to
 * make a diff unreadable for a colour-blind reader. The labels are what make
 * each line's kind available without the colour, and they default to something
 * rather than nothing for that reason.
 */
const meta = {
  title: 'Sections/SideBySideDiff',
  component: SideBySideDiff,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SideBySideDiff>

export default meta
type Story = StoryObj<typeof meta>

const before = [
  { kind: 'ctx' as const, text: 'track("checkout_started", {' },
  { kind: 'del' as const, text: '  cart_value: total,' },
  { kind: 'ctx' as const, text: '  item_count: items.length,' },
  { kind: 'ctx' as const, text: '})' },
]

const after = [
  { kind: 'ctx' as const, text: 'track("checkout_started", {' },
  { kind: 'add' as const, text: '  value: total,' },
  { kind: 'ctx' as const, text: '  item_count: items.length,' },
  { kind: 'ctx' as const, text: '})' },
]

export const Default: Story = {
  args: {
    children: (
      <>
        <DiffColumn side="before" label="main" lines={before} />
        <DiffColumn side="after" label="this pull request" lines={after} />
      </>
    ),
  },
}

/** Context only — no change on either side. */
export const NoChanges: Story = {
  args: {
    children: (
      <>
        <DiffColumn side="before" label="main" lines={before.map((l) => ({ ...l, kind: 'ctx' as const }))} />
        <DiffColumn side="after" label="this pull request" lines={before.map((l) => ({ ...l, kind: 'ctx' as const }))} />
      </>
    ),
  },
}

/** Every line changed, which is where the wash gets loudest. */
export const FullyRewritten: Story = {
  args: {
    children: (
      <>
        <DiffColumn side="before" label="main" lines={before.map((l) => ({ ...l, kind: 'del' as const }))} />
        <DiffColumn side="after" label="this pull request" lines={after.map((l) => ({ ...l, kind: 'add' as const }))} />
      </>
    ),
  },
}
