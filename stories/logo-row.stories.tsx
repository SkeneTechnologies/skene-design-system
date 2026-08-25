import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { LogoRow, LogoSlot } from '@skene/design-system/sections/logo-row'

/**
 * `LogoRow` — the proof strip. The default story is the SHIPPING state: five
 * empty slots and the caption that explains them. That is not a fixture
 * waiting for art — no fabricated customer mark ever goes in a slot, in a
 * story or anywhere else; see the component's file header. The filled story
 * uses an unbranded wordmark placeholder for exactly that reason.
 */
const meta = {
  title: 'Sections/LogoRow',
  component: LogoRow,
  parameters: { layout: 'padded' },
  argTypes: {
    count: { control: { type: 'range', min: 2, max: 8, step: 1 } },
  },
} satisfies Meta<typeof LogoRow>

export default meta
type Story = StoryObj<typeof meta>

/** The strip as roughly fifteen wireframes ship it: all slots empty. */
export const Default: Story = {
  args: {
    title: 'Nothing here is invented.',
    stat: (
      <>
        <strong>10 paying teams</strong> already run continuous monitoring on real releases.{' '}
        <strong>$2,000 MRR</strong>, no account named individually.
      </>
    ),
    caption: 'These slots stay empty until an account agrees to be named on-site.',
  },
}

/** No heading or stat — just the row and its caption, for mid-page use. */
export const RowOnly: Story = {
  args: {
    caption: 'These slots stay empty until an account agrees to be named on-site.',
  },
}

/**
 * Two slots filled, three still blank — the honest intermediate state. The
 * "logos" are deliberately generic text marks, not real or invented brands.
 */
export const PartiallyFilled: Story = {
  args: {
    caption: 'Two accounts named; the rest stay empty until they agree.',
    decorative: false,
  },
  render: (args) => (
    <LogoRow {...args}>
      <LogoSlot label="Example account one">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted-strong">
          Acct one
        </span>
      </LogoSlot>
      <LogoSlot label="Example account two">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted-strong">
          Acct two
        </span>
      </LogoSlot>
    </LogoRow>
  ),
}

/**
 * `LogoSlot` on its own, both states. It is a separate export for the same
 * reason `GlyphBadge` is: reachable without the strip around it.
 */
export const Slot: Story = {
  args: {},
  render: () => (
    <div className="grid w-[360px] grid-cols-2 gap-3.5">
      <LogoSlot />
      <LogoSlot label="Example account">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted-strong">
          Acct
        </span>
      </LogoSlot>
    </div>
  ),
}

/**
 * On cream. Every colour is a mode-aware role, so this is the pair worth
 * checking: the slot outlines must survive the `light` ancestor.
 */
export const OnLight: Story = {
  args: {
    caption: 'These slots stay empty until an account agrees to be named on-site.',
  },
  render: (args) => (
    <div className="light rounded-xl bg-brand-light p-8">
      <LogoRow {...args} />
    </div>
  ),
}
