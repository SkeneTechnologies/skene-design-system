import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { CheckItem, CheckList } from '@skene/design-system/sections/check-list'

/**
 * The highest-frequency element on a Skene marketing page, previously
 * hand-written at every call site.
 *
 * Two decisions worth knowing before overriding anything here. The separator is
 * a TOP border on each row rather than a divider element, so a list of one still
 * reads as part of its card instead of floating. And the check is a real
 * `aria-hidden` span rather than a `::before`, precisely so a screen reader does
 * not announce "tick" before every line.
 */
const meta = {
  title: 'Sections/CheckList',
  component: CheckList,
  parameters: { layout: 'centered' },
  argTypes: { onLight: { control: 'boolean' }, dense: { control: 'boolean' } },
} satisfies Meta<typeof CheckList>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  'Inventories the signals you already collect',
  'Flags missing steps, broken payloads and silent gaps',
  'Names the file and the line, so a finding routes itself',
]

const rows = items.map((t) => <CheckItem key={t}>{t}</CheckItem>)

export const Default: Story = { args: { className: 'w-[420px]', children: rows } }

export const Dense: Story = { args: { ...Default.args, dense: true } }

/** On cream. `onLight` is not cosmetic — the rule colour has to change with the ground. */
export const OnLight: Story = {
  args: { onLight: true, children: rows },
  decorators: [
    (Story) => (
      <div className="light w-[460px] rounded-xl bg-brand-light p-6">
        <Story />
      </div>
    ),
  ],
}

/** One item. The top-border separator is why this still looks attached. */
export const SingleItem: Story = {
  args: { className: 'w-[420px]', children: <CheckItem>One repository, scanned in full</CheckItem> },
}

/** A long item that wraps — the check must stay on the first line, not centre. */
export const Wrapping: Story = {
  args: {
    className: 'w-[320px]',
    children: (
      <>
        <CheckItem>Short one</CheckItem>
        <CheckItem>
          A much longer line that runs past the width of its container and has to wrap onto a second
          and probably a third line without dragging the check down with it
        </CheckItem>
      </>
    ),
  },
}
