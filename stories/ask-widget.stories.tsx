import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { AskWidget } from '@skene/design-system/sections/ask-widget'

/**
 * The "ask us anything" block, and the package's one genuinely interactive
 * section: a controlled textarea plus a submit handler.
 *
 * It lives in its own module specifically so `'use client'` does not spread to
 * server-renderable siblings — that is a structural decision, not a stylistic
 * one, and moving this markup into a neighbouring file would drag that file
 * across the client boundary with it.
 *
 * The restraint is the design. It is a low-commitment probe, so a full-bleed
 * primary button and a boxed input would make it read as a form rather than as
 * a question. The heading labels the textarea via `aria-labelledby`, which is
 * why the question is a heading rather than a placeholder — placeholder text
 * disappears the moment someone types.
 *
 * `value` / `onValueChange` are required: this is fully controlled, so the
 * stories below hold state themselves rather than passing a literal.
 */
const meta = {
  title: 'Sections/AskWidget',
  component: AskWidget,
  parameters: { layout: 'fullscreen' },
  argTypes: { showAiBadge: { control: 'boolean' } },
} satisfies Meta<typeof AskWidget>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(props: Omit<React.ComponentProps<typeof AskWidget>, 'value' | 'onValueChange'>) {
  const [value, setValue] = React.useState('')
  return <AskWidget {...props} value={value} onValueChange={setValue} />
}

const base = {
  question: 'What are you not measuring?',
  name: 'Teemu',
  submitLabel: 'Ask',
  placeholder: 'Type the thing you cannot answer today…',
}

export const Empty: Story = {
  args: { ...base, value: '', onValueChange: () => {} },
  render: (args) => <Controlled {...args} />,
}

/** With text in it. The submit is sized to its label, not to the field. */
export const WithText: Story = {
  args: {
    ...base,
    value: 'Why does activation drop 8% between signup and the first scan?',
    onValueChange: () => {},
  },
}

export const WithLede: Story = {
  args: {
    ...base,
    lede: 'It goes to a person, not a queue.',
    value: '',
    onValueChange: () => {},
  },
  render: (args) => <Controlled {...args} />,
}

export const WithAvatar: Story = {
  args: { ...base, avatar: <span aria-hidden>◆</span>, value: '', onValueChange: () => {} },
  render: (args) => <Controlled {...args} />,
}

/** Badge off — the disclosure is a prop because not every surface routes to AI. */
export const WithoutAiBadge: Story = {
  args: { ...base, showAiBadge: false, value: '', onValueChange: () => {} },
  render: (args) => <Controlled {...args} />,
}
