import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { QuestionCard, QuestionGrid } from '@skene/design-system/sections/question-grid'

/**
 * `QuestionGrid` — the "questions this answers" band. `columns` is a fixed set
 * because the class has to exist in the stylesheet: Tailwind scans source text,
 * so a computed `grid-cols-${n}` emits nothing at all and the grid silently
 * collapses to one column. That is why the prop is a key of a lookup rather
 * than a number.
 */
const meta = {
  title: 'Sections/QuestionGrid',
  component: QuestionGrid,
  parameters: { layout: 'fullscreen' },
  argTypes: { columns: { control: 'inline-radio', options: [2, 3, 4] } },
} satisfies Meta<typeof QuestionGrid>

export default meta
type Story = StoryObj<typeof meta>

const cards = [
  {
    tag: 'Coverage',
    title: 'Which steps am I not measuring at all?',
    body: 'Skene walks the routes and the handlers and lists the ones with no event behind them.',
  },
  {
    tag: 'Correctness',
    title: 'Are the events I do send well formed?',
    body: 'Payload shape, required properties, and the ones that changed shape without a version.',
  },
  {
    tag: 'Drift',
    title: 'What broke since the last release?',
    body: 'A diff against the last scan, so a regression is a line rather than an archaeology project.',
  },
  {
    tag: 'Ownership',
    title: 'Who has to fix it?',
    body: 'Each finding carries the file and the line, so it routes itself.',
  },
]

export const ThreeColumns: Story = {
  args: {
    columns: 3,
    children: cards.slice(0, 3).map((c) => (
      <QuestionCard key={c.title} tag={c.tag} title={c.title}>
        {c.body}
      </QuestionCard>
    )),
  },
}

export const TwoColumns: Story = {
  args: {
    columns: 2,
    children: cards.slice(0, 2).map((c) => (
      <QuestionCard key={c.title} tag={c.tag} title={c.title}>
        {c.body}
      </QuestionCard>
    )),
  },
}

export const FourColumns: Story = {
  args: {
    columns: 4,
    children: cards.map((c) => (
      <QuestionCard key={c.title} tag={c.tag} title={c.title}>
        {c.body}
      </QuestionCard>
    )),
  },
}

/** No tag, and a card with no body — both slots are optional and both ship. */
export const MinimalCards: Story = {
  args: {
    columns: 3,
    children: [
      <QuestionCard key="a" title="A question with no tag and no body." />,
      <QuestionCard key="b" title="A question with a body but no tag.">
        The tag is a category marker, not a requirement.
      </QuestionCard>,
      <QuestionCard key="c" tag="Tagged" title="Both." >
        Both slots filled.
      </QuestionCard>,
    ],
  },
}
