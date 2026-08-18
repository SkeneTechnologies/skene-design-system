import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Finding, MetricCard, Sparkline } from '@skene/design-system/sections/finding-card'

/**
 * Three related pieces. `Finding` is one detected problem; `MetricCard` is a
 * number with a delta; `Sparkline` is the shape behind it.
 *
 * `onLight` on `Finding` is the trap this module shares with `NumberedStep`:
 * without it the card keeps invariant `chrome.*` text and disappears on cream.
 */
const meta = {
  title: 'Sections/FindingCard',
  component: Finding,
  parameters: { layout: 'centered' },
  argTypes: {
    status: { control: 'inline-radio', options: ['good', 'warn', 'danger'] },
    onLight: { control: 'boolean' },
  },
} satisfies Meta<typeof Finding>

export default meta
type Story = StoryObj<typeof meta>

export const Danger: Story = {
  args: {
    status: 'danger',
    tag: 'MISSING',
    title: 'signup_started fires nowhere',
    note: 'The route has no event between submit and redirect.',
    className: 'w-[420px]',
  },
}

export const Warn: Story = {
  args: {
    status: 'warn',
    tag: 'CHANGED',
    title: 'checkout_started lost cart_value',
    note: 'The property disappeared in the release that moved the cart route.',
    className: 'w-[420px]',
  },
}

export const Good: Story = {
  args: { status: 'good', tag: 'VERIFIED', title: 'repo_connected', className: 'w-[420px]' },
}

/** No note — the smallest shape, and the one where vertical rhythm shows. */
export const TitleOnly: Story = {
  args: { status: 'good', tag: 'VERIFIED', title: 'page_view', className: 'w-[420px]' },
}

/**
 * Every status on both grounds, tags only — the case ask r filed.
 *
 * The tag renders at 9px, which is small text under WCAG 2.2 by any reading,
 * and it used to be full-strength status ink on an 18% tint of its own hue.
 * Measured off real pixels by a consumer: 3.88 danger, 3.94 good, 4.00 warn,
 * against a 4.5:1 floor. It now takes the on-tint ink on a 12% tint and
 * measures 4.90 / 5.03 / 4.90 on the light card.
 *
 * Open the a11y panel on this one. The dark card's `danger` is the pair that
 * still does not clear — 4.06 — and it is recorded rather than fixed, because
 * closing it needs a token value or a surface role this component does not own.
 * See `__tests__/finding-tag-contrast.test.ts`, which computes all six.
 */
export const Tags: Story = {
  args: { status: 'danger', tag: 'MISSING', title: 'placeholder' },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="light grid gap-2 rounded-xl bg-brand-light p-4">
        {(['good', 'warn', 'danger'] as const).map((s) => (
          <Finding key={s} status={s} tag={s.toUpperCase()} title="signup_started" />
        ))}
      </div>
      <div className="dark grid gap-2 rounded-xl bg-chrome-surface-1 p-4">
        {(['good', 'warn', 'danger'] as const).map((s) => (
          <Finding key={s} onLight={false} status={s} tag={s.toUpperCase()} title="signup_started" />
        ))}
      </div>
    </div>
  ),
}

export const OnLight: Story = {
  args: { ...Danger.args, onLight: true },
  decorators: [
    (Story) => (
      <div className="light rounded-xl bg-brand-light p-6">
        <Story />
      </div>
    ),
  ],
}

export const Metric: Story = {
  args: { status: 'good', tag: 'VERIFIED', title: 'placeholder' },
  render: () => (
    <MetricCard label="Trial activation" value="31.4%" delta="↓ 8.2%" trend="danger">
      <Sparkline bars={[74, 81, 77, 72, 55, 51, 47, 45]} highlight={4} />
    </MetricCard>
  ),
}

/** Every trend at one value, plus a metric with no sparkline at all. */
export const MetricTrends: Story = {
  args: { status: 'good', tag: 'VERIFIED', title: 'placeholder' },
  render: () => (
    <div className="grid gap-3">
      {(['good', 'warn', 'danger'] as const).map((t) => (
        <MetricCard key={t} label="Trial activation" value="31.4%" delta="↓ 8.2%" trend={t}>
          <Sparkline bars={[74, 81, 77, 72, 55, 51, 47, 45]} highlight={4} />
        </MetricCard>
      ))}
      <MetricCard label="Events found" value="14" />
    </div>
  ),
}

/** The sparkline alone, flat and spiky, so the bar floor is checkable. */
export const Sparklines: Story = {
  args: { status: 'good', tag: 'VERIFIED', title: 'placeholder' },
  render: () => (
    <div className="grid w-[280px] gap-4">
      <Sparkline bars={[50, 50, 50, 50, 50, 50]} />
      <Sparkline bars={[4, 90, 12, 77, 3, 95]} highlight={5} />
      <Sparkline bars={[0, 0, 0, 100]} highlight={3} />
    </div>
  ),
}
