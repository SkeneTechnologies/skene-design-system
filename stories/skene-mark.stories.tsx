import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { SkeneLockup, SkeneMark } from '@skene/design-system/patterns/skene-mark'

/**
 * The brand mark and the lockup, as elements. `tone` names the GROUND, not the
 * ink — the source file's whole argument — so each story renders every tone on
 * the ground it is named for, which is the pairing a caller has to get right.
 */
const meta = {
  title: 'Patterns/SkeneMark',
  component: SkeneMark,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SkeneMark>

export default meta
type Story = StoryObj<typeof meta>

/** `block`, the default and the only tone safe on any ground. */
export const Default: Story = {
  args: { size: 40 },
}

/** Each mark tone on its own ground; `block` on both, because it brings its own. */
export const MarkTones: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-4 rounded-xl bg-chrome-surface-darker p-6">
        <SkeneMark tone="block" size={40} />
        <SkeneMark tone="onDark" size={40} />
      </div>
      <div className="light flex items-center gap-4 rounded-xl bg-brand-light p-6">
        <SkeneMark tone="block" size={40} />
        <SkeneMark tone="onLight" size={40} />
      </div>
    </div>
  ),
}

/**
 * The lockup's three tones. `accent` is the one not named after its ground —
 * peach symbol, white wordmark, dark grounds only — so it sits with `onDark`,
 * and `onLight` gets the cream it exists for.
 */
export const Lockups: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start gap-4 rounded-xl bg-chrome-surface-darker p-6">
        <SkeneLockup tone="onDark" height={26} />
        <SkeneLockup tone="accent" height={26} />
      </div>
      <div className="light rounded-xl bg-brand-light p-6">
        <SkeneLockup tone="onLight" height={26} />
      </div>
    </div>
  ),
}
