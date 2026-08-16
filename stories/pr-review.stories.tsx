import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { PrReview } from '@skene/design-system/sections/pr-review'

/**
 * The GitHub check, drawn.
 *
 * This is the component behind the sheen defect recorded in the FeatureRow
 * stories: its "changes requested" pill is red on the window's own dark chrome,
 * and a 10% white wash over the whole visual raised that ground enough to take
 * the pill from 4.510:1 to 3.801 at 390. The pill's ground is set HERE, by this
 * panel — a caller cannot fix it from the outside, which is why `FeatureRow`
 * grew a `sheen` prop rather than the pill growing a colour override.
 */
const meta = {
  title: 'Sections/PrReview',
  component: PrReview,
  parameters: { layout: 'centered' },
  argTypes: { status: { control: 'inline-radio', options: ['fail', 'pass'] } },
} satisfies Meta<typeof PrReview>

export default meta
type Story = StoryObj<typeof meta>

export const Failing: Story = {
  args: {
    className: 'w-[520px]',
    status: 'fail',
    repo: 'SkeneTechnologies/skene-dashboard #259',
    statusLabel: 'changes requested',
    author: 'skene[bot]',
    title: 'Rename checkout_started properties',
    summary: 'One event on this diff loses a property four funnels depend on.',
    issuesLabel: 'What breaks',
    issues: [
      { severity: 'high' as const, text: 'cart_value is no longer sent' },
      { severity: 'medium' as const, text: 'item_count changed from number to string' },
      { severity: 'low' as const, text: 'coupon_code is now optional and undocumented' },
    ],
    fixLabel: 'Suggested fix',
    fix: 'Keep cart_value on the payload and version the rename.',
    file: 'app/(shop)/cart/page.tsx',
    fileNote: 'line 142',
  },
}

export const Passing: Story = {
  args: {
    className: 'w-[520px]',
    status: 'pass',
    repo: 'SkeneTechnologies/skene-dashboard #260',
    statusLabel: 'all checks passed',
    author: 'skene[bot]',
    title: 'Add repo_connected to the onboarding route',
    summary: 'No event on this diff loses a property.',
  },
}

/** All three severities, which is the component's whole colour vocabulary. */
export const Severities: Story = {
  args: {
    ...Failing.args,
    summary: undefined,
    fix: undefined,
    file: undefined,
    issues: [
      { severity: 'high' as const, text: 'high' },
      { severity: 'medium' as const, text: 'medium' },
      { severity: 'low' as const, text: 'low' },
      { text: 'no severity given' },
    ],
  },
}

/** Header only — every body slot is optional. */
export const HeaderOnly: Story = {
  args: {
    className: 'w-[520px]',
    status: 'fail',
    repo: 'SkeneTechnologies/skene-dashboard #259',
    statusLabel: 'changes requested',
  },
}

/**
 * Under a 10% white wash — the exact overlay that caused the regression. Compare
 * the pill here against `Failing`.
 */
export const UnderASheen: Story = {
  args: Failing.args,
  decorators: [
    (Story) => (
      <div className="relative">
        <Story />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-white/10" />
      </div>
    ),
  ],
}
